/**
 * Calculates the crossing point between two processed points
 * and returns the y point which will either rest on long 0 or
 * long 360
 *
 * @param previousPoint - The previous processed point.
 * @param currentPoint - The current processed point.
 * @returns The calculated crossing point.
 */
import type { ProcessedPoint } from './createSvgTypes';

export function crossingPoint(
  previousPoint: ProcessedPoint,
  currentPoint: ProcessedPoint,
): number {
  const { long: previousLong, lat: previousLat } = previousPoint;
  const { long: currentLong, lat: currentLat } = currentPoint;

  let x1: number;
  let x2: number;

  let y1: number;
  let y2: number;

  const baseY = Math.min(previousLat, currentLat);

  if (previousLong > currentLong) {
    x1 = previousLong;
    x2 = currentLong + 360;
    y1 = previousLat;
    y2 = currentLat;
  } else {
    x1 = currentLong;
    x2 = previousLong + 360;
    y1 = currentLat;
    y2 = previousLat;
  }

  if (y1 === y2) {
    return y1;
  }

  return ((y2 - y1) / (x2 - x1)) * (360 - x1) + baseY;
}
