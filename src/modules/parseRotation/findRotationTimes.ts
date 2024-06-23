import { RotationDict, RotationRecord } from '@projectTypes/rotationTypes';

function findTimePair(plateObject: RotationRecord, time: number) {
  const times = Object.keys(plateObject).map((key) => parseInt(key, 10));
  const sortedTimes = times.sort((a, b) => a - b);

  for (let i = 0; i < sortedTimes.length; i++) {
    if (sortedTimes[i] > time) {
      return [sortedTimes[i - 1], sortedTimes[i]];
    }
  }

  return [sortedTimes[sortedTimes.length - 1], sortedTimes[0]];
}

export function findRotationTimes(rotationDict: RotationDict, time: number) {
  const times = Object.keys(rotationDict).reduce((acc, plateId) => {
    const plateObject: RotationRecord = rotationDict[plateId];

    if (Object.keys(plateObject).length < 2) {
      throw new Error('Rotation record must have at least two time points');
    }

    acc[plateId] = {};

    if (plateObject[time]) {
      acc[plateId] = plateObject[time];
      return acc;
    }

    const [time1, time2] = findTimePair(plateObject, time);
    acc[plateId][time1] = plateObject[time1];
    acc[plateId][time2] = plateObject[time2];
    return acc;
  }, {} as RotationDict);
  return times;
}
