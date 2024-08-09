import { describe, expect, test } from 'vitest';
import { crossingPoint } from './crossingPoint';

const latLonToCartesianCases = [
  {
    name: 'where 45, 45 generates [0.5, 0.5, 0.7071067811865475]',
    previousPoint: { lat: 350, long: 45 },
    currentPoint: { lat: 10, long: -45 },
    expected: 371.6666666666667,
  },
];

describe('crossingPoint', () => {
  test.each(latLonToCartesianCases)(
    '$name',
    ({ previousPoint, currentPoint, expected }) => {
      const result = crossingPoint(previousPoint, currentPoint);
      expect(result).toEqual(expected);
    },
  );
});
