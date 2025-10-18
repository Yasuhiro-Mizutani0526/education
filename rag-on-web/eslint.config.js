import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";
import jsxRuntime from "eslint-plugin-react/configs/jsx-runtime.js";
import reactRefresh from "eslint-plugin-react-refresh";


export default [
  {
    ignores: ["dist", "node_modules/"]
  },
  pluginJs.configs.recommended,
  {
    ...pluginReactConfig,
    files: ["**/*.{js,jsx,mjs,ts,tsx}"],
    settings: {
      react: {
        version: "detect"
      }
    },
    languageOptions: {
      ...pluginReactConfig.languageOptions,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
      },
    }
  },
  {
    files: ["**/*.{js,jsx,mjs,ts,tsx}"],
    ...jsxRuntime
  },
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    plugins: {
      "react-refresh": reactRefresh,
    },
    rules: {
      "react-refresh/only-export-components": "warn"
    }
  },
];