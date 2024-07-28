import parsePoints from '@modules/createSvg/parsePoints';
import { RotationNode, RotationRecord } from '@projectTypes/rotationTypes';
import { FeatureCollection } from '@projectTypes/timeTypes';
import Quaternion from 'quaternion';
import { findFinalRotation } from '@modules/findFinalRotation/findFinalRotation';

export function featureAndRotationFactory(rotationTimes: RotationRecord) {
  return function (feature: FeatureCollection, color: string) {
    const plateId = feature.reconstructionPlateId?.ConstantValue?.value;
    const rotationNode: RotationNode = rotationTimes[plateId] as RotationNode;

    if (plateId) {
      try {
        const finalRotation: Quaternion = findFinalRotation(
          rotationNode,
          rotationTimes,
        );

        return parsePoints(feature, color, finalRotation);
      } catch (e) {
        console.log(e, feature.reconstructionPlateId);
      }
    }
  };
}
