import { Command } from 'commander';

import * as dotenv from 'dotenv';
dotenv.config({ path: __dirname + '/../.env' });

import createSvg from './modules/createSvg/createSvg';

const program = new Command();
program
  .version('0.0.1')
  .description('A CLI for converting GPLates GPML files to SVGs.')
  .option('-c, --convert <source>')
  .option('-d, --dest <dest>')
  .option('-m, --mkdir <value>', 'Create a directory')
  .option('-t, --touch <value>', 'Create a file')
  .parse(process.argv);

const options = program.opts();

function convertFile(filepath: string, destination: string) {
  createSvg(filepath, destination);
}

switch (true) {
  case !!options.convert:
    let filepath =
      typeof options.convert === 'string' ? options.convert : __dirname;
    let destination =
      typeof options.dest === 'string'
        ? options.dest
        : process.env.DEST || __dirname;

    convertFile(filepath, destination);
    break;
  case options.mkdir:
    console.log('MK DIR');
    break;
  default:
    console.log('default');
}
