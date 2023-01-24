// https://github.com/andreashuber69/backup/blob/master/README.md#----backup
import { once } from "node:events";

export const requestInput = async (prompt: string) => {
    process.stdout.write(prompt);
    const stdin = process.openStdin();
    const result = `${await once(stdin, "data")}`.trim();
    stdin.pause();

    return result;
};
