import { Command, OptionValues } from 'commander';
import colorProcessing from './utilities/colorProcessing';
import { parseToJson } from './modules/findNodes/parseToJson';

import * as dotenv from 'dotenv';
dotenv.config({ path: __dirname + '/../.env' });

import createSvg from './modules/createSvg/createSvg';
import parsePoints from './modules/createSvg/parsePoints';
import { processFileName } from './utilities/processFileName';
import { filterForTime } from './modules/findNodes/filterForTime';

const program = new Command();

program.enablePositionalOptions();

program.enablePositionalOptions().option('-p, --progress');

program
  .version('0.0.1')
  .description('A CLI for converting GPLates GPML files to SVGs.')
  .command('convert <source>')
  .requiredOption(
    '-t, --time <number>',
    'point in time that a feature must exist',
  )
  .option('-c, --color <string>', 'fill color', 'teal')
  .action(async (source, options) => {
    convertFile(source, options);
  });

program.parse(process.argv);

async function convertFile(filepath: string, options: OptionValues) {
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
