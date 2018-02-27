import { Path } from "./Path";
import { Medium } from "./Medium";
import { WriteStream } from "fs";

export class Logger {
    private static readonly logWidth = 120;

    public static async create(path: Path) {
        return new Logger(await path.openWrite());
    }

    public dispose() {
        this.stream.close();
    }

    public writeLine(line: string = "") {
        this.stream.write(line + "\n");
    }

    public writeMessage(message: string) {
        this.writeLine(Logger.formatTime(new Date()) + "  " + message);
    }

    public writeMediumInfo(today: Date, medium: Medium, mediumName: string) {
        this.writeInfoLine("Current Date", Logger.formatDate(today));
        this.writeInfoLine("Medium Name", mediumName);
        const mediumStart = new Date(today.valueOf() - medium.backupCountSinceMediumStart * 24 * 60 * 60 * 1000);
        this.writeInfoLine("Medium Start", Logger.formatDate(mediumStart));
        const mediumEnd = new Date(today.valueOf() + medium.backupCountUntilMediumEnd * 24 * 60 * 60 * 1000);
        this.writeInfoLine("Medium End", Logger.formatDate(mediumEnd));
    }

    private writeInfoLine(name: string, value: string) {
        this.writeLine(Logger.formatTitle(name) + value); 
    }

    private static formatTitle(title: string) {
        return (title + ":            ").slice(0, 13);
    }

    private static formatTime(time: Date) {
        const hours = Logger.formatNumber(time.getUTCHours(), 2);
        const minutes = Logger.formatNumber(time.getUTCMinutes(), 2);
        const seconds = Logger.formatNumber(time.getUTCSeconds(), 2);
        const milliSeconds = Logger.formatNumber(time.getUTCMilliseconds(), 3);
        return `${hours}:${minutes}:${seconds}.${milliSeconds}`;
    }

    private static formatDate(date: Date) {
        const year = date.getUTCFullYear();
        const month = Logger.formatNumber(date.getUTCMonth() + 1, 2);
        const day = Logger.formatNumber(date.getUTCDate(), 2);
        return `${year}-${month}-${day}`;
    }

    private static formatNumber(num: number, length: number) {
        return ('000' + num).slice(-length);
    }

    private constructor(private readonly stream: WriteStream) {
    }
}
