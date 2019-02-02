import { expect } from "chai";
// tslint:disable-next-line:no-import-side-effect
import "mocha";
import { Path } from "./Path";

type ExpectedArray = [ boolean, boolean, boolean, boolean ];
type PathArray = [ Path, Path, Path, Path ];
type Method = "canAccess" | "canExecute" | "getStats";

describe("Path", () => {
    const checkResult = (method: Method, checker: (path: Path) => Promise<boolean>, ...expected: ExpectedArray) => {
        describe(method, () => {
            const paths: PathArray = [
                new Path(".", "234987298374"),
                new Path(".", "LICENSE"),
                new Path(".", "publish"),
                new Path(".", "src"),
            ];

            for (let index = 0; index < paths.length; ++index) {
                it(`should evaluate to ${expected[index]} for ${paths[index].path}`, async () => {
                    expect(await checker(paths[index])).to.equal(expected[index]);
                });
            }
        });
    };

    const getStatsChecker = async (path: Path) => {
        try {
            return !!await path.getStats();
        } catch (e) {
            return false;
        }
    };

    checkResult("canAccess", (path) => path.canAccess(), false, true, true, true);
    checkResult("canExecute", (path) => path.canExecute(), false, false, true, true);
    checkResult("getStats", getStatsChecker, false, true, true, true);
});
