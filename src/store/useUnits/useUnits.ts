import { useEffect, useMemo, useState } from 'react';

interface UseUnitsResult {
  convertedUnitsFrom: number[];
  convertedUnitsTo: number[];
}

const useUnits = (rate: number, units: number[]): UseUnitsResult => {
  const [convertedUnitsFrom, setConvertedUnitsFrom] = useState<number[]>([]);
  const [convertedUnitsTo, setConvertedUnitsTo] = useState<number[]>([]);

  useEffect(() => {
    if (rate) {
      const newConverted = units.map((unit) =>
        parseFloat((unit * rate).toFixed(2)),
      );
      setConvertedUnitsFrom(newConverted);
    } else {
      setConvertedUnitsFrom([]);
    }
  }, [rate, units]);

  useEffect(() => {
    if (rate) {
      const newConverted = units.map((unit) =>
        parseFloat((unit / rate).toFixed(2)),
      );
      setConvertedUnitsTo(newConverted);
    } else {
      setConvertedUnitsTo([]);
    }
  }, [rate, units]);

  return useMemo(
    () => ({
      convertedUnitsFrom,
      convertedUnitsTo,
    }),
    [convertedUnitsFrom, convertedUnitsTo],
  );
};

export default useUnits;
