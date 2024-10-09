import MockAdapter from 'axios-mock-adapter';
import { getCurrencyList, getRates } from './api';
import { CurrencyList, RatesResponse } from '@api/types';
import axios from 'axios';

const CURRENCY_URL = 'https://api.vatcomply.com/currencies';
const BASE_URL = 'https://api.vatcomply.com/rates';

describe('API тесты', () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.restore();
  });

  it('Корректно получает и фильтрует список валют', async () => {
    const mockCurrencyList: CurrencyList = {
      USD: { name: 'United States Dollar', symbol: '$' },
      EUR: { name: 'Euro', symbol: '€' },
    };

    const mockRatesResponse: RatesResponse = {
      base: 'USD',
      date: '2023-10-01',
      rates: {
        USD: 1,
        EUR: 0.85,
      },
    };

    mock.onGet(CURRENCY_URL).reply(200, mockCurrencyList);
    mock.onGet(BASE_URL).reply(200, mockRatesResponse);

    const result = await getCurrencyList();
    expect(result).toEqual({
      USD: { name: 'United States Dollar', symbol: '$' },
      EUR: { name: 'Euro', symbol: '€' },
    });
  });

  it('Корректно получает данные с сервера на основе даты и базовой валюты', async () => {
    const mockRatesResponse: RatesResponse = {
      base: 'USD',
      date: '2023-10-01',
      rates: {
        USD: 1,
        EUR: 0.85,
      },
    };

    mock.onGet(BASE_URL).reply(200, mockRatesResponse);

    const result = await getRates('USD', '2023-10-01');
    expect(result).toEqual({
      USD: 1,
      EUR: 0.85,
    });
  });

  it('Отменяет запрос getCurrencyList с использованием AbortController', async () => {
    const controller = new AbortController();
    const signal = controller.signal;

    mock.onGet(CURRENCY_URL).reply(() => {
      return new Promise((resolve, reject) => {
        signal.addEventListener('abort', () => {
          reject(new axios.Cancel('canceled'));
        });
      });
    });

    const request = getCurrencyList({ signal });
    controller.abort();

    await expect(request).rejects.toThrow('canceled');
  });

  it('Отменяет запрос getRates с использованием AbortController', async () => {
    const controller = new AbortController();
    const signal = controller.signal;

    mock.onGet(BASE_URL).reply(() => {
      return new Promise((resolve, reject) => {
        signal.addEventListener('abort', () => {
          reject(new axios.Cancel('canceled'));
        });
      });
    });

    const request = getRates('USD', '2023-10-01', { signal });
    controller.abort();

    await expect(request).rejects.toThrow('canceled');
  });
});
