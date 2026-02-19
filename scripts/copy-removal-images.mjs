#!/usr/bin/env node
/**
 * Copies Images_Only from UK_Removal_Dataset to public/removal-items
 * Run: node scripts/copy-removal-images.mjs
 * Set UK_REMOVAL_DATASET_PATH env var to override default path
 */
import { cpSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const datasetPath = process.env.UK_REMOVAL_DATASET_PATH || 'C:\\VanJet\\UK_Removal_Dataset';
const sourceDir = join(datasetPath, 'Images_Only');
const destDir = join(__dirname, '..', 'public', 'removal-items');

if (!existsSync(sourceDir)) {
  console.error('Source not found:', sourceDir);
  console.error('Set UK_REMOVAL_DATASET_PATH if your dataset is elsewhere.');
  process.exit(1);
}

mkdirSync(destDir, { recursive: true });
cpSync(sourceDir, destDir, { recursive: true });
console.log('Copied images from', sourceDir, 'to', destDir);
