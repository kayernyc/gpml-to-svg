import path from 'path';
import { GPLATES_GPML_FILE_EXT } from 'GPLATES_CONSTANTS';
import { lstatSync, readdirSync } from 'fs';

export const isDirectory = (path: string) => {
  try {
    return lstatSync(path) ? lstatSync(path).isDirectory() : false;
  } catch {
    return false;
  }
};

export const isFile = (path: string) => {
  try {
    return lstatSync(path) ? lstatSync(path).isFile() : false;
  } catch {
    return false;
  }
};

export function findValidFiles(filepaths: string[]): string[] | undefined {
  const { files, directories } = filepaths.reduce(
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
        });
      } else if (
        isFile(proposedPath) &&
        path.extname(proposedPath) === GPLATES_GPML_FILE_EXT
      ) {
        acc.files.push(proposedPath);
      }

      return acc;
    },
    { files: [] as string[], directories: [] as string[] },
  );

  if (!directories.length && !files.length) {
    console.log('nothing to convert');
  }

  if (directories.length) {
    console.log('converted directories', { directories });

    // messaging to human
  }

  if (files.length) {
    console.log('files to convert');
    const filesSet = Array.from(new Set(files));
    return filesSet;
  }

  return;
}
