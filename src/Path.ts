import { access, chmod, constants, createWriteStream, lstat, mkdir, readdir, rmdir, Stats, unlink } from "fs";
import { join } from "path";

import { Stream } from "./Stream";

export class Path {
    public readonly path: string;

    public constructor(...paths: readonly string[]) {
        this.path = join(...paths);
    }

    public async canAccess() {
        return new Promise<boolean>((resolve) => access(this.path, (err) => resolve(!err)));
    }

    public async canExecute() {
        return new Promise<boolean>((resolve) => access(this.path, constants.X_OK, (err) => resolve(!err)));
    }

    public async getStats() {
        return new Promise<Stats>(
            (resolve, reject) => lstat(this.path, (err, stats) => err ? reject(err) : resolve(stats))
        );
    }

    public async getFiles() {
        return new Promise<Path[]>((resolve, reject) => readdir(this.path, (err, files) =>
            err ? reject(err) : resolve(files.map((value) => new Path(join(this.path, value))))));
    }

    public async changeMode(mode: string | number) {
        return new Promise<void>((resolve, reject) => chmod(this.path, mode, (err) => err ? reject(err) : resolve()));
    }

    public async createDirectory() {
        return new Promise<void>((resolve, reject) => mkdir(this.path, (err) => err ? reject(err) : resolve()));
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
        return new Promise<void>((resolve, reject) => rmdir(this.path, (err) => err ? reject(err) : resolve()));
    }

    private async unlinkFile() {
        return new Promise<void>((resolve, reject) => unlink(this.path, (err) => err ? reject(err) : resolve()));
    }
}
