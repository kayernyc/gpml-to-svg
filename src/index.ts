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
  .option('-c, --color <string>', 'fill color', 'teal')
  .argument('<filepaths...>')
  .action(async (filepaths, options) => {
    convert(filepaths, options);
  });

program.parse(process.argv);
