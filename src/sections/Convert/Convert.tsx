import { FC, memo, useEffect, useState } from 'react';
import Section from '@components/Section/Section.tsx';
import CurrencyInput from '@components/CurrencyInput/CurrencyInput.tsx';
import { ArrowLeftRight } from 'lucide-react';
import s from './Convert.module.scss';
import { useConvert } from '@/store/ConvertProvider/ConvertProvider.tsx';

interface IConvertProps {
  className?: string;
}

const ConvertComponent: FC<IConvertProps> = ({ className }) => {
  const {
    amountFrom,
    amountTo,
    rate,
    loading,
    fromCurrency,
    toCurrency,
    currencies,
  } = useConvert();

  const [loadingAll, setLoadingAll] = useState(false);

  useEffect(() => {
    setLoadingAll(loading);
  }, [loading]);

  const handleSwap = () => {
    setLoadingAll(true);
    const tempAmount = amountTo.value;
    const tempCurrency = fromCurrency.value;
    fromCurrency.setFromCurrency(toCurrency.value);
    toCurrency.setToCurrency(tempCurrency);
    amountFrom.handleChange(tempAmount);
  };

  return (
    <Section title={'Конвертер валют'} className={`${className}`} fixed={true}>
      <section className={s.convert}>
        <section className={s.currency}>
          <CurrencyInput
            loading={loadingAll}
            value={amountFrom.value}
            onChange={amountFrom.handleChange}
            underText={`1 ${fromCurrency.value} = ${rate.toFixed(2)} ${toCurrency.value}`}
          />
          <select
            disabled={loadingAll}
            value={fromCurrency.value}
            onChange={(e) => fromCurrency.setFromCurrency(e.target.value)}
          >
            {currencies &&
              Object.keys(currencies).map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
          </select>
        </section>
        <button className={'flat'} disabled={loadingAll} onClick={handleSwap}>
          <ArrowLeftRight />
        </button>
        <section className={s.currency}>
          <CurrencyInput
            loading={loadingAll}
            value={amountTo.value}
            onChange={amountTo.handleChange}
            underText={`1 ${toCurrency.value} = ${(1 / rate).toFixed(2)} ${fromCurrency.value}`}
          />
          <select
            disabled={loadingAll}
            value={toCurrency.value}
            onChange={(e) => toCurrency.setToCurrency(e.target.value)}
          >
            {currencies &&
              Object.keys(currencies).map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
          </select>
        </section>
      </section>
    </Section>
  );
};

export default memo(ConvertComponent);
