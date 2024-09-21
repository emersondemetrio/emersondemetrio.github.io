import { Link } from 'react-router-dom';
import { BaseCurrency, CurrencyProvider } from '../../types';

type BadgeProps = {
  base: BaseCurrency;
  target: string;
  amount: number;
  provider: CurrencyProvider;
};

export const Badge = ({ base, target, amount, provider }: BadgeProps) => {
  return (
    <Link
      target="_blank"
      className="badge badge-primary"
      to={provider.url(base, target, amount)}
    >
      {provider.nickname}
    </Link>
  );
};
