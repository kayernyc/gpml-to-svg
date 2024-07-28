import { RgbColorArrayType } from '@modules/colorMap/createColorArray';
import { validateRgbColor } from '@utilities/validateRgbColor';
import { promises as fs } from 'fs';
import { stderr } from 'process';

export interface CptRampRule {
  anchor: number | 'B' | 'F' | 'N';
  color: RgbColorArrayType;
}

export type CptRampRuleArray = CptRampRule[];

function parseKey(key: string): number | 'B' | 'F' | 'N' {
  if (key === 'B' || key === 'F' || key === 'N') {
    return key;
  }

  if (isNaN(parseInt(key))) {
    process.exit(1);
  } else {
    return parseInt(key);
  }
}

export function findRgbColorCodeRule(line: string): CptRampRuleArray {
  let charArray = line.split('');
  let numberArray = [];
  let currentNumStr = '';

  while (charArray.length > 0) {
    const currentChar = charArray.shift();

    if (currentChar === undefined) {
      continue;
    }

    if (currentChar === 'B' || currentChar === 'F' || currentChar === 'N') {
      numberArray.push(currentChar);
      continue;
    }

    if (isNaN(parseInt(currentChar))) {
      if (currentNumStr.length > 0) {
        numberArray.push(currentNumStr);
      }
      currentNumStr = '';
    } else {
      currentNumStr += currentChar;
    }

    if (currentNumStr.length > 3) {
      process.exit(2);
    }

    if (charArray.length === 0 && currentNumStr.length > 0) {
      numberArray.push(currentNumStr);
    }
  }

  if (numberArray.length % 4 !== 0) {
    stderr.write('Invalid CPT');
    process.exit(1);
  }

  const accumulator: CptRampRuleArray = [];

  for (let i = 0; i < numberArray.length; i += 4) {
    try {
      let currentRule: CptRampRule = {
        anchor: parseKey(numberArray[i]), // parseInt(numberArray[i]),
        color: [
          parseInt(numberArray[i + 1]),
          parseInt(numberArray[i + 2]),
          parseInt(numberArray[i + 3]),
        ],
      };

      // throws if the Rgb value doesn't conform
      validateRgbColor(currentRule.color);
      accumulator.push(currentRule);
    } catch (err) {
      console.log(err);
      process.exit(2);
    }
  }

  return accumulator;
}

export async function jsonFromCpt(filePath: string) {
  let data = await fs.readFile(filePath, 'utf8');
  return data
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => !line.includes('#'))
    .reduce((acc, line) => {
      switch (line.charAt(0)) {
        case 'B':
        case 'F':
        case 'N':
          acc.push(findRgbColorCodeRule(line)[0]);
          return acc;
          break;

        default:
          return [...acc, ...findRgbColorCodeRule(line)];
      }
    }, [] as CptRampRuleArray);
}
