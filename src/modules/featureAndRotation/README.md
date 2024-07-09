## Calculate Quats by hand

```ts
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
    console.log({ qTransform });
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
    console.log({ qTransform });

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
```

## multiplying Quats the manual way

```ts

function multiplyQuaternions(q1: Quaternion, q2: Quaternion): Quaternion {
  return new Quaternion(
    q1.w * q2.w - q1.x * q2.x - q1.y * q2.y - q1.z * q2.z,
    q1.w * q2.x + q1.x * q2.w + q1.y * q2.z - q1.z * q2.y,
    q1.w * q2.y - q1.x * q2.z + q1.y * q2.w + q1.z * q2.x,
    q1.w * q2.z + q1.x * q2.y - q1.y * q2.x + q1.z * q2.w,
  );
}
```

