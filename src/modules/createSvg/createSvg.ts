import { promises as fs } from 'fs';
import parseGpml from './parseGpml';
import errorProcessing from '../../utilities/errorProcessing';

const svgHeader = `<svg width="3600" height="1800" xmlns="http://www.w3.org/2000/svg">`;
const svgFooter = '</svg>';

async function createSvg(sourcePath: string, destPath: string, color?: string) {
  color = color || '#000000';
  const data: string = await parseGpml(sourcePath, color);
  const content = `${svgHeader}${data}${svgFooter}`;
  await fs
    .mkdir(destPath, { recursive: true })
    .then(() => console.log(`Directory '${destPath}' created.`))
    .catch((err) => console.error(`Error creating directory: ${err.message}`));

  try {
    fs.writeFile(`${destPath}/test.svg`, content);
  } catch (err: unknown) {
    errorProcessing(err);
  }
}

export default createSvg;
