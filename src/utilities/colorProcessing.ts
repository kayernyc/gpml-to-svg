import { stderr } from 'node:process';
import NAMED_COLORS from '../constants/NAMED_COLORS';
import type { RgbColorArrayType } from '@modules/colorMap/createColorArray';

const HexColorRegex = /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;

// CREDIT WHERE CREDIT IS DUE: https://stackoverflow.com/a/5624139
export function hexToRgb(hex: string): RgbColorArrayType | undefined {
  if (!HexColorRegex.test(hex) && !shorthandRegex.test(hex)) {
    stderr.write(`Color ${hex} is not valid. Defaulting to gray.`);
    return [128, 128, 128];
  }

  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  const testedHex = hex.replace(
    shorthandRegex,
    (_, r, g, b) => r + r + g + g + b + b,
  );

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(testedHex);
  if (result) {
    return [
      Number.parseInt(result[1], 16), // red
      Number.parseInt(result[2], 16), // green
      Number.parseInt(result[3], 16), // blue
    ];
  }
  return;
}

export function componentToHex(colorValue: number) {
  const clampedColorValue = Math.round(Math.max(0, Math.min(colorValue, 255)));
  const hex = clampedColorValue.toString(16);
  return hex.length === 1 ? `0${hex}` : hex;
}

export function rgbToHex(rgbNumber: [number, number, number]): string {
  const result = `#${rgbNumber.map((num) => componentToHex(num)).join('')}`;
  if (!HexColorRegex.test(result)) {
    stderr.write(`Color ${result} is not valid. Defaulting to gray.`);
    return '#808080';
  }

  return result;
}

export function colorValidation(color: string): string {
  if (color.length < 1) {
    return '';
  }

  if (NAMED_COLORS[color] !== undefined) {
    return color;
  }

  if (!HexColorRegex.test(color) && !shorthandRegex.test(color)) {
    stderr.write(`Color ${color} is not valid. Defaulting to no color.`);
    ('');
  } else {
    return color.charAt(0) === '#' ? color : `#${color}`;
  }

  return '';
}

export default function colorProcessing(color: string): RgbColorArrayType {
  if (NAMED_COLORS[color] !== undefined) {
    return NAMED_COLORS[color] as RgbColorArrayType;
  }

  if (HexColorRegex.test(color)) {
    let formattedColor = color;
    if (color.charAt(0) !== '#') {
      formattedColor = `#${color}`;
    }
    return hexToRgb(formattedColor) as RgbColorArrayType;
  }

  stderr.write('Invalid color. Defaulting to gray.');
  return [128, 128, 128];
}
