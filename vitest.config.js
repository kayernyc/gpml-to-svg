import path from 'path';

export default {
  test: {
    globals: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@modules': path.resolve(__dirname, './src/modules/'),
      '@commands': path.resolve(__dirname, './src/commands/'),
      '@projectTypes': path.resolve(__dirname, './src/types/'),
      '@utilities': path.resolve(__dirname, './src/utilities/'),
    },
  },
};
