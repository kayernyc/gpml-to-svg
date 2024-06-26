import { promises as fs } from 'fs';
import { XMLParser } from 'fast-xml-parser';
import errorProcessing from '@utilities/errorProcessing';

export async function parseToJson(
  sourcePath: string,
): Promise<Array<Record<string, unknown>> | undefined> {
  try {
    let data = await fs.readFile(sourcePath, 'utf8');
    data = data.replace(/gml:/g, '');
    data = data.replace(/gpml:/g, '');
    const parser = new XMLParser();
    const parsedJson = parser.parse(data);

    if (parsedJson && parsedJson['FeatureCollection']) {
      const sourceJson = parsedJson['FeatureCollection'];
      if (Array.isArray(sourceJson.featureMember)) {
        return sourceJson.featureMember;
      }
    }

    throw new Error('No FeatureCollection found');
  } catch (err: unknown) {
    errorProcessing(err);
  }
}
