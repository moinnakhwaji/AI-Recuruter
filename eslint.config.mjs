import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@typescript-eslint/no-unused-expressions": "off",
      "no-var": "off",
      "react/no-unescaped-entities": "off",
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      '@typescript-eslint/no-require-imports': 'off',
      "react-hooks/exhaustive-deps": "off",
      
      // Disable semicolon rule
      "semi": "off",
      
      // Disable quotes rule for single quotes
      "quotes": "off",
      
      // Disable console rule to allow all console methods
      "no-console": "off",
      
      // Disable the no-this-alias rule
      "@typescript-eslint/no-this-alias": "off",
      
      // Disable the ban-ts-comment rule or allow it with a description
      "@typescript-eslint/ban-ts-comment": ["warn", {
        "ts-expect-error": "allow-with-description"
      }],
      
      // Disable the no-empty-object-type rule
      "@typescript-eslint/no-empty-object-type": "off",
      
      // Disable the unnecessary-type-constraint rule
      "@typescript-eslint/no-unnecessary-type-constraint": "off",
      
      // Disable unsafe-function-type rule
      "@typescript-eslint/no-unsafe-function-type": "off",
    },
  },
];

export default eslintConfig;
