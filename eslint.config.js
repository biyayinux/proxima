import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-plugin-prettier/recommended';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  prettierConfig, // Intègre Prettier pour éviter les conflits avec ESLint
  globalIgnores(['dist']), // Ignore le dossier dist globalement
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: globals.browser,
      parserOptions: {
        project: './tsconfig.json', // Indique le projet TypeScript
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      reactHooks,
      reactRefresh,
      tseslint,
    },
    rules: {
      // Ajoutez ici vos règles personnalisées ou désactivez celles qui posent problème
      'prettier/prettier': 'error', // Affiche les erreurs Prettier comme des erreurs ESLint
    },
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
      'plugin:prettier/recommended', // Assure la priorité de Prettier
    ],
  },
]);
