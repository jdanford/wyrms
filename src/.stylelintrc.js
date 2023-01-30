module.exports = {
    plugins: ["stylelint-scss", "stylelint-prettier"],
    rules: {
        "prettier/prettier": true,
    },
    overrides: [
        {
            files: ["*.scss", "**/*.scss"],
            customSyntax: "postcss-scss",
        },
    ],
};
