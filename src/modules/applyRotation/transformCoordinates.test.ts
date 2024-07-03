import { describe, expect, test } from 'vitest';

import {
  latLonToCartesian,
  cartesianToLatLong,
  transformPointBetweenPoles,
} from './transformCoordinates';

const latLonToCartesianCases = [
  {
    name: 'where 45, 45 generates [0.5, 0.5, 0.7071067811865475]',
    lat: 45,
    lon: 45,
    expected: [0.5, 0.5, 0.7071067811865475],
  },
  {
    name: 'where 0, 90 generates [0, 1, 0]',
    lat: 0,
    lon: 90,
    expected: [0, 1, 0],
  },
  {
    name: 'where 0, -90 generates [0, -1, 0]',
    lat: 0,
    lon: -90,
    expected: [0, -1, 0],
  },
  {
    name: 'where 0, 180 generates [-1, 0, 0]',
    lat: 0,
    lon: 180,
    expected: [-1, 0, 0],
  },
  {
    name: 'where 0, -180 generates [-1, 0, 0]',
    lat: 0,
    lon: -180,
    expected: [-1, 0, 0],
  },
  {
    name: 'where 35, 61 generates [0.3972, 0.71644, 0.5736]',
    lat: 35,
    lon: 61,
    expected: [0.3972, 0.71644, 0.5736],
  },
];

describe('latLonToCartesian', () => {
  test.each(latLonToCartesianCases)('$name', ({ lat, lon, expected }) => {
    const result = latLonToCartesian(lat, lon);
    expect(result[0]).toBeCloseTo(expected[0], 2);
    expect(result[1]).toBeCloseTo(expected[1], 2);
    expect(result[2]).toBeCloseTo(expected[2], 2);
  });
});

const LclArray = [
  { name: 'where 0, 0 generates 0, 0', x: 1, y: 0, z: 0, expected: [0, 0] },
  {
    name: 'where 0.5, 0.5, 0.70711 generates 45, 45',
    x: 0.5,
    y: 0.5,
    z: 0.70711,
    expected: [45, 45],
  },
  {
    name: 'where 0, 1, 0 generates 0, 90',
    x: 0,
    y: 1,
    z: 0,
    expected: [0, 90],
  },
  {
    name: 'where 0, -1, 0 generates 0, -90',
    x: 0,
    y: -1,
    z: 0,
    expected: [0, -90],
  },
  {
    name: 'where -1, 0, 0 generates 0, 180',
    x: -1,
    y: 0,
    z: 0,
    expected: [0, 180],
  },
  {
    name: 'where 0, -1, 0 generates 0, -90',
    x: 0,
    y: -1,
    z: 0,
    expected: [0, -90],
  },
  {
    name: 'where 0.3972, 0.71644, 0.5736 generates 35, 61',
    x: 0.3972,
    y: 0.71644,
    z: 0.5736,
    expected: [35, 61],
  },
];

describe('cartesianToLatLong', () => {
  test.each(LclArray)('$name', ({ x, y, z, expected }) => {
    const [lat, lon] = cartesianToLatLong(x, y, z);
    const [resultLat, resultLon] = expected;
    expect(lat).toBeCloseTo(resultLat, 2);
    expect(lon).toBeCloseTo(resultLon, 2);
  });
});

const transformPointBetweenPolesCases = [
  // {
  //   name: 'where point [1, 0, 0] is transformed from initial pole to new pole',
  //   point: [1, 0, 0],
  //   initialPole: {
  //     lat_of_euler_pole: 30,
  //     lon_of_euler_pole: 60,
  //     rotation_angle: 20,
  //   },
  //   newPole: {
  //     lat_of_euler_pole: 45,
  //     lon_of_euler_pole: 45,
  //     rotation_angle: 30,
  //   },
  //   expected: [0.7392, 0.5732, 0.3536],
  // },
  // {
  //   name: 'where point [0, 1, 0] is transformed from initial pole to new pole',
  //   point: [0, 1, 0],
  //   initialPole: {
  //     lat_of_euler_pole: 30,
  //     lon_of_euler_pole: 60,
  //     rotation_angle: 20,
  //   },
  //   newPole: {
  //     lat_of_euler_pole: 45,
  //     lon_of_euler_pole: 45,
  //     rotation_angle: 30,
  //   },
  //   expected: [0.2803, 0.7392, 0.6124],
  // },
  {
    name: 'where point [1, 0, 0] is transformed from initial pole to new pole',
    point: [1, 0, 0],
    initialPole: {
      lat_of_euler_pole: 90,
      lon_of_euler_pole: 0,
      rotation_angle: 0,
    },
    newPole: {
      lat_of_euler_pole: 90,
      lon_of_euler_pole: 0,
      rotation_angle: 30,
    },
    expected: [0.8660254037844387, 0.5, 0],
  },
  {
    name: 'in the series, the same point goes to a third pole',
    point: [0.8660254037844387, 0.5, 0],
    initialPole: {
      lat_of_euler_pole: 90,
      lon_of_euler_pole: 0,
      rotation_angle: 30,
    },
    newPole: {
      lat_of_euler_pole: 20,
      lon_of_euler_pole: 45,
      rotation_angle: 30,
    },
    expected: [0.9251766765758391, 0.23016134445423478, -0.30178448044772743],
  },
  {
    name: 'using test planet',
    point: [1, 0, 0],
    initialPole: {
      lat_of_euler_pole: 90,
      lon_of_euler_pole: 0,
      rotation_angle: 0,
    },
    newPole: {
      lat_of_euler_pole: 90,
      lon_of_euler_pole: 0,
      rotation_angle: 0,
    },
    expected: [1, 0, 0],
  },
  {
    name: 'using test planet and motion',
    point: [1, 0, 0],
    initialPole: {
      lat_of_euler_pole: 90,
      lon_of_euler_pole: 0,
      rotation_angle: 0,
    },
    newPole: {
      lat_of_euler_pole: 90,
      lon_of_euler_pole: 0,
      rotation_angle: -30,
    },
    expected: [0.8660254037844387, -0.5, 0],
  },
];

describe('transformPointBetweenPoles', () => {
  test.each(transformPointBetweenPolesCases)(
    '$name',
    ({ point, initialPole, newPole, expected }) => {
      const result = transformPointBetweenPoles(
        point as [number, number, number],
        initialPole,
        newPole,
      );

      expect(result[0]).toBeCloseTo(expected[0], 3);
      expect(result[1]).toBeCloseTo(expected[1], 3);
      expect(result[2]).toBeCloseTo(expected[2], 3);
    },
  );
});
