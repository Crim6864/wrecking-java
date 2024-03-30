module.exports = {
    env: {
      browser: true,
      es6: true,
    },
    extends: [
      'eslint:recommended',
      'plugin:security/recommended'
    ],
    parserOptions: {
      ecmaVersion: 6,
      sourceType: 'module',
    },
    ignorePatterns: ["*.html"], // Add this line to ignore HTML files
  };
  