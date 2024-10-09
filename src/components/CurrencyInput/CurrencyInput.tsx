import { FC, memo } from 'react';
import s from './CurrencyInput.module.scss';

interface ICurrencyInputProps {
  value?: number;
  onChange?: (value: number) => void;
  underText?: string;
  loading?: boolean;
}

const CurrencyInputComponent: FC<ICurrencyInputProps> = ({
  value,
  onChange,
  underText,
  loading,
}) => {
  return (
    <div className={`${s.currencyInput}`}>
      <input
        type={'number'}
        step={0.01}
        disabled={loading}
        className={`flat ${loading ? s.loading : ''}`}
        value={value?.toString()}
        min={'1'}
        onChange={(e) => onChange && onChange(Number(e.target.value))}
      />
      {underText && (
        <>
          <hr className={s.separator} />
          <span className={s.underText}>
            {loading ? 'Loading..' : underText}
          </span>
        </>
      )}
    </div>
  );
};

export default memo(CurrencyInputComponent);
