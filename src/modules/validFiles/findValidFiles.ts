import path from 'path';
import { GPLATES_GPML_FILE_EXT } from 'GPLATES_CONSTANTS';
import { lstatSync } from 'fs';

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
    (acc, path) => {
      if (isDirectory(path)) {
        acc.directories.push(path);
      } else if (isFile(path)) {
        acc.files.push(path);
      }

      return acc;
    },
    { files: [] as string[], directories: [] as string[] },
  );

  if (!directories.length && !files.length) {
    console.log('nothing to convert');
  }

  if (directories.length) {
    console.log('convert directories');

    // add all valid files to files array
  }

  if (files.length) {
    console.log('convert files');

    const validFiles = files.filter((filename) => {
      console.log(path.extname(filename));
      return path.extname(filename) === GPLATES_GPML_FILE_EXT;
    });
    return validFiles;
  }

  return;
}
