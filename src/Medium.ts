export class Medium {
    public readonly name: string;
    public readonly backupCountSinceMediumStart: number;
    public readonly backupCountUntilMediumEnd: number;

    public constructor(
        slotNames: readonly string[],
        cacheCount: number,
        backupCountSinceStart: number,
    ) {
        const slotCount = slotNames.length;
        const cacheInterval = slotCount * slotCount; // How many backups to move from one to the next cache
        const cacheCycle = cacheCount * cacheInterval; // How many backups to cycle through all caches
        const slotStartInterval = cacheCycle + slotCount + 1; // How many backups between two slot starts
        const mediaLifetime = cacheCycle * slotCount; // How many backups before a single medium is retired

        // The last number is the *total* amount of backups that are made during the lifetime of a single medium and is
        // not to be confused with how many times a single medium is written to.

        // When the backup starts with the very first medium, we want to begin retiring media after one full
        // cache cycle. The following addition takes care of this fact. Moreover it also ensures that
        // backupsSinceSlotStart will never become negative
        const startBackupCount = backupCountSinceStart + mediaLifetime - cacheCycle + cacheInterval - slotCount;

        const slotNumber = (startBackupCount % slotCount);
        const backupCountSinceSlotStart = startBackupCount - (slotNumber * slotStartInterval);
        const cacheNumber = Math.floor(backupCountSinceSlotStart / cacheInterval) % cacheCount;
        const serialNumber = Math.floor(backupCountSinceSlotStart / mediaLifetime);
        this.name =
            `${slotNames[slotNumber % 7]}${(cacheNumber + 1)}${String.fromCharCode("a".charCodeAt(0) + serialNumber)}`;
        this.backupCountSinceMediumStart =
            (backupCountSinceSlotStart % mediaLifetime) - (cacheNumber * cacheInterval);
        this.backupCountUntilMediumEnd =
            mediaLifetime - this.backupCountSinceMediumStart - ((cacheCount - 1) * cacheInterval) - slotCount;
    }
}
