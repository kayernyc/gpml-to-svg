export type RgbColorArrayType = [number, number, number];

export function stepSingleChannel(
  color: number,
  step: number,
  numberOfFiles: number,
): number[] {
  const stepsAbove = Math.min(Math.floor((255 - color) / step), numberOfFiles);
  const start = color + stepsAbove * step;

  return new Array(numberOfFiles)
    .fill(0)
    .map((_, index) => start - index * step);
}

export function createRange(rgbColor: number[], numberOfFiles: number) {
  const colorRange: RgbColorArrayType[] = [];

  numberOfFiles = Math.min(149, numberOfFiles);

  const step =
    numberOfFiles >= 90
      ? Math.floor(150 / numberOfFiles)
      : Math.floor(90 / numberOfFiles);

  const compositeArray = rgbColor.map((color) =>
    stepSingleChannel(color, step, numberOfFiles),
  );

  const finalArray: RgbColorArrayType[] = [];

  for (let i = 0; i < numberOfFiles; i++) {
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
