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
        this.stream.removeListener("open", this.onOpen).removeListener("error", this.onError);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private stream: T;
    private onOpen: (fd: number) => void;
    private onError: (err: Error) => void;
    private readonly promise: Promise<T>;
}
