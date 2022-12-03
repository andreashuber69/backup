import { exec as execCallback } from "child_process";
import type { IExecResult } from "./IExecResult";

interface IExecError extends Error {
    code: number;
}

const isExecError = (error: Error | null): error is IExecError => (error ? "code" in error : false);

const getResult = (error: Error | null, stdout: string, stderr: string): IExecResult =>
    ({
        output: stdout + stderr,
        exitCode: isExecError(error) ? error.code : 0,
        exitMessage: error ? error.toString() : "",
    });

export const exec = async (command: string) =>
    await new Promise<IExecResult>(
        (resolve) => execCallback(command, (error, stdout, stderr) => resolve(getResult(error, stdout, stderr))),
    );
