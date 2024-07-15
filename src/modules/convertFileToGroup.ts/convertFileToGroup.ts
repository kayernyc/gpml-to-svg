import { parseToJson } from '@modules/findNodes/parseToJson';
import { filterForTime } from '@modules/findNodes/filterForTime';

import { FeatureCollection } from '@projectTypes/timeTypes';
import { featureAndRotationFactory } from '@modules/featureAndRotation/featureAndRotationFactory';
import { RotationRecord } from '@projectTypes/rotationTypes';
import path from 'path';
import { processedFileName } from '@utilities/processedFileName';

export async function convertFileToGroup(
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
  const fileName = processedFileName(path.basename(filepath))?.slice(0, -4);

  const parsePointsWithRotation = featureAndRotationFactory(
    rotationTimes,
    color,
  );

  const svgFeatures = featureArray
    ?.map((feature) => parsePointsWithRotation(feature))
    .join('');

  if (svgFeatures?.length) {
    return `<g id="${fileName}">${svgFeatures}</g>`;
  }

  return;
}
