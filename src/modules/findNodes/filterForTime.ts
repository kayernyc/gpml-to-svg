import type { GPlates_Feature } from '@projectTypes/timeTypes';

export function filterForTime(
  sourceJsonArray: GPlates_Feature[],
  time: number,
): GPlates_Feature[] {
  const filteredFeatures = sourceJsonArray.filter(
    (feature: GPlates_Feature) => {
      const { begin, end } = feature.processedTime;
      // must have existed by the beginning time
      return time <= begin && time >= end;
    },
  );

  return filteredFeatures;
}
