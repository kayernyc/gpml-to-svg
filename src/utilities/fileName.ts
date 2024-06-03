export function fileName(url: string) {
  const splitUrl = url.split('/');
  let nameSource = splitUrl[splitUrl.length - 1];
  nameSource = nameSource.split('.')[nameSource.length - 1];
  nameSource = nameSource.replace(' ', '-');
  return `${nameSource}.svg`;
}
