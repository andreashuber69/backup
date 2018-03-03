import { EventEmitter } from "events";

export class StreamFactory<T extends EventEmitter> {
    private stream: T;
    private onOpen: (fd: number) => void;
    private onError: (err: Error) => void;
    private readonly promise: Promise<T>;

    public constructor(create: () => T) {
        this.promise = new Promise<T>((resolve, reject) => {
            this.stream = create();
            this.onOpen = (fd) => resolve(this.stream);
            this.onError = (err) => reject(err);
            this.stream.on("open", this.onOpen).on("error", this.onError);
        });
    }

    public get() { return this.promise; }

    public dispose() {
        this.stream.removeListener("open", this.onOpen).removeListener("error", this.onError);
    }
}
