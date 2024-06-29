import { describe, expect, it, test } from 'vitest';

import {
  cartesianToLatLong,
  getCartesianZFromLat,
  getCartesianXYFromLong,
  longLatToCartesian,
} from './transformCoordinates';

describe('getCartesianZFromLat', () => {
  it('should return the correct cartesian Z coordinate from latitude', () => {
    // Test case 1
    const result1 = getCartesianZFromLat(0);
    expect(result1).toBeCloseTo(0, 2);
    // Test case 2
    const result2 = getCartesianZFromLat(45);
    expect(result2).toBeCloseTo(0.707, 2);
    // Test case 3
    const result3 = getCartesianZFromLat(-90);
    expect(result3).toBeCloseTo(-1, 2);
    // Test case 4
    const result4 = getCartesianZFromLat(90);
    expect(result4).toBeCloseTo(1, 1);
  });
});

const CxyArray = [
  { name: 'where 0 generates 1, 0', long: 0, expected: [1, 0] },
  { name: 'where 90 generates 0, 1', long: 90, expected: [0, 1] },
  { name: 'where -90 generates 0, -1', long: -90, expected: [0, -1] },
  { name: 'where 180 generates -1, 0', long: 180, expected: [-1, 0] },
  {
    name: 'where 45 generates 0.70711, 0.70711',
    long: 45,
    expected: [0.7071067811865476, 0.7071067811865476],
  },
  {
    name: 'where -45 generates 0.70711, -0.70711',
    long: -45,
    expected: [0.7071067811865476, -0.7071067811865476],
  },
];

describe('getCartesianXYFromLong', () => {
  test.each(CxyArray)('$name', ({ long, expected }) => {
    const [x, y] = getCartesianXYFromLong(long);
    const [resultX, resultY] = expected;
    expect(x).toBeCloseTo(resultX, 5);
    expect(y).toBeCloseTo(resultY, 5);
  });
});

const CllArray = [
  { name: 'where 0, 0 generates 0, 0', lat: 0, long: 0, expected: [1, 0, 0] },
  {
    name: 'where 45, 45 generates 45, 45',
    lat: 45,
    long: 45,
    expected: [0.70711, 0.70711, 0.7071067811865475],
  },
  {
    name: 'where 0, 90 generates 0, 1, 0',
    lat: 0,
    long: 90,
    expected: [0, 1, 0],
  },
  {
    name: 'where 0, -90 generates 0, -1, 0',
    lat: 0,
    long: -90,
    expected: [0, -1, 0],
  },
  {
    name: 'where 180, 0 generates -1, 0, 0',
    lat: 0,
    long: 180,
    expected: [-1, 0, 0],
  },
  {
    name: 'where 180, -90 generates -1, 0, -1',
    lat: 0,
    long: 180,
    expected: [-1, 0, 0],
  },
];

describe('latLongToCartesian', () => {
  test.each(CllArray)('$name', ({ lat, long, expected }) => {
    const [x, y, z] = longLatToCartesian(long, lat);
    const [resultX, resultY, resultZ] = expected;
    expect(x).toBeCloseTo(resultX, 5);
    expect(y).toBeCloseTo(resultY, 5);
    expect(z).toBeCloseTo(resultZ, 5);
  });

  it('should convert latitude and longitude to cartesian coordinates', () => {
    // Test case 1
    const result1 = longLatToCartesian(0, 90);
    expect(result1).toEqual([1, 0, 1]);

    // Test case 2
    const result2 = longLatToCartesian(45, 45);
    expect(result2).toEqual([0.70711, 0.70711, 0.7071067811865475]);

    // Test case 3
    const result3 = longLatToCartesian(0, -90);
    expect(result3).toEqual([1, 0, -1]);

    // Test case 4
    const result4 = longLatToCartesian(180, 0);
    expect(result4).toEqual([-1, 0, 0]);
  });
});
