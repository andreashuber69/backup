import { once } from "node:events";
import { expect } from "chai";

import { Path } from "./Path.js";

type ExpectedArray = readonly [boolean, boolean, boolean];

type PathArray = readonly [Path, Path, Path];

type Method = "canAccess" | "canExecute" | "getFiles" | "getStats" ;

describe("Path", () => {
    let testRunPath: Path;

    before(async () => {
        testRunPath = new Path("test-run");

        if (await testRunPath.canAccess()) {
            await testRunPath.changeMode(0o777);
            await testRunPath.delete();
        }

        await testRunPath.createDirectory();
    });

    const checkResult =
        (method: Method, checker: (sut: Readonly<Path>) => Promise<boolean>, ...expected: ExpectedArray) => {
            describe(method, () => {
                const sut: PathArray = [
                    new Path(".", "234987298374"),
                    new Path(".", "LICENSE"),
                    new Path(".", "src"),
                ];

                for (const [index, path] of sut.entries()) {
                    it(`should evaluate to ${expected[index]} for ${path.path}`, async () => {
                        expect(await checker(path)).to.equal(expected[index]);
                    });
                }
            });
        };

    const getStatsChecker = async (sut: Readonly<Path>) => {
        try {
            return Boolean(await sut.getStats());
        } catch {
            return false;
        }
    };

    const getFilesChecker = async (sut: Readonly<Path>) => {
        try {
            return Boolean(await sut.getFiles());
        } catch {
            return false;
        }
    };

    checkResult("canAccess", async (sut) => await sut.canAccess(), false, true, true);
    checkResult("canExecute", async (sut) => await sut.canExecute(), false, false, true);
    checkResult("getStats", getStatsChecker, false, true, true);
    checkResult("getFiles", getFilesChecker, false, false, true);

    describe("changeMode", () => {
        let sut: Path;
        before(() => (sut = new Path(testRunPath.path, `${Date.now()}`)));

        it("should fail to change the mode of a missing file", async () => {
            try {
                await sut.changeMode(0o777);
            } catch (error: unknown) {
                expect(
                    error instanceof Error && error.message.startsWith("ENOENT: no such file or directory"),
                ).to.equal(true);

                return;
            }

            throw new Error("did not throw as expected");
        });

        it("should change the mode of an existing file", async () => {
            await sut.createDirectory();

            await sut.changeMode(0o000);
            expect((await sut.getStats()).mode & 0o777).to.equal(0o000);
            await sut.changeMode(0o777);
            expect((await sut.getStats()).mode & 0o777).to.equal(0o777);
        });
    });

    describe("createDirectory", () => {
        it("should fail to create an already existing directory", async () => {
            try {
                await testRunPath.createDirectory();
            } catch (error: unknown) {
                expect(
                    error instanceof Error && error.message.startsWith("EEXIST: file already exists"),
                ).to.equal(true);

                return;
            }

            throw new Error("did not throw as expected");
        });
    });

    const createTextFile = async (sut: Readonly<Path>) => {
        const stream = await sut.openWrite();

        stream.write("Test\n");
        stream.end();
        await once(stream, "finish");
        stream.close();
        await once(stream, "close");
    };

    describe("delete", () => {
        let sut: Path;
        let filePath: Path;
        let directoryPath: Path;

        before(async () => {
            sut = new Path(testRunPath.path, `${Date.now()}`);
            await sut.createDirectory();
            filePath = new Path(sut.path, `${Date.now()}.txt`);
            await createTextFile(filePath);
            directoryPath = new Path(sut.path, `${Date.now()}`);
            await directoryPath.createDirectory();

            await sut.changeMode(0o555);
        });

        const expectDeleteToFail = (getSut: () => Path) => {
            it("should fail to delete a file in a read-only directory", async () => {
                try {
                    await getSut().delete();
                } catch (error: unknown) {
                    expect(
                        error instanceof Error && error.message.startsWith("EACCES: permission denied"),
                    ).to.equal(true);

                    return;
                }

                throw new Error("did not throw as expected");
            });
        };

        expectDeleteToFail(() => filePath);
        expectDeleteToFail(() => directoryPath);

        it("should delete an existing non-empty directory", async () => {
            await sut.changeMode(0o777);

            await sut.delete();

            expect(await sut.canAccess()).to.equal(false);
        });
    });

    describe("openWrite", () => {
        it("should open a new file for writing", async () => {
            const sut = new Path(testRunPath.path, `${Date.now()}.txt`);

            await createTextFile(sut);

            const stats = await sut.getStats();
            expect(stats.isDirectory()).to.equal(false);
            expect(stats.isFile()).to.equal(true);
        });

        it("should fail to open a new file in a non-existent directory", async () => {
            const sut = new Path(testRunPath.path, `${Date.now()}`, `${Date.now()}.txt`);

            try {
                await sut.openWrite();
            } catch (error: unknown) {
                expect(
                    error instanceof Error && error.message.startsWith("ENOENT: no such file or directory"),
                ).to.equal(true);

                return;
            }

            throw new Error("did not throw as expected");
        });
    });
});
