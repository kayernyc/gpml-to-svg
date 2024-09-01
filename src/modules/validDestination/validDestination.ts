import { isDirectory } from '@utilities/isDirectory';

export function validDestination(candidate: string): boolean {
  if (!candidate.length) {
    console.log('No destination provided. Aborting.');
    return false;
  }

  if (isDirectory(candidate)) {
    console.log(`Using ${candidate} for destination location.`);
    return true;
  }

  console.log(`Destination ${candidate} is not a valid directory. Aborting.`);
  return false;
}
