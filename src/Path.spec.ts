import { expect } from "chai";
// tslint:disable-next-line:no-import-side-effect
import "mocha";
import { Path } from "./Path";

type ExpectedArray = [ boolean, boolean, boolean, boolean ];
type PathArray = [ Path, Path, Path, Path ];
type Method = "canAccess" | "canExecute" | "getStats";

describe("Path", () => {
    const checkResult = <T extends Method>(method: T, ...expected: ExpectedArray) => {
        describe(method, () => {
            const paths: PathArray = [
                new Path(".", "234987298374"),
                new Path(".", "LICENSE"),
                new Path(".", "publish"),
                new Path(".", "src"),
            ];

            for (let index = 0; index < paths.length; ++index) {
                it(`should return ${expected[index]} for ${paths[index].path}`, async () => {
                    expect(!!await paths[index][method]()).to.equal(expected[index]);
                });
            }
        });
    };

    checkResult("canAccess", false, true, true, true);
    checkResult("canExecute", false, false, true, true);
});
