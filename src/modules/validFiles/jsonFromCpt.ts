import { promises as fs } from 'node:fs';
import { stderr } from 'node:process';
import type { RgbColorArrayType } from '@modules/colorMap/createColorArray';
import { validateRgbColor } from '@utilities/validateRgbColor';
import ansis from 'ansis';

export interface CptRampRule {
  anchor: number | 'B' | 'F' | 'N';
  color: RgbColorArrayType;
}

export type CptRampRuleArray = CptRampRule[];

function parseKey(key: string): number | 'B' | 'F' | 'N' {
  if (key === 'B' || key === 'F' || key === 'N') {
    return key;
  }

  if (Number.isNaN(Number.parseInt(key))) {
    process.exit(1);
  } else {
    return Number.parseInt(key);
  }
}

export function findRgbColorCodeRule(line: string): CptRampRuleArray {
  const charArray = line.split('');
  const numberArray = [];
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

    if (Number.isNaN(Number.parseInt(currentChar))) {
      if (currentNumStr.length > 0) {
        numberArray.push(currentNumStr);
      }
      currentNumStr = '';
    } else {
      currentNumStr += currentChar;
    }

    if (currentNumStr.length > 3 && numberArray.length % 4 !== 0) {
      stderr.write(ansis.red.bold(`Invalid color number ${currentNumStr}`));
      process.exit(2);
    }

    if (charArray.length === 0 && currentNumStr.length > 0) {
      numberArray.push(currentNumStr);
    }
  }

  if (numberArray.length % 4 !== 0) {
    stderr.write(ansis.red.bold('Invalid CPT'));
    process.exit(1);
  }

  const accumulator: CptRampRuleArray = [];

  for (let i = 0; i < numberArray.length; i += 4) {
    try {
      const currentRule: CptRampRule = {
        anchor: parseKey(numberArray[i]), // parseInt(numberArray[i]),
        color: [
          Number.parseInt(numberArray[i + 1]),
          Number.parseInt(numberArray[i + 2]),
          Number.parseInt(numberArray[i + 3]),
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
  const data = await fs.readFile(filePath, 'utf8');
  const resultData = data
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

        default:
          // biome-ignore lint/performance/noAccumulatingSpread: <explanation>
          return [...acc, ...findRgbColorCodeRule(line)];
      }
    }, [] as CptRampRuleArray);

  return resultData;
}
