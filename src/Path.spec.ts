import { expect } from "chai";
// tslint:disable-next-line:no-import-side-effect
import "mocha";
import { Path } from "./Path";

describe("Path", () => {
    let goodPath: Path | undefined;
    let badPath: Path | undefined;

    beforeEach(() => {
        goodPath = new Path(".", "LICENSE");
        badPath = new Path(".", "234987298374");
    });

    describe("canAccess", () => {
        it("should return true", async () => {
            expect(goodPath && await goodPath.canAccess()).to.equal(true);
        });

        it("should return false", async () => {
            expect(badPath && await badPath.canAccess()).to.equal(false);
        });
    });
});
