module.exports = {
  extends: ['airbnb-base', 'prettier'],
  parser: 'babel-eslint',

  rules: {
    'consistent-return': 0,
    radix: 0,
    'import/extensions': 0,
    'import/no-unresolved': 0,
    'import/no-absolute-path': 0,
    'no-restricted-syntax': 0,
  },
  env: {
    browser: true,
  },
};
