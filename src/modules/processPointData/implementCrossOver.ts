import type { ProcessedPoint } from './createSvgTypes';
import { crossingPoint } from './crossingPoint';
import { shortDistanceCrosses360 } from './shortDistanceCrosses360';

export function implementCrossOver(
  currentPointArrays: ProcessedPoint[][],
): ProcessedPoint[][] {
  const processedPointArrays: ProcessedPoint[][] = [];

  for (const currentPointArray of currentPointArrays) {
    if (currentPointArray.length > 2) {
      let mostRecentPath: ProcessedPoint[] = [];
      let currentPath: ProcessedPoint[] = [];

      let previousPoint: ProcessedPoint | undefined;

      for (let i = 0; i < currentPointArray.length; i++) {
        const { long: sourceLong, lat: sourceLat } = currentPointArray[i];

        if (previousPoint) {
          const { long: previousLong } = previousPoint;

          if (shortDistanceCrosses360(previousLong, sourceLong)) {
            const borderY = crossingPoint(previousPoint, {
              lat: sourceLat,
              long: sourceLong,
            });

            const previousBorderX = previousLong > 180 ? 360 : 0;
            const currentBorderX = previousLong < 180 ? 360 : 0;

            currentPath.push({ long: previousBorderX, lat: borderY });
            const tempRecent = currentPath;
            if (mostRecentPath) {
              currentPath = mostRecentPath;
            } else {
              currentPath = [];
            }

            mostRecentPath = tempRecent;
            currentPath.push({ long: currentBorderX, lat: borderY });
            currentPath.push({ long: sourceLong, lat: sourceLat });
          } else {
            currentPath.push({ long: sourceLong, lat: sourceLat });
          }
        }

        previousPoint = {
          long: sourceLong,
          lat: sourceLat,
        };
      }

      if (mostRecentPath.length) {
        processedPointArrays.push(mostRecentPath);
      }

      processedPointArrays.push(currentPath);
    }
  }
  return processedPointArrays;
}
