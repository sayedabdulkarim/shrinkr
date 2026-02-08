import { describe, it, expect } from 'vitest';
import { parseUserAgent } from '../src/utils/ua-parser.js';

describe('User-Agent parser', () => {
  it('parses Chrome on Windows', () => {
    const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
    const result = parseUserAgent(ua);
    expect(result.browser).toBe('Chrome');
    expect(result.os).toBe('Windows');
    expect(result.deviceType).toBe('desktop');
  });

  it('parses Safari on iPhone', () => {
    const ua = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';
    const result = parseUserAgent(ua);
    expect(result.browser).toBe('Mobile Safari');
    expect(result.os).toBe('iOS');
    expect(result.deviceType).toBe('mobile');
  });

  it('handles undefined user-agent', () => {
    const result = parseUserAgent(undefined);
    expect(result.browser).toBe('Unknown');
    expect(result.os).toBe('Unknown');
    expect(result.deviceType).toBe('Unknown');
  });
});
