import { RgbColorArrayType } from '@modules/colorMap/createColorArray';
import { CptRampRule, CptRampRuleArray } from '@modules/validFiles/jsonFromCpt';

export type RampDictionaryType = { [key: number]: RgbColorArrayType };

export function findOutOfRangeValues(colorRamp: CptRampRuleArray) {
  return colorRamp.reduce(
    (acc, ramp: CptRampRule) => {
      switch (ramp.anchor) {
        case 'B':
          acc.belowRange = ramp.color;
          break;
        case 'F':
          acc.aboveRange = ramp.color;
          break;
        case 'N':
          acc.invalidAge = ramp.color;
      }

      return acc;
    },
    {
      aboveRange: [0, 0, 0] as RgbColorArrayType,
      belowRange: [0, 0, 0] as RgbColorArrayType,
      invalidAge: [0, 0, 0] as RgbColorArrayType,
    },
  );
}

export function findNumericRangeValues(colorRamp: CptRampRuleArray) {
  let lowBoundary = Infinity;
  let highBoundary = 0;

  let rangeArray: number[] = [];

  const rampDictionary = colorRamp.reduce(
    (acc, ramp: CptRampRule) => {
      if (typeof ramp.anchor !== 'number') {
        return acc;
      }

      lowBoundary = Math.min(lowBoundary, ramp.anchor);
      highBoundary = Math.max(highBoundary, ramp.anchor);
      rangeArray.push(ramp.anchor);

      if (acc[ramp.anchor] === undefined) {
        acc[ramp.anchor] = ramp.color;
      }

      return acc;
    },
    {} as { [key: number]: RgbColorArrayType },
  );

  rangeArray = Array.from(new Set(rangeArray)).sort((a, b) => a - b);

  return {
    highBoundary,
    lowBoundary,
    rampDictionary,
    rangeArray,
  };
}

function findColorInTwoRgbColors(low: number, high: number, ratio: number) {
  return (high - low) * ratio + low;
}

export function findColorInRange(
  age: number,
  rampDictionary: RampDictionaryType,
  rangeArray: number[],
): RgbColorArrayType {
  if (rampDictionary[age] !== undefined) {
    return rampDictionary[age];
  }

  const { lowKey, highKey } = rangeArray.reduce(
    (acc, currentValue: number) => {
      if (currentValue < age) {
        acc.lowKey = Math.max(acc.lowKey, currentValue);
      }

      if (currentValue > age) {
        acc.highKey = Math.min(acc.highKey, currentValue);
      }
      return acc;
    },
    {
      lowKey: 0,
      highKey: Infinity,
    },
  );

  const lowColor = rampDictionary[lowKey];
  const highColor = rampDictionary[highKey];

  const ratio = (age - lowKey) / (highKey - lowKey);

  return [
    findColorInTwoRgbColors(lowColor[0], highColor[0], ratio),
    findColorInTwoRgbColors(lowColor[1], highColor[1], ratio),
    findColorInTwoRgbColors(lowColor[2], highColor[2], ratio),
  ] as RgbColorArrayType;
}

export function gradedStepFactory(colorRamp: CptRampRuleArray) {
  const { aboveRange, belowRange, invalidAge } =
    findOutOfRangeValues(colorRamp);

  const { highBoundary, lowBoundary, rampDictionary, rangeArray } =
    findNumericRangeValues(colorRamp);

  return function (age: number) {
    switch (true) {
      case age < 0:
      case isNaN(age):
        return invalidAge;

      case age < lowBoundary:
        return belowRange;

      case age > highBoundary:
        return aboveRange;

      default:
    }
  };
}
