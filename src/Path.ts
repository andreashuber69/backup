import { access, chmod, constants, createWriteStream, lstat, mkdir, readdir, rmdir, Stats, unlink } from "fs";
import { join } from "path";

import { Stream } from "./Stream";

export class Path {
    public readonly path: string;

    public constructor(...paths: readonly string[]) {
        this.path = join(...paths);
    }

    public async canAccess() {
        return new Promise<boolean>((resolve) => void access(this.path, (err) => void resolve(!err)));
    }

    public async canExecute() {
        return new Promise<boolean>((resolve) => void access(this.path, constants.X_OK, (err) => void resolve(!err)));
    }

    public async getStats() {
        return new Promise<Stats>(
            (resolve, reject) => void lstat(this.path, (err, stats) => void (err ? reject(err) : resolve(stats))),
        );
    }

    public async getFiles() {
        return new Promise<Path[]>(
            (resolve, reject) => void readdir(
                this.path,
                (e, f) => void (e ? reject(e) : resolve(f.map((value) => new Path(join(this.path, value))))),
            ),
        );
    }

    public async changeMode(mode: string | number) {
        return new Promise<void>(
            (resolve, reject) => void chmod(this.path, mode, (err) => void (err ? reject(err) : resolve())),
        );
    }

    public async createDirectory() {
        return new Promise<void>(
            (resolve, reject) => void mkdir(this.path, (err) => void (err ? reject(err) : resolve())),
        );
    }

    public async delete() {
        if ((await this.getStats()).isDirectory()) {
            await Promise.all((await this.getFiles()).map(async (file) => file.delete()));
            await this.removeEmptyDirectory();
        } else {
            await this.unlinkFile();
        }
    }

    public async openWrite() {
        return Stream.create(() => createWriteStream(this.path));
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private async removeEmptyDirectory() {
        return new Promise<void>(
            (resolve, reject) => void rmdir(this.path, (err) => void (err ? reject(err) : resolve())),
        );
    }

    private async unlinkFile() {
        return new Promise<void>(
            (resolve, reject) => void unlink(this.path, (err) => void (err ? reject(err) : resolve())),
        );
    }
}
