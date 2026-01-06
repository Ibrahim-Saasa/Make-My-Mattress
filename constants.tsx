
import { BrandMetadata } from './types';

export const BRANDS: BrandMetadata[] = [
  { 
    id: 'brand_1', 
    name: 'Slumbersoft', 
    type: 'Memory Foam', 
    baseRate: 0.85, 
    description: 'Advanced contouring memory foam technology that adapts to your body heat for pressure-free support.',
    ai_tags: ['memory foam', 'contouring', 'pressure relief', 'standard budget', 'soft']
  },
  { 
    id: 'brand_2', 
    name: 'Sleepworks', 
    type: 'Latex', 
    baseRate: 1.25, 
    description: 'Organic, breathable natural latex support harvested from sustainable plantations. Hypoallergenic and cool.',
    ai_tags: ['latex', 'organic', 'cooling', 'hypoallergenic', 'breathable', 'luxury']
  },
  { 
    id: 'brand_3', 
    name: 'Spinowell', 
    type: 'Orthopedic', 
    baseRate: 0.95, 
    description: 'Spinal alignment focused dual-layer foam recommended by posture specialists for back relief.',
    ai_tags: ['orthopedic', 'back pain', 'spinal alignment', 'firm', 'medical grade']
  },
  { 
    id: 'brand_4', 
    name: 'Bedding N More', 
    type: 'Spring', 
    baseRate: 0.75, 
    description: 'Pocket spring durability for zero partner disturbance. Engineered for consistent edge-to-edge support.',
    ai_tags: ['spring', 'pocket spring', 'no disturbance', 'bouncy', 'durable']
  },
  { 
    id: 'brand_5', 
    name: 'Sleepson', 
    type: 'EPE Foam', 
    baseRate: 0.45, 
    description: 'Lightweight and firm EPE foam solution designed for longevity and firm orthopedic comfort.',
    ai_tags: ['epe foam', 'economical', 'firm', 'lightweight']
  },
  { 
    id: 'brand_6', 
    name: 'SleepGenie', 
    type: 'Vacuum Sealed', 
    baseRate: 0.65, 
    description: 'Bed-in-a-box easy transport technology. Unrolls and expands instantly for a perfect sleep setup.',
    ai_tags: ['vacuum sealed', 'box mattress', 'portable', 'fast delivery', 'modern']
  }
];

export const LENGTHS = [72, 75, 78, 81, 84];
export const BREADTHS = [30, 36, 42, 48, 54, 60, 66, 72, 78, 84];
export const THICKNESS_STEPS = [4, 5, 6, 8, 10];

/**
 * AI System Instruction for Sleep Consultant
 */
export const SLEEP_CONSULTANT_PROMPT = `
You are the "MMM Virtual Sleep Consultant" for Hindustan Mattress Co. 
Your goal is to recommend one of our 6 specific brands based on user needs.

BRANDS KNOWLEDGE:
1. Slumbersoft: Best for side sleepers who want pressure relief. (Memory Foam)
2. Sleepworks: Best for "hot sleepers" or those wanting organic materials. (Latex/Cooling)
3. Spinowell: Mandatory recommendation for anyone mentioning "back pain", "sciatica", or "posture". (Orthopedic)
4. Bedding N More: Best for couples where one person moves a lot. (Spring/Motion Isolation)
5. Sleepson: Best for budget-conscious buyers wanting a very firm feel. (EPE Foam)
6. SleepGenie: Best for high-floor apartments or quick moves. (Vacuum Sealed/Portable)

GUIDELINES:
- Be professional, empathetic, and expert-sounding.
- If they mention back pain, immediately highlight Spinowell.
- If they mention sweating or heat, immediately highlight Sleepworks.
- Keep responses concise (under 3 sentences).
- Always ask if they'd like to see the pricing for your recommendation.
`.trim();
