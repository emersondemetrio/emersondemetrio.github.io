export const dateToBase64 = (date: Date): string => {
    const dateString = date.toISOString();
    return btoa(dateString);
};

export const base64ToDate = (base64: string): Date | null => {
    const dateString = atob(base64);
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
        return null;
    }

    return date;
};

export const createCountdownId = (d1: Date, d2: Date): string => {
    return `${dateToBase64(d1)}-${dateToBase64(d2)}`;
};

export const getIntervalFromId = (id: string): [Date, Date, string] | [null, null] => {
    const [d1, d2] = id.split('-').map(base64ToDate);
    if (!d1 || !d2) {
        return [null, null];
    }

    const description = `Countdown from ${d1.toDateString()} to ${d2.toDateString()}`;

    return [d1, d2, description];
};
