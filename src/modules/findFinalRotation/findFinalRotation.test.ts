import type { RotationNode } from '@projectTypes/rotationTypes';
import { describe, expect, it } from 'vitest';
import { findAllRotations, findFinalRotation } from './findFinalRotation';

const rotationTimes = {
  100: {
    lat_of_euler_pole: 90,
    lon_of_euler_pole: 0,
    rotation_angle: 0,
    relativePlateId: 0,
  },
  200: {
    lat_of_euler_pole: 18.0278,
    lon_of_euler_pole: -5.9447,
    rotation_angle: -37.1595,
    relativePlateId: 0,
  },
  300: {
    lat_of_euler_pole: -34.4489,
    lon_of_euler_pole: 65.8376,
    rotation_angle: -51.2807,
    relativePlateId: 0,
  },
  350: {
    lat_of_euler_pole: 50.5931,
    lon_of_euler_pole: -154.4447,
    rotation_angle: -89.8022,
    relativePlateId: 300,
  },
  370: {
    lat_of_euler_pole: -23.4654,
    lon_of_euler_pole: 44.8734,
    rotation_angle: 206.4252,
    relativePlateId: 350,
  },
  400: {
    lat_of_euler_pole: 90,
    lon_of_euler_pole: 0,
    rotation_angle: 50,
    relativePlateId: 0,
  },
  500: {
    lat_of_euler_pole: 90,
    lon_of_euler_pole: 0,
    rotation_angle: 0,
    relativePlateId: 0,
  },
  1: {
    lat_of_euler_pole: 90,
    lon_of_euler_pole: 0,
    rotation_angle: 0,
    relativePlateId: 0,
  },
};

describe('findFinalRotation', () => {
  it('should return original rotation when there is no dependency', () => {
    // use 300 at 600 my
    const rotationNode = {
      lat_of_euler_pole: -34.4489,
      lon_of_euler_pole: 65.8376,
      rotation_angle: -51.2807,
      relativePlateId: 0,
    };

    const expectedTransformQuat = {
      w: 0.9015280105759967,
      x: -0.14606124245908153,
      y: -0.3255722590077852,
      z: 0.2447775801881427,
    };

    const finalTransformQuat = findFinalRotation(rotationNode, rotationTimes);
    expect(finalTransformQuat).toEqual(expectedTransformQuat);
  });

  it('should return a correct transformation for one dependency', () => {
    const rotationNode = {
      lat_of_euler_pole: 50.5931,
      lon_of_euler_pole: -154.445,
      rotation_angle: -89.8022,
      relativePlateId: 300,
    };

    const expectedRotation = {
      w: 0.8940632033005891,
      x: 0.3912582721676063,
      y: -0.03704653060455519,
      z: -0.21493140192739402,
    };

    const finalRotation = findFinalRotation(rotationNode, rotationTimes);
    expect(finalRotation).toEqual(expectedRotation);
  });

  it('should return a correct transformation for two dependencies', () => {
    const rotationNode = {
      lat_of_euler_pole: -23.4654,
      lon_of_euler_pole: 44.8734,
      rotation_angle: 206.4252,
      relativePlateId: 350,
    };

    const expectedRotation = {
      w: -0.5119385557807475,
      x: 0.6261647365199006,
      y: 0.5874353599969298,
      z: -0.02750155758068773,
    };

    const finalRotation = findFinalRotation(rotationNode, rotationTimes);
    expect(finalRotation).toEqual(expectedRotation);
  });
});

describe('findAllRotations', () => {
  it('should return an empty array when there are no rotations', () => {
    const rotationNode = {
      lat_of_euler_pole: 90,
      lon_of_euler_pole: 0,
      rotation_angle: 0,
      relativePlateId: 0,
    };

    const expected: RotationNode[] = [
      {
        lat_of_euler_pole: 90,
        lon_of_euler_pole: 0,
        relativePlateId: 0,
        rotation_angle: 0,
      },
    ];

    const finalRotation = findAllRotations(rotationNode, []);

    expect(finalRotation).toEqual(expected);
  });

  it('two rotations when there is one dependency', () => {
    const rotationNode = {
      lat_of_euler_pole: 50.5931,
      lon_of_euler_pole: -154.4447,
      rotation_angle: -89.8022,
      relativePlateId: 300,
    };

    const expected: RotationNode[] = [
      {
        lat_of_euler_pole: 50.5931,
        lon_of_euler_pole: -154.4447,
        relativePlateId: 300,
        rotation_angle: -89.8022,
      },
      {
        lat_of_euler_pole: -34.4489,
        lon_of_euler_pole: 65.8376,
        relativePlateId: 0,
        rotation_angle: -51.2807,
      },
    ];

    const finalRotation = findAllRotations(rotationNode, rotationTimes);

    expect(finalRotation).toEqual(expected);
  });

  it('two rotations when there are two dependencies', () => {
    const rotationNode = {
      lat_of_euler_pole: -23.4654,
      lon_of_euler_pole: 44.8734,
      rotation_angle: 206.4252,
      relativePlateId: 350,
    };

    const expected: RotationNode[] = [
      {
        lat_of_euler_pole: -23.4654,
        lon_of_euler_pole: 44.8734,
        rotation_angle: 206.4252,
        relativePlateId: 350,
      },
      {
        lat_of_euler_pole: 50.5931,
        lon_of_euler_pole: -154.4447,
        relativePlateId: 300,
        rotation_angle: -89.8022,
      },
      {
        lat_of_euler_pole: -34.4489,
        lon_of_euler_pole: 65.8376,
        relativePlateId: 0,
        rotation_angle: -51.2807,
      },
    ];

    const finalRotation = findAllRotations(rotationNode, rotationTimes);

    expect(finalRotation).toEqual(expected);
  });
});
