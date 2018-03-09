import { EventEmitter } from "events";

export class StreamFactory<T extends EventEmitter> {
    public constructor(create: () => T) {
        this.promise = new Promise<T>((resolve, reject) => {
            this.stream = create();
            this.onOpen = (fd) => resolve(this.stream);
            this.onError = reject;
            this.stream.on("open", this.onOpen).on("error", this.onError);
        });
    }

    public get() { return this.promise; }

    public dispose() {
        (this.stream as T).removeListener("open", this.onOpen as (fd: number) => void);
        (this.stream as T).removeListener("error", this.onError as (err: Error) => void);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private stream: T | undefined;
    private onOpen: ((fd: number) => void) | undefined;
    private onError: ((err: Error) => void) | undefined;
    private readonly promise: Promise<T>;
}
