import path from 'path';
import { GPLATES_GPML_FILE_EXT } from 'GPLATES_CONSTANTS';
import { readdirSync } from 'fs';
import { isDirectory } from '@utilities/isDirectory';
import { isFile } from '@utilities/isFile';

export interface ValidFilesDictionary {
  files: string[];
  directories: string[];
  rotations: string[];
}

export function findValidFiles(
  filepaths: string[],
): ValidFilesDictionary | undefined {
  const { files, directories, rotations } = filepaths.reduce(
    (acc, proposedPath) => {
      if (isDirectory(proposedPath)) {
        acc.directories.push(proposedPath);
        // traverse directory and add all files to files array
        const allFilesInDir = readdirSync(proposedPath);
        allFilesInDir.forEach((dirFilepath) => {
          if (path.extname(dirFilepath) === GPLATES_GPML_FILE_EXT) {
            const fullPath = path.join(proposedPath, dirFilepath);
            acc.files.push(fullPath);
          }
          if (path.extname(dirFilepath) === '.rot') {
            const fullPath = path.join(proposedPath, dirFilepath);
            acc.rotations.push(fullPath);
          }
        });
      } else if (
        isFile(proposedPath) &&
        path.extname(proposedPath) === GPLATES_GPML_FILE_EXT
      ) {
        acc.files.push(proposedPath);
      } else if (
        isFile(proposedPath) &&
        path.extname(proposedPath) === '.rot'
      ) {
        acc.rotations.push(proposedPath);
      }

      return acc;
    },
    {
      files: [] as string[],
      directories: [] as string[],
      rotations: [] as string[],
    },
  );

  if (!directories.length && !files.length) {
    console.log('nothing to convert');
  }

  if (directories.length) {
    console.log('converted directories', { directories });

    // TODO: messaging to humans
  }

  if (files.length) {
    const filesSet = Array.from(new Set(files));
    const rotationSet = Array.from(new Set(rotations));
    return {
      files: filesSet,
      rotations: rotationSet,
      directories,
    };
  }

  return;
}
