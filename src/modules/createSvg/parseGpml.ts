import { promises as fs } from 'fs';
import errorProcessing from '../../utilities/errorProcessing';

const CoordinatesRegex =
  /<gml:posList gml:dimension="2">(?<coordinatelist>[0-9.\-\s]+)/gm;

type ProcessedPoint = {
  lat: number;
  long: number;
};

function crossingPoint(
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

function shortDistanceCrosses360(
  previousLong: number,
  sourceLong: number,
): boolean {
  const lowPoint = Math.min(previousLong, sourceLong) + 360;
  const highPoint = Math.max(previousLong, sourceLong) + 360;

  return lowPoint + 360 - highPoint < highPoint - lowPoint;
}

async function parseGpml(sourcePath: string, color: string): Promise<string> {
  try {
    const data = await fs.readFile(sourcePath, 'utf8');

    const results = data.matchAll(CoordinatesRegex);

    let nodes = '';

    for (let result of results) {
      if (result[1]) {
        const coordinateData = result[1].trim().split(' ');

        let previousPoint: ProcessedPoint | undefined;
        let mostRecentPath: ProcessedPoint[] = [];
        let currentPath: ProcessedPoint[] = [];

        coordinateData.forEach((dataPoint, index) => {
          // only work with complete pairs
          if (index % 2 === 1) {
            const dataFloat = parseFloat(dataPoint);
            if (isNaN(dataFloat)) {
              console.warn({ dataFloat }, { dataPoint }, 'is NaN');
            } else {
              const sourceLat = 90 - parseFloat(coordinateData[index - 1]);
              const sourceLong = dataFloat + 180;

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

              currentPath.push(previousPoint);
            }
          }
        });

        let currentStr = `<polygon points="${currentPath
          .map((point: ProcessedPoint) => `${point.long} ${point.lat}`)
          .join(' ')}" style="fill:${color}" />`;

        if (mostRecentPath) {
          currentStr += `<polygon points="${mostRecentPath
            .map((point: ProcessedPoint) => `${point.long} ${point.lat}`)
            .join(' ')}" style="fill:${color}" />`;
        }

        nodes = `${nodes}${currentStr}`;
      }
    }

    return nodes;
  } catch (err) {
    errorProcessing(err);
  }

  return '';
}

export default parseGpml;
