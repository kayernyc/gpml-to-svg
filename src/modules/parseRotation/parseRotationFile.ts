import fs from 'fs';
import { RotationDict } from '@projectTypes/rotationTypes';

export function parseRotationFile(filepath: string) {
  const rotationFile = fs.readFileSync(filepath, 'utf8');
  const rotationFileArray = rotationFile.split('\n');
  const accDict: RotationDict = {};

  const rotationDict: RotationDict = rotationFileArray.reduce((acc, line) => {
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

    acc[plateId][parseInt(time)] = {
      lat_of_euler_pole: parseFloat(lat_of_euler_pole),
      lon_of_euler_pole: parseFloat(lon_of_euler_pole),
      rotation_angle: parseFloat(rotation_angle),
      relativePlateId: parseInt(relativePlateId),
    };

    return acc;
  }, accDict);

  return rotationDict;
}
