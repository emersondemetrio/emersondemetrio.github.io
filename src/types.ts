export type LinkCategory = 'social' | 'professional' | 'arts';

export type Link = {
  title: string;
  url: string;
  icon?: string;
  category: LinkCategory
  handle: string;
};

export const TargetCurrencies = ["USD", "GBP", "BRL"];

export type BaseCurrency = "USD" | "EUR" | "GBP" | "CAD";

export type Currency = {
  provider: string,
  time_last_updated: number,
  rates: Record<string, number>
}

export type UseCurrencyHook = {
  data: Currency | null,
  isLoading: boolean,
  error: Error | null
}

export type CurrencyProvider = {
  name: string;
  nickname: string;
  url: (amount: number, currency: string) => string;
};

export type Repo = {
  name: string;
  url: string;
}


// Weather API types
export type WeatherAPIResult = {
  current: {
    condition: {
      text: string;
      icon: string;
    };
    temp_c: number;
    feelslike_c: number;
  };
  source: "cache" | "api";
  error: {
    code: number;
    message: string;
  }
};

