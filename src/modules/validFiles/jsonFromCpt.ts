import { RgbColorArrayType } from '@modules/colorMap/createColorArray';
import { promises as fs } from 'fs';
import { stderr } from 'process';

interface CptRampRule {
  anchor: number;
  color: RgbColorArrayType;
}

type CptRampRuleArray = CptRampRule[];

export function findRgbColorCode(line: string): CptRampRuleArray {
  let charArray = line.split('');
  let numberArray = [];
  let currentNumStr = '';

  while (charArray.length > 0) {
    const currentChar = charArray.shift();

    if (currentChar === undefined) {
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
    let currentRule: CptRampRule = {
      anchor: parseInt(numberArray[i]),
      color: [
        parseInt(numberArray[i + 1]),
        parseInt(numberArray[i + 2]),
        parseInt(numberArray[i + 3]),
      ],
    };

    currentRule.color.forEach((colorNumber: number) => {
      if (colorNumber > 255 || colorNumber < 0) {
        process.exit(1);
      }
    });

    accumulator.push(currentRule);
  }

  return accumulator;
}

export async function jsonFromCpt(filePath: string) {
  let data = await fs.readFile(filePath, 'utf8');
  let dataArray = data
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => !line.includes('#'))
    .reduce(
      (acc, line) => {
        switch (line.charAt(0)) {
          case 'B':
            acc.B = line;
            break;

          case 'F':
            acc.F = line;
            break;

          case 'N':
            acc.N = line;
            break;

          default:
        }
        return acc;
      },
      {
        B: '',
        F: '',
        N: '',
      },
    );
  console.log({ dataArray });
}
