import { useEffect, useMemo, useState } from 'react';
import { getRates } from '@api/api.ts';
import { RateHistory, RateHistorySelected } from '@api/types.ts';

interface UseRateHistoryResult {
  currencyHistory: { date: string; rate: number }[];
  loading: boolean;
  error: string | null;
}

const useRateHistory = (
  fromCurrency: string,
  toCurrency: string,
): UseRateHistoryResult => {
  const [history, setHistory] = useState<RateHistory[]>([]);
  const [currencyHistory, setCurrencyHistory] = useState<RateHistorySelected[]>(
    [],
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchHistory = async () => {
      setLoading(true);
      try {
        const dates: string[] = [];
        const today = new Date();
        for (let i = 9; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(today.getDate() - i);
          dates.push(date.toISOString().split('T')[0]);
        }

        const fetchPromises = dates.map((date) =>
          getRates(fromCurrency, date, { signal: controller.signal }),
        );

        const responses = await Promise.all(fetchPromises);
        const fetchedHistory: RateHistory[] = responses.map((rates, index) => ({
          date: dates[index],
          rate: rates,
        }));

        setHistory(fetchedHistory);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    if (fromCurrency) {
      fetchHistory();
    }

    return () => {
      controller.abort();
    };
  }, [fromCurrency]);

  useEffect(() => {
    const filteredHistory = history.map((entry) => ({
      date: entry.date,
      rate: entry.rate[toCurrency] ?? 0,
    }));
    setCurrencyHistory(filteredHistory);
  }, [history, toCurrency]);

  return useMemo(
    () => ({
      currencyHistory,
      loading,
      error,
    }),
    [currencyHistory, loading, error],
  );
};

export default useRateHistory;
