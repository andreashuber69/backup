import { exec as execCallback } from "child_process";
import type { IExecResult } from "./IExecResult.js";

const getResult = (error: Error | null, stdout: string, stderr: string): IExecResult =>
    ({
        output: stdout + stderr,
        exitCode: error && ("code" in error) && (typeof error.code === "number") ? error.code : 0,
        exitMessage: `${error}`,
    });

export const exec = async (command: string) =>
    await new Promise<IExecResult>(
        (resolve) => execCallback(command, (error, stdout, stderr) => resolve(getResult(error, stdout, stderr))),
    );
