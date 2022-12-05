import { expect } from "chai";

import { Medium } from "./Medium.js";

const createMedium = (backupCount: number) => {
    const slotNames = ["One"] as const;

    return new Medium(slotNames, 1, backupCount);
};

const checkProperties = (medium: Medium, expectedName: string) => {
    const { name, backupCountSinceMediumStart, backupCountUntilMediumEnd } = medium;
    expect(name).to.equal(expectedName);
    expect(backupCountSinceMediumStart).to.equal(0);
    expect(backupCountUntilMediumEnd).to.equal(0);
};

describe("Medium", () => {
    const expectedNames = [
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
        "One1n",
        "One1o",
        "One1p",
        "One1q",
        "One1r",
        "One1s",
        "One1t",
        "One1u",
        "One1v",
        "One1w",
        "One1x",
        "One1y",
        "One1z",
    ] as const;

    for (let index = 0; index < expectedNames.length; ++index) {
        const medium = createMedium(index);

        it(medium.name, () => {
            checkProperties(medium, expectedNames[index] ?? "");
        });
    }
});
