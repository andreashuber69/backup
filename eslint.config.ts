// https://github.com/andreashuber69/backup/blob/master/README.md#----backup

import config from "@andreashuber69/eslint-config";

// eslint-disable-next-line import/no-anonymous-default-export, import/no-default-export
export default [
    ...config,
    {
        ignores: ["coverage/", "test-run/"],
    },
];
