import { filterForTime } from '@modules/findNodes/filterForTime';
import { parseToJson } from '@modules/findNodes/parseToJson';

import path from 'node:path';
import type { CptRampRuleArray } from '@modules/validFiles/jsonFromCpt';
import type { RotationRecord } from '@projectTypes/rotationTypes';
import type { GPlates_Feature } from '@projectTypes/timeTypes';
import { processedFileName } from '@utilities/processedFileName';
import { featureColorAndRotationFactory } from './featureColorAndRotationFactory';

export interface ConvertRampedFileToGroupOptions {
  colorRamp: CptRampRuleArray;
  filepath: string;
  longOffset: number;
  maxAge: number;
  rotationTimes: RotationRecord;
  time: number;
}

export async function convertRampedFileToGroup(
  options: ConvertRampedFileToGroupOptions,
): Promise<string | undefined> {
  const { colorRamp, filepath, longOffset, maxAge, rotationTimes, time } =
    options;
  let featureArray: GPlates_Feature[] | undefined = await parseToJson(
    filepath,
    maxAge,
  );

  if (!featureArray) {
    throw new Error('No features found in file');
  }

  // Finds all features that are valid at the given time
  featureArray = filterForTime(featureArray, time);
  const fileName = processedFileName(path.basename(filepath), false);

  const parsePointsWithRotation = featureColorAndRotationFactory(
    colorRamp,
    rotationTimes,
    time,
    longOffset,
  );

  const svgFeatures = featureArray
    ?.map((feature) => parsePointsWithRotation(feature))
    .join('');

  if (svgFeatures?.length) {
    return `<g id="${fileName}">${svgFeatures}</g>`;
  }

  return;
}
