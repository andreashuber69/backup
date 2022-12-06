import { once } from "events";

export const requestInput = async (prompt: string) => {
    process.stdout.write(prompt);
    const stdin = process.openStdin();
    const result = `${await once(stdin, "data")}`.trim();
    stdin.pause();

    return result;
};
