// https://github.com/andreashuber69/backup/blob/master/README.md#----backup
import { once } from "node:events";
import { createWriteStream } from "node:fs";
import { access, chmod, constants, lstat, mkdir, readdir, rmdir, unlink } from "node:fs/promises";
import { join } from "node:path";

export class Path {
    public constructor(...paths: readonly string[]) {
        this.path = join(...paths);
    }

    public readonly path: string;

    public async canAccess(fac?: number) {
        try {
            await access(this.path, fac);

            return true;
        } catch {
            return false;
        }
    }

    public async canExecute() {
        return await this.canAccess(constants.X_OK);
    }

    public async getStats() {
        return await lstat(this.path);
    }

    public async getFiles() {
        return (await readdir(this.path)).map((value) => new Path(join(this.path, value)));
    }

    public async changeMode(mode: number | string) {
        await chmod(this.path, mode);
    }

    public async createDirectory() {
        await mkdir(this.path);
    }

    public async delete() {
        if ((await this.getStats()).isDirectory()) {
            await Promise.all((await this.getFiles()).map(async (file) => await file.delete()));
            await this.removeEmptyDirectory();
        } else {
            await this.unlinkFile();
        }
    }

    public async openWrite() {
        const result = createWriteStream(this.path);
        await once(result, "open");

        return result;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private async removeEmptyDirectory() {
        await rmdir(this.path);
    }

    private async unlinkFile() {
        await unlink(this.path);
    }
}
