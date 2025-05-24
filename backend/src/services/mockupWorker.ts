// Core image processing logic for generating mockups

// Handles the core image processing logic for generating mockups.
// It utilizes the 'sharp' library for image manipulation tasks.
import sharp from 'sharp';
import axios from 'axios';
import { uploadToS3 } from './storageService';
import { logger } from '../utils/logger';

export enum TextClipping {
  NONE = 'none',
  PATH = 'path',
}

interface GenerateMockupParams {
  logoUrl: string;
  templateUrl: string;
  customizations?: {
    position?: { x: number; y: number };
    scale?: number;
    rotation?: number;
    opacity?: number;
    blendMode?: sharp.Blend;
    tint?: string; // Hex color string e.g., '#FF0000'
    grayscale?: boolean;
    // Text clipping and customization options
    text?: string;
    fontFamily?: string;
    fontSize?: number;
    textColor?: string;
    textClipping?: TextClipping; // Added textClipping
    textPath?: string; // SVG path for clipping, used if textClipping is PATH
    textAlign?: 'left' | 'center' | 'right';
    textStrokeColor?: string;
    textStrokeWidth?: number;
  };
}

interface GenerateMockupResult {
  renderUrl: string;
  thumbnailUrl: string;
}

const generateMockupImage = async (params: GenerateMockupParams): Promise<GenerateMockupResult> => {
  const { logoUrl, templateUrl, customizations = {} } = params;

  try {
    // Download images
    const [logoResponse, templateResponse] = await Promise.all([
      axios.get(logoUrl, { responseType: 'arraybuffer' }),
      axios.get(templateUrl, { responseType: 'arraybuffer' })
    ]);

    const logoBuffer = Buffer.from(logoResponse.data);
    const templateBuffer = Buffer.from(templateResponse.data);

    // Get template dimensions
    const templateMetadata = await sharp(templateBuffer).metadata();
    const templateWidth = templateMetadata.width!;
    const templateHeight = templateMetadata.height!;

    // Process logo
    const {
      scale = 0.3,
      rotation = 0,
      opacity = 1,
      position = { x: templateWidth / 2, y: templateHeight / 2 },
      blendMode = 'over', // Default blend mode
      tint,
      grayscale = false,
      // Text options
      text,
      fontFamily = 'Arial',
      fontSize = 24,
      textColor = '#000000',
      textPath,
      textAlign = 'center',
      textStrokeColor,
      textStrokeWidth = 0,
      textClipping = TextClipping.NONE // Added textClipping with default
    } = customizations;

    // Calculate logo dimensions
    const logoMetadata = await sharp(logoBuffer).metadata();
    const logoAspectRatio = logoMetadata.width! / logoMetadata.height!;
    const maxLogoSize = Math.min(templateWidth, templateHeight) * scale;

    let logoWidth, logoHeight;
    if (logoAspectRatio > 1) {
      logoWidth = maxLogoSize;
      logoHeight = maxLogoSize / logoAspectRatio;
    } else {
      logoHeight = maxLogoSize;
      logoWidth = maxLogoSize * logoAspectRatio;
    }

    // Process the logo with transformations
    let logoProcessingChain = sharp(logoBuffer)
      .resize(Math.round(logoWidth), Math.round(logoHeight))
      .rotate(rotation);

    if (tint) {
      logoProcessingChain = logoProcessingChain.tint(tint);
    }

    if (grayscale) {
      logoProcessingChain = logoProcessingChain.grayscale();
    }

    const processedLogo = await logoProcessingChain.png().toBuffer();

    // Calculate position (center-based to top-left)
    const left = Math.round(position.x - logoWidth / 2);
    const top = Math.round(position.y - logoHeight / 2);

    // --- Text Rendering Logic ---
    let textOverlayBuffer: Buffer | undefined;
    if (text) {
      let svgText = `<text x="50%" y="50%" dominant-baseline="middle" text-anchor="${textAlign}" font-family="${fontFamily}" font-size="${fontSize}" fill="${textColor}"`;
      if (textStrokeColor && textStrokeWidth > 0) {
        svgText += ` stroke="${textStrokeColor}" stroke-width="${textStrokeWidth}"`;
      }
      svgText += `>${text}</text>`;

      let svgWidth = templateWidth; // Default to template width
      let svgHeight = fontSize * 1.5; // Estimate height

      // If textPath is provided, use it for clipping
      // This is a simplified example; robust path handling would be more complex
      if (textClipping === TextClipping.PATH && textPath) {
        // Assuming textPath is a valid SVG <path d="..."/> definition
        // We'd need to determine the bounds of the path to set svgWidth/Height appropriately
        // For simplicity, we'll use a fixed size or derive from template if path bounds are unknown
        const pathSvg = `<svg width="${templateWidth}" height="${templateHeight}">
          <defs>
            <clipPath id="textClipPath">
              <path d="${textPath}"/>
            </clipPath>
          </defs>
          <g clip-path="url(#textClipPath)">
            ${svgText}
          </g>
        </svg>`;
        textOverlayBuffer = Buffer.from(pathSvg);
      } else {
        // Simple text without path clipping (or if textClipping is NONE)
        const simpleTextSvg = `<svg width="${svgWidth}" height="${svgHeight}">${svgText}</svg>`;
        textOverlayBuffer = Buffer.from(simpleTextSvg);
      }
    }
    // --- End Text Rendering Logic ---

    // Composite logo and text onto template
    let compositeOperations: sharp.OverlayOptions[] = [{
      input: processedLogo,
      left: Math.max(0, left),
      top: Math.max(0, top),
      blend: blendMode
    }];

    if (textOverlayBuffer) {
      // For simplicity, text is centered or placed based on its own SVG coordinates.
      // More advanced positioning relative to logo or template would require more calculations.
      compositeOperations.push({
        input: textOverlayBuffer,
        gravity: 'center' // This will center the SVG overlay; adjust as needed
        // blend: 'over' // Or another blend mode if desired for text
      });
    }

    const finalImage = await sharp(templateBuffer)
      .composite(compositeOperations)
      .jpeg({ quality: 95 })
      .toBuffer();

    // Generate thumbnail
    const thumbnail = await sharp(finalImage)
      .resize(400, 400, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 80 })
      .toBuffer();

    // Upload to S3
    const timestamp = Date.now();
    const renderFilename = `mockups/${timestamp}-render.jpg`;
    const thumbnailFilename = `mockups/${timestamp}-thumb.jpg`;

    const [renderUrl, thumbnailUrl] = await Promise.all([
      uploadToS3(finalImage, renderFilename, 'image/jpeg'),
      uploadToS3(thumbnail, thumbnailFilename, 'image/jpeg')
    ]);

    return { renderUrl, thumbnailUrl };

  } catch (error) {
    logger.error('Mockup generation failed:', error);
    throw new Error('Failed to generate mockup');
  }
};

// Queue handler is now defined in queueService.ts to avoid duplication
console.log('Mockup worker module loaded...');