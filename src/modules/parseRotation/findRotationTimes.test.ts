import { describe, expect, it, test } from 'vitest';
import {
  relativeTimeRotationParams,
  findRelativeTimeRotationParams,
} from './findRotationTimes';
import { time } from 'console';

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
      lat_of_euler_pole: -35.4532,
      lon_of_euler_pole: 63.8624,
      rotation_angle: -12.9164,
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
