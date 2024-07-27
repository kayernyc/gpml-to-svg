import { describe, expect, it } from 'vitest';
import { findRgbColorCode } from './jsonFromCpt';

describe('findRgbColorCode', () => {
  it('creates a simple rule from a source with tabs', () => {
    const result = findRgbColorCode('0\t209\t233\t255\t300\t98 159 217');
    const expected = [
      {
        anchor: 0,
        color: [209, 233, 255],
      },
      {
        anchor: 300,
        color: [98, 159, 217],
      },
    ];

    expect(result).toEqual(expected);
  });

  it('creates a simple rule from a rule with spaces', () => {
    const result = findRgbColorCode('0 209 233 255  300  98 159 217');
    const expected = [
      {
        anchor: 0,
        color: [209, 233, 255],
      },
      {
        anchor: 300,
        color: [98, 159, 217],
      },
    ];

    expect(result).toEqual(expected);
  });

  it("throws an error if there aren't enough values", () => {
    expect(() => {
      findRgbColorCode('0 209 233 255  300  98 217');
    }).toThrow();
  });

  it('throws an error if a value is 4 characters long', () => {
    expect(() => {
      findRgbColorCode('0 209 233 2550  300  98 217 98');
    }).toThrow();
  });

  it('throws an error if a color value is too high', () => {
    expect(() => {
      findRgbColorCode('0 209 233 300  300  98 217 129');
    }).toThrow();
  });
});
