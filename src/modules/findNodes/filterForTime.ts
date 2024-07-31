import type { FeatureCollection, TimePeriod } from '@projectTypes/timeTypes';

function findTimePeriod(validTime: TimePeriod): [number, number] {
  const returnValue = [
    validTime.begin.TimeInstant.timePosition,
    validTime.end.TimeInstant.timePosition,
  ].map((time) => {
    if (typeof time === 'string') {
      return 0;
    }
    return time;
  });

  return [returnValue[0], returnValue[1]];
}

export function filterForTime(
  sourceJsonArray: Record<string, unknown>[],
  time: number,
): FeatureCollection[] {
  const filteredFeatures = sourceJsonArray
    .flatMap((feature) => {
      const keys = Object.keys(feature);
      return keys.map((key) => {
        const value = feature[key] as FeatureCollection;
        value.featureType = key;
        return value;
      });
    })
    .filter((feature: FeatureCollection) => {
      const [beginTime, endTime] = findTimePeriod(feature.validTime.TimePeriod);
      // must have existed by the beginning time
      return time <= beginTime && time >= endTime;
    });

  return filteredFeatures;
}
