import { render, screen, act, renderHook } from '@testing-library/react';
import { vi } from 'vitest';
import { ConvertProvider, useConvert } from './ConvertProvider';
import useCurrencies from '@/store/useCurrencies/useCurrencies.ts';
import useRates from '@/store/useRates/useRates.ts';
import useAmounts from '@/store/useAmounts/useAmounts.ts';

vi.mock('@/store/useCurrencies/useCurrencies.ts');
vi.mock('@/store/useRates/useRates.ts');
vi.mock('@/store/useAmounts/useAmounts.ts');

const TestComponent = () => {
  const context = useConvert();
  return (
    <div>
      <div data-testid="amountFrom">{context.amountFrom.value}</div>
      <div data-testid="amountTo">{context.amountTo.value}</div>
      <div data-testid="rate">{context.rate}</div>
      <div data-testid="loading">{context.loading.toString()}</div>
      <div data-testid="error">{context.error}</div>
      <div data-testid="fromCurrency">{context.fromCurrency.value}</div>
      <div data-testid="toCurrency">{context.toCurrency.value}</div>
      <div data-testid="currencies">{JSON.stringify(context.currencies)}</div>
      <button onClick={() => context.amountFrom.handleChange(200)}>
        Change Amount From
      </button>
      <button onClick={() => context.fromCurrency.setFromCurrency('GBP')}>
        Change From Currency
      </button>
      <button onClick={() => context.toCurrency.setToCurrency('JPY')}>
        Change To Currency
      </button>
    </div>
  );
};

describe('ConvertProvider', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('Корректно инициализируется', () => {
    (useCurrencies as vi.Mock).mockReturnValue({
      currencies: undefined,
      loading: false,
      error: null,
    });
    (useRates as vi.Mock).mockReturnValue({
      rate: 1,
      loading: false,
      error: null,
      fromCurrency: { value: 'USD', setFromCurrency: vi.fn() },
      toCurrency: { value: 'EUR', setToCurrency: vi.fn() },
    });
    (useAmounts as vi.Mock).mockReturnValue({
      amountFrom: { value: 1, handleChange: vi.fn() },
      amountTo: { value: 1, handleChange: vi.fn() },
    });

    render(
      <ConvertProvider>
        <TestComponent />
      </ConvertProvider>,
    );

    expect(screen.getByTestId('amountFrom').textContent).toBe('1');
    expect(screen.getByTestId('amountTo').textContent).toBe('1');
    expect(screen.getByTestId('rate').textContent).toBe('1');
    expect(screen.getByTestId('loading').textContent).toBe('false');
    expect(screen.getByTestId('error').textContent).toBe('');
    expect(screen.getByTestId('fromCurrency').textContent).toBe('USD');
    expect(screen.getByTestId('toCurrency').textContent).toBe('EUR');
    expect(screen.getByTestId('currencies').textContent).toBe('');
  });

  it('Корректно загружает данные при loading', () => {
    (useCurrencies as vi.Mock).mockReturnValue({
      currencies: undefined,
      loading: true,
      error: null,
    });
    (useRates as vi.Mock).mockReturnValue({
      rate: 1,
      loading: true,
      error: null,
      fromCurrency: { value: 'USD', setFromCurrency: vi.fn() },
      toCurrency: { value: 'EUR', setToCurrency: vi.fn() },
    });
    (useAmounts as vi.Mock).mockReturnValue({
      amountFrom: { value: 1, handleChange: vi.fn() },
      amountTo: { value: 1, handleChange: vi.fn() },
    });

    render(
      <ConvertProvider>
        <TestComponent />
      </ConvertProvider>,
    );

    expect(screen.getByTestId('loading').textContent).toBe('true');
  });

  it('Корректно устанавливается ошибка', () => {
    (useCurrencies as vi.Mock).mockReturnValue({
      currencies: undefined,
      loading: false,
      error: 'Error loading currencies',
    });
    (useRates as vi.Mock).mockReturnValue({
      rate: 1,
      loading: false,
      error: 'Error loading rates',
      fromCurrency: { value: 'USD', setFromCurrency: vi.fn() },
      toCurrency: { value: 'EUR', setToCurrency: vi.fn() },
    });
    (useAmounts as vi.Mock).mockReturnValue({
      amountFrom: { value: 1, handleChange: vi.fn() },
      amountTo: { value: 1, handleChange: vi.fn() },
    });

    render(
      <ConvertProvider>
        <TestComponent />
      </ConvertProvider>,
    );

    expect(screen.getByTestId('error').textContent).toBe(
      'Error loading currencies',
    );
  });

  it('Передаются корректные значения', () => {
    const mockSetFromCurrency = vi.fn();
    const mockSetToCurrency = vi.fn();

    (useCurrencies as vi.Mock).mockReturnValue({
      currencies: { USD: 'United States Dollar', EUR: 'Euro' },
      loading: false,
      error: null,
    });
    (useRates as vi.Mock).mockReturnValue({
      rate: 1.2,
      loading: false,
      error: null,
      fromCurrency: { value: 'USD', setFromCurrency: mockSetFromCurrency },
      toCurrency: { value: 'EUR', setToCurrency: mockSetToCurrency },
    });
    (useAmounts as vi.Mock).mockReturnValue({
      amountFrom: { value: 100, handleChange: vi.fn() },
      amountTo: { value: 120, handleChange: vi.fn() },
    });

    render(
      <ConvertProvider>
        <TestComponent />
      </ConvertProvider>,
    );

    expect(screen.getByTestId('amountFrom').textContent).toBe('100');
    expect(screen.getByTestId('amountTo').textContent).toBe('120');
    expect(screen.getByTestId('rate').textContent).toBe('1.2');
    expect(screen.getByTestId('loading').textContent).toBe('false');
    expect(screen.getByTestId('error').textContent).toBe('');
    expect(screen.getByTestId('fromCurrency').textContent).toBe('USD');
    expect(screen.getByTestId('toCurrency').textContent).toBe('EUR');
    expect(screen.getByTestId('currencies').textContent).toBe(
      '{"USD":"United States Dollar","EUR":"Euro"}',
    );
  });

  it('Корректно изменяет данные при изменении состояния', async () => {
    const mockSetFromCurrency = vi.fn();
    const mockSetToCurrency = vi.fn();
    const mockHandleChange = vi.fn();

    (useCurrencies as vi.Mock).mockReturnValue({
      currencies: {
        USD: 'United States Dollar',
        EUR: 'Euro',
        GBP: 'British Pound',
        JPY: 'Japanese Yen',
      },
      loading: false,
      error: null,
    });
    (useRates as vi.Mock).mockReturnValue({
      rate: 1.2,
      loading: false,
      error: null,
      fromCurrency: { value: 'USD', setFromCurrency: mockSetFromCurrency },
      toCurrency: { value: 'EUR', setToCurrency: mockSetToCurrency },
    });
    (useAmounts as vi.Mock).mockReturnValue({
      amountFrom: { value: 100, handleChange: mockHandleChange },
      amountTo: { value: 120, handleChange: vi.fn() },
    });

    render(
      <ConvertProvider>
        <TestComponent />
      </ConvertProvider>,
    );

    expect(screen.getByTestId('amountFrom').textContent).toBe('100');
    expect(screen.getByTestId('amountTo').textContent).toBe('120');
    expect(screen.getByTestId('rate').textContent).toBe('1.2');
    expect(screen.getByTestId('fromCurrency').textContent).toBe('USD');
    expect(screen.getByTestId('toCurrency').textContent).toBe('EUR');

    act(() => {
      screen.getByText('Change Amount From').click();
    });
    expect(mockHandleChange).toHaveBeenCalledWith(200);

    act(() => {
      screen.getByText('Change From Currency').click();
    });
    expect(mockSetFromCurrency).toHaveBeenCalledWith('GBP');

    act(() => {
      screen.getByText('Change To Currency').click();
    });
    expect(mockSetToCurrency).toHaveBeenCalledWith('JPY');
  });
});

describe('useConvert', () => {
  it('Выбрасывается ошибка если мы не внутри провайдера', () => {
    try {
      renderHook(() => useConvert());
    } catch (error) {
      expect(error).toEqual(
        new Error('useConvert must be used within a ConvertProvider'),
      );
    }
  });
});
