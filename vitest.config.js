import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'json', 'html'],
      exclude: ['__mocks__'],
    },
    globals: true,
    include: ['./src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@commands': path.resolve(__dirname, './src/commands/'),
      '@constants': path.resolve(__dirname, './src/constants/'),
      '@modules': path.resolve(__dirname, './src/modules/'),
      '@projectTypes': path.resolve(__dirname, './src/types/'),
      '@utilities': path.resolve(__dirname, './src/utilities/'),
    },
  },
});
