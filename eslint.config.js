import generalConfig from "@andreashuber69/eslint-config";

const config = [
    ...generalConfig,
    {
        ignores: ["coverage/", "test-run/"],
    },
];

// eslint-disable-next-line import/no-default-export
export default config;
