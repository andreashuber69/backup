// https://github.com/andreashuber69/backup/blob/master/README.md#----backup
import { execSync } from "node:child_process";
import type { Logger } from "./Logger";

export const exec = async (command: string, logger: Logger) => {
    logger.writeMessage(`Executing Process: ${command}`);
    logger.writeOutputMarker("Output Start");
    await logger.flush();

    try {
        logger.writeLine(execSync(command, { encoding: "utf8" }));
    } catch (error: unknown) {
        logger.writeLine(`${error}`);
        throw error;
    } finally {
        logger.writeOutputMarker("Output End");
        await logger.flush();
    }
};
