import { renderHook, act } from '@testing-library/react';
import { waitFor } from '@testing-library/react';
import useAmounts from './useAmounts';

describe('useAmounts', () => {
  it('Правильно инициализируется без начальных значений', () => {
    const { result } = renderHook(() => useAmounts());

    expect(result.current.amountFrom.value).toBe(1);
    expect(result.current.amountTo.value).toBe(1);
  });

  it('Правильно инициализируется при начальных значениях', () => {
    const { result } = renderHook(() => useAmounts(5, 10));

    expect(result.current.amountFrom.value).toBe(5);
    expect(result.current.amountTo.value).toBe(10);
  });

  it('Правильно обновляется amountTo когда изменился rate', async () => {
    const { result, rerender } = renderHook(
      ({ rate }) => useAmounts(5, 10, rate),
      {
        initialProps: { rate: 2 },
      },
    );

    expect(result.current.amountTo.value).toBe(10);

    rerender({ rate: 3 });

    expect(result.current.amountTo.value).toBe(15);

    rerender({ rate: 4 });

    expect(result.current.amountTo.value).toBe(20);
  });

  it('Правильно обновляются amountFrom и amountTo, когда изменяется amountFrom', async () => {
    const { result } = renderHook(() => useAmounts(5, 10, 2));

    act(() => {
      result.current.amountFrom.handleChange(6);
    });

    await waitFor(() => {
      expect(result.current.amountFrom.value).toBe(6);
      expect(result.current.amountTo.value).toBe(12);
    });

    act(() => {
      result.current.amountFrom.handleChange(8);
    });

    await waitFor(() => {
      expect(result.current.amountFrom.value).toBe(8);
      expect(result.current.amountTo.value).toBe(16);
    });
  });

  it('Правильно обновляются amountFrom и amountTo когда меняется amountTo', async () => {
    const { result } = renderHook(() => useAmounts(5, 10, 2));

    act(() => {
      result.current.amountTo.handleChange(14);
    });

    await waitFor(() => {
      expect(result.current.amountTo.value).toBe(14);
      expect(result.current.amountFrom.value).toBe(7);
    });

    act(() => {
      result.current.amountTo.handleChange(28);
    });

    await waitFor(() => {
      expect(result.current.amountTo.value).toBe(28);
      expect(result.current.amountFrom.value).toBe(14);
    });
  });

  it('Комплексная проверка', async () => {
    const { result, rerender } = renderHook(
      ({ rate }) => useAmounts(5, 10, rate),
      {
        initialProps: { rate: 2 },
      },
    );

    expect(result.current.amountTo.value).toBe(10);

    rerender({ rate: 3 });
    expect(result.current.amountTo.value).toBe(15);

    act(() => {
      result.current.amountFrom.handleChange(6);
    });
    await waitFor(() => {
      expect(result.current.amountFrom.value).toBe(6);
      expect(result.current.amountTo.value).toBe(18);
    });

    act(() => {
      result.current.amountTo.handleChange(12);
    });
    await waitFor(() => {
      expect(result.current.amountTo.value).toBe(12);
      expect(result.current.amountFrom.value).toBe(4);
    });

    rerender({ rate: 4 });
    expect(result.current.amountTo.value).toBe(16);

    act(() => {
      result.current.amountFrom.handleChange(8);
    });
    await waitFor(() => {
      expect(result.current.amountFrom.value).toBe(8);
      expect(result.current.amountTo.value).toBe(32);
    });

    act(() => {
      result.current.amountTo.handleChange(20);
    });
    await waitFor(() => {
      expect(result.current.amountTo.value).toBe(20);
      expect(result.current.amountFrom.value).toBe(5);
    });
  });
});
