import { renderHook } from '@testing-library/react';
import useUnits from './useUnits';

describe('useUnits', () => {
  it('Если коэффициент конвертации 0 - возвращаются пустые массивы', async () => {
    const { result } = renderHook(({ rate, units }) => useUnits(rate, units), {
      initialProps: { rate: 0, units: [1, 2, 3] },
    });

    expect(result.current.convertedUnitsFrom).toEqual([]);
    expect(result.current.convertedUnitsTo).toEqual([]);
  });

  it('Единицы должны корректно конвертироваться', () => {
    const { result } = renderHook(({ rate, units }) => useUnits(rate, units), {
      initialProps: { rate: 2, units: [1, 2, 3] },
    });

    expect(result.current.convertedUnitsFrom).toEqual([2, 4, 6]);
    expect(result.current.convertedUnitsTo).toEqual([0.5, 1, 1.5]);
  });

  it('Единицы должны корректно обновляться при изменении коэффициента', () => {
    const { result, rerender } = renderHook(
      ({ rate, units }) => useUnits(rate, units),
      {
        initialProps: { rate: 2, units: [1, 2, 3] },
      },
    );

    expect(result.current.convertedUnitsFrom).toEqual([2, 4, 6]);
    expect(result.current.convertedUnitsTo).toEqual([0.5, 1, 1.5]);

    rerender({ rate: 3, units: [1, 2, 3] });

    expect(result.current.convertedUnitsFrom).toEqual([3, 6, 9]);
    expect(result.current.convertedUnitsTo).toEqual(
      [0.33, 0.67, 1].map((n) => parseFloat(n.toFixed(2))),
    );
  });

  it('Единицы должны корректно обновляться, если изменились входные единицы', () => {
    const { result, rerender } = renderHook(
      ({ rate, units }) => useUnits(rate, units),
      {
        initialProps: { rate: 2, units: [1, 2, 3] },
      },
    );

    expect(result.current.convertedUnitsFrom).toEqual([2, 4, 6]);
    expect(result.current.convertedUnitsTo).toEqual([0.5, 1, 1.5]);

    rerender({ rate: 2, units: [4, 5, 6] });

    expect(result.current.convertedUnitsFrom).toEqual([8, 10, 12]);
    expect(result.current.convertedUnitsTo).toEqual([2, 2.5, 3]);
  });
});
