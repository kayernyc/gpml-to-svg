import { describe, expect, test } from 'vitest';

function teds() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('foo');
    }, 300);
  });
}

describe('CLI tests', async () => {
  test('should be truthy', () => {
    expect(true).toBeTruthy();
  });
});
