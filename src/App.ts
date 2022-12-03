import { setTimeout } from "timers";

import { exec } from "./exec";
import { getMediumName } from "./getMediumName";
import { Logger } from "./Logger";
import { Medium } from "./Medium";
import { Path } from "./Path";
import { requestInput } from "./requestInput";

const getTodayMilliseconds = () => {
    // We want to get the number of full days between start and today. The current timezone should be considered
    // such that when the clock moves past midnight in the current timezone then the number of days between start
    // and today should increase by one. We achieve that by getting the current local year, month and day and then
    // pretend that they are actually UTC numbers. Likewise, we construct the start with Date.UTC.
    const now = new Date();

    return Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
};

const delay = async (milliseconds: number) => {
    await new Promise<void>((resolve) => setTimeout(resolve, milliseconds));
};

class App {
    public static async main() {
        const startMilliseconds = Date.UTC(2000, 3, 10);
        const todayMilliseconds = getTodayMilliseconds();
        const daysSinceStart = (todayMilliseconds - startMilliseconds) / 24 / 60 / 60 / 1000;
        const medium = Medium.get(2, 7, daysSinceStart);
        const mediumName = getMediumName(medium);
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
                await requestInput(`Please insert ${mediumName} and press Enter: `);
            }

            const files =
                (await mediumRoot.getFiles()).filter((p) => !p.path.endsWith("lost+found"));
            const prompt = "Non-empty medium! Delete everything? [Y/n]: ";

            if ((files.length === 0) || (await requestInput(prompt)).toLowerCase() !== "n") {
                await Promise.all(files.map(async (file) => await file.delete()));
                const backupScript = new Path(__dirname, "backup");
                const commandLine = `${backupScript.path} ${mediumRoot.path}`;
                const resultPromise = exec(commandLine);
                // Allow the external process to start and execute past the empty directory check.
                await delay(1000);
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
}

// The catch should never be reached (because we handle all errors in main). If it does, we let the whole thing fail.
App.main().then((exitCode) => (process.exitCode = exitCode)).catch(() => (process.exitCode = 1));
