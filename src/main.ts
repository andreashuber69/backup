// https://github.com/andreashuber69/backup/blob/master/README.md#----backup

import { exec } from "./exec.ts";
import { getMedium } from "./getMedium.ts";
import { getTodayMilliseconds } from "./getTodayMilliseconds.ts";
import { Logger } from "./Logger.ts";
import { Path } from "./Path.ts";
import { requestInput } from "./requestInput.ts";

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
        const archive = new Path(mediumRoot.path, "files.tar.gz");
        const fileAndDirectory = `--file=${archive.path} --directory=/home/${user}`;
        await exec(`tar --create ${fileAndDirectory} Documents Music Pictures`, logger);
        await archive.sync();
        // Ask kernel to drop caches
        await exec(`dd if=${archive.path} iflag=nocache count=0`, logger);
        await exec(`tar --compare ${fileAndDirectory}`, logger);
    }
} catch (error: unknown) {
    const errorString = `${error}`;
    console.error(errorString);

    if (logger) {
        logger.writeLine(errorString);
    }

    process.exitCode = 1;
} finally {
    if (logger) {
        logger.writeOutputMarker("Backup End");
        logger.writeLine();
        await logger.dispose();
    }
}
