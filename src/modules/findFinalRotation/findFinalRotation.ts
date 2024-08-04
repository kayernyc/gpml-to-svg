import { eulerToQuaternion } from '@modules/applyRotation/transformCoordinates';
import type { RotationNode, RotationRecord } from '@projectTypes/rotationTypes';
import type Quaternion from 'quaternion';

export function findAllRotations(
  rotationNode: RotationNode,
  rotationTimes: RotationRecord,
  currentTimes: RotationNode[] = [],
): RotationNode[] {
  currentTimes.push(rotationNode);
  // If this rotates relative to globe, return immediately
  if (rotationNode.relativePlateId === 0) {
    return currentTimes;
  }

  const nextNode = rotationTimes[rotationNode.relativePlateId] as RotationNode;
  return findAllRotations(nextNode, rotationTimes, currentTimes);
}

export function findFinalRotation(
  rotationNode: RotationNode,
  rotationArray: RotationRecord,
  root = {
    lat_of_euler_pole: 90,
    lon_of_euler_pole: 0,
    rotation_angle: 0,
  },
): Quaternion {
  const allRotations = findAllRotations(rotationNode, rotationArray);

  let currentBase: Quaternion | undefined;

  for (const current of allRotations) {
    const { lat_of_euler_pole, lon_of_euler_pole, rotation_angle } = current;
    const currentQuat = eulerToQuaternion({
      lat_of_euler_pole,
      lon_of_euler_pole,
      rotation_angle,
    });

    if (!currentBase) {
      currentBase = currentQuat;
    } else {
      currentBase = currentQuat.mul(currentBase) as Quaternion;
    }
  }

  if (!currentBase) {
    throw new Error('No rotations found');
  }

  const rootQuat = eulerToQuaternion(root);
  const qTransform = currentBase.mul(rootQuat.conjugate());
  return qTransform;
}
