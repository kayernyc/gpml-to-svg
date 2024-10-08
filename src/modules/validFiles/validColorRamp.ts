import path from 'node:path';
import { stdout } from 'node:process';
import { select } from '@inquirer/prompts';
import type { Choice } from '@projectTypes/Choice';
import { findFileTypeInDirectory } from '@utilities/findFileTypeInDirectory';
import { isDirectory } from '@utilities/isDirectory';
import { isFile } from '@utilities/isFile';
import { COLOR_RAMP_FILE_EXT } from 'constants/GPLATES_CONSTANTS';
import { jsonFromCpt } from './jsonFromCpt';

function validCR(filePath: string) {
  if (path.extname(filePath) !== COLOR_RAMP_FILE_EXT) {
    console.warn('Invalid file name');
    process.exit(1);
  }

  stdout.write(`Using ${filePath} as the color ramp.\n`);

  // process cpt and extract values
  return jsonFromCpt(filePath);
}

async function selectCPT(candidateNames: string[]): Promise<string> {
  const choices: Choice<string>[] = candidateNames.map((name) => ({
    value: name,
  }));

  const fileName = await select({
    message: 'Which color ramp would you like to use?',
    choices,
  });

  return fileName;
}

export async function validColorRamp(filePath: string) {
  if (isFile(filePath)) {
    return await validCR(filePath);
  }

  if (isDirectory(filePath)) {
    const { cpt } = findFileTypeInDirectory(filePath, ['cpt']);
    if (cpt.length === 0) {
      console.warn('No valid color ramp provided');
      process.exit(1);
    } else if (cpt.length === 1) {
      return await validCR(path.join(filePath, cpt[0]));
    } else {
      const selectedCPT = await selectCPT(cpt);
      return await validCR(path.join(filePath, selectedCPT));
    }
  }

  console.warn('NO VALID CR FOUND');
}
