import { stderr } from 'process';
import NAMED_COLORS from '../NAMED_COLORS';

const HexColorRegex = /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;

// CREDIT WHERE CREDIT IS DUE: https://stackoverflow.com/a/5624139
export function hexToRgb(hex: string) {
  if (!HexColorRegex.test(hex) && !shorthandRegex.test(hex)) {
    stderr.write(`Color ${hex} is not valid. Defaulting to gray.`);
    return [128, 128, 128];
  }

  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  hex = hex.replace(shorthandRegex, function (_, r, g, b) {
    return r + r + g + g + b + b;
  });

  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [
        parseInt(result[1], 16), // red
        parseInt(result[2], 16), // green
        parseInt(result[3], 16), // blue
      ]
    : [];
}

export function componentToHex(colorValue: number) {
  colorValue = Math.max(0, Math.min(colorValue, 255));
  var hex = colorValue.toString(16);
  return hex.length == 1 ? '0' + hex : hex;
}

export function rgbToHex(rgbNumber: [number, number, number]): string {
  const result = '#' + rgbNumber.map((num) => componentToHex(num)).join('');
  if (!HexColorRegex.test(result)) {
    stderr.write(`Color ${result} is not valid. Defaulting to gray.`);
    return '#808080';
  }

  return result;
}

export default function colorProcessing(color: string): number[] {
  if (NAMED_COLORS[color] !== undefined) {
    return NAMED_COLORS[color];
  }

  if (HexColorRegex.test(color)) {
    if (color.charAt(0) !== '#') {
      color = `#${color}`;
    }
    return hexToRgb(color);
  }

  console.warn('Invalid color. Defaulting to gray.');
  return [128, 128, 128];
}
