import { exec } from "child_process";
import { WriteStream } from "fs";
import * as https from "https";
import { setTimeout } from "timers";
import { ExecResult } from "./ExecResult";
import { Logger } from "./Logger";
import { Medium } from "./Medium";
import { Path } from "./Path";

interface IExecError extends Error {
    code: number;
}

enum DayOfWeek {
    Sunday,
    Monday,
    Tuesday,
    Wednesday,
    Thursday,
    Friday,
    Saturday,
}

class App {
    public static async main() {
        const todayMilliseconds = this.getTodayMilliseconds();
        const daysSinceStart = (todayMilliseconds - this.startMilliseconds) / 24 / 60 / 60 / 1000;
        const medium = Medium.get(2, 7, daysSinceStart);
        const mediumName = this.getMediumName(medium);
        // cSpell: ignore logname
        const user = process.env.LOGNAME;
        const mediumRoot = new Path("/", "media", user ? user : "", mediumName);
        let logger: Logger | undefined;

        try {
            while (!await mediumRoot.canAccess() || !(await mediumRoot.getStats()).isDirectory()) {
                await this.requestInput(`Please insert ${mediumName} and press Enter: `);
            }

            const files = await mediumRoot.getFiles();
            const prompt = "Non-empty medium! Delete everything? [Y/n]: ";

            if ((files.length === 0) || (await this.requestInput(prompt)).toLowerCase() !== "n") {
                for (const file of files) {
                    await file.delete();
                }

                const backupScript = new Path(__dirname, "backup");

                if (!await backupScript.exists()) {
                    await this.downloadFile(
                        "https://raw.githubusercontent.com/andreashuber69/owncloud/master/backup", backupScript);
                    // Set execute bit for the owner
                    await backupScript.changeMode((await backupScript.getStats()).mode | 0o100);
                }

                const commandLine = `${backupScript.path} ${mediumRoot.path}`;
                const resultPromise = this.exec(commandLine);
                // Allow the external process to start and execute past the empty directory check.
                await this.delay(1000);
                logger = await Logger.create(new Path(mediumRoot.path, "log.txt"));
                logger.writeOutputMarker("Backup Start");
                logger.writeMediumInfo(new Date(todayMilliseconds), medium, mediumName);
                logger.writeMessage(`Executing Process: ${commandLine}`);
                const result = await resultPromise;
                logger.writeOutputMarker("Output Start");
                logger.writeLine(result.output);
                logger.writeOutputMarker("Output End");
                logger.writeMessage(`Process Exit Message: ${result.exitMessage}`);
                logger.writeMessage(`Process Exit Code: ${result.exitCode}`);
                logger.writeOutputMarker("Backup End");
                logger.writeLine();

                return result.exitCode;
            }

            return 0;
        } catch (ex) {
            const exceptionString = this.getExceptionString(ex);

            if (logger) {
                logger.writeLine(exceptionString);
            } else {
                console.log(exceptionString);
            }

            return 1;
        } finally {
            if (logger) {
                await logger.dispose();
            }
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static readonly startMilliseconds = Date.UTC(2000, 3, 10);

    private static getTodayMilliseconds() {
        // We want to get the number of full days between start and today. The current timezone should be considered
        // such that when the clock moves past midnight in the current timezone then the number of days between start
        // and today should increase by one. We achieve that by getting the current local year, month and day and then
        // pretend that they are actually UTC numbers. Likewise, we construct the start with Date.UTC.
        const now = new Date();

        return Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
    }

    private static getMediumName(medium: Medium) {
        const serial = String.fromCharCode("a".charCodeAt(0) + medium.serialNumber);

        return `${DayOfWeek[(medium.slotNumber + 1) % 7]}${(medium.cacheNumber + 1)}${serial}`;
    }

    private static requestInput(prompt: string) {
        process.stdout.write(prompt);

        return this.getConsoleInput();
    }

    private static async downloadFile(url: string, path: Path) {
        const writeStream = await path.openWrite();

        try {
            await this.downloadFileImpl(url, writeStream);
        } catch (ex) {
            await path.delete();
            throw ex;
        }
    }

    private static exec(command: string) {
        return new Promise<ExecResult>((resolve) => exec(command, (error: Error | null, stdout, stderr) => resolve(
            this.getResult(error, stdout, stderr))));
    }

    private static getResult(error: Error | null, stdout: string, stderr: string) {
        return new ExecResult(stdout + stderr, this.isExecError(error) ? error.code : 0, error ? error.toString() : "");
    }

    private static isExecError(error: Error | null): error is IExecError {
        return error ? "code" in error : false;
    }

    private static delay(milliseconds: number) {
        return new Promise<void>((resolve) => setTimeout(resolve, milliseconds));
    }

    private static downloadFileImpl(url: string, writeStream: WriteStream) {
        return new Promise<void>((resolve, reject) => {
            let error: Error | undefined = new Error("Unknown error!");

            writeStream.on("close", () => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });

            writeStream.on("finish", () => {
                error = undefined;
                writeStream.close();
            });

            const request = https.get(url, (res) => {
                if (res.statusCode === 200) {
                    res.pipe(writeStream);
                } else {
                    error = new Error(
                        (res.statusCode ? `${res.statusCode}: ` : "") + (res.statusMessage ? res.statusMessage : ""));
                    writeStream.close();
                }
            });

            request.on("error", (err) => {
                error = err;
                writeStream.close();
            });
        });
    }

    private static getConsoleInput() {
        return new Promise<string>((resolve) => {
            const stdin = process.openStdin();
            stdin.once("data", (args: object) => {
                resolve(args.toString().trim());
                stdin.pause();
            });
        });
    }

    private static getExceptionString(ex: any): string {
        const exceptionObject = ex as object;

        return exceptionObject ? exceptionObject.toString() : "Unknown exception!";
    }
}

// The catch should never be reached (because we handle all errors in main). If it does, we let the whole thing fail.
App.main().then((exitCode) => process.exitCode = exitCode).catch((reason) => process.exitCode = 1);