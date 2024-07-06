export type EulerParamType = [number, number, number];
import { RotationNode } from '@projectTypes/rotationTypes';
import Quaternion from 'quaternion';

/*  Written with the help of ChatGPT, assuming this
    structure in GPlates:
		{
			double lat_of_euler_pole;
			double lon_of_euler_pole;
			double rotation_angle;
		};
*/

export function degreesToRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

export function radiansToDegrees(radians: number): number {
  return (radians * 180) / Math.PI;
}

export function latLonToCartesian(
  lat: number,
  lon: number,
): [number, number, number] {
  const latitude = degreesToRadians(lat);
  const longitude = degreesToRadians(lon);
  const x = Math.cos(latitude) * Math.cos(longitude);
  const y = Math.cos(latitude) * Math.sin(longitude);
  const z = Math.sin(latitude);
  return [x, y, z];
}

export function cartesianToLatLong(
  x: number,
  y: number,
  z: number,
): [number, number] {
  const radius = Math.sqrt(x * x + y * y + z * z);
  const latitude = Math.asin(z / radius) * (180 / Math.PI);
  const longitude = Math.atan2(y, x) * (180 / Math.PI);

  return [latitude, longitude];
}

interface EulerPole {
  lat_of_euler_pole: number;
  lon_of_euler_pole: number;
  rotation_angle: number; // in degrees
}

export function eulerToQuaternion(euler: EulerPole): Quaternion {
  const { lat_of_euler_pole, lon_of_euler_pole, rotation_angle } = euler;

  const latRad = degreesToRadians(lat_of_euler_pole);
  const lonRad = degreesToRadians(lon_of_euler_pole);
  const angleRad = degreesToRadians(rotation_angle);

  const x = Math.cos(latRad) * Math.cos(lonRad);
  const y = Math.cos(latRad) * Math.sin(lonRad);
  const z = Math.sin(latRad);

  const sinHalfAngle = Math.sin(angleRad / 2);
  const cosHalfAngle = Math.cos(angleRad / 2);

  return new Quaternion(
    cosHalfAngle,
    x * sinHalfAngle,
    y * sinHalfAngle,
    z * sinHalfAngle,
  );
}

export function quaternionToEulerPole(quaternion: Quaternion): EulerPole {
  const { w, x, y, z } = quaternion;

  // Calculate the rotation angle
  const angleRad = 2 * Math.acos(w);
  const angleDeg = radiansToDegrees(angleRad);

  // Calculate the rotation axis
  const sinHalfAngle = Math.sqrt(1 - w * w);
  let axisX = x / sinHalfAngle;
  let axisY = y / sinHalfAngle;
  let axisZ = z / sinHalfAngle;

  if (sinHalfAngle < 1e-6) {
    axisX = x;
    axisY = y;
    axisZ = z;
  }

  // Normalize the axis
  const magnitude = Math.sqrt(axisX * axisX + axisY * axisY + axisZ * axisZ);
  axisX /= magnitude;
  axisY /= magnitude;
  axisZ /= magnitude;

  // Convert the rotation axis to latitude and longitude
  const latRad = Math.asin(axisZ);
  const lonRad = Math.atan2(axisY, axisX);

  const latDeg = radiansToDegrees(latRad);
  const lonDeg = radiansToDegrees(lonRad);

  return {
    lat_of_euler_pole: latDeg,
    lon_of_euler_pole: lonDeg,
    rotation_angle: angleDeg,
  };
}

export function transformPointBetweenPoles(
  point: [number, number, number],
  oldPole: EulerPole,
  newPole: EulerPole,
): [number, number, number] {
  const qInitial = eulerToQuaternion(oldPole);
  const qNew = eulerToQuaternion(newPole);
  const testQ = qNew.mul(qInitial);
  const qTransform = qNew.mul(qInitial.conjugate());

  const eulerArray = qTransform.toEuler();

  const qPoint = new Quaternion(0, ...point);
  const qConjugate = qTransform.conjugate();

  const result = qTransform.mul(qPoint).mul(qConjugate);
  return [result.x, result.y, result.z];
}

export function transformLatLongBetweenPoles(
  lat: number,
  long: number,
  newPole: EulerPole,
  oldPole: EulerPole = {
    lat_of_euler_pole: 90,
    lon_of_euler_pole: 0,
    rotation_angle: 0,
  },
): [number, number] {
  const cartesian = latLonToCartesian(lat, long);
  const transformed = transformPointBetweenPoles(cartesian, oldPole, newPole);
  return cartesianToLatLong(...transformed);
}

function multiplyQuaternions(q1: Quaternion, q2: Quaternion): Quaternion {
  return new Quaternion(
    q1.w * q2.w - q1.x * q2.x - q1.y * q2.y - q1.z * q2.z,
    q1.w * q2.x + q1.x * q2.w + q1.y * q2.z - q1.z * q2.y,
    q1.w * q2.y - q1.x * q2.z + q1.y * q2.w + q1.z * q2.x,
    q1.w * q2.z + q1.x * q2.y - q1.y * q2.x + q1.z * q2.w,
  );
}

export function transformBetweenPoles(
  oldPole: EulerPole,
  newPole: EulerPole,
): Quaternion {
  const qInitial = eulerToQuaternion(oldPole);
  const qNew = eulerToQuaternion(newPole);
  const qTransform = qNew.mul(qInitial);

  return qTransform;
}

export function multiplyDegreeEulerRotations(
  oldPole: EulerPole,
  newPole: EulerPole,
): EulerPole {
  const qInitial = eulerToQuaternion(oldPole);
  const qNew = eulerToQuaternion(newPole);
  const qTransform = qNew.mul(qInitial);

  return quaternionToEulerPole(qTransform);
}
