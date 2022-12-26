import { exec } from "./exec.js";
import { getMedium } from "./getMedium.js";
import { getTodayMilliseconds } from "./getTodayMilliseconds.js";
import { Logger } from "./Logger.js";
import { Path } from "./Path.js";
import { requestInput } from "./requestInput.js";

const todayMilliseconds = getTodayMilliseconds();
const medium = getMedium(todayMilliseconds);
// cSpell: ignore logname
const user = `${process.env["LOGNAME"]}`;
const mediumRoot = new Path("/", "media", user, medium.name);
let logger: Logger | undefined;

try {
    // The await statements cannot be parallelized
    // eslint-disable-next-line no-await-in-loop
    while (!await mediumRoot.canAccess() || !(await mediumRoot.getStats()).isDirectory()) {
        // eslint-disable-next-line no-await-in-loop
        await requestInput(`Please insert ${medium.name} and press Enter: `);
    }

    const files = (await mediumRoot.getFiles()).filter((p) => !p.path.endsWith("lost+found"));
    const prompt = "Non-empty medium! Delete everything? [Y/n]: ";

    if ((files.length === 0) || (await requestInput(prompt)).toLowerCase() !== "n") {
        await Promise.all(files.map(async (file) => await file.delete()));
        logger = await Logger.create(new Path(mediumRoot.path, "log.txt"));
        logger.writeOutputMarker("Backup Start");
        logger.writeMediumInfo(new Date(todayMilliseconds), medium);
        const fileAndDirectory = `--file=${new Path(mediumRoot.path, "files.tar.gz").path} --directory=/home/${user}`;
        await exec(`tar --create ${fileAndDirectory} Documents Pictures Videos`, logger);
        await exec(`tar --compare ${fileAndDirectory}`, logger);
    }

    process.exitCode = 0;
} catch (error: unknown) {
    console.error(`${error}`);
    process.exitCode = 1;
} finally {
    if (logger) {
        logger.writeOutputMarker("Backup End");
        logger.writeLine();
        await logger.dispose();
    }
}
