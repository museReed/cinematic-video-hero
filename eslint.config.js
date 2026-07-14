import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
  {
    // Token discipline: registry components must use semantic token classes only.
    // Raw colors live in themes/ (and PageSpec content values), never in component code.
    files: ['src/component-library/components/**/*.tsx', 'src/page-builder/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: 'Literal[value=/#[0-9A-Fa-f]{3,8}\\b/]',
          message: 'Raw hex color in a registry component. Use semantic token classes (bg-primary, text-foreground, …); color values belong in src/component-library/themes/.',
        },
        {
          selector: 'TemplateElement[value.raw=/#[0-9A-Fa-f]{3,8}/]',
          message: 'Raw hex color in a template string. Use semantic token classes; color values belong in src/component-library/themes/.',
        },
        {
          selector: 'Literal[value=/var\\(--ck-/], TemplateElement[value.raw=/var\\(--ck-/]',
          message: 'Legacy --ck-* variable. The token contract uses --background/--primary/… pairs (see themes/index.ts THEME_VARIABLES).',
        },
      ],
    },
  },
)
