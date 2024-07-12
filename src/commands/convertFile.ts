import { parseToJson } from '@modules/findNodes/parseToJson';
import createSvg from '@modules/createSvg/createSvg';
import { filterForTime } from '@modules/findNodes/filterForTime';

import { directoryPath } from '@utilities/directoryPath';
import { FeatureCollection } from '@projectTypes/timeTypes';
import { featureAndRotationFactory } from '@modules/featureAndRotation/featureAndRotationFactory';
import { RotationRecord } from '@projectTypes/rotationTypes';

export async function convertFile(
  filepath: string,
  rotationTimes: RotationRecord,
  color: string,
  time: number,
): Promise<string | undefined> {
  let featureArray: FeatureCollection[] | undefined =
    await parseToJson(filepath);

  if (!featureArray) {
    throw new Error('No features found in file');
  }

  // Finds all features that are valid at the given time
  featureArray = filterForTime(featureArray, time);

  const parsePointsWithRotation = featureAndRotationFactory(
    rotationTimes,
    color,
  );

  const svgFeatures = featureArray
    ?.map((feature) => parsePointsWithRotation(feature))
    .join('');

  if (svgFeatures?.length) {
    return `<g>${svgFeatures}</g>`;
  }

  return;
}
