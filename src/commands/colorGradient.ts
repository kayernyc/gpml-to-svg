import { stderr } from 'node:process';
import { convertRampedFileToGroup } from '@modules/colorGradient/convertRampedFileToGroup';
import createSvg from '@modules/createSvg/createSvg';
import { validColorRamp } from '@modules/validFiles/validColorRamp';
import { colorValidation } from '@utilities/colorProcessing';
import ansis from 'ansis';
import type { OptionValues } from 'commander';
import { validateRequiredFileProcessingOptions } from 'middleware/validateRequiredFileProcessingOptions';

export async function colorGradient(options: OptionValues) {
  const {
    destination,
    files,
    longOffset,
    maxAge,
    rotationTimes,
    userFileName,
  } = await validateRequiredFileProcessingOptions(options);

  const borderColor = options.borderColor
    ? colorValidation(options.borderColor)
    : '';

  const timeInt = Number.parseInt(options.time);

  const ramp = await validColorRamp(options.colorRamp);
  if (!ramp) {
    stderr.write(ansis.red('No valid cpt file found. Exiting.'));
    process.exit(2);
  }

  const finalElements = await convertRampedFileToGroup({
    filepath: files[0],
    rotationTimes,
    colorRamp: ramp,
    time: timeInt,
    longOffset,
    maxAge,
  });

  if (finalElements === undefined) {
    process.exit(1);
  }

  createSvg({
    featureString: finalElements,
    destPath: destination,
    fileName: userFileName,
    borderColor,
    longOffset,
  });
}
