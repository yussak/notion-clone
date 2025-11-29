import tseslint from "typescript-eslint";

export default [
  {
    ignores: ["src/generated/**"],
  },
  ...tseslint.configs.recommended,
  {
    rules: {
      // 未使用変数の禁止
      "no-unused-vars": "error",
    },
  },
];
