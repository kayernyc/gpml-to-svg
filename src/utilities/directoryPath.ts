export function directoryPath(destinationPath: string): string {
  // detect if file name is at the end of the path
  const splitPath = destinationPath.split('/');
  const pathUpToFileName = splitPath.slice(0, splitPath.length - 1).join('/');

  if (pathUpToFileName) {
    return pathUpToFileName;
  }

  throw new Error('No directory name found');
}
