import { promises as fs } from 'node:fs';
import type { GPlates_Feature } from '@projectTypes/timeTypes';
import errorProcessing from '@utilities/errorProcessing';
import { XMLParser } from 'fast-xml-parser';

export function stripGPML(data: string): string {
  let strippedData = data.replace(/gml:/g, '');
  strippedData = strippedData.replace(/gpml:/g, '');

  return strippedData;
}

export function timeToNumber(value: string | number): number {
  if (typeof value === 'string') {
    if (value.includes('distantPast')) {
      return Number.POSITIVE_INFINITY;
    }
    if (value.includes('distantFuture')) {
      return 0;
    }

    return Number.parseFloat(value);
  }

  return value;
}

export async function parseToJson(
  sourcePath: string,
): Promise<Array<GPlates_Feature> | undefined> {
  try {
    let data = await fs.readFile(sourcePath, 'utf8');
    data = stripGPML(data);

    const parser = new XMLParser();
    const parsedJson = parser.parse(data);

    let featureCollectionArray: Array<Record<string, GPlates_Feature>> = [];

    if (parsedJson?.FeatureCollection) {
      const sourceJson = parsedJson.FeatureCollection;
      if (Array.isArray(sourceJson.featureMember)) {
        featureCollectionArray = [...sourceJson.featureMember];
      } else if (typeof sourceJson.featureMember === 'object') {
        featureCollectionArray = [sourceJson.featureMember];
      }
    }

    if (featureCollectionArray.length < 1) {
      console.warn(`No FeatureCollection found in ${sourcePath}`);
      return;
    }

    return featureCollectionArray.flatMap((featureCollection) => {
      const newCollection: Array<GPlates_Feature> = [];
      for (const [key, gPFeature] of Object.entries(featureCollection)) {
        gPFeature.featureType = key;
        gPFeature.processedTime = {
          begin: timeToNumber(
            gPFeature.validTime.TimePeriod.begin.TimeInstant.timePosition,
          ),
          end: timeToNumber(
            gPFeature.validTime.TimePeriod.end.TimeInstant.timePosition,
          ),
        };
        newCollection.push(gPFeature);
      }
      return newCollection;
    });

    // return featureCollectionArray;
  } catch (err: unknown) {
    errorProcessing(err);
  }
}
