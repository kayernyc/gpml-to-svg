import { Command } from 'commander';

import { convertFile } from '@commands/convertFile';

import * as dotenv from 'dotenv';
dotenv.config({ path: __dirname + '/../.env' });

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
