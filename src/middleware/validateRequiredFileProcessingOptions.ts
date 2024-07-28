import { defineDestFileName } from '@modules/defineDestFileName/defineDestFileName';
import { findRotationTimes } from '@modules/parseRotation/findRotationTimes';
import { parseRotationFile } from '@modules/parseRotation/parseRotationFile';
import { validDestination } from '@modules/validDestination/validDestination';
import { findValidFiles } from '@modules/validFiles/findValidFiles';
import { findValidRotationFile } from '@modules/validFiles/findValidRotationFile';
import { processedFileName } from '@utilities/processedFileName';
import { OptionValues } from 'commander';
import { readdirSync } from 'fs';
import { GPLATES_GPML_FILE_EXT } from 'constants/GPLATES_CONSTANTS';
import path from 'path';

export async function validateRequiredFileProcessingOptions(
  options: OptionValues,
  filepaths?: string[],
) {
  const { destination, filePath } = options;

  if (!validDestination(destination)) {
    throw Error(`No valid destination provided.`);
  }

  const fileCandidates: string[] =
    filepaths && filepaths?.length > 0 ? filepaths : [filePath];
  if (fileCandidates.length === 0) {
    throw Error(`No valid file names provided.`);
  }

  const validFiles = findValidFiles(fileCandidates);

  if (validFiles === undefined) {
    const message = filepaths
      ? 'No valid files found.'
      : `${filePath} is not a valid file. Does it exist and does it end in .gpml?`;
    throw Error(message);
  }

  const timeInt = parseInt(options.time);
  const { files, rotations, userFileNameCandidates, directories } = validFiles;

  let { fileName: userFileName } = options;
  if (userFileName) {
    userFileName = processedFileName(userFileName);
  } else {
    userFileName = await defineDestFileName(userFileNameCandidates);
  }

  if (!options.rotationFile && !rotations.length && directories.length) {
    const proposedRotations = directories
      .map((dirFilepath: string) => {
        const allFilesInDir = readdirSync(dirFilepath);
        const rotationArray: string[] = [];
        allFilesInDir.forEach((candidatePath) => {
          if (path.extname(candidatePath) === '.rot') {
            rotationArray.push(path.join(dirFilepath, candidatePath));
          }
        });
        return rotationArray;
      })
      .flat();

    if (proposedRotations.length) {
      proposedRotations.forEach((candidatePath: string) =>
        rotations.push(candidatePath),
      );
    }
  }

  const rotationFilePath = findValidRotationFile(
    options.rotationFile,
    rotations,
  );

  const rotationDict = parseRotationFile(rotationFilePath);
  const rotationTimes = findRotationTimes(rotationDict, timeInt);

  return {
    destination,
    files,
    rotationTimes,
    userFileName,
  };
}
