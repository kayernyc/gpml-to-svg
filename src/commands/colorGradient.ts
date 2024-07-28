import { validColorRamp } from '@modules/validFiles/validColorRamp';
import { OptionValues } from 'commander';
import { validateRequiredFileProcessingOptions } from 'middleware/validateRequiredFileProcessingOptions';

export async function colorGradient(options: OptionValues) {
  const { destination, files, rotationTimes, userFileName } =
    await validateRequiredFileProcessingOptions(options);

  const ramp = await validColorRamp(options.colorRamp);

  console.log({ destination, files, userFileName }, options.colorRamp);
}
