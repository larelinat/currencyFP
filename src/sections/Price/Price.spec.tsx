import { render, screen, within } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useConvert } from '@/store/ConvertProvider/ConvertProvider.tsx';
import useUnits from '@/store/useUnits/useUnits.ts';
import PriceComponent from './Price.tsx';

vi.mock('@/store/ConvertProvider/ConvertProvider.tsx');
vi.mock('@/store/useUnits/useUnits.ts');

describe('PriceComponent', () => {
  const mockUseConvert = {
    rate: 1.2,
    fromCurrency: { value: 'USD' },
    toCurrency: { value: 'EUR' },
  };

  const mockUseUnits = {
    convertedUnitsFrom: [1.2, 6, 12, 30, 60, 120, 600, 1200, 6000],
    convertedUnitsTo: [
      0.83, 4.17, 8.33, 20.83, 41.67, 83.33, 416.67, 833.33, 4166.67,
    ],
  };

  beforeEach(() => {
    (useConvert as jest.Mock).mockReturnValue(mockUseConvert);
    (useUnits as jest.Mock).mockReturnValue(mockUseUnits);
  });

  it('Корректно рендерится', () => {
    render(<PriceComponent />);
    expect(screen.getByText('Стоимость конвертации')).toBeInTheDocument();
  });

  it('Корректно присваивается название класса', () => {
    const className = 'test-class';
    render(<PriceComponent className={className} />);
    expect(document.querySelector(`section.${className}`)).toBeInTheDocument();
  });

  it('Таблицы рендерятся с правильными данными', () => {
    render(<PriceComponent />);

    const firstTable = screen.getAllByTestId('table-component')[0];
    expect(within(firstTable).getByText('USD')).toBeInTheDocument();
    expect(within(firstTable).getByText('EUR')).toBeInTheDocument();

    mockUseUnits.convertedUnitsFrom.forEach((unit) => {
      expect(within(firstTable).getByText(unit.toString())).toBeInTheDocument();
    });

    const secondTable = screen.getAllByTestId('table-component')[1];
    expect(within(secondTable).getByText('USD')).toBeInTheDocument();
    expect(within(secondTable).getByText('EUR')).toBeInTheDocument();

    mockUseUnits.convertedUnitsTo.forEach((unit) => {
      expect(
        within(secondTable).getByText(unit.toString()),
      ).toBeInTheDocument();
    });
  });

  it('Корректно вызываются хуки useConvert и useUnits', () => {
    render(<PriceComponent />);
    expect(useConvert).toHaveBeenCalled();
    expect(useUnits).toHaveBeenCalledWith(
      mockUseConvert.rate,
      [1, 5, 10, 25, 50, 100, 500, 1000, 5000],
    );
  });
});
