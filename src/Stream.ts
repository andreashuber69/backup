import { EventEmitter } from "events";

export class Stream {
    public static async create<T extends EventEmitter>(create: () => T): Promise<T> {
        const result = create();
        let onOpen: (() => void) | undefined;
        let onError: ((reason?: any) => void) | undefined;

        try {
            await new Promise<void>((resolve, reject) => {
                onOpen = resolve;
                onError = reject;
                result.on("open", onOpen).on("error", onError);
            });

            return result;
        } finally {
            if (onOpen) {
                result.removeListener("open", onOpen);
            }

            if (onError) {
                result.removeListener("error", onError);
            }
        }
    }
}
