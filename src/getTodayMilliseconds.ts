// https://github.com/andreashuber69/backup/blob/master/README.md#----backup

export const getTodayMilliseconds = () => {
    // We want to get the number of full days between start and today. The current timezone should be considered
    // such that when the clock moves past midnight in the current timezone then the number of days between start
    // and today should increase by one. We achieve that by getting the current local year, month and day and then
    // pretend that they are actually UTC numbers. Likewise, we construct the start with Date.UTC.
    const now = new Date();

    return Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
};
