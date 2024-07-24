import { OptionValues } from 'commander';
import { validateRequiredFileProcessingOptions } from 'middleware/validateRequiredFileProcessingOptions';

export async function colorGradient(options: OptionValues) {
  const { destination, files, rotationTimes, userFileName } =
    await validateRequiredFileProcessingOptions(options);

  console.log({ destination, files, rotationTimes, userFileName });
}
