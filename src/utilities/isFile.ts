import { lstatSync } from 'fs';

export const isFile = (path: string) => {
  try {
    return lstatSync(path) ? lstatSync(path).isFile() : false;
  } catch {
    return false;
  }
};
