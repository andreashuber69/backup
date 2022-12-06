import { execSync } from "child_process";
import type { Logger } from "./Logger";

export const exec = async (command: string, logger: Logger) => {
    logger.writeMessage(`Executing Process: ${command}`);
    logger.writeOutputMarker("Output Start");
    await logger.flush();

    try {
        logger.writeLine(execSync(command, { encoding: "utf-8" }));
    } catch (ex: unknown) {
        logger.writeLine(`${ex}`);
        throw ex;
    } finally {
        logger.writeOutputMarker("Output End");
        await logger.flush();
    }
};
