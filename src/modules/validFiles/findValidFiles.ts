import path from 'path';
import { GPLATES_GPML_FILE_EXT } from 'GPLATES_CONSTANTS';
import { readdirSync } from 'fs';
import { isDirectory } from '@utilities/isDirectory';
import { isFile } from '@utilities/isFile';
import { processedFileName } from '@utilities/processedFileName';

export interface ValidFilesDictionary {
  files: string[];
  directories: string[];
  rotations: string[];
  userFileNameCandidates: string[];
}

export function findValidFiles(
  filepaths: string[],
): ValidFilesDictionary | undefined {
  const { files, directories, rotations, userFileNameCandidates } =
    filepaths.reduce(
      (acc, proposedPath) => {
        if (isDirectory(proposedPath)) {
          acc.userFileNameCandidates.unshift(path.dirname(proposedPath) || '');
          acc.directories.push(proposedPath);
          // traverse directory and add all files to files array
          const allFilesInDir = readdirSync(proposedPath);
          allFilesInDir.forEach((candidateProposedPath) => {
            if (path.extname(candidateProposedPath) === GPLATES_GPML_FILE_EXT) {
              acc.userFileNameCandidates.push(
                path.basename(candidateProposedPath),
              );
              const fullPath = path.join(proposedPath, candidateProposedPath);
              acc.files.push(fullPath);
            }
            if (path.extname(candidateProposedPath) === '.rot') {
              const fullPath = path.join(proposedPath, candidateProposedPath);
              acc.rotations.push(fullPath);
            }
          });
        } else if (
          isFile(proposedPath) &&
          path.extname(proposedPath) === GPLATES_GPML_FILE_EXT
        ) {
          acc.directories.push(path.dirname(proposedPath));
          acc.userFileNameCandidates.push(path.basename(proposedPath));
          acc.files.push(proposedPath);
        } else if (
          isFile(proposedPath) &&
          path.extname(proposedPath) === '.rot'
        ) {
          acc.rotations.push(proposedPath);
        }

        return acc;
      },
      {
        files: [] as string[],
        directories: [] as string[],
        rotations: [] as string[],
        userFileNameCandidates: [] as string[],
      },
    );

  if (!directories.length && !files.length) {
    console.log('nothing to convert');
  }

  if (directories.length) {
    console.log('converted directories', { directories });

    // TODO: messaging to humans
  }

  let userFileNameCandidatesSet = Array.from(new Set(userFileNameCandidates));
  userFileNameCandidatesSet = userFileNameCandidatesSet
    .map((userName) => processedFileName(userName, false) || '')
    .filter((userName) => !!userName);

  if (files.length) {
    const filesSet = Array.from(new Set(files));
    const rotationSet = Array.from(new Set(rotations));
    return {
      files: filesSet,
      rotations: rotationSet,
      directories,
      userFileNameCandidates: userFileNameCandidatesSet,
    };
  }

  return;
}
