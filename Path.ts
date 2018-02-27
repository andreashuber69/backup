import { access, exists, lstat, Stats, readdir, createWriteStream, rmdir, unlink, WriteStream } from "fs";
import { join } from "path";
import { EventEmitter } from "events";

export class Path {
    public readonly path: string;

    public constructor(...paths: string[]) {
        this.path = join(...paths);
    }

    public canAccess() {
        return new Promise<boolean>(resolve => access(this.path, err => resolve(err === null)));
    }

    public exists() {
        return new Promise<boolean>(resolve => exists(this.path, resolve));
    }

    public getStats() {
        return new Promise<Stats>((resolve, reject) => lstat(this.path, (err, stats) => {
            if (err === null) {
                resolve(stats);
            } else {
                reject(err);
            }
        }));
    }
    
    public getFiles() {
        return new Promise<Path[]>((resolve, reject) => readdir(this.path, (err, files) => {
            if (err === null) {
                resolve(files.map((value, index, array) => new Path(join(this.path, value))));
            } else {
                reject(err);
            }
        }));
    }

    public async delete() {
        if ((await this.getStats()).isDirectory()) {
            for (let file of await this.getFiles()) {
                await file.delete();
            }

            await this.removeEmptyDirectory();
        } else {
            await this.unlinkFile();
        }
    }

    public async openWrite() {
        const factory = new StreamFactory(() => createWriteStream(this.path));

        try {
            return await factory.get();
        } finally {
            factory.dispose();
        }
    }

    private removeEmptyDirectory() {
        return new Promise<void>((resolve, reject) => rmdir(this.path, err => {
            if (err === null) {
                resolve();
            } else {
                reject(err);
            }
        }));
    }

    private unlinkFile() {
        return new Promise<void>((resolve, reject) => unlink(this.path, err => {
            if (err === null) {
                resolve();
            } else {
                reject(err);
            }
        }));
    }
}

class StreamFactory<T extends EventEmitter> {
    private stream: T;
    private onOpen: (fd: number) => void;
    private onError: (err: Error) => void;
    private readonly promise: Promise<T>;

    public constructor(create: () => T) {
        this.promise = new Promise<T>((resolve, reject) => {
            this.stream = create();
            this.onOpen = fd => resolve(this.stream);
            this.onError = err => reject(err);
            this.stream.on("open", this.onOpen).on("error", this.onError); 
        });
    }

    public get() { return this.promise; }

    public dispose() {
        this.stream.removeListener("open", this.onOpen).removeListener("error", this.onError);
    }
}
