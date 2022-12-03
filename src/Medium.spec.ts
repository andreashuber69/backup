import { expect } from "chai";

import { Medium } from "./Medium.js";

describe("Medium", () => {
    describe("get", () => {
        it("should return a Medium instance", () => {
            expect(Medium.get(2, 7, 0) instanceof Medium).to.equal(true);
        });
    });
});
