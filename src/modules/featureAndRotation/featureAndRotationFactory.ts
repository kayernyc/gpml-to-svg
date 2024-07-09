import parsePoints from '@modules/createSvg/parsePoints';
import {
  RotationDict,
  RotationNode,
  RotationRecord,
} from '@projectTypes/rotationTypes';
import { FeatureCollection } from '@projectTypes/timeTypes';
import { eulerToQuaternion } from '@modules/applyRotation/transformCoordinates';
import Quaternion from 'quaternion';

export function findAllRotations(
  rotationNode: RotationNode,
  rotationTimes: RotationRecord,
  currentTimes: RotationNode[] = [],
): RotationNode[] {
  currentTimes.push(rotationNode);
  if (rotationNode.relativePlateId === 0) {
    return currentTimes;
  }

  const nextNode = rotationTimes[rotationNode.relativePlateId] as RotationNode;
  return findAllRotations(nextNode, rotationTimes, currentTimes);
}

export function findFinalRotation(
  rotationNode: RotationNode,
  rotationArray: RotationRecord,
): Quaternion {
  const root = {
    lat_of_euler_pole: 90,
    lon_of_euler_pole: 0,
    rotation_angle: 0,
  };

  const allRotations = findAllRotations(rotationNode, rotationArray);

  let currentBase: Quaternion | undefined;

  allRotations.forEach((current: RotationNode) => {
    const { lat_of_euler_pole, lon_of_euler_pole, rotation_angle } = current;
    const currentQuat = eulerToQuaternion({
      lat_of_euler_pole,
      lon_of_euler_pole,
      rotation_angle,
    });

    console.log({ currentQuat });

    if (!currentBase) {
      currentBase = currentQuat;
    } else {
      currentBase = currentQuat.mul(currentBase) as Quaternion;
    }
  });

  if (!currentBase) {
    throw new Error('No rotations found');
  }

  console.log({ currentBase });

  const rootQuat = eulerToQuaternion(root);
  const qTransform = currentBase.mul(rootQuat.conjugate());
  return qTransform;
}

export function featureAndRotationFactory(
  rotationTimes: RotationRecord,
  color: string,
) {
  return function (feature: FeatureCollection) {
    const plateId = feature.reconstructionPlateId.ConstantValue.value;
    const rotationNode: RotationNode = rotationTimes[plateId] as RotationNode;

    const finalRotation: Quaternion = findFinalRotation(
      rotationNode,
      rotationTimes,
    );

    return parsePoints(feature, color, finalRotation);
  };
}
