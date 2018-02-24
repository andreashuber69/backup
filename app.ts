import { Medium } from "./Medium";
import { exec } from "child_process";

class App {
    private static readonly startMilliseconds = Date.UTC(2000, 3, 10); 

    public static async main(): Promise<number> {
        let daysSinceStart = (App.getTodayMilliseconds() - App.startMilliseconds) / 24 / 60 / 60 / 1000;
        let medium = Medium.get(2, 7, daysSinceStart);
        let mediumName = App.getMediumName(medium);
        let input = await this.requestInput("Please insert USB stick " + mediumName + " and press Enter: ");
        console.info(input);
        return 0;
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
            String.fromCharCode('a'.charCodeAt(0) + medium.serialNumber);
    }

    private static requestInput(prompt: string): Promise<string> {
        process.stdout.write(prompt);
        return App.getConsoleInput();
    }

    private static async getConsoleInput(): Promise<string> {
        return new Promise<string>(resolve => {
            let stdin = process.openStdin();
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