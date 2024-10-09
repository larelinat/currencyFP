import { FC, memo } from 'react';
import s from './Table.module.scss';

interface ITableProps {
  className?: string;
  headerUnits?: string;
  headerData?: string;
  units?: string[] | number[];
  data?: string[] | number[];
}

const TableComponent: FC<ITableProps> = ({
  className,
  headerUnits,
  headerData,
  units,
  data,
}) => {
  return (
    <section className={`${className}`} data-testid="table-component">
      <section className={s.table}>
        <article className={s.row}>
          <span className={`${s.item} ${s.headItem}`}>{headerUnits}</span>
          <span className={`${s.item} ${s.headItem}`}>{headerData}</span>
        </article>

        {units?.map((rate, index) => (
          <article key={index} className={s.row}>
            <span className={s.item}>{rate}</span>
            <span className={s.item}>{data?.[index] || '...'}</span>
          </article>
        ))}
      </section>
    </section>
  );
};

export default memo(TableComponent);
