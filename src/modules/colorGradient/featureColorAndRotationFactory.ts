import parsePoints from '@modules/processPointData/parsePoints';
import { findFinalRotation } from '@modules/findFinalRotation/findFinalRotation';
import type { CptRampRuleArray } from '@modules/validFiles/jsonFromCpt';
import type { RotationNode, RotationRecord } from '@projectTypes/rotationTypes';
import type { GPlates_Feature, TimeInstant } from '@projectTypes/timeTypes';
import { rgbToHex } from '@utilities/colorProcessing';
import type Quaternion from 'quaternion';
import { gradedStepFactory } from './gradedStepFactory';

function getTimeFromTimeInstant(time: TimeInstant): number {
  const value = time.timePosition;
  if (typeof value === 'string') {
    return Number.parseInt(value);
  }

  return value as unknown as number;
}

export function featureColorAndRotationFactory(
  colorRamp: CptRampRuleArray,
  rotationTimes: RotationRecord,
  targetTime: number,
  longOffset = 0,
) {
  const gradedColor = gradedStepFactory(colorRamp);

  return (feature: GPlates_Feature) => {
    const plateId = feature.reconstructionPlateId?.ConstantValue?.value;
    const age =
      getTimeFromTimeInstant(feature.validTime.TimePeriod.begin.TimeInstant) -
      targetTime;

    const rotationNode: RotationNode = rotationTimes[plateId] as RotationNode;

    const hexColor = rgbToHex(gradedColor(age));

    if (plateId) {
      try {
        const finalRotation: Quaternion = findFinalRotation(
          rotationNode,
          rotationTimes,
        );

        return parsePoints({
          gpObject: feature,
          color: hexColor,
          finalRotation,
          longOffset,
        });
      } catch (e) {
        console.log(e, feature.reconstructionPlateId);
      }
    }
  };
}
