import { Command } from 'commander';

import * as dotenv from 'dotenv';
dotenv.config({ path: __dirname + '/../.env' });

import parseGpml from './modules/createSvg/parseGpml';

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
  parseGpml();
}

console.log(process.env.DEST);

switch (true) {
  case !!options.convert:
    console.log({ options });
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
