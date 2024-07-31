import { promises as fs } from 'fs';
import errorProcessing from '@utilities/errorProcessing';
import ansis from 'ansis';
import { stderr } from 'process';

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

  if (fileName.slice(-4) !== '.svg') {
    fileName += '.svg';
  }

  await fs
    .mkdir(destPath, { recursive: true })
    .then(() =>
      stderr.write(
        ansis.green(`\nFile "${fileName}" written to '${destPath}'.\n`),
      ),
    ) //console.log()
    .catch((err) => console.error(`Error creating directory: ${err.message}`));
  try {
    fs.writeFile(`${destPath}/${fileName}`, content);
  } catch (err: unknown) {
    errorProcessing(err);
  }
}

export default createSvg;
