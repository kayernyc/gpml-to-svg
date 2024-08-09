/**
 * Determines if the shortest distance between two angles, considering a 360-degree range, crosses over 360 degrees.
 *
 * @param previousLong - The previous angle in degrees.
 * @param sourceLong - The source angle in degrees.
 * @returns A boolean value indicating whether the shortest distance between the angles crosses over 360 degrees.
 */

export function shortDistanceCrosses360(
  previousLong: number,
  sourceLong: number,
): boolean {
  const lowPoint = Math.min(previousLong, sourceLong) + 360;
  const highPoint = Math.max(previousLong, sourceLong) + 360;

  return lowPoint + 360 - highPoint < highPoint - lowPoint;
}
