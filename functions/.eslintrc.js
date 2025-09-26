module.exports = {
  env: {
    es2021: true,
    node: true, // ✅ allow require/module/exports
  },
  extends: ["eslint:recommended"],
  parserOptions: {
    ecmaVersion: "latest",
  },
  rules: {},
};
