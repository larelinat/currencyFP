import { CurrencyList } from '@api/types.ts';
import { createContext, FC, memo, ReactNode, useContext } from 'react';
import useCurrencies from '@/store/useCurrencies/useCurrencies.ts';
import useRates from '@/store/useRates/useRates.ts';
import useAmounts from '@/store/useAmounts/useAmounts.ts';

interface ConvertContextProps {
  amountFrom: {
    value: number;
    handleChange: (value: number) => void;
  };
  amountTo: {
    value: number;
    handleChange: (value: number) => void;
  };
  rate: number;
  loading: boolean;
  error: string | null;
  fromCurrency: {
    value: string;
    setFromCurrency: (currency: string) => void;
  };
  toCurrency: {
    value: string;
    setToCurrency: (currency: string) => void;
  };
  currencies: CurrencyList | undefined;
}

const ConvertContext = createContext<ConvertContextProps | undefined>(
  undefined,
);

const ConvertProviderBase: FC<{ children: ReactNode }> = ({ children }) => {
  const {
    currencies,
    loading: currenciesLoading,
    error: currenciesError,
  } = useCurrencies();
  const {
    rate,
    loading: ratesLoading,
    error: ratesError,
    fromCurrency,
    toCurrency,
  } = useRates();
  const { amountFrom, amountTo } = useAmounts(1, 1, rate);

  const loading = currenciesLoading || ratesLoading;
  const error = currenciesError || ratesError;

  return (
    <ConvertContext.Provider
      value={{
        amountFrom,
        amountTo,
        rate,
        loading,
        error,
        fromCurrency,
        toCurrency,
        currencies,
      }}
    >
      {children}
    </ConvertContext.Provider>
  );
};

export const ConvertProvider = memo(ConvertProviderBase);

export const useConvert = (): ConvertContextProps => {
  const context = useContext(ConvertContext);
  if (!context) {
    throw new Error('useConvert must be used within a ConvertProvider');
  }
  return context;
};
