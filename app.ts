import { Medium } from "./Medium";

class App {
    public static main(): number {
        let startMilliseconds = Date.UTC(2000, 3, 10);
        let todayMilliseconds = App.getTodayMilliseconds();
        let final = (todayMilliseconds - startMilliseconds) / 24 / 60 / 60 / 1000;

        for (let days = 0; days < final; ++days) {
            let medium = Medium.get(2, 7, days);
            console.log(App.getMediumName(medium));
        }

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

App.main();