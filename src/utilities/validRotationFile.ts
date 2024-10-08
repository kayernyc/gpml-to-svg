import { readdirSync } from 'node:fs';
import path from 'node:path';
import { isDirectory } from './isDirectory';
import { isFile } from './isFile';

export function validRotationFile(proposedPath: string): string | undefined {
  if (isFile(proposedPath) && path.extname(proposedPath) === '.rot') {
    return proposedPath;
  }

  if (isDirectory(proposedPath)) {
    const allFilesInDir = readdirSync(proposedPath);
    for (let i = 0; i < allFilesInDir.length; i++) {
      const pathName = allFilesInDir[i];
      if (path.extname(pathName) === '.rot') {
        return path.join(proposedPath, pathName);
      }
    }
  }

  return;
}
