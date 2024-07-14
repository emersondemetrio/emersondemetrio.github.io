// Define the types for the elements
const finalDate: Date = new Date("08/07/2024 10:00:00");

const d: HTMLElement | null = document.getElementById("d");
const h: HTMLElement | null = document.getElementById("h");
const m: HTMLElement | null = document.getElementById("m");
const s: HTMLElement | null = document.getElementById("s");

const muc: HTMLElement | null = document.getElementById("muc");

const METRICS: { [key: string]: number } = {
    s: 1000,
    m: 1000 * 60,
    h: 1000 * 60 * 60,
    d: 1000 * 60 * 60 * 24
};

// Function to calculate date difference in specific metrics
const dateDiff = (a: Date, b: Date, metric: string = "d"): number => {
    const utc1 = Date.UTC(
        a.getFullYear(),
        a.getMonth(),
        a.getDate(),
        a.getHours(),
        a.getMinutes(),
        a.getSeconds()
    );
    const utc2 = Date.UTC(
        b.getFullYear(),
        b.getMonth(),
        b.getDate(),
        b.getHours(),
        b.getMinutes(),
        b.getSeconds()
    );

    return Math.floor((utc2 - utc1) / METRICS[metric]);
};

// Function to format numbers
const format = (n: number): string =>
    new Intl.NumberFormat("pt-BR", { maximumSignificantDigits: 8 }).format(n);

const genericDateOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false,
};

// Function to format dates
const formatDate = (d: Date, options: Intl.DateTimeFormatOptions): string =>
    new Intl.DateTimeFormat('pt-BR', options).format(d);

// Function to format dates for DE time zone
const formatDateDE = (d: Date): string => formatDate(d, {
    ...genericDateOptions,
    timeZone: 'Europe/Berlin'
});


window.setInterval((): void => {
    const today: Date = new Date();

    if (d) d.innerText = format(dateDiff(today, finalDate));
    if (h) h.innerText = format(dateDiff(today, finalDate, "h"));
    if (m) m.innerText = format(dateDiff(today, finalDate, "m"));
    if (s) s.innerText = format(dateDiff(today, finalDate, "s"));

    if (muc) muc.innerText = formatDateDE(today);
}, 1000);
