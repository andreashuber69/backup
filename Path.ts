import { access, lstat, Stats, readdir, rmdir, unlink } from "fs";
import { join } from 'path';

export class Path {
    public constructor(private readonly path: string)
    {       
    }

    public canAccess(): Promise<boolean> {
        return new Promise<boolean>(resolve => access(this.path, err => resolve(err === null)));
    }

    public getStats(): Promise<Stats> {
        return new Promise<Stats>((resolve, reject) => lstat(this.path, (err, stats) => {
            if (err === null) {
                resolve(stats);
            } else {
                reject(err);
            }
        }));
    }
    
    public getFiles(): Promise<Path[]> {
        return new Promise<Path[]>((resolve, reject) => readdir(this.path, (err, files) => {
            if (err === null) {
                resolve(files.map((value, index, array) => new Path(join(this.path, value))));
            } else {
                reject(err);
            }
        }));
    }

    public async delete(): Promise<void> {
        if ((await this.getStats()).isDirectory()) {
            for (let file of await this.getFiles()) {
                await file.delete();
            }

            await this.removeEmptyDirectory();
        } else {
            await this.unlinkFile();
        }
    }

    private removeEmptyDirectory(): Promise<void> {
        return new Promise<void>((resolve, reject) => rmdir(this.path, err => {
            if (err === null) {
                resolve();
            } else {
                reject(err);
            }
        }));
    }

    private unlinkFile(): Promise<void> {
        return new Promise<void>((resolve, reject) => unlink(this.path, err => {
            if (err === null) {
                resolve();
            } else {
                reject(err);
            }
        }));
    }
}