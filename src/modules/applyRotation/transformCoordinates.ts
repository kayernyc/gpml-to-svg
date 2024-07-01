export type EulerParamType = [number, number, number];
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

function eulerToQuaternion(euler: EulerPole): Quaternion {
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

export function transformPointBetweenPoles(
  point: [number, number, number],
  initialPole: EulerPole,
  newPole: EulerPole,
): [number, number, number] {
  const qInitial = eulerToQuaternion(initialPole);
  const qNew = eulerToQuaternion(newPole);
  const qTransform = qNew.mul(qInitial.conjugate());

  const qPoint = new Quaternion(0, ...point);
  const qConjugate = qTransform.conjugate();

  const result = qTransform.mul(qPoint).mul(qConjugate);
  return [result.x, result.y, result.z];
}
