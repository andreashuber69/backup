// https://github.com/andreashuber69/backup/blob/master/README.md#----backup

import { createInterface } from "node:readline/promises";

export const requestInput = async (prompt: string) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout });

    try {
        return await rl.question(prompt);
    } finally {
        rl.close();
    }
};
