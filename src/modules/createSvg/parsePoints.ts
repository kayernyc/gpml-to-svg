import {
  cartesianToLatLong,
  latLonToCartesian,
} from '@modules/applyRotation/transformCoordinates';
import type { ShapeType } from '@projectTypes/shapeTypes';
import {
  type GPlates_Feature,
  isGPlates_Feature,
} from '@projectTypes/timeTypes';
import errorProcessing from '@utilities/errorProcessing';
import type Quaternion from 'quaternion';
import { isFeatureValid } from './isFeatureValid';
import { shortDistanceCrosses360 } from './shortDistanceCrosses360';
import type { ProcessedPoint } from './createSvgTypes';
import { crossingPoint } from './crossingPoint';

const CoordinatesRegex = /posList":"(?<coordinatelist>[0-9.\-\s]+)/gm;

const scaleMultiplier = 10;

function createPointsArray(
  result: RegExpExecArray,
  finalRotation: Quaternion,
): ProcessedPoint[][] {
  const coordinateData = result[1].trim().split(' ');

  let previousPoint: ProcessedPoint | undefined;
  let mostRecentPath: ProcessedPoint[] = [];
  let currentPath: ProcessedPoint[] = [];

  coordinateData.forEach((dataPoint, index) => {
    // only work with complete pairs
    if (index % 2 === 1) {
      const incomingLon = Number.parseFloat(dataPoint);
      if (Number.isNaN(incomingLon)) {
        console.warn({ dataFloat: incomingLon }, { dataPoint }, 'is NaN');
      } else {
        const incomingLat = Number.parseFloat(coordinateData[index - 1]);
        const point = latLonToCartesian(incomingLat, incomingLon);

        const qConjugate = finalRotation.conjugate();
        const result = finalRotation.mul(point).mul(qConjugate);
        let [sourceLat, sourceLong] = cartesianToLatLong(
          result.x,
          result.y,
          result.z,
        );

        sourceLat = 90 - sourceLat;
        sourceLong = sourceLong + 180;

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

  currentPath = currentPath.map(({ lat, long }) => {
    return { lat: lat * scaleMultiplier, long: long * scaleMultiplier };
  });

  mostRecentPath = mostRecentPath.map(({ lat, long }) => {
    return { lat: lat * scaleMultiplier, long: long * scaleMultiplier };
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

function createLine(
  currentPointsArray: ProcessedPoint[],
  color: string,
  metaData = '',
) {
  return `<polyline points="${currentPointsArray
    .map((point: ProcessedPoint) => `${point.long} ${point.lat}`)
    .join(
      ' ',
    )}" fill="none" ${metaData ? `id="${metaData}"` : ''} style="stroke:${color}; stroke-width:2" />`;
}

function createShape(
  currentPointsArray: ProcessedPoint[],
  color: string,
  metaData = '',
) {
  return `<polygon points="${currentPointsArray
    .map((point: ProcessedPoint) => `${point.long} ${point.lat}`)
    .join(
      ' ',
    )}" ${metaData ? `id="${metaData}"` : ''} style="fill:${color}" />`;
}

interface keyable {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  [key: string]: any;
}

function parsePoints(
  outlineObject: unknown,
  color: string,
  finalRotation: Quaternion,
): string {
  try {
    if (!isGPlates_Feature(outlineObject as object)) {
      throw new Error('Object is not a valid feature.');
    }

    const featureObject = outlineObject as GPlates_Feature;
    const featureType: ShapeType | boolean = isFeatureValid(
      featureObject.shapeType,
    );

    if (!featureType) {
      return '';
    }

    let metaData = '';
    if (featureObject.name) {
      metaData = featureObject.name;
    }

    const data = JSON.stringify(outlineObject);
    const results = data.matchAll(CoordinatesRegex);
    if (!results) {
      return '';
    }

    let nodes = '';
    let currentStr = '';

    for (const result of results) {
      const currentPointArrays = createPointsArray(result, finalRotation);

      if (featureType === 'LineString' || featureType === 'OrientableCurve') {
        for (const currentPointArray of currentPointArrays) {
          currentStr += createLine(currentPointArray, color);
        }
      } else if (featureType === 'MultiPoint' || featureType === 'Point') {
        console.warn('Point and MultiPoint not implemented.');
        // currentPointArrays.forEach((currentPointArray) => {
        //   currentStr += createPoints(currentPointArray, color);
        // });
      } else {
        for (const currentPointArray of currentPointArrays) {
          currentStr += createShape(currentPointArray, color, metaData);
        }
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
