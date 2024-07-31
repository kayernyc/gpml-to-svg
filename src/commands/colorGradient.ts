import { convertRampedFileToGroup } from '@modules/colorGradient/convertRampedFileToGroup';
import createSvg from '@modules/createSvg/createSvg';
import { validColorRamp } from '@modules/validFiles/validColorRamp';
import { colorValidation } from '@utilities/colorProcessing';
import ansis from 'ansis';
import { OptionValues } from 'commander';
import { validateRequiredFileProcessingOptions } from 'middleware/validateRequiredFileProcessingOptions';
import { stderr } from 'process';

export async function colorGradient(options: OptionValues) {
  const { destination, files, rotationTimes, userFileName } =
    await validateRequiredFileProcessingOptions(options);

  const borderColor = colorValidation(options.borderColor);
  const timeInt = parseInt(options.time);

  const ramp = await validColorRamp(options.colorRamp);
  if (!ramp) {
    stderr.write(ansis.red('No valid cpt file found. Exiting.'));
    process.exit(2);
  }

  const finalElements = await convertRampedFileToGroup(
    files[0],
    rotationTimes,
    ramp,
    timeInt,
  );

  if (finalElements === undefined) {
    process.exit(1);
  }

  createSvg(finalElements, destination, userFileName, borderColor);
}
