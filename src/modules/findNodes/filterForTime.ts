import { FeatureCollection, TimePeriod } from '../../types/timeTypes';

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
  beginningTime: number,
): FeatureCollection[] {
  const filteredFeatures = sourceJsonArray
    .map((feature) => {
      const keys = Object.keys(feature);
      return keys.map((key) => {
        const value = feature[key] as FeatureCollection;
        value.featureType = key;
        return value;
      });
    })
    .flat()
    .filter((feature: FeatureCollection) => {
      const [beginTime, endTime] = findTimePeriod(feature.validTime.TimePeriod);

      return beginningTime >= beginTime;
    });

  return filteredFeatures;
}
