import { act, renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import useRates from './useRates';
import { getRates } from '@api/api.ts';
import { Rates } from '@api/types.ts';

vi.mock('@api/api.ts', () => ({
  getRates: vi.fn(),
}));

describe('useRates', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('Инициализируется с корректными значениями', async () => {
    (getRates as vi.Mock).mockResolvedValue({});

    const { result } = renderHook(() => useRates());

    await waitFor(() => {
      expect(result.current.rate).toBe(0);
      expect(result.current.loading).toBe(true);
      expect(result.current.error).toBeNull();
      expect(result.current.fromCurrency.value).toBe('USD');
      expect(result.current.toCurrency.value).toBe('EUR');
    });
  });

  it('После получения данных коэффициент устанавливается корректно', async () => {
    const mockRates: Rates = { EUR: 0.85 };
    (getRates as vi.Mock).mockResolvedValueOnce(mockRates);

    const { result } = renderHook(() => useRates());

    await waitFor(() => {
      expect(result.current.rate).toBe(0.85);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  it('Ошибка происходит корректно', async () => {
    const mockError = new Error('Failed to fetch');
    (getRates as vi.Mock).mockRejectedValue(mockError);

    const { result } = renderHook(() => useRates());

    await waitFor(() => {
      expect(result.current.rate).toBe(0);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(mockError.message);
    });
  });

  it('При изменении fromCurrency должны запрашиваться новые данные и происходить корректный пересчет значений', async () => {
    const mockRates: Rates = { EUR: 0.85, GBP: 0.75 };
    (getRates as vi.Mock).mockResolvedValueOnce(mockRates);

    const { result } = renderHook(() => useRates());

    await waitFor(() => {
      expect(result.current.rate).toBe(0.85);
    });

    (getRates as vi.Mock).mockResolvedValueOnce({ EUR: 0.9, USD: 0.7 });
    act(() => {
      result.current.fromCurrency.setFromCurrency('GBP');
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(true);
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.rate).toBe(0.9);
    });
  });

  it('Коэффициент должен корректно обновляться при смене валюты', async () => {
    const mockRates: Rates = { EUR: 0.85, GBP: 0.75 };
    (getRates as vi.Mock).mockResolvedValueOnce(mockRates);

    const { result } = renderHook(() => useRates());

    await waitFor(() => {
      expect(result.current.rate).toBe(0.85);
    });

    act(() => {
      result.current.toCurrency.setToCurrency('GBP');
    });

    await waitFor(() => {
      expect(result.current.rate).toBe(0.75);
    });
  });
});
