module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    overrides: [
      {
        // feel free to replace with your preferred file pattern - eg. 'src/**/*Slice.ts'
        files: ['src/features/api/*.slice.ts'],
        // avoid state param assignment
        rules: { 'no-param-reassign': ['error', { props: false }] },
      }
    ]
  }
};
