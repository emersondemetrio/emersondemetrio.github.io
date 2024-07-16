import { Link } from 'react-router-dom';
import { CurrencyProvider } from '../../types';

type BadgeProps = {
  amount: number;
  currency: string;
  provider: CurrencyProvider;
};

export const Badge = ({ amount, currency, provider }: BadgeProps) => {
  return (
    <Link
      target="_blank"
      className="badge badge-primary"
      to={provider.url(amount, currency)}
    >
      {provider.nickname}
    </Link>
  );
};
