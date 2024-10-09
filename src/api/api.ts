import axios, { AxiosRequestConfig } from 'axios';
import { CurrencyList, Rates, RatesResponse } from '@api/types.ts';

const CURRENCY_URL = 'https://api.vatcomply.com/currencies';
const BASE_URL = 'https://api.vatcomply.com/rates';

export const getCurrencyList = async (
  config?: AxiosRequestConfig,
): Promise<CurrencyList> => {
  const [currencyResponse, ratesResponse] = await Promise.all([
    axios.get<CurrencyList>(CURRENCY_URL, { ...config }),
    axios.get<RatesResponse>(BASE_URL, { ...config }),
  ]);

  const currencyList = currencyResponse.data;
  const rates = ratesResponse.data.rates;

  const filteredCurrencyList: CurrencyList = {};
  Object.keys(currencyList).forEach((currency) => {
    if (rates[currency]) {
      filteredCurrencyList[currency] = currencyList[currency];
    }
  });

  return filteredCurrencyList;
};

export const getRates = async (
  base?: string,
  date?: string,
  config?: AxiosRequestConfig,
): Promise<Rates> => {
  const response = await axios.get<RatesResponse>(BASE_URL, {
    params: {
      date,
      base,
    },
    ...config,
  });
  return response.data.rates;
};
