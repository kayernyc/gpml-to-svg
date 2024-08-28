import { readdirSync } from 'node:fs';

export function findFileTypeInDirectory(
  directoryPath: string,
  fileTypes: string[],
) {
  const returnObject: Record<string, string[]> = {};
  const allFilesInDir = readdirSync(directoryPath);

  for (const fileType of fileTypes) {
    const filesWithExtension = allFilesInDir.filter((file) =>
      file.endsWith(`.${fileType}`),
    );
    returnObject[fileType] = filesWithExtension;
  }

  return returnObject;
}
