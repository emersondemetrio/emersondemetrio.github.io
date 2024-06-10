import { useState } from "react";
import { formatToCurrency, useCurrencyNow } from "../../hooks/use-currency-now";
import { Loading } from "../loading/loading";
import { Badge } from "../badge/badge";
import { CurrencyProviders } from "../../constants";

export const CurrencyNow = () => {
  const { data, isLoading, error } = useCurrencyNow();
  const [userInput, setUserInput] = useState<number | null>(null);

  if (isLoading) {
    return <Loading />;
  }

  const copy = (message: string) => () => {
    navigator.clipboard.writeText(message);
    alert("Copied to clipboard!");
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const inputValue = parseInt(event.target.value, 10);

    if (isNaN(inputValue)) {
      setUserInput(null);
      return;
    }

    if (inputValue > 5_000_000) {
      return;
    }

    setUserInput(inputValue);
  };

  if (data === null) {
    return <div className="currency-item">No currency data</div>;
  }

  if (error) {
    return <div className="currency-item">{error.message}</div>;
  }

  return (
    <div className="currency-now">
      <div className="currency-item">
        <input
          type="number"
          max={999999}
          placeholder="Currency"
          value={userInput ?? ""}
          onChange={handleChange}
        />
      </div>
      {Object.entries(data.rates).map(([currency, rate]) => {
        const asEuros = formatToCurrency(userInput || 1, "eur");
        const asCurrency = formatToCurrency(userInput, currency, rate);

        return (
          <div className="currency-item" key={currency}>
            <span
              title={currency}
              style={{ flex: 1 }}
              onClick={copy(`${asEuros} = ${asCurrency}`)}
            >
              {asEuros} = {asCurrency}
            </span>
            <div
              style={{
                display: "flex",
                gap: "0.1rem",
              }}
            >
              {CurrencyProviders.map((provider) => (
                <Badge
                  key={provider.name}
                  currency={currency}
                  amount={userInput || 1}
                  provider={provider}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
