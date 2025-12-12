/**
 * Validates and sanitizes base64 image data to prevent XSS attacks.
 * Only allows safe image formats (JPEG, PNG, GIF, WebP).
 * Rejects potentially dangerous formats like SVG that can contain scripts.
 */

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
] as const;

const ALLOWED_MIME_PREFIXES = [
  "data:image/jpeg",
  "data:image/png",
  "data:image/gif",
  "data:image/webp",
];

/**
 * Validates a base64 string to ensure it's a safe image format
 * @param base64 - Base64 encoded image string (without data URI prefix)
 * @returns true if valid, false otherwise
 */
export const isValidBase64Image = (base64: string): boolean => {
  if (!base64 || typeof base64 !== "string") {
    return false;
  }

  // Check if it's valid base64
  const base64Regex = /^[A-Za-z0-9+/]+=*$/;
  if (!base64Regex.test(base64)) {
    return false;
  }

  try {
    // Decode base64 to check file signature (magic numbers)
    const decoded = atob(base64.substring(0, 100)); // Check first bytes for signature
    const bytes = new Uint8Array(decoded.length);
    for (let i = 0; i < decoded.length; i++) {
      bytes[i] = decoded.charCodeAt(i);
    }

    // Check magic numbers for common image formats
    // JPEG: FF D8 FF
    if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
      return true;
    }
    // PNG: 89 50 4E 47
    if (
      bytes[0] === 0x89 &&
      bytes[1] === 0x50 &&
      bytes[2] === 0x4e &&
      bytes[3] === 0x47
    ) {
      return true;
    }
    // GIF: 47 49 46 38
    if (
      bytes[0] === 0x47 &&
      bytes[1] === 0x49 &&
      bytes[2] === 0x46 &&
      bytes[3] === 0x38
    ) {
      return true;
    }
    // WebP: 52 49 46 46 (RIFF)
    if (
      bytes[0] === 0x52 &&
      bytes[1] === 0x49 &&
      bytes[2] === 0x46 &&
      bytes[3] === 0x46
    ) {
      // Check for WEBP at offset 8
      if (
        bytes.length > 11 &&
        bytes[8] === 0x57 &&
        bytes[9] === 0x45 &&
        bytes[10] === 0x42 &&
        bytes[11] === 0x50
      ) {
        return true;
      }
    }

    return false;
  } catch {
    return false;
  }
};

/**
 * Validates a complete data URI to ensure it's a safe image
 * @param dataUri - Complete data URI (e.g., "data:image/jpeg;base64,...")
 * @returns true if valid, false otherwise
 */
export const isValidImageDataUri = (dataUri: string): boolean => {
  if (!dataUri || typeof dataUri !== "string") {
    return false;
  }

  // Check if it starts with an allowed MIME type
  const hasValidPrefix = ALLOWED_MIME_PREFIXES.some((prefix) =>
    dataUri.toLowerCase().startsWith(prefix),
  );

  if (!hasValidPrefix) {
    return false;
  }

  // Reject SVG explicitly as it can contain JavaScript
  if (dataUri.toLowerCase().includes("image/svg")) {
    return false;
  }

  // Extract base64 part
  const parts = dataUri.split(",");
  if (parts.length !== 2) {
    return false;
  }

  return isValidBase64Image(parts[1]);
};

/**
 * Sanitizes avatar base64 data by validating it
 * Returns null if the data is invalid or potentially dangerous
 * @param base64 - Base64 encoded image (without data URI prefix)
 * @returns Sanitized base64 string or null
 */
export const sanitizeAvatarBase64 = (
  base64: string | undefined,
): string | null => {
  if (!base64) {
    return null;
  }

  if (!isValidBase64Image(base64)) {
    console.warn("Invalid or potentially dangerous image format detected");
    return null;
  }

  return base64;
};

/**
 * Creates a safe data URI for an avatar image
 * @param base64 - Base64 encoded image (without data URI prefix)
 * @param mimeType - MIME type (defaults to jpeg)
 * @returns Safe data URI or empty string if invalid
 */
export const createSafeAvatarDataUri = (
  base64: string | undefined,
  mimeType:
    | "image/jpeg"
    | "image/png"
    | "image/gif"
    | "image/webp" = "image/jpeg",
): string => {
  if (!base64) {
    return "";
  }

  const sanitized = sanitizeAvatarBase64(base64);
  if (!sanitized) {
    return "";
  }

  // Ensure MIME type is allowed
  if (!ALLOWED_IMAGE_TYPES.includes(mimeType)) {
    mimeType = "image/jpeg";
  }

  return `data:${mimeType};base64,${sanitized}`;
};

/**
 * Validates a file before upload
 * @param file - File object to validate
 * @returns Object with validation result
 */
export const validateImageFile = (
  file: File,
): { valid: boolean; error?: string } => {
  // Check file type
  if (
    !ALLOWED_IMAGE_TYPES.includes(
      file.type as (typeof ALLOWED_IMAGE_TYPES)[number],
    )
  ) {
    return {
      valid: false,
      error:
        "Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.",
    };
  }

  // Explicitly reject SVG
  if (
    file.type === "image/svg+xml" ||
    file.name.toLowerCase().endsWith(".svg")
  ) {
    return {
      valid: false,
      error: "SVG files are not allowed for security reasons.",
    };
  }

  // Check file size (2MB limit)
  const maxSize = 2 * 1024 * 1024;
  if (file.size > maxSize) {
    return {
      valid: false,
      error: "File size must be less than 2MB.",
    };
  }

  return { valid: true };
};
