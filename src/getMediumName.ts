import type { Medium } from "./Medium.js";

enum DayOfWeek {
    Sunday,
    Monday,
    Tuesday,
    Wednesday,
    Thursday,
    Friday,
    Saturday,
}

export const getMediumName = ({ cacheNumber, slotNumber, serialNumber }: Medium) => {
    const serial = String.fromCharCode("a".charCodeAt(0) + serialNumber);

    return `${DayOfWeek[(slotNumber + 1) % 7]}${(cacheNumber + 1)}${serial}`;
};

