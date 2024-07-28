import path from 'path';
import { isDirectory } from '@utilities/isDirectory';
import { isFile } from '@utilities/isFile';
import { COLOR_RAMP_FILE_EXT } from 'GPLATES_CONSTANTS';
import { findFileTypeInDirectory } from '@utilities/findFileTypeInDirectory';
import { stdout } from 'process';
import { select } from '@inquirer/prompts';
import { Choice } from '@projectTypes/Choice';
import { jsonFromCpt } from './jsonFromCpt';

function validCR(filePath: string) {
  if (path.extname(filePath) !== COLOR_RAMP_FILE_EXT) {
    console.warn('Invalid file name');
    process.exit(1);
  }

  stdout.write(`Using ${filePath} as the color ramp.`);

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
  } else if (isDirectory(filePath)) {
    console.log('DIR');
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
  } else {
    console.warn('NO VALID CR FOUND');
  }
}
