import { exec } from "child_process";
import { setTimeout } from "timers";

import type { IExecResult } from "./IExecResult";
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
        const todayMilliseconds = App.getTodayMilliseconds();
        const daysSinceStart = (todayMilliseconds - App.startMilliseconds) / 24 / 60 / 60 / 1000;
        const medium = Medium.get(2, 7, daysSinceStart);
        const mediumName = App.getMediumName(medium);
        // cSpell: ignore logname
        const user = process.env["LOGNAME"];
        const mediumRoot = new Path("/", "media", user ? user : "", mediumName);
        // eslint-disable-next-line @typescript-eslint/init-declarations
        let logger: Logger | undefined;

        try {
            // The await statements cannot be parallelized
            // eslint-disable-next-line no-await-in-loop
            while (!await mediumRoot.canAccess() || !(await mediumRoot.getStats()).isDirectory()) {
                // eslint-disable-next-line no-await-in-loop
                await App.requestInput(`Please insert ${mediumName} and press Enter: `);
            }

            const files =
                (await mediumRoot.getFiles()).filter((p) => !p.path.endsWith("lost+found"));
            const prompt = "Non-empty medium! Delete everything? [Y/n]: ";

            if ((files.length === 0) || (await App.requestInput(prompt)).toLowerCase() !== "n") {
                await Promise.all(files.map(async (file) => await file.delete()));
                const backupScript = new Path(__dirname, "backup");
                const commandLine = `${backupScript.path} ${mediumRoot.path}`;
                const resultPromise = App.exec(commandLine);
                // Allow the external process to start and execute past the empty directory check.
                await App.delay(1000);
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
        } catch (ex: unknown) {
            if (logger) {
                logger.writeLine(`${ex}`);
            } else {
                console.error(`${ex}`);
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

    private static getMediumName({ cacheNumber, slotNumber, serialNumber }: Medium) {
        const serial = String.fromCharCode("a".charCodeAt(0) + serialNumber);

        return `${DayOfWeek[(slotNumber + 1) % 7]}${(cacheNumber + 1)}${serial}`;
    }

    private static async requestInput(prompt: string) {
        process.stdout.write(prompt);

        return await App.getConsoleInput();
    }

    private static async exec(command: string) {
        return await new Promise<IExecResult>(
            (resolve) => exec(command, (error, stdout, stderr) => resolve(App.getResult(error, stdout, stderr))),
        );
    }

    private static getResult(error: Error | null, stdout: string, stderr: string): IExecResult {
        return {
            output: stdout + stderr,
            exitCode: App.isExecError(error) ? error.code : 0,
            exitMessage: error ? error.toString() : "",
        };
    }

    private static isExecError(error: Error | null): error is IExecError {
        return error ? "code" in error : false;
    }

    private static async delay(milliseconds: number) {
        await new Promise<void>((resolve) => setTimeout(resolve, milliseconds));
    }

    private static async getConsoleInput() {
        return await new Promise<string>((resolve) => {
            const stdin = process.openStdin();
            stdin.once("data", (args: { readonly toString: () => string }) => {
                resolve(args.toString().trim());
                stdin.pause();
            });
        });
    }
}

// The catch should never be reached (because we handle all errors in main). If it does, we let the whole thing fail.
App.main().then((exitCode) => (process.exitCode = exitCode)).catch(() => (process.exitCode = 1));
