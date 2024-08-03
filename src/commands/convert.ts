import createSvg from '@modules/createSvg/createSvg';
import colorProcessing, {
  colorValidation,
  rgbToHex,
} from '@utilities/colorProcessing';
import type { OptionValues } from 'commander';
import { convertFileToGroup } from '../modules/convert/convertFileToGroup';

import {
  type RgbColorArrayType,
  createColorArray,
} from '@modules/colorMap/createColorArray';
import { validateRequiredFileProcessingOptions } from 'middleware/validateRequiredFileProcessingOptions';

const isFulfilled = <T>(
  input: PromiseSettledResult<T>,
): input is PromiseFulfilledResult<T> => input.status === 'fulfilled';

export async function convert(filepaths: string[], options: OptionValues) {
  console.log({ options });
  const { destination, files, rotationTimes, userFileName } =
    await validateRequiredFileProcessingOptions(options, filepaths);

  const color = colorProcessing(options.color.toLowerCase());

  const borderColor = options.borderColor
    ? colorValidation(options.borderColor)
    : '';

  const { multiColor } = options;

  const timeInt = Number.parseInt(options.time);

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

  const finalElements: string = processedFiles
    .filter(isFulfilled)
    .map((record) => record.value)
    .filter(
      (record): record is Exclude<typeof record, undefined> =>
        record !== undefined,
    )
    .join('\n');

  createSvg(finalElements, destination, userFileName, borderColor);
}
