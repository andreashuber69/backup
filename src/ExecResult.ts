export class ExecResult {
    public constructor(
        public readonly output: string, public readonly exitCode: number, public readonly exitMessage: string) {}
}
