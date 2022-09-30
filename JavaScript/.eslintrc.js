module.exports = {
    env: {
        browser: true,
    },
    extends: [
        'airbnb',
        'plugin:jsdoc/recommended',
    ],
    rules: {
        'max-len': [2, {
            'code': 120,
            'comments': 120,
            'commentLength': 120,
            'tabWidth': 4,
            'ignoreUrls': false,
            'ignorePattern': null,
            'ignoreTrailingComments': false,
            'ignoreComments': false
        }],
        indent: ['error', 4, {
            SwitchCase: 1,
        }],
        'jsdoc/require-file-overview': 1,
    },
};
