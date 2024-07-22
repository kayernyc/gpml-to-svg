import { describe, it, expect } from 'vitest';
import { createRange, stepSingleChannel } from './createColorArray';

describe('stepSingleChannel', () => {
  it('should return an array with the stepped color values', () => {
    const color = 128;
    const step = 10;
    const numberOfFiles = 5;
    const expected = [178, 168, 158, 148, 138];
    const result = stepSingleChannel(color, step, numberOfFiles);
    expect(result).toEqual(expected);
  });

  it('should return an array with the stepped color values when the color is close to 255', () => {
    const color = 230;
    const step = 10;
    const numberOfFiles = 5;
    const expected = [250, 240, 230, 220, 210];
    const result = stepSingleChannel(color, step, numberOfFiles);
    expect(result).toEqual(expected);
  });

  it('should return an array many steps', () => {
    const color = 230;
    const step = Math.floor(90 / 55);
    const numberOfFiles = 55;
    const expected = [
      255, 254, 253, 252, 251, 250, 249, 248, 247, 246, 245, 244, 243, 242, 241,
      240, 239, 238, 237, 236, 235, 234, 233, 232, 231, 230, 229, 228, 227, 226,
      225, 224, 223, 222, 221, 220, 219, 218, 217, 216, 215, 214, 213, 212, 211,
      210, 209, 208, 207, 206, 205, 204, 203, 202, 201,
    ];
    const result = stepSingleChannel(color, step, numberOfFiles);
    expect(result).toEqual(expected);
  });
});

describe('createRange', () => {
  it('should return an array with the correct range of color values', () => {
    const rgbColor = [128, 128, 128];
    const numberOfFiles = 5;
    const expected = [
      [218, 218, 218],
      [200, 200, 200],
      [182, 182, 182],
      [164, 164, 164],
      [146, 146, 146],
    ];
    const result = createRange(rgbColor, numberOfFiles);
    expect(result).toEqual(expected);
  });

  it('should return an array with the correct range of color values when the color is close to [255, 255, 255]', () => {
    const rgbColor = [240, 240, 240];
    const numberOfFiles = 5;
    const expected = [
      [240, 240, 240],
      [222, 222, 222],
      [204, 204, 204],
      [186, 186, 186],
      [168, 168, 168],
    ];
    const result = createRange(rgbColor, numberOfFiles);
    expect(result).toEqual(expected);
  });

  it('should return an array with the correct range of color values for a different number of files', () => {
    const rgbColor = [250, 100, 128];
    const numberOfFiles = 8;
    const expected = [
      [250, 188, 216],
      [239, 177, 205],
      [228, 166, 194],
      [217, 155, 183],
      [206, 144, 172],
      [195, 133, 161],
      [184, 122, 150],
      [173, 111, 139],
    ];
    const result = createRange(rgbColor, numberOfFiles);
    expect(result).toEqual(expected);
  });
});
