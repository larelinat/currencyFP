import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CurrencyInputComponent from './CurrencyInput';

describe('<CurrencyInputComponent />', () => {
  it('Компонент корректно рендерится и по-умолчанию отсутствуют разделитель и текст снизу ', () => {
    render(<CurrencyInputComponent />);
    const inputElement = screen.getByRole('spinbutton');
    expect(inputElement).toBeInTheDocument();

    const separatorElement = screen.queryByRole('separator');
    expect(separatorElement).not.toBeInTheDocument();

    const underTextElement = screen.queryByText((content, element) => {
      return (
        element?.tagName.toLowerCase() === 'span' &&
        element?.className.includes('underText')
      );
    });
    expect(underTextElement).not.toBeInTheDocument();
  });

  it('Поле ввода выключено во время загрузки', () => {
    render(<CurrencyInputComponent loading={true} />);
    const inputElement = screen.getByRole('spinbutton');
    expect(inputElement).toBeDisabled();
  });

  it('onChange вызывается с правильным значением', () => {
    const handleChange = vi.fn();
    render(<CurrencyInputComponent onChange={handleChange} />);
    const inputElement = screen.getByRole('spinbutton');
    fireEvent.change(inputElement, { target: { value: '123.45' } });
    expect(handleChange).toHaveBeenCalledWith(123.45);
  });

  it('Текст под Input отображается корректно', () => {
    render(<CurrencyInputComponent underText="Test UnderText" />);
    const underTextElement = screen.getByText('Test UnderText');
    expect(underTextElement).toBeInTheDocument();
    const separatorElement = screen.queryByRole('separator');
    expect(separatorElement).toBeInTheDocument();
  });

  it('Во время загрузки отображается надпись Loading.. в поле под Input', () => {
    render(
      <CurrencyInputComponent loading={true} underText="Test UnderText" />,
    );
    const loadingTextElement = screen.getByText('Loading..');
    expect(loadingTextElement).toBeInTheDocument();
  });

  it('Значение обновляется корректно при изменении через onChange', () => {
    let value = 0;
    const handleChange = (newValue: number) => {
      value = newValue;
    };

    const { rerender } = render(
      <CurrencyInputComponent value={value} onChange={handleChange} />,
    );
    const inputElement = screen.getByRole('spinbutton');

    fireEvent.change(inputElement, { target: { value: '123.45' } });
    rerender(<CurrencyInputComponent value={value} onChange={handleChange} />);

    expect(inputElement).toHaveValue(123.45);
  });
});
