import {
  eulerToQuaternion,
  quaternionToEulerPole,
} from '@modules/applyRotation/transformCoordinates';
import type {
  RotationDict,
  RotationNode,
  RotationRecord,
} from '@projectTypes/rotationTypes';

function findTimePair(plateObject: RotationRecord, time: number) {
  const times = Object.keys(plateObject).map((key) => Number.parseFloat(key));
  const sortedTimes = times.sort((a, b) => a - b);

  for (let i = 0; i < sortedTimes.length; i++) {
    if (sortedTimes[i] > time) {
      return [sortedTimes[i - 1], sortedTimes[i]];
    }
  }

  return [sortedTimes[sortedTimes.length - 1], sortedTimes[0]];
}

export interface relativeTimeRotationParams {
  time: number;
  earlyTime: number;
  lateTime: number;
  earlyRecord: RotationNode;
  lateRecord: RotationNode;
}

export function findRelativeTimeRotationParams(
  params: relativeTimeRotationParams,
) {
  const { time, earlyTime, lateTime, earlyRecord, lateRecord } = params;
  if (
    earlyRecord.lat_of_euler_pole === lateRecord.lat_of_euler_pole &&
    earlyRecord.lon_of_euler_pole === lateRecord.lon_of_euler_pole &&
    earlyRecord.rotation_angle === lateRecord.rotation_angle
  ) {
    return lateRecord;
  }

  if (earlyRecord.relativePlateId !== lateRecord.relativePlateId) {
    // TODO: improve error message for non-technical users
    const message = `Relative plate ID must be the same for both records. Early record ${earlyRecord.relativePlateId}, late record ${lateRecord.relativePlateId}`;
    throw new Error(message);
  }

  const q1 = eulerToQuaternion(earlyRecord);
  const q2 = eulerToQuaternion(lateRecord);
  const relativeTime = (time - earlyTime) / (lateTime - earlyTime);

  const slerpedQ = q1.slerp(q2)(relativeTime);
  const quat = quaternionToEulerPole(slerpedQ);
  return { ...quat, relativePlateId: earlyRecord.relativePlateId };
}

export function findRotationTimes(rotationDict: RotationDict, time: number) {
  const times = Object.keys(rotationDict).reduce((acc, plateId) => {
    const plateIdInt = Number.parseInt(plateId, 10);
    const plateObject: RotationRecord = rotationDict[plateId];

    if (Object.keys(plateObject).length < 2) {
      throw new Error('Rotation record must have at least two time points');
    }

    acc[plateIdInt] = {
      lat_of_euler_pole: 0,
      lon_of_euler_pole: 0,
      rotation_angle: 0,
      relativePlateId: 0,
    };

    // If the time is in the rotation record, return the record
    if (plateObject[time]) {
      acc[plateIdInt] = plateObject[time];
      return acc;
    }

    const [time1, time2] = findTimePair(plateObject, time);
    const relativeRotation = findRelativeTimeRotationParams({
      time,
      earlyTime: time1,
      lateTime: time2,
      earlyRecord: plateObject[time1],
      lateRecord: plateObject[time2],
    });

    acc[plateIdInt] = relativeRotation;
    return acc;
  }, {} as RotationRecord);
  return times;
}
