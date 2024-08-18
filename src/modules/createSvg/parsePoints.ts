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
import type { ProcessedPoint } from './createSvgTypes';

import { implementCrossOver } from './implementCrossOver';

const CoordinatesRegex = /posList":"(?<coordinatelist>[0-9.\-\s]+)/gm;

interface keyable {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  [key: string]: any;
}

function createPointsArray(
  result: RegExpExecArray,
  finalRotation: Quaternion,
  longOffset = 0,
): ProcessedPoint[][] {
  const coordinateData = result[1].trim().split(' ');

  // let previousPoint: ProcessedPoint | undefined;
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

        currentPath.push({ long: sourceLong, lat: sourceLat });
      }
    }
  });

  currentPath = currentPath.map(({ lat, long }) => {
    return {
      lat,
      long: (long + longOffset) % 360,
    };
  });

  return [currentPath];
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

function applyScale(
  currentPointArrays: ProcessedPoint[][],
  scaleMultiplier = 10,
): ProcessedPoint[][] {
  return currentPointArrays.map((currentPointArray: ProcessedPoint[]) => {
    return currentPointArray.map(({ lat, long }) => ({
      lat: lat * scaleMultiplier,
      long: long * scaleMultiplier,
    }));
  });
}

function parsePoints(
  gpObject: unknown,
  color: string,
  finalRotation: Quaternion,
  longOffset = 0,
): string {
  try {
    if (!isGPlates_Feature(gpObject as object)) {
      // TODO better error messaging
      throw new Error('Object is not a valid feature.');
    }

    const featureObject = gpObject as GPlates_Feature;
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

    const data = JSON.stringify(gpObject);
    const results = data.matchAll(CoordinatesRegex);
    if (!results) {
      return '';
    }

    let nodes = '';
    let currentStr = '';

    for (const result of results) {
      let currentPointArrays = createPointsArray(
        result,
        finalRotation,
        longOffset,
      );
      // create crossover
      currentPointArrays = implementCrossOver(currentPointArrays);
      currentPointArrays = applyScale(currentPointArrays);

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
