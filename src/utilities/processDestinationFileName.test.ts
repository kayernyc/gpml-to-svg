import { expect, test } from 'vitest';

import { processDestinationFileName } from './processDestinationFileName';

const testCases = [
  {
    label: 'expect simple return',
    destination: 'testFolder/image.bob.svg',
    source: 'testFolder/image.bob.svg',
    expected: 'testFolder/image.bob.svg',
  },
  {
    label: 'expect simple return with space',
    destination: 'testFolder/image bob.svg',
    source: 'testFolder/image bob.svg',
    expected: 'testFolder/image-bob.svg',
  },
  {
    label: 'expect destination path with source name',
    destination: 'testFolder/',
    source: 'https://examplesource.com/bpb.svg',
    expected: 'testFolder/bpb.svg',
  },
];

for (const { label, destination, source, expected } of testCases) {
  test(label, {}, () => {
    expect(processDestinationFileName(destination, source)).toBe(expected);
  });
}

test('expect error when no file name found', {}, () => {
  expect(() =>
    processDestinationFileName('testFolder/', 'testFolder/'),
  ).toThrowError('No file name found');
});
