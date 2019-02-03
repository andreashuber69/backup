import { access, chmod, constants, createWriteStream, lstat, mkdir, readdir, rmdir, Stats, unlink } from "fs";
import { join } from "path";
import { Stream } from "./Stream";

export class Path {
    public readonly path: string;

    public constructor(...paths: string[]) {
        this.path = join(...paths);
    }

    public canAccess() {
        return new Promise<boolean>((resolve) => access(this.path, (err) => resolve(!err)));
    }

    public canExecute() {
        return new Promise<boolean>((resolve) => access(this.path, constants.X_OK, (err) => resolve(!err)));
    }

    public getStats() {
        return new Promise<Stats>(
            (resolve, reject) => lstat(this.path, (err, stats) => err ? reject(err) : resolve(stats)));
    }

    public getFiles() {
        return new Promise<Path[]>((resolve, reject) => readdir(this.path, (err, files) =>
            err ? reject(err) : resolve(files.map((value) => new Path(join(this.path, value))))));
    }

    public changeMode(mode: string | number) {
        return new Promise<void>((resolve, reject) => chmod(this.path, mode, (err) => err ? reject(err) : resolve()));
    }

    public createDirectory() {
        return new Promise<void>((resolve, reject) => mkdir(this.path, (err) => err ? reject(err) : resolve()));
    }

    public async delete() {
        if ((await this.getStats()).isDirectory()) {
            for (const file of await this.getFiles()) {
                await file.delete();
            }

            await this.removeEmptyDirectory();
        } else {
            await this.unlinkFile();
        }
    }

    public openWrite() {
        return Stream.create(() => createWriteStream(this.path));
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private removeEmptyDirectory() {
        return new Promise<void>((resolve, reject) => rmdir(this.path, (err) => err ? reject(err) : resolve()));
    }

    private unlinkFile() {
        return new Promise<void>((resolve, reject) => unlink(this.path, (err) => err ? reject(err) : resolve()));
    }
}
