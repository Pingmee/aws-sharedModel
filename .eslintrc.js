module.exports = {
    env: {
        browser: true, // Enables browser global variables like 'window' and 'document'
        es2021: true, // Supports ES2021 syntax
        node: true, // Enables Node.js global variables and Node.js scoping
    },
    extends: [
        'eslint:recommended', // Uses recommended ESLint rules
        'plugin:@typescript-eslint/recommended', // Recommended rules for TypeScript
        'plugin:prettier/recommended', // Integrates with Prettier for code formatting
    ],
    parser: '@typescript-eslint/parser', // Specifies the ESLint parser for TypeScript
    parserOptions: {
        ecmaVersion: 12, // Supports modern ECMAScript features
        sourceType: 'module', // Allows the use of import/export syntax
    },
    plugins: [
        '@typescript-eslint', // Adds TypeScript-specific linting rules
        'prettier', // Enables Prettier integration
    ],
    rules: {
        'no-console': 'warn', // Warns when 'console.log' is used
        'no-unused-vars': 'warn', // Warns about unused variables
        'prettier/prettier': 'error', // Marks Prettier issues as errors
        '@typescript-eslint/no-unused-vars': ['warn'], // Handles unused vars in TS
        '@typescript-eslint/explicit-module-boundary-types': 'off', // Disables the need to explicitly type functions
    },
};