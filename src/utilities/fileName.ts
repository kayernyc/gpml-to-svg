export function fileName(url: string) {
  const splitUrl = url.split('/');
  let nameSource = splitUrl[splitUrl.length - 1];

  // get everything before the last period
  const indexOfLastPeriod = nameSource.lastIndexOf('.');
  nameSource = nameSource.slice(0, indexOfLastPeriod);
  if (!nameSource) return undefined;

  nameSource = nameSource.replaceAll(' ', '-');
  return `${nameSource}.svg`;
}
