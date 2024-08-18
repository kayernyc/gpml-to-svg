import { filterForTime } from '@modules/findNodes/filterForTime';
import { parseToJson } from '@modules/findNodes/parseToJson';

import path from 'node:path';
import { featureAndRotationFactory } from '@modules/convert/featureAndRotationFactory';
import type { RotationRecord } from '@projectTypes/rotationTypes';
import type { GPlates_Feature } from '@projectTypes/timeTypes';
import { processedFileName } from '@utilities/processedFileName';

export interface ConvertFileToGroupOptions {
  color: string;
  filepath: string;
  longOffset: number;
  maxAge: number;
  rotationTimes: RotationRecord;
  time: number;
}

export async function convertFileToGroup(
  options: ConvertFileToGroupOptions,
): Promise<string | undefined> {
  const { color, filepath, longOffset, maxAge, rotationTimes, time } = options;

  let featureArray: GPlates_Feature[] | undefined = await parseToJson(
    filepath,
    maxAge,
  );

  if (!featureArray) {
    throw new Error('No features found in file');
  }
  const fileName = processedFileName(path.basename(filepath), false);

  // Finds all features that are valid at the given time
  featureArray = filterForTime(featureArray, time);

  const parsePointsWithRotation = featureAndRotationFactory(
    rotationTimes,
    longOffset,
  );

  const svgFeatures = featureArray
    ?.map((feature) => parsePointsWithRotation(feature, color))
    .join('');

  if (svgFeatures?.length) {
    return `<g id="${fileName}">${svgFeatures}</g>`;
  }

  return;
}
