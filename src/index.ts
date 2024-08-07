#! /usr/bin/env node

import { colorGradient } from '@commands/colorGradient';
import { convert } from '@commands/convert';
import { Command } from 'commander';
import {
  BORDER_COLOR_DECLARATION,
  BORDER_COLOR_DESCRIPTION,
  DESTINATION_DECLARATION,
  DESTINATION_DESCRIPTION,
  FILL_COLOR_DECLARATION,
  FILL_COLOR_DEFAULT,
  FILL_COLOR_DESCRIPTION,
  GENERATED_FILE_NAME_DECLARATION,
  GENERATED_FILE_NAME_DESCRIPTION,
  MULTI_COLOR_DECLARATION,
  MULTI_COLOR_DESCRIPTION,
  ROTATION_FILE_DECLARATION,
  ROTATION_FILE_DESCRIPTION,
  TIME_DECLARATION,
  TIME_DESCRIPTION,
} from 'constants/COMMANDER_CONSTANTS';

import * as dotenv from 'dotenv';
import { gpsvgHelp } from 'gpsvgHelp';
dotenv.config({ path: `${__dirname}/../.env` });

const program = new Command();

program
  .configureHelp({
    helpWidth: 40,
    sortOptions: true,
    subcommandTerm: (cmd) => cmd.name(),
  })
  .addHelpText('before', gpsvgHelp);

program.version('0.0.2');

program
  .command('convert')
  .description('Convert one or more files to an SVG.')
  .requiredOption(TIME_DECLARATION, TIME_DESCRIPTION)
  .requiredOption(DESTINATION_DECLARATION, DESTINATION_DESCRIPTION)
  .option(FILL_COLOR_DECLARATION, FILL_COLOR_DESCRIPTION, FILL_COLOR_DEFAULT)
  .option(ROTATION_FILE_DECLARATION, ROTATION_FILE_DESCRIPTION)
  .option(GENERATED_FILE_NAME_DECLARATION, GENERATED_FILE_NAME_DESCRIPTION)
  .option(MULTI_COLOR_DECLARATION, MULTI_COLOR_DESCRIPTION)
  .option(BORDER_COLOR_DECLARATION, BORDER_COLOR_DESCRIPTION)
  .argument('<filepaths...>')
  .action(async (filepaths, options) => {
    convert(filepaths, options);
  });

program
  .command('color-gradient')
  .description(
    'Convert a single file to an SVG with a color ramp to indicate age.',
  )
  .requiredOption(TIME_DECLARATION, TIME_DESCRIPTION)
  .requiredOption(DESTINATION_DECLARATION, DESTINATION_DESCRIPTION)
  .requiredOption(
    '-cr, --color-ramp <string>',
    'file for gradient or color ramp',
  )
  .option(ROTATION_FILE_DECLARATION, ROTATION_FILE_DESCRIPTION)
  .option(GENERATED_FILE_NAME_DECLARATION, GENERATED_FILE_NAME_DESCRIPTION)
  .option(BORDER_COLOR_DECLARATION, BORDER_COLOR_DESCRIPTION)
  .option('-f, --file-path <string>', 'file to color with a gradient')
  .action(async (options) => {
    colorGradient(options);
  });

program.parse(process.argv);
