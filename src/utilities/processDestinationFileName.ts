import { fileName } from './fileName';

export function processDestinationFileName(
  destinationPath: string,
  sourcePath: string,
): string {
  // detect if file name is at the end of the path
  const splitPath = destinationPath.split('/');
  const pathUpToFileName = splitPath.slice(0, splitPath.length - 1).join('/');

  let destinationFileName = fileName(destinationPath) || fileName(sourcePath);

  if (destinationFileName) {
    return `${pathUpToFileName}/${destinationFileName}`;
  }

  throw new Error('No file name found');
}
