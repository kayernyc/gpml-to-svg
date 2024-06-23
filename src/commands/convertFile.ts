import { OptionValues } from 'commander';

import { parseToJson } from '@modules/findNodes/parseToJson';
import createSvg from '@modules/createSvg/createSvg';
import parsePoints from '@modules/createSvg/parsePoints';
import { filterForTime } from '@modules/findNodes/filterForTime';

import colorProcessing from '@utilities/colorProcessing';
import { processFileName } from '@utilities/processFileName';

export async function convertFile(filepath: string, options: OptionValues) {
  const color = colorProcessing(options.color.toLowerCase()) || 'black';

  let destination =
    typeof options.dest === 'string'
      ? options.dest
      : process.env.DEST || __dirname;

  if (destination && filepath) {
    const destinationPath = processFileName(destination, filepath);
    let featureArray = await parseToJson(filepath);

    if (featureArray?.length) {
      featureArray = filterForTime(featureArray, parseInt(options.time));
    }

    const svgFeatures = featureArray
      ?.map((feature) => parsePoints(feature, color))
      .join('');

    console.log({ svgFeatures });
    if (svgFeatures?.length) {
      createSvg(svgFeatures, destination, color);
    }
  }
}
