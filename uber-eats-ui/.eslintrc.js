module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  ignorePatterns: ['dist/', 'node_modules/'],
  rules: {
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'no-console': 'off',
    'no-debugger': 'off',
    'import/prefer-default-export': 'off',
    'import/extensions': ['off'],
    'react/destructuring-assignment': 'off',
  },
};
