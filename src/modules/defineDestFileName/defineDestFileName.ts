import { input, select, Separator } from '@inquirer/prompts';
import toggle from 'inquirer-toggle';
import { validateFileName } from './fileNameValidation';

import type { Choice } from '@projectTypes/Choice';

async function createFileName(): Promise<string> {
  const answer = await input({
    message: 'Enter the name:',
    validate: (candidateFileName: string) => {
      const { message } = validateFileName(candidateFileName);
      if (message) {
        return message;
      }

      return true;
    },
  });

  return answer;
}

async function selectFileName(candidateNames: string[]): Promise<string> {
  let choices: (Separator | Choice<string>)[] = candidateNames.map((name) => ({
    value: name,
  }));
  if (choices.length > 1) {
    choices = [
      ...choices,
      new Separator(),
      {
        value: 'other',
        description: 'Enter a file name',
      },
      new Separator(),
    ];

    const fileName = await select({
      message: 'Would you like to name the new file?',
      choices,
    });

    return fileName;
  } else {
    const fileName = candidateNames[0];
    const fileNameAcceptable = await toggle({
      message: `Name the generated file ${fileName}.svg`,
    });

    return fileNameAcceptable ? fileName : '';
  }
}

async function awaitFileName(candidateNames: string[]) {
  const createFN = await toggle({
    message: 'Enter a custom name for the new file?',
  });

  if (createFN) {
    return await createFileName();
  } else {
    let fileName = await selectFileName(candidateNames);
    if (fileName === 'other') {
      fileName = await createFileName();
    } else {
      return fileName;
    }
  }
}

export async function defineDestFileName(
  candidateNames: string[],
): Promise<string> {
  process.stderr.write(
    'The output file needs a name. Would you like to select a file name or enter a new file name?',
  );

  let fileName: string | undefined;

  while (!fileName) {
    fileName = await awaitFileName(candidateNames);
  }

  return fileName;
}
