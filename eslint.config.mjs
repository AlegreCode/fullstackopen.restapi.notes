import js from "@eslint/js";
import globals from "globals";
import { defineConfig, globalIgnores } from "eslint/config";


export default defineConfig([
  globalIgnores(['node_modules', 'dist']),
  { files: ["**/*.{js,mjs,cjs}"], plugins: { js }, extends: ["js/recommended"] },
  { files: ["**/*.js"], languageOptions: { sourceType: "commonjs" } },
  { files: ["**/*.{js,mjs,cjs}"], languageOptions: { globals: globals.browser } },
  { rules: {
    "no-process-env": "off",
    "no-undef": ["error", { "typeof": false}],
  }}
]);
