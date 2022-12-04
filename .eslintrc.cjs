// https://github.com/andreashuber69/backup#--
module.exports = {
    extends: [
        "@andreashuber69",
    ],
    rules: {
        // Would make sense if var declarations were allowed (to avoid different behavior in and outside of a loop).
        // Since var declarations are not allowed, we can safely turn this off.
        "init-declarations": "off",
        "@typescript-eslint/init-declarations": "off",
    },
};
