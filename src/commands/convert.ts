import { findValidFiles } from '@modules/validFiles/findValidFiles';
import { OptionValues } from 'commander';

import colorProcessing, { rgbToHex } from '@utilities/colorProcessing';
import { findValidRotationFile } from '@modules/validFiles/findValidRotationFile';
import { parseRotationFile } from '@modules/parseRotation/parseRotationFile';
import { findRotationTimes } from '@modules/parseRotation/findRotationTimes';
import { convertFileToGroup } from '../modules/convert/convertFileToGroup';
import { validDestination } from '@modules/validDestination/validDestination';
import createSvg from '@modules/createSvg/createSvg';
import { processedFileName } from '@utilities/processedFileName';
import { defineDestFileName } from '@modules/defineDestFileName/defineDestFileName';
import {
  createColorArray,
  RgbColorArrayType,
} from '@modules/colorMap/createColorArray';
import { validateRequiredFileProcessingOptions } from 'middleware/validateRequiredFileProcessingOptions';

const isFulfilled = <T>(
  input: PromiseSettledResult<T>,
): input is PromiseFulfilledResult<T> => input.status === 'fulfilled';

export async function convert(filepaths: string[], options: OptionValues) {
  const { destination, files, rotationTimes, userFileName } =
    await validateRequiredFileProcessingOptions(options, filepaths);

  const color = colorProcessing(options.color.toLowerCase());
  const { multiColor } = options;

  const timeInt = parseInt(options.time);

  const colorMap: RgbColorArrayType[] = createColorArray(
    color,
    files.length,
    multiColor,
  );

  const processedFiles = await Promise.allSettled(
    files.map(async (filePath, index) => {
      // get rgb color
      const rgbColor = colorMap[Math.min(index, colorMap.length - 1)] as [
        number,
        number,
        number,
      ];
      // convert rgb to hex
      const hexColor = rgbToHex(rgbColor);
      return convertFileToGroup(filePath, rotationTimes, hexColor, timeInt);
    }),
  );

  let finalElements: string = processedFiles
    .filter(isFulfilled)
    .map((record) => record.value)
    .filter(
      (record): record is Exclude<typeof record, undefined> =>
        record !== undefined,
    )
    .join('\n');

  createSvg(finalElements, destination, userFileName);
}
