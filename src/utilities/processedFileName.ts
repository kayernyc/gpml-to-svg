import path from 'node:path';

export function processedFileName(url: string, extension = true) {
  let nameSource = path.basename(url);

  // get everything before the last period
  const indexOfLastPeriod = nameSource.lastIndexOf('.');

  if (indexOfLastPeriod > -1) {
    nameSource = nameSource.slice(0, indexOfLastPeriod);
  }

  if (!nameSource) return undefined;

  nameSource = nameSource.replaceAll(' ', '-');
  return extension ? `${nameSource}.svg` : nameSource;
}
