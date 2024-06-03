import { fileName } from './fileName';

export function processFileName(
  destinationPath: string,
  sourcePath: string,
): string {
  // detect if file name is at the end of the path
  const splitPath = destinationPath.split('/');
  const pathUpToFileName = splitPath.slice(0, splitPath.length - 1).join('/');

  let destinationFileName = fileName(destinationPath) || fileName(sourcePath);

  if (destinationFileName) {
    destinationFileName = destinationFileName.replace(' ', '-');
    return `${pathUpToFileName}${destinationFileName}.svg`;
  }

  throw new Error('No file name detected.');
}
