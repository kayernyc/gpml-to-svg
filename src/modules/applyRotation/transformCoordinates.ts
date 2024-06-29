export type EulerParamType = [number, number, number];
import Quaternion from 'quaternion';
import projector from 'ecef-projector';

// Calculate angle with x-axis
// const angleWithX = Math.atan2(y, x);

// Calculate angle with y-axis
// const angleWithY = Math.atan2(x, y);

// Calculate angle with hypotenuse
// const angleWithHypotenuse = Math.atan2(y, Math.sqrt(x * x + y * y));
// Calculate x from angle with x-axis
// const xFromAngleWithX = Math.cos(angleWithX);
// Calculate y from angle with y-axis
// const yFromAngleWithY = Math.sin(angleWithY);
// Calculate hypotenuse from angle with hypotenuse
// const hypotenuseFromAngleWithHypotenuse = Math.sqrt(x * x + y * y);

export function degreesToRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

export function radiansToDegrees(radians: number): number {
  return (radians * 180) / Math.PI;
}

const radius = Math.sqrt(2);

// const adjacent = Math.cos(angle) * hypotenuse;
// const opposite = Math.sin(angle) * hypotenuse;

export const getCartesianZFromLat = (lat: number) => {
  const latRad = degreesToRadians(lat);
  return Math.sin(latRad);
};

export const getCartesianXYFromLong = (long: number) => {
  const lonRad = degreesToRadians(long);

  const x = Math.cos(lonRad);
  const y = Math.sin(lonRad);

  return [x, y];
};

export function longLatToCartesian(
  long: number,
  lat: number,
): [number, number, number] {
  const [x, y] = getCartesianXYFromLong(long);
  console.log({ x, y });
  const z = getCartesianZFromLat(lat);
  return [x, y, z];
}

export function cartesianToLatLong(
  x: number,
  y: number,
  z: number,
): [number, number] {
  console.log(x, y, z);
  // Calculate longitude (lon)
  let lon = (Math.atan2(z, x) * 180) / Math.PI;
  if (x === 0 && z === 0) {
    lon = 0;
  }

  if (y === 0) {
    return [0, lon];
  }

  let hypotenuse = Math.sqrt(x * x + z * z) || 1;

  const lat = radiansToDegrees(Math.asin(y / hypotenuse));

  return [lat, lon];
}

export function transformCoordinates(
  lat: number,
  long: number,
  newEuler: EulerParamType,
) {
  const initialEulerRad = [1.5707963267948966, 0, 0] as [
    number,
    number,
    number,
  ];
  const newEulerRad: [number, number, number] = newEuler.map(
    (angle) => (angle * Math.PI) / 180,
  ) as [number, number, number];

  const initialQuaternion = Quaternion.fromEuler(...initialEulerRad);
  const newQuaternion = Quaternion.fromEuler(...newEulerRad);

  const initialCartesian = longLatToCartesian(lat, long);

  // Rotate initial Cartesian coordinates using the initial and new quaternions
  const rotatedCartesian = initialQuaternion.rotateVector(initialCartesian);
  const finalRotatedCartesian = newQuaternion.rotateVector(rotatedCartesian);

  // Convert final rotated Cartesian coordinates back to latitude and longitude
  const [newLat, newLon] = cartesianToLatLong(
    finalRotatedCartesian[0],
    finalRotatedCartesian[1],
    finalRotatedCartesian[2],
  );

  return [newLat, newLon];
}
