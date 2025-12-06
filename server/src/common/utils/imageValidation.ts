/**
 * Server-side image validation utility
 * Validates base64 image data to prevent XSS attacks
 */

const ALLOWED_IMAGE_SIGNATURES = {
  jpeg: [0xff, 0xd8, 0xff],
  png: [0x89, 0x50, 0x4e, 0x47],
  gif: [0x47, 0x49, 0x46, 0x38],
  webp: [0x52, 0x49, 0x46, 0x46], // RIFF header, need to check for WEBP at offset 8
} as const;

export class ImageValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ImageValidationError';
  }
}

/**
 * Validates base64 image data by checking file signatures (magic numbers)
 * @param base64Data - Base64 encoded image string
 * @returns Buffer if valid, throws error otherwise
 */
export function validateAndDecodeImage(base64Data: string): Buffer {
  if (!base64Data || typeof base64Data !== 'string') {
    throw new ImageValidationError('Invalid base64 data');
  }

  // Check if it's valid base64
  const base64Regex = /^[A-Za-z0-9+/]+=*$/;
  if (!base64Regex.test(base64Data)) {
    throw new ImageValidationError('Invalid base64 format');
  }

  let buffer: Buffer;
  try {
    buffer = Buffer.from(base64Data, 'base64');
  } catch {
    throw new ImageValidationError('Failed to decode base64 data');
  }

  // Check minimum size (at least 12 bytes for header)
  if (buffer.length < 12) {
    throw new ImageValidationError('Image data too small');
  }

  // Check maximum size (2MB)
  const maxSize = 2 * 1024 * 1024;
  if (buffer.length > maxSize) {
    throw new ImageValidationError('Image size exceeds 2MB limit');
  }

  // Validate file signature
  const isValidImage =
    isJPEG(buffer) || isPNG(buffer) || isGIF(buffer) || isWebP(buffer);

  if (!isValidImage) {
    throw new ImageValidationError(
      'Invalid or unsupported image format. Only JPEG, PNG, GIF, and WebP are allowed.',
    );
  }

  // Explicitly reject SVG and other XML-based formats
  const bufferStart = buffer.toString('utf8', 0, Math.min(100, buffer.length));
  if (
    bufferStart.includes('<svg') ||
    bufferStart.includes('<?xml') ||
    bufferStart.includes('<html')
  ) {
    throw new ImageValidationError(
      'SVG and XML-based formats are not allowed for security reasons',
    );
  }

  return buffer;
}

function isJPEG(buffer: Buffer): boolean {
  return (
    buffer[0] === ALLOWED_IMAGE_SIGNATURES.jpeg[0] &&
    buffer[1] === ALLOWED_IMAGE_SIGNATURES.jpeg[1] &&
    buffer[2] === ALLOWED_IMAGE_SIGNATURES.jpeg[2]
  );
}

function isPNG(buffer: Buffer): boolean {
  return (
    buffer[0] === ALLOWED_IMAGE_SIGNATURES.png[0] &&
    buffer[1] === ALLOWED_IMAGE_SIGNATURES.png[1] &&
    buffer[2] === ALLOWED_IMAGE_SIGNATURES.png[2] &&
    buffer[3] === ALLOWED_IMAGE_SIGNATURES.png[3]
  );
}

function isGIF(buffer: Buffer): boolean {
  return (
    buffer[0] === ALLOWED_IMAGE_SIGNATURES.gif[0] &&
    buffer[1] === ALLOWED_IMAGE_SIGNATURES.gif[1] &&
    buffer[2] === ALLOWED_IMAGE_SIGNATURES.gif[2] &&
    buffer[3] === ALLOWED_IMAGE_SIGNATURES.gif[3]
  );
}

function isWebP(buffer: Buffer): boolean {
  // Check RIFF header
  if (
    buffer[0] !== ALLOWED_IMAGE_SIGNATURES.webp[0] ||
    buffer[1] !== ALLOWED_IMAGE_SIGNATURES.webp[1] ||
    buffer[2] !== ALLOWED_IMAGE_SIGNATURES.webp[2] ||
    buffer[3] !== ALLOWED_IMAGE_SIGNATURES.webp[3]
  ) {
    return false;
  }

  // Check WEBP signature at offset 8
  return (
    buffer[8] === 0x57 && // W
    buffer[9] === 0x45 && // E
    buffer[10] === 0x42 && // B
    buffer[11] === 0x50 // P
  );
}
