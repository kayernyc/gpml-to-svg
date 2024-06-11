import { Command, OptionValues } from 'commander';
import colorProcessing from './utilities/colorProcessing';

import * as dotenv from 'dotenv';
dotenv.config({ path: __dirname + '/../.env' });

import createSvg from './modules/createSvg/createSvg';
import { processFileName } from './utilities/processFileName';

const program = new Command();

program.enablePositionalOptions();

program.enablePositionalOptions().option('-p, --progress');

program
  .version('0.0.1')
  .description('A CLI for converting GPLates GPML files to SVGs.')
  .command('convert <source>')
  .option('-c, --color <string>', 'fill color', 'teal')
  .action((source, options) => {
    convertFile(source, options);
  });

program.parse(process.argv);

function convertFile(filepath: string, options: OptionValues) {
  console.log({ options });

  const color = colorProcessing(options.color.toLowerCase()) || 'black';

  let destination =
    typeof options.dest === 'string'
      ? options.dest
      : process.env.DEST || __dirname;

  if (destination && filepath) {
    const destinationPath = processFileName(destination, filepath);
    createSvg(filepath, destination, color);
  }
}
