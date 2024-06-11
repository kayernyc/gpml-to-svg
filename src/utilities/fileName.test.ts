import { expect, test } from 'vitest';

import { fileName } from './fileName';

test('fileName is correctly processed', () => {
  expect(fileName('testfolder/image.bob.svg')).toBe('image.bob.svg');
  expect(fileName('testfolder/image bob.svg')).toBe('image-bob.svg');
  expect(fileName('testfolder/.svg')).toBe(undefined);
});
