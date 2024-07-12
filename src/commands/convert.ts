import { findValidFiles } from '@modules/validFiles/findValidFiles';
import { OptionValues } from 'commander';

import colorProcessing from '@utilities/colorProcessing';
import { findValidRotationFile } from '@modules/validFiles/findValidRotationFile';
import { parseRotationFile } from '@modules/parseRotation/parseRotationFile';
import { findRotationTimes } from '@modules/parseRotation/findRotationTimes';
import { convertFile } from './convertFile';

export async function convert(filepaths: string[], options: OptionValues) {
  // process options
  const color = colorProcessing(options.color.toLowerCase()) || 'black';
  const validFiles = findValidFiles(filepaths);
  const timeInt = parseInt(options.time);

  if (validFiles === undefined) {
    throw Error('No valid files found.');
  }

  const { files, rotations } = validFiles;
  const rotationFilePath = findValidRotationFile(
    options.rotationFile,
    rotations,
  );

  const rotationDict = parseRotationFile(rotationFilePath);
  const rotationTimes = findRotationTimes(rotationDict, timeInt);

  const processedFiles = await Promise.allSettled(
    files.map(async (filePath) => {
      return convertFile(filePath, rotationTimes, color, timeInt);
    }),
  );

  console.log(processedFiles);
}
