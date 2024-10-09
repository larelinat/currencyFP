import { useCallback, useEffect, useMemo, useState } from 'react';

interface UseAmountsResult {
  amountFrom: {
    value: number;
    handleChange: (value: number) => void;
  };
  amountTo: {
    value: number;
    handleChange: (value: number) => void;
  };
}

const useAmounts = (
  initialAmountFrom?: number,
  initialAmountTo?: number,
  rate?: number,
): UseAmountsResult => {
  const [amountFrom, setAmountFrom] = useState<number>(initialAmountFrom ?? 1);
  const [amountTo, setAmountTo] = useState<number>(initialAmountTo ?? 1);

  useEffect(() => {
    if (rate) {
      setAmountTo(parseFloat((amountFrom * rate).toFixed(2)));
    }
  }, [rate]);

  const handleAmountFromChange = useCallback(
    (value: number) => {
      if (rate) {
        setAmountFrom(value);
        setAmountTo(parseFloat((value * rate).toFixed(2)));
      }
    },
    [rate],
  );

  const handleAmountToChange = useCallback(
    (value: number) => {
      if (rate) {
        setAmountTo(value);
        setAmountFrom(parseFloat((value / rate).toFixed(2)));
      }
    },
    [rate],
  );

  const amountFromMemo = useMemo(
    () => ({
      value: amountFrom,
      handleChange: handleAmountFromChange,
    }),
    [amountFrom, handleAmountFromChange],
  );

  const amountToMemo = useMemo(
    () => ({
      value: amountTo,
      handleChange: handleAmountToChange,
    }),
    [amountTo, handleAmountToChange],
  );

  return {
    amountFrom: amountFromMemo,
    amountTo: amountToMemo,
  };
};

export default useAmounts;
