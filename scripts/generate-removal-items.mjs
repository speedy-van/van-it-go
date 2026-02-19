#!/usr/bin/env node
/**
 * Generates removal-items.json from UK_Removal_Dataset
 * Scans Images_Only folder to match each item to actual image files.
 * Run: node scripts/generate-removal-items.mjs
 * Set UK_REMOVAL_DATASET_PATH env var to override default path
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const datasetPath = process.env.UK_REMOVAL_DATASET_PATH || 'C:\\VanJet\\UK_Removal_Dataset';
const csvPath = join(datasetPath, 'Complete_Item_Database.csv');
const imagesDir = join(datasetPath, 'Images_Only');
const outputPath = join(__dirname, '..', 'public', 'data', 'removal-items.json');

/** Extract searchable tokens from item name or filename */
function tokens(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter((t) => t.length > 1);
}

/** Remove _jpg_XXkg.jpg suffix from filename for matching */
function filenameToBase(name) {
  return name.replace(/_jpg_\d+kg\.jpg$/i, '').replace(/\.jpg$/i, '');
}

/** Score how well image filename matches item name (higher = better) */
function matchScore(itemName, imageFilename) {
  const itemTokens = tokens(itemName);
  const fileBase = filenameToBase(imageFilename);
  const fileTokens = tokens(fileBase.replace(/_/g, ' '));
  let score = 0;
  for (const t of itemTokens) {
    if (t.length < 2) continue;
    if (fileBase.includes(t)) score += 2;
    else if (fileTokens.some((ft) => ft.includes(t) || t.includes(ft))) score += 1;
  }
  return score;
}

/** Scan Images_Only, return Map<categoryFolder, string[] of filenames> */
function scanImageFolders() {
  const map = new Map();
  if (!existsSync(imagesDir)) return map;
  const dirs = readdirSync(imagesDir, { withFileTypes: true }).filter((d) => d.isDirectory());
  for (const d of dirs) {
    const folderPath = join(imagesDir, d.name);
    const files = readdirSync(folderPath).filter((f) => /\.(jpg|jpeg|png)$/i.test(f));
    map.set(d.name, files);
  }
  return map;
}

/** Find best matching image for item in category. Returns filename or null */
function findBestImage(itemName, csvFilename, category, imageMap) {
  const files = imageMap.get(category) || [];
  if (files.length === 0) return null;

  const exact = files.find((f) => f.toLowerCase() === (csvFilename || '').toLowerCase());
  if (exact) return exact;

  let best = null;
  let bestScore = 0;
  for (const f of files) {
    const s = matchScore(itemName, f);
    if (s > bestScore) {
      bestScore = s;
      best = f;
    }
  }
  return bestScore >= 2 ? best : (files[0] || null);
}

const CATEGORY_DISPLAY_NAMES = {
  Antiques_Collectibles: 'Antiques & Collectibles',
  Bathroom_Furniture: 'Bathroom',
  Carpets_Rugs: 'Carpets & Rugs',
  Children_Baby_Items: 'Children & Baby',
  Dining_Room_Furniture: 'Dining Room',
  Electrical_Electronic: 'Electrical & Electronics',
  Garden_Outdoor: 'Garden & Outdoor',
  Gym_Fitness_Equipment: 'Gym & Fitness',
  Kitchen_appliances: 'Kitchen Appliances',
  Living_room_Furniture: 'Living Room',
  Bedroom: 'Bedroom',
  Miscellaneous_household: 'Miscellaneous',
  Musical_instruments: 'Musical Instruments',
  Office_furniture: 'Office',
  Wardrobes_closet: 'Wardrobes',
  Pet_items: 'Pet Items',
  Special_Awkward_items: 'Special Items',
  Bag_luggage_box: 'Bags & Luggage',
};

function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map((h) => h.trim());
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const values = [];
    let current = '';
    let inQuotes = false;
    for (let j = 0; j < lines[i].length; j++) {
      const c = lines[i][j];
      if (c === '"') inQuotes = !inQuotes;
      else if ((c === ',' && !inQuotes) || c === '\n') {
        values.push(current.trim());
        current = '';
        if (c === '\n') break;
      } else current += c;
    }
    if (current.length) values.push(current.trim());
    if (values.length >= headers.length) {
      const row = {};
      headers.forEach((h, idx) => (row[h] = values[idx] ?? ''));
      rows.push(row);
    }
  }
  return rows;
}

function main() {
  let csv;
  try {
    csv = readFileSync(csvPath, 'utf-8');
  } catch (err) {
    console.error('Could not read CSV from', csvPath);
    console.error(err.message);
    process.exit(1);
  }

  const rows = parseCSV(csv);
  const imageMap = scanImageFolders();
  const matchedCount = { yes: 0, no: 0 };

  const byCategory = new Map();

  for (const row of rows) {
    const category = row.Category?.trim() || 'Miscellaneous';
    if (!byCategory.has(category)) {
      byCategory.set(category, []);
    }

    const lengthCm = parseFloat(row.Length_cm) || 0;
    const widthCm = parseFloat(row.Width_cm) || 0;
    const heightCm = parseFloat(row.Height_cm) || 0;
    const areaM2 = parseFloat(row.Area_m2) || 0;
    const weightKg = parseFloat(row.Weight_kg) || 0;
    const vanUnits = parseInt(row.Van_Units, 10) || 1;
    const volumeM3 = areaM2 > 0 ? areaM2 * (heightCm / 100) : (lengthCm * widthCm * heightCm) / 1_000_000;

    const itemName = row.Item_Name?.trim() || 'Unknown Item';
    const csvFilename = row.Filename?.trim() || '';
    const actualImage = findBestImage(itemName, csvFilename, category, imageMap);
    const imageUrl = actualImage ? `/removal-items/${category}/${actualImage}` : null;
    if (actualImage) matchedCount.yes++;
    else matchedCount.no++;

    byCategory.get(category).push({
      id: `${category}_${itemName.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '')}`,
      name: itemName,
      category,
      categoryDisplay: CATEGORY_DISPLAY_NAMES[category] || category.replace(/_/g, ' '),
      dimensions: { lengthCm, widthCm, heightCm },
      areaM2,
      weightKg,
      volumeM3: Math.max(0.01, volumeM3),
      vanUnits,
      workers: parseInt(row.Workers, 10) || 1,
      loadingComplexity: row.Loading_Complexity?.trim() || 'Medium',
      specialHandling: row.Special_Handling?.trim() || '',
      filename: actualImage || csvFilename,
      imageUrl,
    });
  }

  console.log(`Matched ${matchedCount.yes} items to images, ${matchedCount.no} without match.`);

  const categories = Array.from(byCategory.entries()).map(([key, items]) => ({
    id: key,
    displayName: CATEGORY_DISPLAY_NAMES[key] || key.replace(/_/g, ' '),
    itemCount: items.length,
    items,
  }));

  const output = {
    version: '1.0',
    generatedAt: new Date().toISOString(),
    totalItems: rows.length,
    categories,
  };

  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf-8');
  console.log(`Generated ${output.totalItems} items across ${categories.length} categories at ${outputPath}`);
}

main();
