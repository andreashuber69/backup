import type { Medium } from "./Medium.js";

enum DayOfWeek {
    Monday,
    Tuesday,
    Wednesday,
    Thursday,
    Friday,
    Saturday,
    Sunday,
}

export const getMediumName = ({ slotNumber, cacheNumber, serialNumber }: Medium) => {
    const serial = String.fromCharCode("a".charCodeAt(0) + serialNumber);

    return `${DayOfWeek[slotNumber % 7]}${(cacheNumber + 1)}${serial}`;
};

