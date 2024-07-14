import { processedFileName } from './processedFileName';

function findPathAndBase(candidateString: string): [string, string] {
  const splitPath = candidateString.split('/');
  const pathUpToFileName = splitPath.slice(0, splitPath.length - 1).join('/');
  const baseName = splitPath[splitPath.length - 1] || '';

  return [pathUpToFileName, baseName];
}

export function processDestinationFileName(
  destinationPath: string,
  sourcePath: string,
): string {
  // detect if file name is at the end of the path
  const [destFilePath, destFileName] = findPathAndBase(destinationPath);
  const [_, sourceFileName] = findPathAndBase(sourcePath);

  let destinationFileName =
    processedFileName(destFileName) || processedFileName(sourceFileName);

  if (destinationFileName) {
    return `${destFilePath}/${destinationFileName}`;
  }

  throw new Error('No file name found');
}
