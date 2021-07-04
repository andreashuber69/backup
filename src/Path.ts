import { access, chmod, constants, createWriteStream, lstat, mkdir, readdir, rmdir, unlink } from "fs";
import type { Stats } from "fs";
import { join } from "path";

import { Stream } from "./Stream";


export class Path {
    public readonly path: string;

    public constructor(...paths: readonly string[]) {
        this.path = join(...paths);
    }

    public async canAccess() {
        return await new Promise<boolean>((resolve) => void access(this.path, (err) => void resolve(!err)));
    }

    public async canExecute() {
        return await new Promise<boolean>(
            (resolve) => void access(this.path, constants.X_OK, (err) => void resolve(!err)),
        );
    }

    public async getStats() {
        return await new Promise<Stats>(
            (resolve, reject) => void lstat(this.path, (err, stats) => void (err ? reject(err) : resolve(stats))),
        );
    }

    public async getFiles() {
        return await new Promise<Path[]>(
            (resolve, reject) => void readdir(
                this.path,
                (e, f) => void (e ? reject(e) : resolve(f.map((value) => new Path(join(this.path, value))))),
            ),
        );
    }

    public async changeMode(mode: number | string) {
        await new Promise<void>(
            (resolve, reject) => void chmod(this.path, mode, (err) => void (err ? reject(err) : resolve())),
        );
    }

    public async createDirectory() {
        await new Promise<void>(
            (resolve, reject) => void mkdir(this.path, (err) => void (err ? reject(err) : resolve())),
        );
    }

    public async delete() {
        if ((await this.getStats()).isDirectory()) {
            await Promise.all((await this.getFiles()).map(async (file) => void await file.delete()));
            await this.removeEmptyDirectory();
        } else {
            await this.unlinkFile();
        }
    }

    public async openWrite() {
        return await Stream.create(() => createWriteStream(this.path));
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private async removeEmptyDirectory() {
        await new Promise<void>(
            (resolve, reject) => void rmdir(this.path, (err) => void (err ? reject(err) : resolve())),
        );
    }

    private async unlinkFile() {
        await new Promise<void>(
            (resolve, reject) => void unlink(this.path, (err) => void (err ? reject(err) : resolve())),
        );
    }
}
