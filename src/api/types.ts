interface CurrencyDetails {
  name: string;
  symbol: string;
}

export type CurrencyList = Record<string, CurrencyDetails>;

export type Rates = Record<string, number>;

export interface RatesResponse {
  date: string;
  base: string;
  rates: Rates;
}

export interface RateHistory {
  date: string;
  rate: Rates;
}

export interface RateHistorySelected {
  date: string;
  rate: number;
}
