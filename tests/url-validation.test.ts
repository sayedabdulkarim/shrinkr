import { describe, it, expect } from 'vitest';
import { validateUrl } from '../src/utils/validate-url.js';

const BASE_URL = 'http://localhost:3000';

describe('URL validation', () => {
  it('accepts valid http URLs', () => {
    expect(validateUrl('http://example.com', BASE_URL).valid).toBe(true);
    expect(validateUrl('https://example.com/path?q=1', BASE_URL).valid).toBe(true);
    expect(validateUrl('https://sub.example.com', BASE_URL).valid).toBe(true);
  });

  it('rejects empty URLs', () => {
    expect(validateUrl('', BASE_URL).valid).toBe(false);
  });

  it('rejects non-http protocols', () => {
    expect(validateUrl('ftp://example.com', BASE_URL).valid).toBe(false);
    expect(validateUrl('javascript:alert(1)', BASE_URL).valid).toBe(false);
  });

  it('rejects invalid URLs', () => {
    expect(validateUrl('not-a-url', BASE_URL).valid).toBe(false);
    expect(validateUrl('://missing-protocol.com', BASE_URL).valid).toBe(false);
  });

  it('rejects URLs exceeding max length', () => {
    const longUrl = 'https://example.com/' + 'a'.repeat(2050);
    expect(validateUrl(longUrl, BASE_URL).valid).toBe(false);
  });

  it('rejects self-referencing URLs', () => {
    expect(validateUrl('http://localhost:3000/something', BASE_URL).valid).toBe(false);
  });
});
