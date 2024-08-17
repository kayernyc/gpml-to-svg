import { describe, it, expect } from 'vitest';
import { execa } from 'execa';
import path from 'node:path';
import { Command } from 'commander';

const cliPath = path.resolve(__dirname, '../../../dist/index.js');
import { cmd } from '../../../dist/index.js';

describe('CLI tests', () => {
  // it('should greet the user', async () => {
  //   console.log(cliPath);
  //   // console.log(__dirname);
  //   const { stdout } = await execa('node', [cliPath], {
  //     input: 'convert -t 700', // Simulate user input
  //   });

  //   expect(stdout.trim()).toBe('What is your name? Hello, Alice!');
  // });

  it('should do a thing', async () => {
    const response = cmd.execute();
  });
});
