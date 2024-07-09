import { describe, expect, it, test } from 'vitest';
import Quaternion from 'quaternion';

import {
  eulerToQuaternion,
  quaternionToEulerPole,
  cartesianToLatLong,
  latLonToCartesian,
  transformPointBetweenPoles,
  transformBetweenPoles,
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
  {
    name: 'using gplates real case',
    point: [1, 0, 0],
    initialPole: {
      lat_of_euler_pole: 90,
      lon_of_euler_pole: 0,
      rotation_angle: 0,
    },
    newPole: {
      lat_of_euler_pole: -34.4489,
      lon_of_euler_pole: 65.8376,
      rotation_angle: -51.2807,
    },
    expected: [0.6681732808036102, 0.5364546671230196, 0.5155199869472283],
  },
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
    name: 'using no rotation',
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
      console.log(cartesianToLatLong(result[0], result[1], result[2]));

      expect(result[0]).toBeCloseTo(expected[0], 3);
      expect(result[1]).toBeCloseTo(expected[1], 3);
      expect(result[2]).toBeCloseTo(expected[2], 3);
    },
  );
});

const quaternionToEulerPoleCases = [
  {
    name: 'where quaternion [0, 0, 0, 1] generates euler pole [0, 0, 90]',
    quaternion: { w: 0, x: 0, y: 0, z: 1 },
    expected: {
      lat_of_euler_pole: 90,
      lon_of_euler_pole: 0,
      rotation_angle: 180,
    },
  },
  {
    name: 'where quaternion [0.5, 0.5, 0.5, 0.5] generates euler pole [0, 0, 45]',
    quaternion: { w: 0.5, x: 0.5, y: 0.5, z: 0.5 },
    expected: {
      lat_of_euler_pole: 35.264,
      lon_of_euler_pole: 45,
      rotation_angle: 120,
    },
  },
  {
    name: 'where quaternion [0.866, 0, 0, 0.5] generates euler pole [0, 0, 30]',
    quaternion: { w: 0.866, x: 0, y: 0, z: 0.5 },
    expected: {
      lat_of_euler_pole: 90,
      lon_of_euler_pole: 0,
      rotation_angle: 60.00582186237605,
    },
  },
  {
    name: 'where quaternion [0.707, 0, 0, 0.707] generates euler pole [90, 0 90]',
    quaternion: { w: 0.707, x: 0, y: 0, z: 0.707 },
    expected: {
      lat_of_euler_pole: 90,
      lon_of_euler_pole: 0,
      rotation_angle: 90.0173,
    },
  },
  {
    name: 'where quaternion [0, 0.707, 0, 0.707] generates euler pole [0, 90, 45]',
    quaternion: { w: 0, x: 0.707, y: 0, z: 0.707 },
    expected: {
      lat_of_euler_pole: 45,
      lon_of_euler_pole: 0,
      rotation_angle: 180,
    },
  },
];

describe('quaternionToEulerPole', () => {
  test.each(quaternionToEulerPoleCases)('$name', ({ quaternion, expected }) => {
    const result = quaternionToEulerPole(quaternion as Quaternion);

    expect(result.lat_of_euler_pole).toBeCloseTo(expected.lat_of_euler_pole, 3);
    expect(result.lon_of_euler_pole).toBeCloseTo(expected.lon_of_euler_pole, 3);
    expect(result.rotation_angle).toBeCloseTo(expected.rotation_angle, 3);
  });
});

const eulerToQuaternionCases = [
  {
    name: 'where euler pole [0, 0, 90] generates quaternion [0, 0, 0, 1]',
    euler: { lat_of_euler_pole: 90, lon_of_euler_pole: 0, rotation_angle: 180 },
    expected: { w: 0, x: 0, y: 0, z: 1 },
  },
  {
    name: 'where euler pole [0, 0, 45] generates quaternion [0.5, 0.5, 0.5, 0.5]',
    euler: {
      lat_of_euler_pole: 35.264,
      lon_of_euler_pole: 45,
      rotation_angle: 120,
    },
    expected: { w: 0.5, x: 0.5, y: 0.5, z: 0.5 },
  },
  {
    name: 'where euler pole [0, 0, 30] generates quaternion [0.866, 0, 0, 0.5]',
    euler: {
      lat_of_euler_pole: 89.23993017780637,
      lon_of_euler_pole: 0,
      rotation_angle: 60.00582186237605,
    },
    expected: { w: 0.866, x: 0.0066, y: 0, z: 0.5 },
  },
  {
    name: 'where euler pole [0, 0, 45] generates quaternion [0.707, 0, 0, 0.707]',
    euler: {
      lat_of_euler_pole: 88.5919462011935,
      lon_of_euler_pole: 0,
      rotation_angle: 90.017303325676,
    },
    expected: { w: 0.707, x: 0.0173, y: 0, z: 0.707 },
  },
  {
    name: 'where euler pole [0, 90, 45] generates quaternion [0, 0.707, 0, 0.707]',
    euler: {
      lat_of_euler_pole: 44.991348337,
      lon_of_euler_pole: 0,
      rotation_angle: 180,
    },
    expected: { w: 0, x: 0.707, y: 0, z: 0.707 },
  },
];

describe('eulerToQuaternion', () => {
  test.each(eulerToQuaternionCases)('$name', ({ name, euler, expected }) => {
    const result = eulerToQuaternion(euler);
    console.log({ name }, { result });
    expect(result.w).toBeCloseTo(expected.w, 3);
    expect(result.x).toBeCloseTo(expected.x, 3);
    expect(result.y).toBeCloseTo(expected.y, 3);
    expect(result.z).toBeCloseTo(expected.z, 3);
  });
});

const transformBetweenPolesCases = [
  {
    name: 'where point [1, 0, 0] is transformed from initial pole to new pole',
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
    expected: {
      w: 0.9659258262890683,
      x: -1.5848095757158825e-17,
      y: 0,
      z: -0.25881904510252074,
    },
  },
  {
    name: 'where point [0.8660254037844387, 0.5, 0] is transformed from initial pole to new pole',
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
    name: 'where point [1, 0, 0] is transformed from initial pole to new pole with no rotation',
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
    name: 'where point [1, 0, 0] is transformed from initial pole to new pole with negative rotation',
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

describe('transformBetweenPoles', () => {
  test.each(transformBetweenPolesCases)('$name', ({ initialPole, newPole }) => {
    const { w, x, y, z } = transformBetweenPoles(initialPole, newPole);
    expect(w).toBeCloseTo(w, 3);
    expect(x).toBeCloseTo(x, 3);
    expect(y).toBeCloseTo(y, 3);
    expect(z).toBeCloseTo(z, 3);
  });

  it('processes two rotations', () => {
    const secondPole = {
      lat_of_euler_pole: 90,
      lon_of_euler_pole: 0,
      rotation_angle: 30,
    };
    const thirdPole = {
      lat_of_euler_pole: 90,
      lon_of_euler_pole: 0,
      rotation_angle: 10,
    };
    const firstResult = transformBetweenPoles(secondPole, thirdPole);

    expect(firstResult).toEqual({
      w: 0.9396926207859084,
      x: 2.094269368838496e-17,
      y: 1.925929944387236e-34,
      z: 0.3420201433256687,
    });
  });

  it('processes plateID 300 at 600 my', () => {
    const base = {
      lat_of_euler_pole: 90,
      lon_of_euler_pole: 0,
      rotation_angle: 0,
    };
    const thirdPole = {
      lat_of_euler_pole: -34.4489,
      lon_of_euler_pole: 65.8376,
      rotation_angle: -51.2807,
    };
    const firstResult = transformBetweenPoles(base, thirdPole);
    console.log(quaternionToEulerPole(firstResult));

    const angle = 2 * Math.acos(firstResult.w);
    console.log({ angle });

    expect(firstResult).toEqual({
      w: 0.9015280105759967,
      x: -0.14606124245908153,
      y: -0.3255722590077852,
      z: 0.2447775801881427,
    });
  });

  it('processes plateID 400 at 600 my', () => {
    const base = {
      lat_of_euler_pole: 90,
      lon_of_euler_pole: 0,
      rotation_angle: 0,
    };
    const thirdPole = {
      lat_of_euler_pole: 90,
      lon_of_euler_pole: 0,
      rotation_angle: 50,
    };
    const firstResult = transformBetweenPoles(base, thirdPole);
    console.log(quaternionToEulerPole(firstResult));

    expect(firstResult).toEqual({
      w: 0.9063077870366499,
      x: 2.5877905075098294e-17,
      y: 0,
      z: 0.42261826174069944,
    });
  });

  it('processes two different rotations', () => {
    // 350 -> 300 -> 0
    const secondPole = {
      lat_of_euler_pole: -34.4489,
      lon_of_euler_pole: 65.8376,
      rotation_angle: -51.2807,
    };
    const thirdPole = {
      lat_of_euler_pole: 50.5931,
      lon_of_euler_pole: -154.445,
      rotation_angle: -89.8022,
    };
    const firstResult = transformBetweenPoles(secondPole, thirdPole);
    console.log(quaternionToEulerPole(firstResult));

    const angle = 2 * Math.acos(firstResult.w);
    console.log({ angle });

    expect(firstResult).toEqual({
      w: 0.8940632033005891,
      x: 0.13075310559609227,
      y: -0.07563544611933094,
      z: -0.42170356077604665,
    });
  });
});

describe('multiplyQuaternions manually', () => {
  it('multiplies simple things', () => {
    // use 300 at 600 my
    const point = latLonToCartesian(0, 0);
    const root = {
      lat_of_euler_pole: 90,
      lon_of_euler_pole: 0,
      rotation_angle: 0,
    };
    const firstPole = {
      lat_of_euler_pole: -34.4489,
      lon_of_euler_pole: 65.8376,
      rotation_angle: -51.2807,
    };

    const qPoint = new Quaternion(0, ...point);

    const rootQuat = eulerToQuaternion(root);
    const qNew = eulerToQuaternion(firstPole);
    const qTransform = qNew.mul(rootQuat.conjugate());
    console.log({ qTransform });

    //---
    const qConjugate = qTransform.conjugate();
    const result = qTransform.mul(qPoint).mul(qConjugate);
    console.log(cartesianToLatLong(result.x, result.y, result.z));
  });

  it('multiplies two things', () => {
    // use 350 at 600 my
    const point = latLonToCartesian(4.3191, 14.9992);
    const root = {
      lat_of_euler_pole: 90,
      lon_of_euler_pole: 0,
      rotation_angle: 0,
    };

    const firstPole = {
      lat_of_euler_pole: -34.4489,
      lon_of_euler_pole: 65.8376,
      rotation_angle: -51.2807,
    };

    const secondPole = {
      lat_of_euler_pole: 50.5931,
      lon_of_euler_pole: -154.445,
      rotation_angle: -89.8022,
    };

    const qPoint = new Quaternion(0, ...point);
    const baseQuat = eulerToQuaternion(root);

    const qInitial = eulerToQuaternion(firstPole);
    const qNew = eulerToQuaternion(secondPole);
    const intermediateQuat = qInitial.mul(qNew);

    const qTransform = intermediateQuat.mul(baseQuat.conjugate());
    const qConjugate = qTransform.conjugate();
    const result = qTransform.mul(qPoint).mul(qConjugate);
    console.log(cartesianToLatLong(result.x, result.y, result.z));
  });

  it('multiplies three things', () => {
    // use 370 at 600 my
    const point = latLonToCartesian(-19.6762, 58.5797);
    const root = {
      lat_of_euler_pole: 90,
      lon_of_euler_pole: 0,
      rotation_angle: 0,
    };

    const firstPole = {
      lat_of_euler_pole: -34.4489,
      lon_of_euler_pole: 65.8376,
      rotation_angle: -51.2807,
    };

    const secondPole = {
      lat_of_euler_pole: 50.5931,
      lon_of_euler_pole: -154.445,
      rotation_angle: -89.8022,
    };

    const thirdPole = {
      lat_of_euler_pole: -23.4654,
      lon_of_euler_pole: 44.8734,
      rotation_angle: 206.4252,
    };

    const qOne = eulerToQuaternion(firstPole);
    const qTwo = eulerToQuaternion(secondPole);
    const qThree = eulerToQuaternion(thirdPole);
    const baseQuat = eulerToQuaternion(root);

    const intermediateQuat1 = qTwo.mul(qThree);
    const intermediateQuat2 = qOne.mul(intermediateQuat1);

    const qTransform = intermediateQuat2.mul(baseQuat);

    const qConjugate = qTransform.conjugate();
    const result = qTransform.mul(point).mul(qConjugate);
    console.log(cartesianToLatLong(result.x, result.y, result.z));
  });

  it('multiplies three different things', () => {
    // use 370 at 600 my
    const point = latLonToCartesian(-30.1393, 60.0494);
    const root = {
      lat_of_euler_pole: 90,
      lon_of_euler_pole: 0,
      rotation_angle: 0,
    };

    const firstPole = {
      lat_of_euler_pole: -34.4489,
      lon_of_euler_pole: 65.8376,
      rotation_angle: -51.2807,
    };

    const secondPole = {
      lat_of_euler_pole: 50.5931,
      lon_of_euler_pole: -154.445,
      rotation_angle: -89.8022,
    };

    const thirdPole = {
      lat_of_euler_pole: -23.4654,
      lon_of_euler_pole: 44.8734,
      rotation_angle: 206.4252,
    };

    const qOne = eulerToQuaternion(firstPole);
    const qTwo = eulerToQuaternion(secondPole);
    const qThree = eulerToQuaternion(thirdPole);
    const baseQuat = eulerToQuaternion(root);

    const intermediateQuat1 = qTwo.mul(qThree);
    const intermediateQuat2 = qOne.mul(intermediateQuat1);
    const qTransform = intermediateQuat2.mul(baseQuat);
    const qConjugate = qTransform.conjugate();
    const result = qTransform.mul(point).mul(qConjugate);
    console.log(cartesianToLatLong(result.x, result.y, result.z));
  });
});
