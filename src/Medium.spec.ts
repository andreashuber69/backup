// https://github.com/andreashuber69/backup/blob/master/README.md#----backup
import assert from "node:assert";
import { describe, it } from "node:test";

import { Medium } from "./Medium.js";

const check = (slotNames: readonly string[], expectedMediumNames: readonly string[]) => {
    for (const [index, expectedMediumName] of expectedMediumNames.entries()) {
        const medium = new Medium(slotNames, 1, index);
        const { name, backupCountSinceMediumStart, backupCountUntilMediumEnd } = medium;

        it(name, () => {
            assert(name === expectedMediumName);
            assert(backupCountSinceMediumStart === 0);
            assert(backupCountUntilMediumEnd === 0);
        });
    }
};

describe("Medium", () => {
    const slotNames = ["One"] as const;

    describe(`with slot names ${slotNames.join(", ")}`, () => {
        const expectedMediumNames = [
            "One1a",
            "One1b",
            "One1c",
            "One1d",
            "One1e",
            "One1f",
            "One1g",
            "One1h",
            "One1i",
            "One1j",
            "One1k",
            "One1l",
            "One1m",
        ] as const;

        check(slotNames, expectedMediumNames);
    });
});
