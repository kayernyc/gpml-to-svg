import * as fs from 'node:fs';
import { vol } from 'memfs';
import { ufs } from 'unionfs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
const mockRot = './mock.rot';
import { validateRequiredFileProcessingOptions } from './validateRequiredFileProcessingOptions';

vi.mock('node:fs');
vi.mock('node:fs/promises');

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
ufs.use(fs as any).use(vol as any);

describe('validateRequiredFileProcessingOptions', () => {
  beforeEach(() => {
    // Set up the in-memory file system
    vol.fromJSON(
      {
        '/path/to/bob.txt': 'bob file contents',
        '/path/to/file.txt': 'file contents',
        '/path/to/file.gpml': 'not a real gpml',
        '/path/to/rot.rot': mockRot,
        '/path/to/directory/subdirectory/file3.txt': 'content of file3',
      },
      '/tmp',
    );
  });

  afterEach(() => {
    // Reset the virtual file system
    vol.reset();
  });

  it('should throw if the destination is not valid', () => {
    expect(async () => {
      await validateRequiredFileProcessingOptions(
        { destination: '/path/dest' },
        ['/path/to/file'],
      );
    }).rejects.toThrowError('No valid destination provided');
  });

  it('should throw an error if there are no valid files', () => {
    expect(async () => {
      await validateRequiredFileProcessingOptions({ destination: '/path/to' }, [
        '/path/to/file',
      ]);
    }).rejects.toThrowError('No valid files found.');
  });

  it('should throw an error if there are no valid files', () => {
    expect(async () => {
      await validateRequiredFileProcessingOptions({ destination: '/path/to' });
    }).rejects.toThrowError('No valid file names provided.');
  });

  it('should throw an error if there are no valid files', async () => {
    const result = await validateRequiredFileProcessingOptions(
      { destination: '/path/to', time: '700', fileName: 'bob' },
      ['/path/to/file.gpml'],
    );

    expect(result).toEqual({
      destination: '/path/to',
      files: ['/path/to/file.gpml'],
      longOffset: 0,
      maxAge: 0,
      rotationTimes: {},
      userFileName: 'bob.svg',
    });
  });
});
