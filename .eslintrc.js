

module.exports = {
  "parser": "babel-eslint",
  "env": {
    "es6": true,
    "node": true
  },
  "globals": {
    // "ApiError": true,
  },
  "extends": [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
  ],
  "plugins": [
    "import",
  ],
  "parserOptions": {
    "ecmaVersion": 8,
    "sourceType": "module",
    "ecmaFeatures": {
      "arrowFunctions":true,
      "experimentalObjectRestSpread": true
    }
  },
  "rules": {
    "import/no-unresolved": "off",
    "import/no-named-as-default-member": "off",
    "no-empty": "off",
    "no-undef": "off",
    "no-console": "off",
    "no-dupe-keys": "off",
    "no-control-regex": "off",
    "no-irregular-whitespace": "off",
    "indent": ["warn", 4, { "SwitchCase": 1 }],
    "no-unused-vars": [
      "warn", {
        "ignoreModules": true,
        "argsIgnorePattern": "^(next)"
      }
    ],
    "linebreak-style": [
      "error",
      "unix"
    ],
    "quotes": [
      "warn",
      "single", {
        "avoidEscape": true,
        "allowTemplateLiterals": true
      }],
    "comma-dangle": [
      "warn", {
        "arrays": "always-multiline",
        "objects": "always-multiline",
        "imports": "always-multiline",
        "exports": "never",
        "functions": "ignore"
      }],
  }
};
