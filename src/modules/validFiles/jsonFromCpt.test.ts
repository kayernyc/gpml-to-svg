import { describe, expect, it } from 'vitest';
import { findRgbColorCodeRule } from './jsonFromCpt';

describe('findRgbColorCodeRule', () => {
  it('creates a simple rule from a real source with a large time number', () => {
    const result = findRgbColorCodeRule('0\t255 179 40\t  1000 \t86 86 86\n');
    const expected = [
      {
        anchor: 0,
        color: [255, 179, 40],
      },
      {
        anchor: 1000,
        color: [86, 86, 86],
      },
    ];

    expect(result).toEqual(expected);
  });

  it('creates a simple rule from a real source', () => {
    const result = findRgbColorCodeRule('0\t255 179 40\t  100\t86 86 86\n');
    const expected = [
      {
        anchor: 0,
        color: [255, 179, 40],
      },
      {
        anchor: 100,
        color: [86, 86, 86],
      },
    ];

    expect(result).toEqual(expected);
  });

  it('creates a simple rule from a source with tabs', () => {
    const result = findRgbColorCodeRule('0\t209\t233\t255\t300\t98 159 217');
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

  it('creates a simple rule from a source with tabs and spaces', () => {
    const result = findRgbColorCodeRule('0\t209  233\t255  300\t98 159 217');
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
    const result = findRgbColorCodeRule('0 209 233 255  300  98 159 217');
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

  it('creates a simple rule from a rule with a B key', () => {
    const result = findRgbColorCodeRule('B 209 233 255');
    const expected = [
      {
        anchor: 'B',
        color: [209, 233, 255],
      },
    ];

    expect(result).toEqual(expected);
  });

  it('creates a simple rule from a rule with a N key', () => {
    const result = findRgbColorCodeRule('N 209 233 255');
    const expected = [
      {
        anchor: 'N',
        color: [209, 233, 255],
      },
    ];

    expect(result).toEqual(expected);
  });

  it('creates a simple rule from a rule with a F key', () => {
    const result = findRgbColorCodeRule('F 209 233 255');
    const expected = [
      {
        anchor: 'F',
        color: [209, 233, 255],
      },
    ];

    expect(result).toEqual(expected);
  });

  it("throws an error if there aren't enough values", () => {
    expect(() => {
      findRgbColorCodeRule('0 209 233 255  300  98 217');
    }).toThrow();
  });

  it('throws an error if a value is 4 characters long', () => {
    expect(() => {
      findRgbColorCodeRule('0 209 233 2550  300  98 217 98');
    }).toThrow();
  });

  it('throws an error if a color value is too high', () => {
    expect(() => {
      findRgbColorCodeRule('0 209 233 300  300  98 217 129');
    }).toThrow();
  });

  it('throws an error if a color value is too high', () => {
    expect(() => {
      findRgbColorCodeRule('A 209 233 300  300  98 217 129');
    }).toThrow();
  });
});
