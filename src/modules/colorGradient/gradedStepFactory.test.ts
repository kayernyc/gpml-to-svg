import {
  findColorInRange,
  findOutOfRangeValues,
  gradedStepFactory,
  RampDictionaryType,
} from '@modules/colorGradient/gradedStepFactory';
import { findNumericRangeValues } from '@modules/colorGradient/gradedStepFactory';
import { CptRampRuleArray } from '@modules/validFiles/jsonFromCpt';
import { describe, expect, it } from 'vitest';

describe('findOutOfRangeValues', () => {
  it('should return a default values if the colorRamp is empty', () => {
    const colorRamp: CptRampRuleArray = [];
    const result = findOutOfRangeValues(colorRamp);
    const expected = {
      aboveRange: [0, 0, 0],
      belowRange: [0, 0, 0],
      invalidAge: [0, 0, 0],
    };
    expect(result).toEqual(expected);
  });

  it('should correct values for provided options and the default otherwise', () => {
    const colorRamp: CptRampRuleArray = [
      { anchor: 'B', color: [23, 45, 67] },
      { anchor: 'F', color: [23, 145, 167] },
    ];
    const result = findOutOfRangeValues(colorRamp);
    const expected = {
      aboveRange: [23, 145, 167],
      belowRange: [23, 45, 67],
      invalidAge: [0, 0, 0],
    };
    expect(result).toEqual(expected);
  });

  it('should return an array of rules with out-of-range values', () => {
    const colorRamp: CptRampRuleArray = [
      { anchor: 'B', color: [23, 45, 67] },
      { anchor: 'F', color: [23, 145, 167] },
      { anchor: 'F', color: [23, 200, 167] },
      { anchor: 'N', color: [123, 145, 167] },
    ];

    const expected = {
      aboveRange: [23, 200, 167],
      belowRange: [23, 45, 67],
      invalidAge: [123, 145, 167],
    };
    const result = findOutOfRangeValues(colorRamp);
    expect(result).toEqual(expected);
  });
});

describe('findNumericRangeValues', () => {
  it('should return an empty rangeArray if the colorRamp is empty', () => {
    const colorRamp: CptRampRuleArray = [];
    const result = findNumericRangeValues(colorRamp);
    const expected = {
      highBoundary: 0,
      lowBoundary: Infinity,
      rampDictionary: {},
      rangeArray: [],
    };
    expect(result).toEqual(expected);
  });

  it('should return an array of rules with numeric range values', () => {
    const colorRamp: CptRampRuleArray = [
      { anchor: 'B', color: [23, 45, 67] },
      { anchor: 'F', color: [23, 145, 167] },
      { anchor: 'N', color: [123, 145, 167] },
      { anchor: 300, color: [123, 145, 167] },
    ];

    const expected = {
      rangeArray: [300],
      highBoundary: 300,
      lowBoundary: 300,
      rampDictionary: {
        '300': [123, 145, 167],
      },
    };

    const result = findNumericRangeValues(colorRamp);
    expect(result).toEqual(expected);
  });

  it('should return an array of rules with numeric range values, excluding invalidAge', () => {
    const colorRamp: CptRampRuleArray = [
      { anchor: 'B', color: [23, 45, 67] },
      { anchor: 'F', color: [23, 145, 167] },
      { anchor: 'N', color: [123, 145, 167] },
      { anchor: 300, color: [123, 145, 167] },
      { anchor: 100, color: [13, 200, 180] },
      { anchor: 700, color: [157, 255, 201] },
    ];

    const expected = {
      highBoundary: 700,
      lowBoundary: 100,
      rampDictionary: {
        '100': [13, 200, 180],
        '300': [123, 145, 167],
        '700': [157, 255, 201],
      },
      rangeArray: [100, 300, 700],
    };

    const result = findNumericRangeValues(colorRamp);
    expect(result).toEqual(expected);
  });
});

describe('findColorInRange', () => {
  const rampDictionary: RampDictionaryType = {
    100: [13, 200, 180],
    300: [123, 145, 167],
    700: [157, 255, 201],
  };
  const rangeArray = [100, 300, 700];

  it('should return the color for the specified age when there is an exact match', () => {
    const age = 100;
    const result = findColorInRange(age, rampDictionary, rangeArray);
    const expected = [13, 200, 180];
    expect(result).toEqual(expected);
  });

  it('should return the color between two points', () => {
    const age = 200;
    const result = findColorInRange(age, rampDictionary, rangeArray);
    const expected = [68, 172.5, 173.5];
    expect(result).toEqual(expected);
  });

  it('should return the color for the minimum specified age', () => {
    const age = 100;
    const result = findColorInRange(age, rampDictionary, rangeArray);
    const expected = [13, 200, 180];
    expect(result).toEqual(expected);
  });

  it('should return the color for the maximum specified age', () => {
    const age = 700;
    const result = findColorInRange(age, rampDictionary, rangeArray);
    const expected = [157, 255, 201];
    expect(result).toEqual(expected);
  });

  it('should return the color proportionally between two points', () => {
    const age = 400;
    const result = findColorInRange(age, rampDictionary, rangeArray);
    const expected = [131.5, 172.5, 175.5];
    expect(result).toEqual(expected);
  });
});

describe('gradedStepFactory', () => {
  const colorRamp: CptRampRuleArray = [
    { anchor: 'B', color: [23, 45, 67] },
    { anchor: 'F', color: [23, 145, 167] },
    { anchor: 'N', color: [123, 145, 167] },
    { anchor: 300, color: [123, 145, 167] },
    { anchor: 100, color: [255, 245, 267] },
    { anchor: 700, color: [95, 90, 40] },
  ];

  const findColor = gradedStepFactory(colorRamp);

  it('returns below value when passed in an early age.', () => {
    const result = findColor(50);
    const expected = [23, 45, 67];

    expect(result).toEqual(expected);
  });

  it('returns above value when passed in an early age.', () => {
    const result = findColor(750);
    const expected = [23, 145, 167];

    expect(result).toEqual(expected);
  });

  it('returns correct middle value between 100 and 300.', () => {
    const result = findColor(200);
    const expected = [189, 195, 217];

    expect(result).toEqual(expected);
  });

  it('returns correct off-middle value between 300 and 700.', () => {
    const result = findColor(500);
    const expected = [109, 117.5, 103.5];

    expect(result).toEqual(expected);
  });
});
