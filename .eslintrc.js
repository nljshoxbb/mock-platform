module.exports = {
  extends: 'standard-with-typescript',
  parserOptions: {
    project: './tsconfig.json'
  },
  rules: {
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/strict-boolean-expressions': 0,
    '@typescript-eslint/quotes': 0,
    '@typescript-eslint/semi': 0,
    '@typescript-eslint/space-before-function-paren': 0,
    '@typescript-eslint/restrict-plus-operands': 0,
    '@typescript-eslint/restrict-template-expressions': 0,
    '@typescript-eslint/member-delimiter-style': 0,
    '@typescript-eslint/no-floating-promises': 0,
    '@typescript-eslint/return-await': 0,
    '@typescript-eslint/naming-convention': 0,
    '@typescript-eslint/prefer-includes': 0
  }
};
