export function validateUrl(url: string, baseUrl: string): { valid: boolean; error?: string } {
  if (!url || url.length > 2048) {
    return { valid: false, error: 'URL must be between 1 and 2048 characters' };
  }

  try {
    const parsed = new URL(url);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return { valid: false, error: 'Only http and https URLs are allowed' };
    }

    // Reject self-referencing URLs
    const baseHost = new URL(baseUrl).hostname;
    if (parsed.hostname === baseHost) {
      return { valid: false, error: 'Cannot shorten URLs pointing to this service' };
    }

    return { valid: true };
  } catch {
    return { valid: false, error: 'Invalid URL format' };
  }
}
