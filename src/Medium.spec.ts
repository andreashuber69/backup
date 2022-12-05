import { expect } from "chai";

import { Medium } from "./Medium.js";

const check = (slotNames: readonly string[], expectedMediumNames: readonly string[]) => {
    for (let index = 0; index < expectedMediumNames.length; ++index) {
        const medium = new Medium(slotNames, 1, index);
        const { name, backupCountSinceMediumStart, backupCountUntilMediumEnd } = medium;

        it(name, () => {
            expect(name).to.equal(expectedMediumNames[index]);
            expect(backupCountSinceMediumStart).to.equal(0);
            expect(backupCountUntilMediumEnd).to.equal(0);
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
