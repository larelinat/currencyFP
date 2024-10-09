import { FC, memo } from 'react';
import Section from '@components/Section/Section.tsx';
import { useConvert } from '@/store/ConvertProvider/ConvertProvider.tsx';
import useUnits from '@/store/useUnits/useUnits.ts';
import TableComponent from '@components/CurrencyTable/Table.tsx';
import s from './Price.module.scss';

interface IPriceProps {
  className?: string;
}

const units = [1, 5, 10, 25, 50, 100, 500, 1000, 5000];

const PriceComponent: FC<IPriceProps> = ({ className }) => {
  const { rate, fromCurrency, toCurrency } = useConvert();

  const { convertedUnitsFrom, convertedUnitsTo } = useUnits(rate, units);

  return (
    <Section className={className} title={'Стоимость конвертации'}>
      <section className={s.price}>
        <TableComponent
          className={className}
          headerUnits={`${fromCurrency.value}`}
          headerData={`${toCurrency.value}`}
          units={units}
          data={convertedUnitsFrom}
        />
        <TableComponent
          className={className}
          headerUnits={`${toCurrency.value}`}
          headerData={`${fromCurrency.value}`}
          units={units}
          data={convertedUnitsTo}
        />
      </section>
    </Section>
  );
};

export default memo(PriceComponent);
