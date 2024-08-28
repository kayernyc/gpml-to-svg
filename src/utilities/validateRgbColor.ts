import type { RgbColorArrayType } from '@modules/colorMap/createColorArray';

export function validateRgbColor(colorArray: RgbColorArrayType) {
  for (const colorNumber of colorArray) {
    if (colorNumber > 255 || colorNumber < 0) {
      process.exit(1);
    }
  }
}
