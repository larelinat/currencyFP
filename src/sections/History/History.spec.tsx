import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useConvert } from '@/store/ConvertProvider/ConvertProvider.tsx';
import useRateHistory from '@/store/useRateHistory/useRateHistory.ts';
import HistoryComponent from './History.tsx';

vi.mock('@/store/ConvertProvider/ConvertProvider.tsx');
vi.mock('@/store/useRateHistory/useRateHistory.ts');

vi.mock('react-chartjs-2', () => ({
  Line: vi.fn(),
}));

vi.mock('chart.js', () => {
  return {
    Chart: {
      register: vi.fn(),
    },
    CategoryScale: vi.fn(),
    Legend: vi.fn(),
    LinearScale: vi.fn(),
    LineElement: vi.fn(),
    PointElement: vi.fn(),
    Tooltip: vi.fn(),
  };
});

describe('HistoryComponent', () => {
  const mockUseConvert = {
    fromCurrency: { value: 'USD' },
    toCurrency: { value: 'EUR' },
  };

  const mockUseRateHistory = {
    currencyHistory: [
      { date: '2023-01-01', rate: 1.1 },
      { date: '2023-01-02', rate: 1.2 },
    ],
  };

  beforeEach(() => {
    (useConvert as jest.Mock).mockReturnValue(mockUseConvert);
    (useRateHistory as jest.Mock).mockReturnValue(mockUseRateHistory);
  });

  it('Корректно рендерится', () => {
    render(<HistoryComponent />);
    expect(screen.getByText('История курса')).toBeInTheDocument();
  });

  it('Корректно вызываются хуки useConvert и useRateHistory', () => {
    render(<HistoryComponent />);
    expect(useConvert).toHaveBeenCalled();
    expect(useRateHistory).toHaveBeenCalledWith(
      mockUseConvert.fromCurrency.value,
      mockUseConvert.toCurrency.value,
    );
  });
});
