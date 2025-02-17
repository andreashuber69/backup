// https://github.com/andreashuber69/backup/blob/master/README.md#----backup

import { once } from "node:events";
import type { WriteStream } from "node:fs";

import type { Medium } from "./Medium.ts";
import type { Path } from "./Path.ts";

export class Logger {
    public static async create(path: Readonly<Path>) {
        return new Logger(await path.openWrite());
    }

    public async dispose() {
        this.stream.end();
        await once(this.stream, "finish");
        this.stream.close();
        await once(this.stream, "close");
    }

    public writeLine(line = "") {
        this.stream.write(`${line}\n`);
    }

    public writeMessage(message: string) {
        this.writeLine(`${Logger.formatTime(new Date())}  ${message}`);
    }

    public writeMediumInfo(
        today: Readonly<Date>,
        { name, backupCountSinceMediumStart, backupCountUntilMediumEnd }: Medium,
    ) {
        const millisecondsPerDay = 24 * 60 * 60 * 1000;
        this.writeInfoLine("Current Date", Logger.formatDate(today));
        this.writeInfoLine("Medium Name", name);
        const mediumStart = new Date(today.valueOf() - (backupCountSinceMediumStart * millisecondsPerDay));
        this.writeInfoLine("Medium Start", Logger.formatDate(mediumStart));
        const mediumEnd = new Date(today.valueOf() + (backupCountUntilMediumEnd * millisecondsPerDay));
        this.writeInfoLine("Medium End", Logger.formatDate(mediumEnd));
    }

    public writeOutputMarker(marker: string) {
        const lined = ` [${marker}] `;
        const leftPadding = Math.floor((Logger.logWidth - lined.length) / 2);
        const rightPadding = Logger.logWidth - marker.length - leftPadding;
        this.writeLine("#".repeat(Math.max(0, leftPadding)) + lined + "#".repeat(Math.max(0, rightPadding)));
    }

    public async flush() {
        await new Promise<void>((resolve, reject) => this.stream.write("", (e) => (e ? reject(e) : resolve())));
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

    private constructor(private readonly stream: Readonly<WriteStream>) {}

    private writeInfoLine(name: string, value: string) {
        this.writeLine(Logger.formatTitle(name) + value);
    }
}
