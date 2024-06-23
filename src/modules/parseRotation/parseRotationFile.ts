import fs from 'fs';
import { RotationDict } from '@projectTypes/rotationTypes';

export function parseRotationFile(filepath: string) {
  const rotationFile = fs.readFileSync(filepath, 'utf8');
  const rotationFileArray = rotationFile.split('\n');
  const accDict: RotationDict = {};

  const rotationDict: RotationDict = rotationFileArray.reduce((acc, line) => {
    const [plateId, time, x, y, rotation, relativePlateId] = line
      .slice(0, line.indexOf('!'))
      .split(' ')
      .filter((el) => el !== '');

    if (!plateId || !time || !x || !y || !rotation || !relativePlateId) {
      return acc;
    }

    if (!acc[plateId]) {
      acc[plateId] = {};
    }

    acc[plateId][parseInt(time)] = {
      x: parseFloat(x),
      y: parseFloat(y),
      rotation: parseFloat(rotation),
      relativePlateId: parseInt(relativePlateId),
    };

    return acc;
  }, accDict);

  return rotationDict;
}
