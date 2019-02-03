import { expect } from "chai";
import { WriteStream } from "fs";
// tslint:disable-next-line:no-import-side-effect
import "mocha";
import { Path } from "./Path";

type ExpectedArray = [ boolean, boolean, boolean, boolean ];
type PathArray = [ Path, Path, Path, Path ];
type Method = "canAccess" | "canExecute" | "getStats";

describe("Path", async () => {
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

    const testRunPath = new Path("test-run");

    if (await testRunPath.canAccess()) {
        await testRunPath.changeMode(0o777);
        await testRunPath.delete();
    }

    await testRunPath.createDirectory();

    describe("openWrite", () => {
        const end = (stream: WriteStream) => new Promise<void>((resolve) => stream.once("finish", resolve).end());
        const close = (stream: WriteStream) => new Promise<void>((resolve) => stream.once("close", resolve).close());

        it("should open a new file for writing", async () => {
            const path = new Path(testRunPath.path, `${Date.now()}.txt`);
            const stream = await path.openWrite();
            stream.write("Test\n");
            await end(stream);
            await close(stream);

            const stats = await path.getStats();
            expect(stats.isDirectory()).to.equal(false);
            expect(stats.isFile()).to.equal(true);
        });

        it("should fail to open a new file for writing", async () => {
            const path = new Path(testRunPath.path, `${Date.now()}`, `${Date.now()}.txt`);

            try {
                await path.openWrite();
                throw new Error("openWrite did not throw as expected.");
            } catch (e) {
                expect(e instanceof Error && e.message.startsWith("ENOENT: no such file or directory")).to.equal(true);
            }
        });
    });
});
