import type { WriteStream } from "fs";

import type { Medium } from "./Medium";
import type { Path } from "./Path";

export class Logger {
    public static async create(path: Readonly<Path>) {
        return new Logger(await path.openWrite());
    }

    public async dispose() {
        await this.end();
        await this.close();
    }

    public writeLine(line = "") {
        this.stream.write(`${line}\n`);
    }

    public writeMessage(message: string) {
        this.writeLine(`${Logger.formatTime(new Date())}  ${message}`);
    }

    public writeMediumInfo(today: Readonly<Date>, medium: Medium, mediumName: string) {
        this.writeInfoLine("Current Date", Logger.formatDate(today));
        this.writeInfoLine("Medium Name", mediumName);
        const mediumStart = new Date(today.valueOf() - medium.backupCountSinceMediumStart * 24 * 60 * 60 * 1000);
        this.writeInfoLine("Medium Start", Logger.formatDate(mediumStart));
        const mediumEnd = new Date(today.valueOf() + medium.backupCountUntilMediumEnd * 24 * 60 * 60 * 1000);
        this.writeInfoLine("Medium End", Logger.formatDate(mediumEnd));
    }

    public writeOutputMarker(marker: string) {
        const lined = ` [${marker}] `;
        const leftPadding = Math.floor((Logger.logWidth - lined.length) / 2);
        const rightPadding = Logger.logWidth - marker.length - leftPadding;
        this.writeLine("#".repeat(Math.max(0, leftPadding)) + lined + "#".repeat(Math.max(0, rightPadding)));
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static readonly logWidth = 120;

    private static formatTitle(title: string) {
        return (`${title}:             `).slice(0, 14);
    }

    private static formatTime(time: Readonly<Date>) {
        const hours = Logger.formatNumber(time.getUTCHours(), 2);
        const minutes = Logger.formatNumber(time.getUTCMinutes(), 2);
        const seconds = Logger.formatNumber(time.getUTCSeconds(), 2);

        return `${hours}:${minutes}:${seconds}.${Logger.formatNumber(time.getUTCMilliseconds(), 3)}`;
    }

    private static formatDate(date: Readonly<Date>) {
        const year = date.getUTCFullYear();
        const month = Logger.formatNumber(date.getUTCMonth() + 1, 2);
        const day = Logger.formatNumber(date.getUTCDate(), 2);

        return `${year}-${month}-${day}`;
    }

    private static formatNumber(num: number, length: number) {
        return (`000${num}`).slice(-length);
    }

    private constructor(private readonly stream: Readonly<WriteStream>) {
    }

    private writeInfoLine(name: string, value: string) {
        this.writeLine(Logger.formatTitle(name) + value);
    }

    private async end() {
        return new Promise<void>((resolve) => this.stream.once("finish", (fd) => resolve()).end());
    }

    private async close() {
        return new Promise<void>((resolve) => this.stream.once("close", resolve).close());
    }
}
