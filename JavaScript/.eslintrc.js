module.exports = {
    env: {
        browser: true,
    },
    extends: [
        'airbnb',
        'plugin:jsdoc/recommended',
    ],
    rules: {
        indent: ['error', 4, {
            SwitchCase: 1,
        }],
        'jsdoc/require-file-overview': 1,
    },
};
