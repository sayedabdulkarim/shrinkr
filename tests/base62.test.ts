import { describe, it, expect } from 'vitest';
import { encodeBase62, decodeBase62 } from '../src/utils/base62.js';

describe('Base62 encoding', () => {
  it('encodes 0 as "0"', () => {
    expect(encodeBase62(0)).toBe('0');
  });

  it('encodes small numbers', () => {
    expect(encodeBase62(1)).toBe('1');
    expect(encodeBase62(9)).toBe('9');
    expect(encodeBase62(10)).toBe('A');
    expect(encodeBase62(35)).toBe('Z');
    expect(encodeBase62(36)).toBe('a');
    expect(encodeBase62(61)).toBe('z');
  });

  it('encodes 62 as "10"', () => {
    expect(encodeBase62(62)).toBe('10');
  });

  it('encodes large numbers', () => {
    expect(encodeBase62(100000)).toBe('Q0u');
    expect(encodeBase62(123456789)).toBe('8M0kX');
  });

  it('roundtrips encode/decode', () => {
    const values = [0, 1, 42, 100, 999, 100000, 123456789, 56800235583];
    for (const val of values) {
      expect(decodeBase62(encodeBase62(val))).toBe(val);
    }
  });
});
