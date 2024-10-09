import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import useRateHistory from './useRateHistory';
import { getRates } from '@api/api.ts';

vi.mock('@api/api.ts', () => ({
  getRates: vi.fn(),
}));

describe('useRateHistory', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('Корректно инициализируется', async () => {
    (getRates as vi.Mock).mockResolvedValue({});

    const { result } = renderHook(() => useRateHistory('USD', 'EUR'));

    await waitFor(() => {
      expect(result.current.currencyHistory).toEqual([]);
      expect(result.current.loading).toBe(true);
      expect(result.current.error).toBeNull();
    });
  });

  it('Корректно загружает историю', async () => {
    const mockRates = { EUR: 1.85, USD: 1 };
    (getRates as vi.Mock).mockResolvedValue(mockRates);

    const { result } = renderHook(({ from, to }) => useRateHistory(from, to), {
      initialProps: { from: 'USD', to: 'EUR' },
    });

    await waitFor(() => {
      expect(result.current.currencyHistory).toHaveLength(10);
      expect(result.current.currencyHistory[0].rate).toBe(1.85);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  it('Корректно устанавливается ошибка', async () => {
    const mockError = new Error('Failed to fetch');
    (getRates as vi.Mock).mockRejectedValue(mockError);

    const { result } = renderHook(() => useRateHistory('USD', 'EUR'));

    await waitFor(() => {
      expect(result.current.currencyHistory).toEqual([]);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(mockError.message);
    });
  });

  it('Корректно обновляется история когда меняется fromCurrency', async () => {
    const mockRates = { EUR: 0.85 };
    (getRates as vi.Mock).mockResolvedValue(mockRates);

    const { result, rerender } = renderHook(
      ({ fromCurrency }) => useRateHistory(fromCurrency, 'EUR'),
      {
        initialProps: { fromCurrency: 'USD' },
      },
    );

    await waitFor(() => {
      expect(result.current.currencyHistory[0].rate).toBe(0.85);
    });

    (getRates as vi.Mock).mockResolvedValue({ EUR: 0.9 });
    rerender({ fromCurrency: 'GBP' });

    await waitFor(() => {
      expect(result.current.currencyHistory[0].rate).toBe(0.9);
    });
  });

  it('Корректно обновляется история когда меняется toCurrency', async () => {
    const mockRates = { EUR: 0.85, GBP: 0.75 };
    (getRates as vi.Mock).mockResolvedValue(mockRates);

    const { result, rerender } = renderHook(
      ({ to }) => useRateHistory('USD', to),
      {
        initialProps: { to: 'EUR' },
      },
    );

    await waitFor(() => {
      expect(result.current.currencyHistory[0].rate).toBe(0.85);
    });

    rerender({ to: 'GBP' });

    await waitFor(() => {
      expect(result.current.currencyHistory[0].rate).toBe(0.75);
    });
  });
});
