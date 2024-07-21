import { convert } from '@commands/convert';
import { Command } from 'commander';

import * as dotenv from 'dotenv';
dotenv.config({ path: __dirname + '/../.env' });

const program = new Command();

program.enablePositionalOptions();

program.enablePositionalOptions().option('-p, --progress');

program
  .version('0.0.1')
  .description('A CLI for converting GPLates GPML files to SVGs.');

program
  .command('convert')
  .requiredOption(
    '-t, --time <number>',
    'point in time that a feature must exist',
  )
  .requiredOption('-d, --destination <string>', 'where to save the svg')
  .option('-c, --color <string>', 'fill color', 'gray')
  .option('-r, --rotation-file <string>', 'path to the rotation file')
  .option('-fn, --file-name <string>', 'name for generated file')
  .option(
    '--multi-color',
    'generate groups colored with variations on fill color',
  )
  .argument('<filepaths...>')
  .action(async (filepaths, options) => {
    convert(filepaths, options);
  });

program.parse(process.argv);
