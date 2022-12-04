import { dirname } from "path";
import { fileURLToPath } from "url";

import { delay } from "./delay.js";
import { exec } from "./exec.js";
import { Logger } from "./Logger.js";
import { Medium } from "./Medium.js";
import { Path } from "./Path.js";
import { requestInput } from "./requestInput.js";

const getTodayMilliseconds = () => {
    // We want to get the number of full days between start and today. The current timezone should be considered
    // such that when the clock moves past midnight in the current timezone then the number of days between start
    // and today should increase by one. We achieve that by getting the current local year, month and day and then
    // pretend that they are actually UTC numbers. Likewise, we construct the start with Date.UTC.
    const now = new Date();

    return Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
};

const startMilliseconds = Date.UTC(2000, 3, 10);
const todayMilliseconds = getTodayMilliseconds();
const daysSinceStart = (todayMilliseconds - startMilliseconds) / 24 / 60 / 60 / 1000;

const slotNames = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
] as const;

const medium = new Medium(slotNames, 2, daysSinceStart);
// cSpell: ignore logname
const user = process.env["LOGNAME"];
const mediumRoot = new Path("/", "media", user ? user : "", medium.name);
let logger: Logger | undefined;

const scriptFolder = dirname(fileURLToPath(import.meta.url));

try {
    // The await statements cannot be parallelized
    // eslint-disable-next-line no-await-in-loop
    while (!await mediumRoot.canAccess() || !(await mediumRoot.getStats()).isDirectory()) {
        // eslint-disable-next-line no-await-in-loop
        await requestInput(`Please insert ${medium.name} and press Enter: `);
    }

    const files =
        (await mediumRoot.getFiles()).filter((p) => !p.path.endsWith("lost+found"));
    const prompt = "Non-empty medium! Delete everything? [Y/n]: ";

    if ((files.length === 0) || (await requestInput(prompt)).toLowerCase() !== "n") {
        await Promise.all(files.map(async (file) => await file.delete()));
        const backupScript = new Path(scriptFolder, "backup");
        const commandLine = `${backupScript.path} ${mediumRoot.path}`;
        const resultPromise = exec(commandLine);
        // Allow the external process to start and execute past the empty directory check.
        await delay(1000);
        logger = await Logger.create(new Path(mediumRoot.path, "log.txt"));
        logger.writeOutputMarker("Backup Start");
        logger.writeMediumInfo(new Date(todayMilliseconds), medium, medium.name);
        logger.writeMessage(`Executing Process: ${commandLine}`);
        const result = await resultPromise;
        logger.writeOutputMarker("Output Start");
        logger.writeLine(result.output);
        logger.writeOutputMarker("Output End");
        logger.writeMessage(`Process Exit Message: ${result.exitMessage}`);
        logger.writeMessage(`Process Exit Code: ${result.exitCode}`);
        logger.writeOutputMarker("Backup End");
        logger.writeLine();

        process.exitCode = result.exitCode;
    } else {
        process.exitCode = 0;
    }
} catch (ex: unknown) {
    if (logger) {
        logger.writeLine(`${ex}`);
    } else {
        console.error(`${ex}`);
    }

    process.exitCode = 1;
} finally {
    await logger?.dispose();
}
