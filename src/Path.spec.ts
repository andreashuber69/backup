import { expect } from "chai";
// tslint:disable-next-line:no-import-side-effect
import "mocha";
import { Path } from "./Path";

describe("Path", () => {
    const checkPermissions =
        (method: "canAccess" | "canExecute", ...expected: [ boolean, boolean, boolean, boolean ]) => {
            describe(method, () => {
                const paths = [
                    new Path(".", "234987298374"),
                    new Path(".", "LICENSE"),
                    new Path(".", "publish"),
                    new Path(".", "src"),
                ];

                for (let index = 0; index < paths.length; ++index) {
                    it(`should return ${expected[index]}`, async () => {
                        expect(await paths[index][method]()).to.equal(expected[index]);
                    });
                }
            });
        };

    checkPermissions("canAccess", false, true, true, true);
    checkPermissions("canExecute", false, false, true, true);
});
