// https://github.com/andreashuber69/backup/blob/master/README.md#----backup

import { describe, expect, it } from "vitest";

import { Medium } from "./Medium.ts";

type Expected = readonly [name: string, backupCountSinceMediumStart: number, backupCountUntilMediumEnd: number];

const check = (slotNames: readonly string[], cacheCount: number, expectedMedia: readonly Expected[]) => {
    for (const [index, [expectedName, expectedSince, expectedUntil]] of expectedMedia.entries()) {
        const medium = new Medium(slotNames, cacheCount, index);
        const { name, backupCountSinceMediumStart, backupCountUntilMediumEnd } = medium;

        it(`${index}: ${name}`, () => {
            expect(name).toBe(expectedName);
            expect(backupCountSinceMediumStart).toBe(expectedSince);
            expect(backupCountUntilMediumEnd).toBe(expectedUntil);
        });
    }
};

describe("Medium", () => {
    const slotNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] as const;
    const cacheCount = 2;

    describe(`with slot names ${slotNames.join(", ")} and ${cacheCount} caches`, () => {
        const expectedMedia: readonly Expected[] = [
            ["Monday1a", 721, 0],
            ["Tuesday1a", 602, 119],
            ["Wednesday1a", 483, 238],
            ["Thursday1a", 364, 357],
            ["Friday1a", 245, 476],
            ["Saturday1a", 126, 595],
            ["Sunday1a", 7, 714],
            ["Monday2a", 672, 49],
            ["Tuesday1a", 609, 112],
            ["Wednesday1a", 490, 231],
            ["Thursday1a", 371, 350],
            ["Friday1a", 252, 469],
            ["Saturday1a", 133, 588],
            ["Sunday1a", 14, 707],
            ["Monday2a", 679, 42],
            ["Tuesday2a", 560, 161],
            ["Wednesday1a", 497, 224],
            ["Thursday1a", 378, 343],
            ["Friday1a", 259, 462],
            ["Saturday1a", 140, 581],
            ["Sunday1a", 21, 700],
            ["Monday2a", 686, 35],
            ["Tuesday2a", 567, 154],
            ["Wednesday2a", 448, 273],
            ["Thursday1a", 385, 336],
            ["Friday1a", 266, 455],
            ["Saturday1a", 147, 574],
            ["Sunday1a", 28, 693],
            ["Monday2a", 693, 28],
            ["Tuesday2a", 574, 147],
            ["Wednesday2a", 455, 266],
            ["Thursday2a", 336, 385],
            ["Friday1a", 273, 448],
            ["Saturday1a", 154, 567],
            ["Sunday1a", 35, 686],
            ["Monday2a", 700, 21],
            ["Tuesday2a", 581, 140],
            ["Wednesday2a", 462, 259],
            ["Thursday2a", 343, 378],
            ["Friday2a", 224, 497],
            ["Saturday1a", 161, 560],
            ["Sunday1a", 42, 679],
            ["Monday2a", 707, 14],
            ["Tuesday2a", 588, 133],
            ["Wednesday2a", 469, 252],
            ["Thursday2a", 350, 371],
            ["Friday2a", 231, 490],
            ["Saturday2a", 112, 609],
            ["Sunday1a", 49, 672],
            ["Monday2a", 714, 7],
            ["Tuesday2a", 595, 126],
            ["Wednesday2a", 476, 245],
            ["Thursday2a", 357, 364],
            ["Friday2a", 238, 483],
            ["Saturday2a", 119, 602],
            ["Sunday2a", 0, 721],
            ["Monday2a", 721, 0],
            ["Tuesday2a", 602, 119],
            ["Wednesday2a", 483, 238],
            ["Thursday2a", 364, 357],
            ["Friday2a", 245, 476],
            ["Saturday2a", 126, 595],
            ["Sunday2a", 7, 714],
            ["Monday1b", 0, 721],
        ];

        check(slotNames, cacheCount, expectedMedia);
    });
});
