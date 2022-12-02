// https://github.com/andreashuber69/backup#--
module.exports = {
    extends: [
        "@andreashuber69",
    ],
    rules: {
        "@typescript-eslint/parameter-properties": [
            "error",
            {
                "prefer": "parameter-property",
            },
        ],
    },
};
