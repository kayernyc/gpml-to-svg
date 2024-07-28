import { convertRampedFileToGroup } from '@modules/colorGradient/convertRampedFileToGroup';
import { validColorRamp } from '@modules/validFiles/validColorRamp';
import { rgbToHex } from '@utilities/colorProcessing';
import { OptionValues } from 'commander';
import { validateRequiredFileProcessingOptions } from 'middleware/validateRequiredFileProcessingOptions';
import { stderr } from 'process';

export async function colorGradient(options: OptionValues) {
  const { destination, files, rotationTimes, userFileName } =
    await validateRequiredFileProcessingOptions(options);

  const timeInt = parseInt(options.time);

  const ramp = await validColorRamp(options.colorRamp);
  if (!ramp) {
    stderr.write('No valid cpt file found. Exiting.');
    process.exit(2);
  }

  await convertRampedFileToGroup(files[0], rotationTimes, ramp, timeInt);

  console.log({ destination, files, userFileName }, options.colorRamp);
}
