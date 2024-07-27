import path from 'path';

export function directoryPath1(destinationPath: string): string {
  // detect if file name is at the end of the path
  const splitPath = destinationPath.split(path.sep);
  const pathUpToFileName = splitPath
    .slice(0, splitPath.length - 1)
    .join(path.sep);

  if (pathUpToFileName) {
    return pathUpToFileName;
  }

  throw new Error('No directory name found');
}
