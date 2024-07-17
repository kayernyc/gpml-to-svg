import { select, Separator } from '@inquirer/prompts';

export async function defineDestFileName(
  candidateNames: string[],
): Promise<string> {
  const choices: {
    value: string;
    description?: string;
  }[] = candidateNames.map((name) => ({
    value: name,
  }));

  if (choices.length > 1) {
    choices.push({
      value: 'no',
      description: 'Choose your own file name',
    });
    const answer = await select({
      message: 'Would you like to name the new file:',
      choices,
    });

    console.log({ answer });
  }
  return '';
}
