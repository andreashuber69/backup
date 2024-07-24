// https://github.com/andreashuber69/backup/blob/master/README.md#----backup

import { Medium } from "./Medium.js";

export const getMedium = (todayMilliseconds: number) => {
    const slotNames = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
    ] as const;

    const startMilliseconds = Date.UTC(2000, 3, 10);

    return new Medium(slotNames, 2, (todayMilliseconds - startMilliseconds) / 24 / 60 / 60 / 1000);
};
