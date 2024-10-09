import { useCallback, useEffect, useMemo, useState } from 'react';
import { getRates } from '@api/api.ts';
import { Rates } from '@api/types.ts';

interface UseRatesResult {
  rate: number;
  loading: boolean;
  error: string | null;
  fromCurrency: {
    value: string;
    setFromCurrency: (currency: string) => void;
  };
  toCurrency: {
    value: string;
    setToCurrency: (currency: string) => void;
  };
}

const useRates = (
  initialFromCurrency?: string,
  initialToCurrency?: string,
): UseRatesResult => {
  const [fromCurrency, setFromCurrency] = useState<string>(
    initialFromCurrency ?? 'USD',
  );
  const [toCurrency, setToCurrency] = useState<string>(
    initialToCurrency ?? 'EUR',
  );
  const [rates, setRates] = useState<Rates>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [rate, setRate] = useState<number>(0);

  useEffect(() => {
    const controller = new AbortController();

    const fetchRates = async () => {
      setLoading(true);
      try {
        const fetchedRates = await getRates(fromCurrency, undefined, {
          signal: controller.signal,
        });
        setRates(fetchedRates);
        setLoading(false);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
          setLoading(false);
        }
      }
    };

    if (fromCurrency) {
      fetchRates();
    }

    return () => {
      controller.abort();
    };
  }, [fromCurrency]);

  useEffect(() => {
    if (rates[toCurrency]) {
      setRate(rates[toCurrency]);
    } else {
      setRate(0);
    }
  }, [toCurrency, rates]);

  const memoizedSetFromCurrency = useCallback((currency: string) => {
    setFromCurrency(currency);
  }, []);

  const memoizedSetToCurrency = useCallback((currency: string) => {
    setToCurrency(currency);
  }, []);

  return useMemo(
    () => ({
      rate,
      loading,
      error,
      fromCurrency: {
        value: fromCurrency,
        setFromCurrency: memoizedSetFromCurrency,
      },
      toCurrency: {
        value: toCurrency,
        setToCurrency: memoizedSetToCurrency,
      },
    }),
    [
      rate,
      loading,
      error,
      fromCurrency,
      toCurrency,
      memoizedSetFromCurrency,
      memoizedSetToCurrency,
    ],
  );
};

export default useRates;
