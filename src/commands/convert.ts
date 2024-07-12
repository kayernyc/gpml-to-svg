import { findValidFiles } from '@modules/validFiles/findValidFiles';
import { OptionValues } from 'commander';

import colorProcessing from '@utilities/colorProcessing';
import { findValidRotationFile } from '@modules/validFiles/findValidRotationFile';

export async function convert(filepaths: string[], options: OptionValues) {
  // process options
  const color = colorProcessing(options.color.toLowerCase()) || 'black';
  const validFiles = findValidFiles(filepaths);

  if (validFiles === undefined) {
    throw Error('No valid files found.');
  }

  const { files, rotations } = validFiles;
  const rotationFile = findValidRotationFile(options.rotationFile, rotations);

  console.log({ files, rotations }, rotationFile);
}
