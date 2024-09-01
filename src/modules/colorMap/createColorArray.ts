export type RgbColorArrayType = [number, number, number];

export function stepSingleChannel(
  color: number,
  step: number,
  numberOfFiles: number,
): number[] {
  const stepsAbove = Math.min(Math.floor((255 - color) / step), numberOfFiles);
  const stepsBelow = Math.min(Math.floor(color / step), numberOfFiles);
  let start: number;

  if (stepsBelow <= stepsAbove) {
    start = (numberOfFiles - stepsBelow) * step + color;
  } else {
    start = color + stepsAbove * step;
  }

  return new Array(numberOfFiles)
    .fill(0)
    .map((_, index) => start - index * step);
}

export function createRange(rgbColor: number[], numberOfFiles: number) {
  const colorRange: RgbColorArrayType[] = [];

  const clampedNumberOfFiles = Math.min(149, numberOfFiles);

  const step =
    clampedNumberOfFiles >= 90
      ? Math.floor(150 / clampedNumberOfFiles)
      : Math.floor(90 / clampedNumberOfFiles);

  const compositeArray = rgbColor.map((color) =>
    stepSingleChannel(color, step, clampedNumberOfFiles),
  );

  const finalArray: RgbColorArrayType[] = [];

  for (let i = 0; i < clampedNumberOfFiles; i++) {
    finalArray.push([
      compositeArray[0][i],
      compositeArray[1][i],
      compositeArray[2][i],
    ]);
  }

  return finalArray;
}

export function createColorArray(
  color: RgbColorArrayType,
  numberOfFiles: number,
  multiColor = false,
): RgbColorArrayType[] {
  if (multiColor && numberOfFiles > 1) {
    const createdRange = createRange(color, numberOfFiles - 1);
    return [color, ...createdRange];
  }

  return [color];
}
