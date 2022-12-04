import { expect } from "chai";

import { Medium } from "./Medium.js";

const slotNames = ["One", "Two", "Three"] as const;

describe("Medium", () => {
    describe("get", () => {
        it("should return a Medium instance", () => {
            expect(new Medium(slotNames, 2, 0) instanceof Medium).to.equal(true);
        });
    });
});
