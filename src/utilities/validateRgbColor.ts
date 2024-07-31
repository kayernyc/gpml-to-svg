import type { RgbColorArrayType } from '@modules/colorMap/createColorArray';

export function validateRgbColor(colorArray: RgbColorArrayType) {
  colorArray.forEach((colorNumber: number) => {
    if (colorNumber > 255 || colorNumber < 0) {
      process.exit(1);
    }
  });
}
