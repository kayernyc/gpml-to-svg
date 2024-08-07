import { promises as fs } from 'node:fs';
import { stderr } from 'node:process';
import errorProcessing from '@utilities/errorProcessing';
import ansis from 'ansis';

const svgWidth = 3600;
const svgHeight = 1800;

const svgHeader = `<svg width="${svgWidth}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg">`;

const svgFooter = '</svg>';

async function createSvg(
  featureString: string,
  destPath: string,
  fileName = 'test.svg',
  borderColor = '',
) {
  const svgBorder = `<rect width="${svgWidth}" height="${svgHeight}" style="fill:none;${borderColor.length > 0 ? `stroke-width:3;stroke:${borderColor};` : ''}" />`;
  const content = `${svgHeader}${svgBorder}${featureString}${svgFooter}`;

  let finalFileName = fileName;

  if (fileName.slice(-4) !== '.svg') {
    finalFileName += '.svg';
  }

  await fs
    .mkdir(destPath, { recursive: true })
    .then(() =>
      stderr.write(
        ansis.green(`\nFile "${finalFileName}" written to '${destPath}'.\n`),
      ),
    )
    .catch((err) => console.error(`Error creating directory: ${err.message}`));
  try {
    fs.writeFile(`${destPath}/${finalFileName}`, content);
  } catch (err: unknown) {
    errorProcessing(err);
  }
}

export default createSvg;
