import { FC, memo, useMemo } from 'react';
import Section from '@components/Section/Section.tsx';
import {
  CategoryScale,
  Chart,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from 'chart.js';
import useRateHistory from '@/store/useRateHistory/useRateHistory.ts';
import { Line } from 'react-chartjs-2';
import { useConvert } from '@/store/ConvertProvider/ConvertProvider.tsx';

Chart.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
);

interface IHistoryProps {
  className?: string;
}

const HistoryComponent: FC<IHistoryProps> = ({ className }) => {
  const { fromCurrency, toCurrency } = useConvert();
  const { currencyHistory } = useRateHistory(
    fromCurrency.value,
    toCurrency.value,
  );

  const data = useMemo(
    () => ({
      labels: currencyHistory.map((h) => h.date),
      datasets: [
        {
          label: `${fromCurrency.value} / ${toCurrency.value}`,
          data: currencyHistory.map((h) => h.rate),
          fill: false,
          borderColor: 'rgba(75,192,192,1)',
        },
      ],
    }),
    [currencyHistory, fromCurrency.value, toCurrency.value],
  );

  return (
    <Section className={className} title={'История курса'}>
      <Line data={data} />
    </Section>
  );
};

export default memo(HistoryComponent);
