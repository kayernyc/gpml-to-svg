import parsePoints from '@modules/createSvg/parsePoints';
import { RotationNode, RotationRecord } from '@projectTypes/rotationTypes';
import { FeatureCollection, TimeInstant } from '@projectTypes/timeTypes';
import Quaternion from 'quaternion';
import { findFinalRotation } from '@modules/findFinalRotation/findFinalRotation';
import { CptRampRuleArray } from '@modules/validFiles/jsonFromCpt';

function getTimeFromTimeInstant(time: TimeInstant): number {
  const value = time.timePosition;
  if (typeof value === 'string') {
    return parseInt(value);
  }

  return value as unknown as number;
}

function findColorFromAgeAndRamp(age: number, ramp: CptRampRuleArray) {}

export function featureColorAndRotationFactory(
  colorRamp: CptRampRuleArray,
  rotationTimes: RotationRecord,
  targetTime: number,
) {
  return function (feature: FeatureCollection) {
    const plateId = feature.reconstructionPlateId?.ConstantValue?.value;
    const age =
      getTimeFromTimeInstant(feature.validTime.TimePeriod.begin.TimeInstant) -
      targetTime;

    const rotationNode: RotationNode = rotationTimes[plateId] as RotationNode;

    if (plateId) {
      try {
        const finalRotation: Quaternion = findFinalRotation(
          rotationNode,
          rotationTimes,
        );

        return parsePoints(feature, '#FFFFFF', finalRotation);
      } catch (e) {
        console.log(e, feature.reconstructionPlateId);
      }
    }
  };
}
