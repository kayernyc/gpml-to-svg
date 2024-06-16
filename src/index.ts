import { Command, OptionValues } from 'commander';
import colorProcessing from './utilities/colorProcessing';
import { parseToJson } from './modules/findNodes/parseToJson';

import * as dotenv from 'dotenv';
dotenv.config({ path: __dirname + '/../.env' });

import createSvg from './modules/createSvg/createSvg';
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
    '-bt, --beginning-time <number>',
    'earliest time for a feature',
  )
  .option('-c, --color <string>', 'fill color', 'teal')
  .action(async (source, options) => {
    convertFile(source, options);
  });

program.parse(process.argv);

async function convertFile(filepath: string, options: OptionValues) {
  console.log({ options });

  const color = colorProcessing(options.color.toLowerCase()) || 'black';

  let destination =
    typeof options.dest === 'string'
      ? options.dest
      : process.env.DEST || __dirname;

  if (destination && filepath) {
    const destinationPath = processFileName(destination, filepath);
    let featureArray = await parseToJson(filepath);
    if (featureArray) {
      featureArray = filterForTime(featureArray, options.beginningTime);
    }

    createSvg(filepath, destination, color);
  }
}
