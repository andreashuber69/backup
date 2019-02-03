import { expect } from "chai";
import { WriteStream } from "fs";
// tslint:disable-next-line:no-import-side-effect
import "mocha";
import { Path } from "./Path";

type ExpectedArray = [ boolean, boolean, boolean, boolean ];
type PathArray = [ Path, Path, Path, Path ];
type Method = "canAccess" | "canExecute" | "getStats" | "getFiles";

describe("Path", async () => {
    const checkResult = (method: Method, checker: (sut: Path) => Promise<boolean>, ...expected: ExpectedArray) => {
        describe(method, () => {
            const sut: PathArray = [
                new Path(".", "234987298374"),
                new Path(".", "LICENSE"),
                new Path(".", "publish"),
                new Path(".", "src"),
            ];

            for (let index = 0; index < sut.length; ++index) {
                it(`should evaluate to ${expected[index]} for ${sut[index].path}`, async () => {
                    expect(await checker(sut[index])).to.equal(expected[index]);
                });
            }
        });
    };

    const getStatsChecker = async (sut: Path) => {
        try {
            return !!await sut.getStats();
        } catch (e) {
            return false;
        }
    };

    const getFilesChecker = async (sut: Path) => {
        try {
            return !!await sut.getFiles();
        } catch (e) {
            return false;
        }
    };

    checkResult("canAccess", (sut) => sut.canAccess(), false, true, true, true);
    checkResult("canExecute", (sut) => sut.canExecute(), false, false, true, true);
    checkResult("getStats", getStatsChecker, false, true, true, true);
    checkResult("getFiles", getFilesChecker, false, false, false, true);

    const testRunPath = new Path("test-run");

    if (await testRunPath.canAccess()) {
        await testRunPath.changeMode(0o777);
        await testRunPath.delete();
    }

    await testRunPath.createDirectory();

    describe("changeMode", () => {
        const sut = new Path(testRunPath.path, `${Date.now()}`);

        it ("should fail to change the mode of a missing file", async () => {
            try {
                await sut.changeMode(0o777);
                throw new Error("did not throw as expected");
            } catch (e) {
                expect(e instanceof Error && e.message.startsWith("ENOENT: no such file or directory")).to.equal(true);
            }
        });

        it("should change the mode of an existing file", async () => {
            await sut.createDirectory();

            await sut.changeMode(0o000);
            expect((await sut.getStats()).mode & 0o777).to.equal(0o000);
            await sut.changeMode(0o777);
            expect((await sut.getStats()).mode & 0o777).to.equal(0o777);
        });
    });

    describe("openWrite", () => {
        const end = (stream: WriteStream) => new Promise<void>((resolve) => stream.once("finish", resolve).end());
        const close = (stream: WriteStream) => new Promise<void>((resolve) => stream.once("close", resolve).close());

        it("should open a new file for writing", async () => {
            const sut = new Path(testRunPath.path, `${Date.now()}.txt`);

            const stream = await sut.openWrite();
            stream.write("Test\n");
            await end(stream);
            await close(stream);

            const stats = await sut.getStats();
            expect(stats.isDirectory()).to.equal(false);
            expect(stats.isFile()).to.equal(true);
        });

        it("should fail to open a new file for writing", async () => {
            const sut = new Path(testRunPath.path, `${Date.now()}`, `${Date.now()}.txt`);

            try {
                await sut.openWrite();
                throw new Error("did not throw as expected");
            } catch (e) {
                expect(e instanceof Error && e.message.startsWith("ENOENT: no such file or directory")).to.equal(true);
            }
        });
    });
});
