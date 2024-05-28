import { promises as fs } from 'fs';
import merc from 'mercator-projection';
import { GPLATES_X_OFFSET, GPLATES_Y_OFFSET } from '../../GPLATES_CONSTANTS';
import createSvg from './createSvg';

type FeatureMember = {
  [key: string]: object;
};

const CoordinatesRegex =
  /<gml:posList gml:dimension="2">(?<coordinatelist>\d[0-9.-\s]+)/gm;

const testRegex = /(?<test>)gpml/g;

async function parseGpml(sourcePath) {
  try {
    const data = await fs.readFile(sourcePath, 'utf8');

    const results = data.matchAll(CoordinatesRegex);

    let nodes = '';

    for (let result of results) {
      if (result[1]) {
        const coordinateData = result[1].trim().split(' ');
        const coordinates = coordinateData.reduce((acc, dataPoint, index) => {
          const dataFloat = parseFloat(dataPoint);
          if (!isNaN(dataFloat)) {
            if (index % 2 === 1) {
              const sourceX = parseFloat(coordinateData[index - 1]);
              const sourceY = dataFloat;

              const { x, y } = merc.fromLatLngToPoint({
                lat: sourceX,
                lng: sourceY,
              });

              acc += `${x.toFixed(2) * 10} ${y.toFixed(2) * 10} `;
            }
          }
          return acc;
        }, '');

        console.log({ coordinates });

        nodes += `${nodes}<polygon points="${coordinates.trim()}" style="fill:lime" />`;
      }
    }

    createSvg(nodes);
  } catch (err) {
    console.error(err);
  }
}

export default parseGpml;
