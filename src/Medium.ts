export class Medium {
    public readonly slotNumber: number;
    public readonly cacheNumber: number;
    public readonly serialNumber: number;
    public readonly backupCountSinceMediumStart: number;
    public readonly backupCountUntilMediumEnd: number;

    public constructor(cacheCount: number, slotCount: number, backupCountSinceStart: number) {
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

        this.slotNumber = (startBackupCount % slotCount);
        const backupCountSinceSlotStart = startBackupCount - (this.slotNumber * slotStartInterval);
        this.cacheNumber = Math.floor(backupCountSinceSlotStart / cacheInterval) % cacheCount;
        this.serialNumber = Math.floor(backupCountSinceSlotStart / mediaLifetime);
        this.backupCountSinceMediumStart =
            (backupCountSinceSlotStart % mediaLifetime) - (this.cacheNumber * cacheInterval);
        this.backupCountUntilMediumEnd =
            mediaLifetime - this.backupCountSinceMediumStart - ((cacheCount - 1) * cacheInterval) - slotCount;
    }
}
