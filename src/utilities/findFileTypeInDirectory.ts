import { readdirSync } from 'fs';

export function findFileTypeInDirectory(
  directoryPath: string,
  fileTypes: string[],
) {
  const returnObject: Record<string, string[]> = {};
  const allFilesInDir = readdirSync(directoryPath);

  fileTypes.forEach((fileType) => {
    const filesWithExtension = allFilesInDir.filter((file) =>
      file.endsWith(`.${fileType}`),
    );
    returnObject[fileType] = filesWithExtension;
  });

  return returnObject;
}
