import type { ExecException } from "child_process";
import { exec as execCallback } from "child_process";

interface IExecResult {
    readonly output: string;
    readonly exitCode: number;
    readonly exitMessage: string;
}

const getResult = (error: ExecException | null, stdout: string, stderr: string) =>
    ({
        output: stdout + stderr,
        exitCode: error?.code ?? 0,
        exitMessage: `${error}`,
    });


export const exec = async (cmd: string) =>
    await new Promise<IExecResult>(
        (resolve) => execCallback(cmd, (error, stdout, stderr) => resolve(getResult(error, stdout, stderr))),
    );
