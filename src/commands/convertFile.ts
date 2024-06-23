import { OptionValues } from 'commander';

import { parseToJson } from '@modules/findNodes/parseToJson';
import createSvg from '@modules/createSvg/createSvg';
import parsePoints from '@modules/createSvg/parsePoints';
import { filterForTime } from '@modules/findNodes/filterForTime';
import { parseRotationFile } from '@modules/parseRotation/parseRotationFile';

import colorProcessing from '@utilities/colorProcessing';
import { directoryPath } from '@utilities/directoryPath';
import { findFile } from '@utilities/findFile';

function findRotFile(sourcePath: string) {
  const rotPath = findFile(sourcePath, 'rotation.rot');
  if (!rotPath) {
    throw new Error('No rotation.rot file found');
  }

  return rotPath;
}

export async function convertFile(filepath: string, options: OptionValues) {
  const color = colorProcessing(options.color.toLowerCase()) || 'black';
  const sourceDirectoryPath = directoryPath(filepath);
  const rotationFilePath = findRotFile(sourceDirectoryPath);
  const rotationDict = parseRotationFile(rotationFilePath);

  let destination =
    typeof options.dest === 'string'
      ? options.dest
      : process.env.DEST || __dirname;

  if (destination && filepath) {
    let featureArray = await parseToJson(filepath);

    if (featureArray?.length) {
      featureArray = filterForTime(featureArray, parseInt(options.time));
    }

    const svgFeatures = featureArray
      ?.map((feature) => parsePoints(feature, color, rotationDict))
      .join('');

    console.log({ svgFeatures });
    if (svgFeatures?.length) {
      createSvg(svgFeatures, destination, color);
    }
  }
}
