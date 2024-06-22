import { ShapeType, shapeTypes } from '../../types/shapeTypes';
import errorProcessing from '../../utilities/errorProcessing';

const CoordinatesRegex = /posList":"(?<coordinatelist>[0-9.\-\s]+)/gm;

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

function isFeatureValid(data: string): boolean | ShapeType {
  let isValid: boolean | ShapeType = false;
  shapeTypes.forEach((shapeType: string) => {
    if (data.includes(shapeType)) {
      isValid = shapeType as ShapeType;
    }
  });
  return isValid;
}

function createPointsArray(result: RegExpExecArray): ProcessedPoint[][] {
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

  return mostRecentPath.length ? [currentPath, mostRecentPath] : [currentPath];
}

function createPoints(currentPointsArray: ProcessedPoint[], color: string) {
  return currentPointsArray
    .map(
      (point: ProcessedPoint) =>
        `<circle cx="${point.long}" cy="${point.lat}" r="5" style="fill:${color}" />`,
    )
    .join('');
}

function createLine(currentPointsArray: ProcessedPoint[], color: string) {
  return `<polyline points="${currentPointsArray
    .map((point: ProcessedPoint) => `${point.long} ${point.lat}`)
    .join(' ')}" fill="none" style="stroke:${color}; stroke-width:2" />`;
}

function createShape(currentPointsArray: ProcessedPoint[], color: string) {
  return `<polygon points="${currentPointsArray
    .map((point: ProcessedPoint) => `${point.long} ${point.lat}`)
    .join(' ')}" style="fill:${color}" />`;
}

function parsePoints(outlineObject: unknown, color: string): string {
  try {
    const data = JSON.stringify(outlineObject);
    if (isFeatureValid(data) === false) {
      return '';
    }

    const featureType: ShapeType = isFeatureValid(data) as ShapeType;
    const results = data.matchAll(CoordinatesRegex);

    if (!results) {
      return '';
    }

    let nodes = '';
    let currentStr = '';

    for (let result of results) {
      const currentPointArrays = createPointsArray(result);

      if (featureType === 'LineString' || featureType === 'OrientableCurve') {
        currentPointArrays.forEach((currentPointArray) => {
          currentStr += createLine(currentPointArray, color);
        });
      } else if (featureType === 'MultiPoint' || featureType === 'Point') {
        console.warn('Point and MultiPoint not implemented.');
        // currentPointArrays.forEach((currentPointArray) => {
        //   currentStr += createPoints(currentPointArray, color);
        // });
      } else {
        currentPointArrays.forEach((currentPointArray) => {
          currentStr += createShape(currentPointArray, color);
        });
      }

      nodes = `${nodes}${currentStr}`;
    }

    return nodes;
  } catch (err) {
    errorProcessing(err);
  }

  return '';
}

export default parsePoints;
