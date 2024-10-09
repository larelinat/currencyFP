import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import useCurrencies from './useCurrencies';
import { CurrencyList } from '@api/types.ts';
import { getCurrencyList } from '@api/api.ts';

vi.mock('@api/api.ts', () => ({
  getCurrencyList: vi.fn(),
}));

describe('useCurrencies', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('Корректно получает и передает данные из хука', async () => {
    const mockCurrencies: CurrencyList = {
      USD: { name: 'US Dollar', symbol: '$' },
    };
    (getCurrencyList as vi.Mock).mockResolvedValueOnce(mockCurrencies);

    const { result } = renderHook(() => useCurrencies());

    await waitFor(() => {
      expect(result.current.currencies).toEqual(mockCurrencies);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  it('Если не получилось загрузить - выбрасывается ошибка', async () => {
    const mockError = new Error('Failed to fetch');
    (getCurrencyList as vi.Mock).mockRejectedValue(mockError);

    const { result } = renderHook(() => useCurrencies());

    await waitFor(() => {
      expect(result.current.currencies).toBeUndefined();
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(mockError.message);
    });
  });
});
