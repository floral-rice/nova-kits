import js from '@eslint/js';
import vue from 'eslint-plugin-vue';
import tseslint from 'typescript-eslint';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import vueParser from 'vue-eslint-parser';
import globals from 'globals';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default [
  js.configs.recommended,

  ...tseslint.configs.recommended,

  ...vue.configs['flat/recommended'],

  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },

  {
    files: ['**/*.{ts,tsx,vue}'],

    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tseslint.parser,
        project: ['./tsconfig.json', './packages/*/tsconfig.json', './docs/tsconfig.json'],

        tsconfigRootDir: __dirname,
        extraFileExtensions: ['.vue'],
      },
    },

    rules: {
      // JS/TS
      'no-console': 'off',
      'no-param-reassign': 'off',
      'no-useless-assignment': 'off', // 关闭 no-useless-assignment 规则，因为 Vue 模板中使用的变量会被误报
      '@typescript-eslint/no-unnecessary-condition': 'error',
      '@typescript-eslint/await-thenable': 'error',

      // TypeScript unsafe 系列只提示 warn
      '@typescript-eslint/no-unsafe-assignment': 'warn',
      '@typescript-eslint/no-unsafe-call': 'warn',
      '@typescript-eslint/no-unsafe-member-access': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      // 关闭默认 JS unused-vars，TS 用 warn
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { varsIgnorePattern: '^_', argsIgnorePattern: '^_' },
      ],
      // Vue 模板绑定变量检查
      'vue/no-unused-vars': 'warn',
      // Vue 组件命名规则：允许单字组件名（如 index.vue）
      'vue/multi-word-component-names': 'off',
      // Vue 模板根节点规则：允许多个根节点（Vue 3 支持）
      'vue/valid-template-root': 'off',
      // 不允许使用 any
      '@typescript-eslint/no-explicit-any': 'off',
      'vue/max-attributes-per-line': [
        'error',
        {
          singleline: {
            max: 3,
          },
          multiline: {
            max: 1,
          },
        },
      ],
    },
  },

  // DataGrid 组件放宽规则（AG Grid API 返回 any 类型较多）
  {
    files: ['**/data-grid/**/*.{ts,vue}'],
    rules: {
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
    },
  },
];
