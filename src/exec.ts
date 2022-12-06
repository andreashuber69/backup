import { execSync } from "child_process";
import type { Logger } from "./Logger";

export const exec = (command: string, logger: Logger) => {
    logger.writeMessage(`Executing Process: ${command}`);
    logger.writeOutputMarker("Output Start");

    try {
        logger.writeLine(execSync(command, { encoding: "utf-8" }));
    } catch (ex: unknown) {
        logger.writeLine(`${ex}`);
    } finally {
        logger.writeOutputMarker("Output End");
    }
};
