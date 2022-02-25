module.exports = {
  extends: "standard-with-typescript",
  parserOptions: {
    project: "./tsconfig.json",
  },
  rules: {
    "@typescript-eslint/explicit-function-return-type": 0,
    "@typescript-eslint/strict-boolean-expressions": 0,
    "@typescript-eslint/quotes": 0,
    "@typescript-eslint/semi": 0,
    "@typescript-eslint/space-before-function-paren":0,
    "@typescript-eslint/restrict-plus-operands":0
  },
};
