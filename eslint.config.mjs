export default [
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {},
    },
    ignores: ['dist/*'],
    linterOptions: {
      noInlineConfig: true,
      reportUnusedDisableDirectives: 'warn',
    },
    rules: {
      semi: 'error',
      'prefer-const': 'error',
    },
  },
];
