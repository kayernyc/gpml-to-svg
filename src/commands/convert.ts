import { findValidFiles } from '@modules/validFiles/findValidFiles';
import { OptionValues } from 'commander';

export async function convert(filepaths: string[], options: OptionValues) {
  console.log('convert!', { filepaths }, Array.isArray(filepaths));
  const validFiles = findValidFiles(filepaths);

  console.log({ validFiles });
}
