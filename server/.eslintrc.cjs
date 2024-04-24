/* eslint-disable indent */
module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: [
    'airbnb-base',
  ],
  overrides: [
    {
      env: {
        node: true,
      },
      files: [
        '.eslintrc.{js,cjs}',
      ],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    indent: [2, 'tab'],
    'no-tabs': 0,
    camelcase: 'off',
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'always',
        cjs: 'never',
      },
    ],
  },
};
