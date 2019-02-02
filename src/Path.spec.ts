import { expect } from "chai";
// tslint:disable-next-line:no-import-side-effect
import "mocha";
import { Path } from "./Path";

describe("Path", () => {
    const check = (method: "canAccess" | "canExecute", ...expected: [ boolean, boolean, boolean ]) => {
        describe(method, () => {
            const paths = [ new Path(".", "234987298374"), new Path(".", "LICENSE"), new Path(".", "publish") ];

            for (let index = 0; index < paths.length; ++index) {
                it(`should return ${expected[index]}`, async () => {
                    expect(await paths[index][method]()).to.equal(expected[index]);
                });
            }
        });
    };

    check("canAccess", false, true, true);
    check("canExecute", false, false, true);
});
