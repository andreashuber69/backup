export class Medium {
    public readonly name: string;
    public readonly backupCountSinceMediumStart: number;
    public readonly backupCountUntilMediumEnd: number;

    public constructor(
        slotNames: readonly string[],
        cacheCount: number,
        backupCountSinceStart: number,
    ) {
        const cacheInterval = slotNames.length * slotNames.length; // How many backups from one to the next cache
        const cacheCycle = cacheCount * cacheInterval; // How many backups to cycle through all caches
        const slotStartInterval = cacheCycle + slotNames.length + 1; // How many backups between two slot starts
        const mediaLifetime = cacheCycle * slotNames.length; // How many backups before a single medium is retired

        // The last number is the *total* amount of backups that are made during the lifetime of a single medium and is
        // not to be confused with how many times a single medium is written to.

        // When the backup starts with the very first medium, we want to begin retiring media after one full
        // cache cycle. The following addition takes care of this fact. Moreover it also ensures that
        // backupsSinceSlotStart will never become negative
        const startBackupCount = backupCountSinceStart + mediaLifetime - cacheCycle + cacheInterval - slotNames.length;

        const slotNumber = startBackupCount % slotNames.length;
        const backupCountSinceSlotStart = startBackupCount - (slotNumber * slotStartInterval);
        const cacheNumber = Math.floor(backupCountSinceSlotStart / cacheInterval) % cacheCount;
        const serialNumber = Math.floor(backupCountSinceSlotStart / mediaLifetime);
        const letter = String.fromCodePoint(("a".codePointAt(0) ?? 0) + serialNumber);
        this.name = `${slotNames[slotNumber]}${(cacheNumber + 1)}${letter}`;
        this.backupCountSinceMediumStart =
            (backupCountSinceSlotStart % mediaLifetime) - (cacheNumber * cacheInterval);
        this.backupCountUntilMediumEnd =
            mediaLifetime - this.backupCountSinceMediumStart - ((cacheCount - 1) * cacheInterval) - slotNames.length;
    }
}
