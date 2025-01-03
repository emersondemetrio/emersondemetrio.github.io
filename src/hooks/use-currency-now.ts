import { useEffect, useState } from "react";
import { BaseCurrency, Currency, TargetCurrencies, UseCurrencyHook } from "../types";
import { API_URL } from "../constants";
import { useCache } from "./use-cache";

const fetchCurrency = async (base: BaseCurrency) => {
  const response = await fetch(`${API_URL}/${base}`);
  const data = await response.json();

  return data;
};

const filterTarget = (data: Currency, base: BaseCurrency) => {
  const rates = Object.keys(data.rates)
    .filter((currency) => TargetCurrencies.includes(currency))
    .filter((currency) => currency !== base)
    .reduce(
      (acc, currency) => {
        acc[currency] = data.rates[currency];
        return acc;
      },
      {} as Record<string, number>,
    );

  return {
    ...data,
    rates,
  };
};

const fixedAs2 = (n: number) => Math.round(n * 100) / 100;

export const formatToCurrency = (
  value: number | null,
  currency: string,
  rate: number = 1,
) => {
  if (!value || isNaN(value)) {
    value = 1;
  }

  const locale = currency === "BRL" ? "pt-BR" : "en-US";

  return fixedAs2(value * rate).toLocaleString(locale, {
    currency,
    style: "currency",
  });
};

const CACHE_KEY = "currency-app-cache";

export const useCurrencyNow = (base: BaseCurrency = "EUR"): UseCurrencyHook => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<Currency | null>(null);
  const [force, setForce] = useState(false);
  const [error, setError] = useState(null);
  const { get, set, invalidate, createItemKey } = useCache<Currency>(CACHE_KEY);

  const refresh = () => {
    invalidate();
    setForce(true);
    setIsLoading(true);
  };

  useEffect(() => {
    const itemKey = createItemKey(base, new Date().getTime());
    const cache = get(itemKey);

    if (!force && cache) {
      const data = filterTarget(cache, base);
      if (data) {
        setData(data);
        setIsLoading(false);
        return;
      }
    }

    if (force) {
      setForce(false);
    }

    fetchCurrency(base)
      .then((currencyData: Currency) => {
        setData(filterTarget(currencyData, base));
        set(itemKey, currencyData);
        setIsLoading(false);
      })
      .catch((error) => {
        setError(error);
        setIsLoading(false);
      });
  }, [base, force]);

  return {
    data,
    isLoading,
    error,
    refresh,
  };
};
