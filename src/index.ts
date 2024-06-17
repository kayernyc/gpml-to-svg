import { Command, OptionValues } from 'commander';
import colorProcessing from './utilities/colorProcessing';
import { parseToJson } from './modules/findNodes/parseToJson';

import * as dotenv from 'dotenv';
dotenv.config({ path: __dirname + '/../.env' });

// import createSvg from './modules/createSvg/createSvg';
import parsePoints from './modules/createSvg/parsePoints';
import { processFileName } from './utilities/processFileName';
import { filterForTime } from './modules/findNodes/filterForTime';
import { Shape } from './types/shapeTypes';

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
  const color = colorProcessing(options.color.toLowerCase()) || 'black';

  let destination =
    typeof options.dest === 'string'
      ? options.dest
      : process.env.DEST || __dirname;

  if (destination && filepath) {
    const destinationPath = processFileName(destination, filepath);
    let featureArray = await parseToJson(filepath);
    if (featureArray?.length) {
      featureArray = filterForTime(
        featureArray,
        parseInt(options.beginningTime),
      );
    }

    featureArray?.forEach(async (feature) => {
      const nodes = await parsePoints(feature.outlineOf as Shape, color);
    });

    // createSvg(filepath, destination, color);
  }
}

/*
{
  identity: 'GPlates-b066dc20-dc41-4c84-a862-ae4b6130339b',
  revision: 'GPlates-5fa7fe71-da73-40dd-a564-64487d7639a7',
  name: 'rollback islands',
  validTime: { TimePeriod: { begin: [Object], end: [Object] } },
  geometryImportTime: { TimeInstant: { timePosition: 700 } },
  reconstructionPlateId: {
    ConstantValue: { value: 211, description: '', valueType: 'plateId' }
  },
  outlineOf: {
    ConstantValue: { value: [Object], description: '', valueType: 'Polygon' }
  },
  featureType: 'ContinentalCrust'
}
*/
