import { expect } from "chai";
// tslint:disable-next-line:no-import-side-effect
import "mocha";
import { Medium } from "./Medium";

describe("Medium", () => {
    describe("get", () => {
        it("should return a Medium instance", () => {
            expect(Medium.get(2, 7, 0) instanceof Medium).to.equal(true);
        });
    });
});
