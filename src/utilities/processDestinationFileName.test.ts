import { expect, test } from 'vitest';

import { processDestinationFileName } from './processDestinationFileName';

const testCases = [
  {
    label: 'expect simple return',
    destination: 'testfolder/image.bob.svg',
    source: 'testfolder/image.bob.svg',
    expected: 'testfolder/image.bob.svg',
  },
  {
    label: 'expect simple return with space',
    destination: 'testfolder/image bob.svg',
    source: 'testfolder/image bob.svg',
    expected: 'testfolder/image-bob.svg',
  },
  {
    label: 'expect destination path with source name',
    destination: 'testfolder/',
    source: 'https://examplesource.com/bpb.svg',
    expected: 'testfolder/bpb.svg',
  },
];

for (const { label, destination, source, expected } of testCases) {
  test(label, {}, () => {
    expect(processDestinationFileName(destination, source)).toBe(expected);
  });
}

test('expect error when no file name found', {}, () => {
  expect(() =>
    processDestinationFileName('testfolder/', 'testfolder/'),
  ).toThrowError('No file name found');
});
