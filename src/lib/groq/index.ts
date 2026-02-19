import Groq from 'groq-sdk';
import { z } from 'zod';
import type { QuoteRequest, QuoteResponse } from '@/lib/pricing';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const groqQuoteResponseSchema = z.object({
  basePrice: z.number().min(0),
  distancePrice: z.number().min(0),
  volumePrice: z.number().min(0),
  subtotal: z.number().min(0),
  discount: z.number().min(0),
  totalPrice: z.number().min(0),
  estimatedDurationMinutes: z.number().int().min(0),
  currency: z.literal('GBP'),
  validUntil: z.string(),
  breakdown: z.object({
    base: z.number().min(0),
    distance: z.number().min(0),
    volume: z.number().min(0),
    serviceMultiplier: z.number().min(0),
  }),
});

export async function estimateVolumeFromImage(
  _imageBase64: string,
  description: string
): Promise<{
  estimatedVolumeCubicMeters: number;
  confidence: number;
  analysis: string;
}> {
  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `You are an expert moving company volume estimator. Based on this description of items to move, provide a volume estimate. Description: "${description}". Respond in JSON only: { "estimatedVolumeCubicMeters": <number 0.5-50>, "confidence": <0-1>, "analysis": "<brief explanation>" }.`,
        },
      ],
    });

    const responseText = completion.choices[0]?.message?.content ?? '{}';
    const result = JSON.parse(responseText);

    return {
      estimatedVolumeCubicMeters: Math.min(
        50,
        Math.max(0.5, result.estimatedVolumeCubicMeters)
      ),
      confidence: Math.min(1, Math.max(0, result.confidence)),
      analysis: result.analysis,
    };
  } catch (error) {
    console.error('Groq volume estimation failed:', error);
    throw new Error('Failed to estimate volume from image');
  }
}

export async function estimateVolumeFromDescription(
  description: string
): Promise<{
  estimatedVolumeCubicMeters: number;
  confidence: number;
  itemBreakdown: Record<string, number>;
}> {
  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `You are a moving company volume estimator. Based on this description, estimate the total cubic meters needed: "${description}". Respond in JSON only: { "estimatedVolumeCubicMeters": <number>, "confidence": <0-1>, "itemBreakdown": {} }.`,
        },
      ],
    });

    const responseText = completion.choices[0]?.message?.content ?? '{}';
    const result = JSON.parse(responseText);

    return {
      estimatedVolumeCubicMeters: Math.min(
        50,
        Math.max(0.5, result.estimatedVolumeCubicMeters)
      ),
      confidence: Math.min(1, Math.max(0, result.confidence)),
      itemBreakdown: result.itemBreakdown || {},
    };
  } catch (error) {
    console.error('Groq description estimation failed:', error);
    throw new Error('Failed to estimate volume from description');
  }
}

/**
 * Get a moving quote from Groq API. Uses GROQ_API_KEY.
 * Returns a structured quote (GBP) for the given request; enforces minimum £60 and consistent breakdown.
 */
export async function getQuoteFromGroq(
  request: QuoteRequest
): Promise<QuoteResponse> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('GROQ_API_KEY is not set; pricing requires Groq API');
  }

  const prompt = `You are a UK moving company (Speedy Van) pricing expert. Generate a quote in GBP.

Inputs:
- distanceKm: ${request.distanceKm}
- volumeCubicMeters: ${request.volumeCubicMeters}
- serviceType: ${request.serviceType}
- itemCount: ${request.itemCount}

Rules:
- Currency: GBP only.
- Minimum total price: £60.
- Base fee typically around £35; distance about £1.50/km; volume about £15 per cubic meter.
- Service multipliers: house_move 1.0, office_move 1.2, single_item 0.8, student_move 0.9, ebay_delivery 0.7.
- subtotal = (base + distance + volume) * serviceMultiplier; apply any discount then totalPrice; totalPrice must be >= 60.
- estimatedDurationMinutes: roughly 30 + 5*distanceKm + 3*volumeCubicMeters (integer).
- validUntil: ISO 8601 string for 24 hours from now.

Respond with a single JSON object only, no markdown or extra text. Schema:
{
  "basePrice": number,
  "distancePrice": number,
  "volumePrice": number,
  "subtotal": number,
  "discount": number,
  "totalPrice": number,
  "estimatedDurationMinutes": number,
  "currency": "GBP",
  "validUntil": "ISO8601 string",
  "breakdown": {
    "base": number,
    "distance": number,
    "volume": number,
    "serviceMultiplier": number
  }
}`;

  const completion = await groq.chat.completions.create({
    model: 'llama-3.1-8b-instant',
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  });

  const raw =
    completion.choices[0]?.message?.content?.trim() ?? '{}';
  const stripped = raw.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();

  let parsed: unknown;
  try {
    parsed = JSON.parse(stripped);
  } catch {
    // LLM sometimes returns malformed JSON; try to extract a single JSON object
    const match = stripped.match(/\{[\s\S]*\}/);
    const candidate = match ? match[0].replace(/,(\s*[}\]])/g, '$1') : stripped;
    try {
      parsed = JSON.parse(candidate);
    } catch (parseError) {
      throw new Error(
        `Groq returned invalid JSON: ${parseError instanceof Error ? parseError.message : 'parse failed'}. Raw (first 200 chars): ${raw.slice(0, 200)}`
      );
    }
  }

  const validated = groqQuoteResponseSchema.parse(parsed);

  const totalPrice = Math.max(validated.totalPrice, 60);
  const validUntil = new Date(validated.validUntil);
  if (Number.isNaN(validUntil.getTime())) {
    validUntil.setTime(Date.now() + 24 * 60 * 60 * 1000);
  }

  return {
    ...validated,
    totalPrice: Math.round(totalPrice * 100) / 100,
    validUntil,
  };
}
