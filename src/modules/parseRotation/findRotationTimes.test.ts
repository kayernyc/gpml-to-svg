import { describe, expect, test } from 'vitest';
import { findRelativeTimeRotationParams } from './findRotationTimes';

const testCaseParameters = [
  {
    name: 'from gplates example',
    params: {
      time: 900.1,
      earlyTime: 1000,
      lateTime: 600,
      earlyRecord: {
        lat_of_euler_pole: 90,
        lon_of_euler_pole: 0,
        rotation_angle: 0,
        relativePlateId: 0,
      },
      lateRecord: {
        lat_of_euler_pole: -34.4489,
        lon_of_euler_pole: 65.8376,
        rotation_angle: -51.2807,
        relativePlateId: 0,
      },
    },
    expected: {
      lat_of_euler_pole: 58.918887225000006,
      lon_of_euler_pole: 16.442940599999996,
      rotation_angle: -12.807354824999997,
      relativePlateId: 0,
    },
  },
  {
    name: 'where early time is 5, late time is 15, and time is 10',
    params: {
      time: 10,
      earlyTime: 5,
      lateTime: 15,
      earlyRecord: {
        lat_of_euler_pole: 0,
        lon_of_euler_pole: 0,
        rotation_angle: 90,
        relativePlateId: 0,
      },
      lateRecord: {
        lat_of_euler_pole: 0,
        lon_of_euler_pole: 0,
        rotation_angle: 180,
        relativePlateId: 0,
      },
    },
    expected: {
      lat_of_euler_pole: 0,
      lon_of_euler_pole: 0,
      relativePlateId: 0,
      rotation_angle: 135,
    },
  },
  {
    name: 'should handle negative rotation values',
    params: {
      time: 10,
      earlyTime: 5,
      lateTime: 15,
      earlyRecord: {
        lat_of_euler_pole: 0,
        lon_of_euler_pole: 0,
        rotation_angle: -90,
        relativePlateId: 0,
      },
      lateRecord: {
        lat_of_euler_pole: 0,
        lon_of_euler_pole: 0,
        rotation_angle: -180,
        relativePlateId: 0,
      },
    },
    expected: {
      lat_of_euler_pole: 0,
      lon_of_euler_pole: 0,
      relativePlateId: 0,
      rotation_angle: -135,
    },
  },
  {
    name: 'should handle zero rotation values',
    params: {
      time: 10,
      earlyTime: 5,
      lateTime: 15,
      earlyRecord: {
        lat_of_euler_pole: 0,
        lon_of_euler_pole: 0,
        rotation_angle: 0,
        relativePlateId: 0,
      },
      lateRecord: {
        lat_of_euler_pole: 0,
        lon_of_euler_pole: 0,
        rotation_angle: 0,
        relativePlateId: 0,
      },
    },
    expected: {
      lat_of_euler_pole: 0,
      lon_of_euler_pole: 0,
      rotation_angle: 0,
      relativePlateId: 0,
    },
  },
  {
    name: 'should handle asymmetric rotation values',
    params: {
      time: 6,
      earlyTime: 0,
      lateTime: 10,
      earlyRecord: {
        lat_of_euler_pole: 90,
        lon_of_euler_pole: 0,
        rotation_angle: 0,
        relativePlateId: 0,
      },
      lateRecord: {
        lat_of_euler_pole: 90,
        lon_of_euler_pole: 10,
        rotation_angle: 50,
        relativePlateId: 0,
      },
    },
    expected: {
      lat_of_euler_pole: 90,
      lon_of_euler_pole: 6,
      rotation_angle: 30,
      relativePlateId: 0,
    },
  },
];

describe('findRelativeTimeRotationParams', () => {
  test.each(testCaseParameters)(
    'should return the correct rotation parameters when given valid inputs',
    ({ params, expected }) => {
      const result = findRelativeTimeRotationParams(params);
      expect(result).toEqual(expected);
    },
  );
});
