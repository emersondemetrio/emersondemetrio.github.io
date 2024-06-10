import { CurrencyProvider } from "../../types";

type BadgeProps = {
  amount: number;
  currency: string;
  provider: CurrencyProvider;
};

export const Badge = ({ amount, currency, provider }: BadgeProps) => {
  const openProvider = () => {
    window.open(provider.url(amount, currency));
  };

  return (
    <small className="currency-f" onClick={openProvider}>
      {provider.nickname}
    </small>
  );
};
