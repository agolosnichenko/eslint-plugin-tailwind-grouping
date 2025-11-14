import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  // Global ignores first
  {
    ignores: ['dist/**', 'node_modules/**', 'coverage/**', 'examples/**']
  },

  // Base configs
  eslint.configs.recommended,
  ...tseslint.configs.recommended,

  // Type-checked rules for non-test files only
  {
    files: ['**/*.ts', '**/*.tsx'],
    ignores: ['**/*.test.ts', '**/*.spec.ts'],
    extends: [tseslint.configs.recommendedTypeChecked],
    languageOptions: {
      parserOptions: {
        projectService: true
      }
    },
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', {argsIgnorePattern: '^_'}],
      '@typescript-eslint/no-non-null-assertion': 'warn'
    }
  }
);