import parsePoints from '@modules/createSvg/parsePoints';
import type { RotationNode, RotationRecord } from '@projectTypes/rotationTypes';
import type { FeatureCollection, TimeInstant } from '@projectTypes/timeTypes';
import type Quaternion from 'quaternion';
import { findFinalRotation } from '@modules/findFinalRotation/findFinalRotation';
import type { CptRampRuleArray } from '@modules/validFiles/jsonFromCpt';
import { gradedStepFactory } from './gradedStepFactory';
import { rgbToHex } from '@utilities/colorProcessing';

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
) {
  const gradedColor = gradedStepFactory(colorRamp);

  return (feature: FeatureCollection) => {
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

        return parsePoints(feature, hexColor, finalRotation);
      } catch (e) {
        console.log(e, feature.reconstructionPlateId);
      }
    }
  };
}
