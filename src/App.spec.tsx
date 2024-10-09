import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from './App';

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

describe('<App />', () => {
  it('Рендерится компонент конвертации', () => {
    render(<App />);
    expect(screen.getByText('Конвертер валют')).toBeInTheDocument();
  });

  it('Рендерится компонент истории курса', () => {
    render(<App />);
    expect(screen.getByText('История курса')).toBeInTheDocument();
  });

  it('Рендерится компонент стоимости конвертации', () => {
    render(<App />);
    expect(screen.getByText('Стоимость конвертации')).toBeInTheDocument();
  });
});
