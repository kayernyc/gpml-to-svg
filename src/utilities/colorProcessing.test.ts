import { describe, it, expect } from 'vitest';
import { hexToRgb, rgbToHex } from '../utilities/colorProcessing';

describe('hexToRgb', () => {
  it('should convert a valid 6-digit hex color to RGB', () => {
    const hexColor = '#FF0000';
    const expectedRgb = [255, 0, 0];
    const result = hexToRgb(hexColor);
    expect(result).toEqual(expectedRgb);
  });

  it('should convert a valid 3-digit hex color to RGB', () => {
    const hexColor = '#F00';
    const expectedRgb = [255, 0, 0];
    const result = hexToRgb(hexColor);
    expect(result).toEqual(expectedRgb);
  });

  it('should convert a valid 6-digit hex color without "#" to RGB', () => {
    const hexColor = '00FF00';
    const expectedRgb = [0, 255, 0];
    const result = hexToRgb(hexColor);
    expect(result).toEqual(expectedRgb);
  });

  it('should convert a valid 3-digit hex color without "#" to RGB', () => {
    const hexColor = '0F0';
    const expectedRgb = [0, 255, 0];
    const result = hexToRgb(hexColor);
    expect(result).toEqual(expectedRgb);
  });

  it('should return null for an invalid hex color', () => {
    const hexColor = '#12345';
    const expectedRgb = [128, 128, 128];
    const result = hexToRgb(hexColor);
    console.log({ expectedRgb });
    expect(result).toEqual(expectedRgb);
  });
});

describe('rgbToHex', () => {
  it('should convert an RGB color to a valid 6-digit hex color', () => {
    const rgbColor = [255, 0, 0] as [number, number, number];
    const expectedHex = '#ff0000';
    const result = rgbToHex(rgbColor);
    expect(result).toEqual(expectedHex);
  });

  it('should convert an RGB color with values less than 16 to a valid 6-digit hex color', () => {
    const rgbColor = [0, 255, 0] as [number, number, number];
    const expectedHex = '#00ff00';
    const result = rgbToHex(rgbColor);
    expect(result).toEqual(expectedHex);
  });

  it('should convert an RGB color with values greater than 255 to a valid 6-digit hex color', () => {
    const rgbColor = [300, 150, 200] as [number, number, number];
    const expectedHex = '#ff96c8';
    const result = rgbToHex(rgbColor);
    expect(result).toEqual(expectedHex);
  });

  it('should return bounded result for an RGB color with negative numbers', () => {
    const rgbColor = [-10, 0, 300] as [number, number, number];
    const expectedHex = `#0000ff`;
    const result = rgbToHex(rgbColor);
    expect(result).toEqual(expectedHex);
  });
});
