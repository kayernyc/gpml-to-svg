import { findValidFiles } from '@modules/validFiles/findValidFiles';
import { OptionValues } from 'commander';

import colorProcessing from '@utilities/colorProcessing';
import { findValidRotationFile } from '@modules/validFiles/findValidRotationFile';
import { parseRotationFile } from '@modules/parseRotation/parseRotationFile';
import { findRotationTimes } from '@modules/parseRotation/findRotationTimes';
import { convertFileToGroup } from '../modules/convertFileToGroup.ts/convertFileToGroup';
import { validDestination } from '@modules/validDestination/validDestination';
import createSvg from '@modules/createSvg/createSvg';
import { processedFileName } from '@utilities/processedFileName';
import { defineDestFileName } from '@modules/defineDestFileName/defineDestFileName';

const isFulfilled = <T>(
  input: PromiseSettledResult<T>,
): input is PromiseFulfilledResult<T> => input.status === 'fulfilled';

export async function convert(filepaths: string[], options: OptionValues) {
  // process options
  const { destination } = options;

  if (!validDestination(destination)) {
    return 1;
  }

  const color = colorProcessing(options.color.toLowerCase()) || 'black';
  const validFiles = findValidFiles(filepaths);
  const timeInt = parseInt(options.time);

  if (validFiles === undefined) {
    throw Error('No valid files found.');
  }

  const { files, rotations, userFileNameCandidates } = validFiles;
  console.log({ userFileNameCandidates });
  const rotationFilePath = findValidRotationFile(
    options.rotationFile,
    rotations,
  );

  let { fileName: userFileName } = options;
  if (userFileName) {
    userFileName = processedFileName(userFileName);
  } else {
    userFileName = await defineDestFileName(userFileNameCandidates);
  }

  const rotationDict = parseRotationFile(rotationFilePath);
  const rotationTimes = findRotationTimes(rotationDict, timeInt);

  const processedFiles = await Promise.allSettled(
    files.map(async (filePath) => {
      return convertFileToGroup(filePath, rotationTimes, color, timeInt);
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
