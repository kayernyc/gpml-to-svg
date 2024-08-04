import parsePoints from '@modules/createSvg/parsePoints';
import { findFinalRotation } from '@modules/findFinalRotation/findFinalRotation';
import type { RotationNode, RotationRecord } from '@projectTypes/rotationTypes';
import type { GPlates_Feature } from '@projectTypes/timeTypes';
import type Quaternion from 'quaternion';

export function featureAndRotationFactory(rotationTimes: RotationRecord) {
  return (feature: GPlates_Feature, color: string) => {
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
