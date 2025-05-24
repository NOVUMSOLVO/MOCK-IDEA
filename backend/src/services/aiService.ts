import axios from 'axios';
import { logger } from '../utils/logger';

interface ColorInfo {
  name: string;
  hex: string;
  rgb: number[];
  population: number;
}

interface AIAnalysis {
  style: string;
  complexity: number;
  hasText: boolean;
  recommendedCategories: string[];
  dominantColors: string[];
  placement: {
    preferredPosition: string;
    scaleRange: [number, number];
    rotationTolerance: number;
  };
}

export async function analyzeLogoWithAI(
  imageBuffer: Buffer,
  colors: ColorInfo[]
): Promise<AIAnalysis> {
  try {
    const base64Image = imageBuffer.toString('base64');
    
    const response = await axios.post(
      `${process.env.AI_SERVICE_URL}/analyze-logo`,
      {
        image: base64Image,
        colors: colors
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.AI_SERVICE_TOKEN}`
        },
        timeout: 30000
      }
    );

    return response.data;
  } catch (error) {
    logger.error('AI analysis failed:', error);
    
    // Fallback analysis based on colors and basic image properties
    return {
      style: determineStyleFromColors(colors),
      complexity: calculateComplexity(imageBuffer.length),
      hasText: false, // Would need OCR for accurate detection
      recommendedCategories: ['general', 'business'],
      dominantColors: colors.slice(0, 3).map(c => c.hex),
      placement: {
        preferredPosition: 'center',
        scaleRange: [0.3, 0.8],
        rotationTolerance: 15
      }
    };
  }
}

function determineStyleFromColors(colors: ColorInfo[]): string {
  const colorCount = colors.length;
  const brightness = colors.reduce((sum, color) => {
    const [r, g, b] = color.rgb;
    return sum + (r + g + b) / 3;
  }, 0) / colorCount;

  if (colorCount <= 2 && brightness > 200) return 'minimalist';
  if (colorCount <= 3) return 'modern';
  if (colorCount > 5) return 'vibrant';
  return 'classic';
}

function calculateComplexity(fileSize: number): number {
  // Simple complexity estimation based on file size
  if (fileSize < 50000) return 1; // Simple
  if (fileSize < 200000) return 2; // Medium
  return 3; // Complex
}

export async function generateMockupWithAI(params: {
  logoUrl: string;
  templateUrl: string;
  customizations?: any;
}): Promise<{ renderUrl: string; thumbnailUrl: string }> {
  try {
    const response = await axios.post(
      `${process.env.AI_SERVICE_URL}/generate-mockup`,
      params,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.AI_SERVICE_TOKEN}`
        },
        timeout: 60000 // 1 minute timeout for mockup generation
      }
    );

    return response.data;
  } catch (error) {
    logger.error('AI mockup generation failed:', error);
    throw new Error('AI mockup generation failed');
  }
}

export async function enhanceImage(
  imageBuffer: Buffer,
  enhancements: {
    upscale?: boolean;
    removeBackground?: boolean;
    adjustColors?: boolean;
  }
): Promise<Buffer> {
  try {
    const base64Image = imageBuffer.toString('base64');
    
    const response = await axios.post(
      `${process.env.AI_SERVICE_URL}/enhance-image`,
      {
        image: base64Image,
        enhancements
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.AI_SERVICE_TOKEN}`
        },
        timeout: 30000,
        responseType: 'arraybuffer'
      }
    );

    return Buffer.from(response.data);
  } catch (error) {
    logger.error('AI image enhancement failed:', error);
    throw new Error('Image enhancement failed');
  }
}
