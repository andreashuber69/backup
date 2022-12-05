import { exec as execCallback } from "child_process";
import type { IExecResult } from "./IExecResult.js";

const getResult = (error: { code?: number | undefined }, stdout: string, stderr: string): IExecResult =>
    ({
        output: stdout + stderr,
        exitCode: error.code ?? 0,
        exitMessage: `${error}`,
    });


export const exec = async (cmd: string) =>
    await new Promise<IExecResult>(
        (resolve) => execCallback(cmd, (error, stdout, stderr) => resolve(getResult(error ?? {}, stdout, stderr))),
    );
