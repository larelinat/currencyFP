import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import ConvertComponent from './Convert';
import {
  ConvertProvider,
  useConvert,
} from '@/store/ConvertProvider/ConvertProvider.tsx';

vi.mock('@/store/ConvertProvider/ConvertProvider.tsx');

const mockUseConvert = {
  amountFrom: { value: 100, handleChange: vi.fn() },
  amountTo: { value: 120, handleChange: vi.fn() },
  rate: 1.2,
  loading: false,
  fromCurrency: { value: 'USD', setFromCurrency: vi.fn() },
  toCurrency: { value: 'EUR', setToCurrency: vi.fn() },
  currencies: {
    USD: 'United States Dollar',
    EUR: 'Euro',
    GBP: 'British Pound',
    JPY: 'Japanese Yen',
  },
};

(useConvert as vi.Mock).mockReturnValue(mockUseConvert);

describe('ConvertComponent', () => {
  it('Корректно рендерится', () => {
    render(
      <ConvertProvider>
        <ConvertComponent />
      </ConvertProvider>,
    );

    waitFor(() => {
      expect(screen.getByText('Конвертер валют')).toBeInTheDocument();
    });
  });

  it('Отображает начальные значения', () => {
    render(
      <ConvertProvider>
        <ConvertComponent />
      </ConvertProvider>,
    );
    waitFor(() => {
      expect(screen.getByDisplayValue('100')).toBeInTheDocument();
      expect(screen.getByDisplayValue('120')).toBeInTheDocument();
      expect(screen.getByText('1 USD = 1.20 EUR')).toBeInTheDocument();
    });
  });

  it('Корректно обрабатывается загрузка', () => {
    (useConvert as vi.Mock).mockReturnValue({
      ...mockUseConvert,
      loading: true,
    });
    render(
      <ConvertProvider>
        <ConvertComponent />
      </ConvertProvider>,
    );
    waitFor(() => {
      expect(
        screen.getByRole('button', { name: /ArrowLeftRight/i }),
      ).toBeDisabled();
    });
  });

  it('Корректно меняются местами валюты', async () => {
    (useConvert as vi.Mock).mockReturnValue({
      ...mockUseConvert,
      loading: false,
    });
    render(
      <ConvertProvider>
        <ConvertComponent />
      </ConvertProvider>,
    );

    waitFor(() => {
      fireEvent.click(screen.getByRole('button', { name: /ArrowLeftRight/i }));
      expect(mockUseConvert.fromCurrency.setFromCurrency).toHaveBeenCalledWith(
        'EUR',
      );
      expect(mockUseConvert.toCurrency.setToCurrency).toHaveBeenCalledWith(
        'USD',
      );
      expect(mockUseConvert.amountFrom.handleChange).toHaveBeenCalledWith(120);
      expect(
        screen.getByRole('button', { name: /ArrowLeftRight/i }),
      ).toBeDisabled();
    });
  });

  it('Корректно меняется сумма', () => {
    render(
      <ConvertProvider>
        <ConvertComponent />
      </ConvertProvider>,
    );
    waitFor(() => {
      fireEvent.change(screen.getByDisplayValue('100'), {
        target: { value: '200' },
      });
      expect(mockUseConvert.amountFrom.handleChange).toHaveBeenCalledWith(
        '200',
      );
    });
  });

  it('Корректно работает выбор валюты', () => {
    render(
      <ConvertProvider>
        <ConvertComponent />
      </ConvertProvider>,
    );
    waitFor(() => {
      fireEvent.change(screen.getByDisplayValue('USD'), {
        target: { value: 'GBP' },
      });
      expect(mockUseConvert.fromCurrency.setFromCurrency).toHaveBeenCalledWith(
        'GBP',
      );
    });
  });

  it('Корректно отображаются валюты в select', () => {
    render(
      <ConvertProvider>
        <ConvertComponent />
      </ConvertProvider>,
    );

    waitFor(() => {
      const fromCurrencySelect = screen.getByDisplayValue('USD');
      const toCurrencySelect = screen.getByDisplayValue('EUR');

      expect(fromCurrencySelect).toBeInTheDocument();
      expect(toCurrencySelect).toBeInTheDocument();

      Object.keys(mockUseConvert.currencies).forEach((currency) => {
        expect(screen.getAllByText(currency)).toHaveLength(2);
      });
    });
  });
});
