import NAMED_COLORS from '../NAMED_COLORS';

const HexColorRegex = /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

export default function colorProcessing(color: string): string {
  if (NAMED_COLORS.includes(color)) {
    return color;
  }

  if (HexColorRegex.test(color)) {
    if (color.charAt(0) !== '#') {
      color = `#${color}`;
    }
    return color;
  }

  console.warn('Invalid color. Defaulting to black.');
  return 'black';
}
