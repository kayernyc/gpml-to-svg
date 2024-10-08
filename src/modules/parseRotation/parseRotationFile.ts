import fs from 'node:fs';
import type { RotationDict } from '@projectTypes/rotationTypes';

export function reduceFileArray(rotationFileArray: string[]) {
  const accDict: RotationDict = {};
  return rotationFileArray.reduce((acc, line) => {
    if (!line.length) {
      return acc;
    }

    const [
      plateId,
      time,
      lat_of_euler_pole,
      lon_of_euler_pole,
      rotation_angle,
      relativePlateId,
    ] = line
      .slice(0, line.indexOf('!'))
      .split(' ')
      .filter((el) => el !== '');

    if (
      !plateId ||
      !time ||
      !lat_of_euler_pole ||
      !lon_of_euler_pole ||
      !rotation_angle ||
      !relativePlateId
    ) {
      return acc;
    }

    if (!acc[plateId]) {
      acc[plateId] = {};
    }

    acc[plateId][Number.parseFloat(time)] = {
      lat_of_euler_pole: Number.parseFloat(lat_of_euler_pole),
      lon_of_euler_pole: Number.parseFloat(lon_of_euler_pole),
      rotation_angle: Number.parseFloat(rotation_angle),
      relativePlateId: Number.parseInt(relativePlateId),
    };

    return acc;
  }, accDict);
}

export function parseRotationFile(filepath: string) {
  const rotationFile = fs.readFileSync(filepath, 'utf8');
  const rotationFileArray = rotationFile.split('\n');
  return reduceFileArray(rotationFileArray);
}
