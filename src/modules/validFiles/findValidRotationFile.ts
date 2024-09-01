import { validRotationFile } from '@utilities/validRotationFile';

export function findValidRotationFile(
  optionRotationFile?: string,
  rotations?: string[],
) {
  let rotationFile = '';

  const userRotationFile = validRotationFile(optionRotationFile || '');
  if (userRotationFile) {
    rotationFile = userRotationFile;
  } else if (optionRotationFile) {
    console.warn(
      `User defined rotation file: "${optionRotationFile}" is not a valid rotation file.`,
    );
  }

  if (!userRotationFile) {
    if (rotations?.length) {
      rotationFile = rotations[0];
      console.warn(`Using found file: "${rotationFile}" as rotation file.`);
    } else {
      console.warn('No valid rotation files found near source files.');
    }
  }

  return rotationFile;
}
