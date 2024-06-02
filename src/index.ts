import { Command, OptionValues } from 'commander';

import * as dotenv from 'dotenv';
dotenv.config({ path: __dirname + '/../.env' });

import createSvg from './modules/createSvg/createSvg';

const program = new Command();

program.enablePositionalOptions();

program.enablePositionalOptions().option('-p, --progress');

program
  .version('0.0.1')
  .description('A CLI for converting GPLates GPML files to SVGs.')
  .command('convert <source>')
  .option('-c, --color <string>', 'fill color', 'teal')
  .action((source, options) => {
    console.log({ source }, { options });
    if (options.color) {
      console.log(`Converting ${source} with color ${options.color}`);
    }

    convertFile(source, options);
  });

program.parse(process.argv);

const options = program.opts();

function convertFile(filepath: string, options: OptionValues) {
  console.log({ options });
  let destination =
    typeof options.dest === 'string'
      ? options.dest
      : process.env.DEST || __dirname;

  createSvg(filepath, destination, options.color);
}
