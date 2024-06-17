import { useState, useEffect } from "react";
import { BaseCurrency, Currency, TargetCurrencies, UseCurrencyHook } from "../types";
import { API_URL } from "../constants";
import { getFromCache, dateToTimestamp, setCache } from "./currency-cache";

const fetchCurrency = async (base: BaseCurrency) => {
    const response = await fetch(`${API_URL}/${base}`);
    const data = await response.json();

    return data;
}

const filterTarget = (data: Currency) => {
    const rates = Object
        .keys(data.rates)
        .filter((currency) => TargetCurrencies.includes(currency))
        .reduce((acc, currency) => {
            acc[currency] = data.rates[currency];
            return acc;
        }, {} as Record<string, number>);

    return {
        ...data,
        rates
    };
}

const fixedAs2 = (n: number) => Math.round(n * 100) / 100;

export const formatToCurrency = (value: number | null, currency: string, rate: number = 1) => {
    if (!value || isNaN(value)) {
        value = 1;
    }

    return fixedAs2(value * rate).toLocaleString("en-US", {
        currency,
        style: "currency",
    });
}


export const useCurrencyNow = (base: BaseCurrency = "EUR"): UseCurrencyHook => {
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState<Currency | null>(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const cache = getFromCache(dateToTimestamp(new Date()));

        if (cache) {
            setData(filterTarget(cache));
            setIsLoading(false);
            return;
        }

        fetchCurrency(base)
            .then((currencyData: Currency) => {
                setData(filterTarget(currencyData));
                setCache(dateToTimestamp(new Date()), currencyData);
                setIsLoading(false);
            })
            .catch((error) => {
                setError(error);
                setIsLoading(false);
            });
    }, [base]);

    return {
        data,
        isLoading,
        error
    };
}
