import { OptionValues } from 'commander';
import { lstatSync } from 'node:fs';

export const isDirectory = (path: string) =>
  lstatSync(path) ? lstatSync(path).isDirectory() : false;

export async function convert(filepath: string[], options: OptionValues) {
  console.log('convert!', { filepath }, Array.isArray(filepath));
}
