import { Medium } from "./Medium";
import { Path } from "./Path";
import { WriteStream } from "fs";
import { join } from "path";
import { exec } from "child_process";
import * as https from "https";

class App {
    private static readonly startMilliseconds = Date.UTC(2000, 3, 10); 

    public static async main(): Promise<number> {
        try {
            let daysSinceStart = (this.getTodayMilliseconds() - this.startMilliseconds) / 24 / 60 / 60 / 1000;
            let medium = Medium.get(2, 7, daysSinceStart);
            let mediumName = this.getMediumName(medium);
            let mediumRoot = new Path(join("/", "media", "andreas", mediumName));
    
            while (!await mediumRoot.canAccess() || !(await mediumRoot.getStats()).isDirectory()) {
                await this.requestInput("Please insert " + mediumName + " and press Enter: ");
            }
    
            let files = await mediumRoot.getFiles();
            const prompt = "Non-empty medium! Delete everything? [Y/n]: ";

            if ((files.length === 0) || (await this.requestInput(prompt)).toLowerCase() !== "n") {
                for (let file of files) {
                    await file.delete();
                }

                let backupScript = new Path(join(__dirname, "backup"));

                if (!backupScript.canAccess()) {
                    await this.downloadFile(
                        "https://raw.githubusercontent.com/andreashuber69/owncloud/master/backup", backupScript);
                }
            }

            return 0;
        } catch (ex) {
            console.log(ex);
            return 1;
        }
    }

    private static getTodayMilliseconds(): number {
        // We want to get the number of full days between start and today. The current timezone should be considered
        // such that when the clock moves past midnight in the current timezone then the number of days between start
        // and today should increase by one. We achieve that by getting the current local year, month and day and then
        // pretend that they are actually UTC numbers. Likewise, we construct the start with Date.UTC. 
        let now = new Date();
        return Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
    }

    private static getMediumName(medium: Medium): string {
        return DayOfWeek[(medium.slotNumber + 1) % 7] + (medium.cacheNumber + 1) +
            String.fromCharCode("a".charCodeAt(0) + medium.serialNumber);
    }

    private static requestInput(prompt: string): Promise<string> {
        process.stdout.write(prompt);
        return this.getConsoleInput();
    }

    private static async downloadFile(url: string, path: Path): Promise<void> {
        try {
            await this.downloadFileImpl(url, path.openWrite());
        } catch (ex) {
            path.delete();
            throw ex;
        }
    }

    private static downloadFileImpl(url: string, writeStream: WriteStream): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            let error: any = "Unknown error!";
                    
            writeStream.on("finish", () => {
                error = null;
                writeStream.close();
            });

            writeStream.on("error", err => {
                error = err;
                writeStream.close();
            });

            writeStream.on("close", () => {
                if (error === null) {
                    resolve();
                } else {
                    reject(error);
                }
            });

            const request = https.get(url, res => {
                if (res.statusCode === 200) {
                    res.pipe(writeStream);
                } else {
                    error = res.statusMessage; 
                    writeStream.close();
                }
            });

            request.on("error", err => {
                error = err;
                writeStream.close();
            });
        });
    }

    private static async getConsoleInput(): Promise<string> {
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

App.main().then(exitCode => process.exitCode = exitCode);