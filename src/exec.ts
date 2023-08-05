// https://github.com/andreashuber69/backup/blob/master/README.md#----backup
import { exec as nodeExec } from "node:child_process";
import { promisify } from "node:util";
import type { Logger } from "./Logger.js";

export const exec = async (command: string, logger: Logger) => {
    logger.writeMessage(`Executing Process: ${command}`);
    logger.writeOutputMarker("Output Start");
    await logger.flush();

    try {
        const { stdout, stderr } = await promisify(nodeExec)(command, { encoding: "utf8" });
        logger.writeLine(stdout);
        logger.writeLine(stderr);
    } catch (error: unknown) {
        logger.writeLine(`${error}`);
        throw error;
    } finally {
        logger.writeOutputMarker("Output End");
        await logger.flush();
    }
};
