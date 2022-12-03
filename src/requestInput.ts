const getConsoleInput = async () =>
    await new Promise<string>((resolve) => {
        const stdin = process.openStdin();
        stdin.once("data", (args: { readonly toString: () => string }) => {
            resolve(args.toString().trim());
            stdin.pause();
        });
    });

export const requestInput = async (prompt: string) => {
    process.stdout.write(prompt);

    return await getConsoleInput();
};
