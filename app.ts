import { Medium } from "./Medium";
import { Path } from "./Path";
import { Logger } from "./Logger";
import { WriteStream } from "fs";
import { exec } from "child_process";
import * as https from "https";

class App {
    private static readonly startMilliseconds = Date.UTC(2000, 3, 10); 

    public static async main() {
        const todayMilliseconds = this.getTodayMilliseconds();
        const daysSinceStart = (todayMilliseconds - this.startMilliseconds) / 24 / 60 / 60 / 1000;
        const medium = Medium.get(2, 7, daysSinceStart);
        const mediumName = this.getMediumName(medium);
        const mediumRoot = new Path("/", "media", "andreas", mediumName);
        let logger: Logger | undefined;

        try {
            while (!await mediumRoot.canAccess() || !(await mediumRoot.getStats()).isDirectory()) {
                await this.requestInput("Please insert " + mediumName + " and press Enter: ");
            }
    
            const files = await mediumRoot.getFiles();
            const prompt = "Non-empty medium! Delete everything? [Y/n]: ";

            if ((files.length === 0) || (await this.requestInput(prompt)).toLowerCase() !== "n") {
                for (let file of files) {
                    await file.delete();
                }

                logger = await Logger.create(new Path(mediumRoot.path, "log.txt"));
                const backupScript = new Path(__dirname, "backup");

                if (!await backupScript.exists()) {
                    await this.downloadFile(
                        "https://raw.githubusercontent.com/andreashuber69/owncloud/master/backup", backupScript);
                }

                logger.writeOutputMarker("Backup Start");
                logger.writeMediumInfo(new Date(this.getTodayMilliseconds()), medium, mediumName);
                const commandLine = backupScript.path + " " + mediumRoot.path;
                logger.writeMessage("Executing process: " + commandLine);
                var result = await this.exec(commandLine);
                logger.writeOutputMarker("Output Start");
                logger.writeLine(result.output);
                logger.writeOutputMarker("Output End");
                logger.writeMessage("Exit code: " + result.exitCode);
                logger.writeOutputMarker("Backup End");
                logger.writeLine();
                return result.exitCode;
            }

            return 0;
        } catch (ex) {
            if (logger) {
                logger.writeLine(ex);
            }

            return 1;
        }
        finally {
            if (logger)
            {
                await logger.dispose();
            }
        }
    }

    private static getTodayMilliseconds() {
        // We want to get the number of full days between start and today. The current timezone should be considered
        // such that when the clock moves past midnight in the current timezone then the number of days between start
        // and today should increase by one. We achieve that by getting the current local year, month and day and then
        // pretend that they are actually UTC numbers. Likewise, we construct the start with Date.UTC. 
        const now = new Date();
        return Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
    }

    private static getMediumName(medium: Medium) {
        return DayOfWeek[(medium.slotNumber + 1) % 7] + (medium.cacheNumber + 1) +
            String.fromCharCode("a".charCodeAt(0) + medium.serialNumber);
    }

    private static requestInput(prompt: string) {
        process.stdout.write(prompt);
        return this.getConsoleInput();
    }

    private static async downloadFile(url: string, path: Path) {
        const writeStream = await path.openWrite();

        try {
            await this.downloadFileImpl(url, writeStream);
        } catch (ex) {
            path.delete();
            throw ex;
        }
    }

    private static exec(command: string) {
        return new Promise<ExecResult>(resolve => exec(command, (error, stdout, stderr) => resolve(
            new ExecResult(error ? 1 : 0, stdout + stderr))));
    }

    private static downloadFileImpl(url: string, writeStream: WriteStream) {
        return new Promise<void>((resolve, reject) => {
            let error: any = "Unknown error!";
                    
            writeStream.on("close", () => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });

            writeStream.on("finish", () => {
                error = undefined;
                writeStream.close();
            });

            const request = https.get(url, res => {
                if (res.statusCode === 200) {
                    res.pipe(writeStream);
                } else {
                    error = (res.statusCode ? res.statusCode + ": " : "") + res.statusMessage; 
                    writeStream.close();
                }
            });

            request.on("error", err => {
                error = err;
                writeStream.close();
            });
        });
    }

    private static async getConsoleInput() {
        return new Promise<string>(resolve => {
            const stdin = process.openStdin();
            stdin.once("data", args => {
                resolve(args.toString().trim());
                stdin.pause();
            });
        });
    }
}

enum DayOfWeek {
    Sunday,
    Monday,
    Tuesday,
    Wednesday,
    Thursday,
    Friday,
    Saturday        
}

class ExecResult {
    public constructor(public readonly exitCode: number, public readonly output: string) {}
}

App.main().then(exitCode => process.exitCode = exitCode);