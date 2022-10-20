module.exports = {
    extends: [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:jsx-a11y/recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:import/typescript",
        "plugin:react/jsx-runtime",
        "plugin:prettier/recommended",
        "prettier"
    ],
    parser: "@typescript-eslint/parser",
    plugins: ["react", "@typescript-eslint", "import", "jsx-a11y", "react-hooks", "prettier"],
    rules: {
        "sort-imports": "error"
    },
    settings: {
        react: {
            version: "detect"
        }
    }
};
