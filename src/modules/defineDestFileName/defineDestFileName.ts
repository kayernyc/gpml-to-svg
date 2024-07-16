import prompts from 'prompts';

export async function defineDestFileName(
  candidateNames: string[],
): Promise<string> {
  const response = await prompts({
    type: 'number',
    name: 'value',
    message: 'How old are you?',
    validate: (value) => (value < 18 ? `Nightclub is 18+ only` : true),
  });
  return '';
}
