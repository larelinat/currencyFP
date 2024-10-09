import { useEffect, useMemo, useState } from 'react';
import { getCurrencyList } from '@api/api.ts';
import { CurrencyList } from '@api/types.ts';

interface UseCurrenciesResult {
  currencies: CurrencyList | undefined;
  loading: boolean;
  error: string | null;
}

const useCurrencies = (): UseCurrenciesResult => {
  const [currencies, setCurrencies] = useState<CurrencyList>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchCurrencies = async () => {
      try {
        const list = await getCurrencyList();
        setCurrencies(list);
        setLoading(false);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
          setLoading(false);
        }
      }
    };

    fetchCurrencies();

    return () => {
      controller.abort();
    };
  }, []);

  return useMemo(
    () => ({
      currencies,
      loading,
      error,
    }),
    [currencies, loading, error],
  );
};

export default useCurrencies;
