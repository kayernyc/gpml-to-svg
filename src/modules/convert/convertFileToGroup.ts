import { filterForTime } from '@modules/findNodes/filterForTime';
import { parseToJson } from '@modules/findNodes/parseToJson';

import path from 'node:path';
import { featureAndRotationFactory } from '@modules/convert/featureAndRotationFactory';
import type { RotationRecord } from '@projectTypes/rotationTypes';
import type { GPlates_Feature } from '@projectTypes/timeTypes';
import { processedFileName } from '@utilities/processedFileName';

export async function convertFileToGroup(
  filepath: string,
  rotationTimes: RotationRecord,
  color: string,
  time: number,
  maxAge: number,
): Promise<string | undefined> {
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

  const parsePointsWithRotation = featureAndRotationFactory(rotationTimes);

  const svgFeatures = featureArray
    ?.map((feature) => parsePointsWithRotation(feature, color))
    .join('');

  if (svgFeatures?.length) {
    return `<g id="${fileName}">${svgFeatures}</g>`;
  }

  return;
}
