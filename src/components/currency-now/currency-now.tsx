import { useState } from "react";
import { formatToCurrency, useCurrencyNow } from "../../hooks/use-currency-now";
import { Loading } from "../loading/loading";
import { Badge } from "../badge/badge";
import { CurrencyProviders } from "../../constants";
import { BaseCurrency } from "@/types";
import { CurrencyToggles } from "./currency-toggle";

type CurrencyNowProps = {
  asList?: boolean;
};

export const CurrencyNow = ({ asList = false }: CurrencyNowProps) => {
  const [base, setBase] = useState<BaseCurrency>("EUR");
  const { data, isLoading, error, refresh } = useCurrencyNow(base);
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

  if (asList) {
    return (
      <div className="flex flex-col w-64 border border-gray-500 p-10">
        <h3>Currency</h3>
        {Object.entries(data.rates).map(([currency, rate]) => {
          const asBase = formatToCurrency(
            userInput || 1,
            base.toLocaleLowerCase(),
          );
          const asTarget = formatToCurrency(userInput, currency, rate);

          return (
            <div
              key={currency}
              title={currency}
              className="flex flex-row items-center justify-between"
            >
              <div>
                {asBase} = {asTarget}
              </div>
              <div>
                {CurrencyProviders.map((provider) => (
                  <Badge
                    key={provider.name}
                    base={base}
                    target={currency}
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
  }

  return (
    <div className="currency-now">
      <div className="overflow-x-auto">
        <div>
          <input
            type="number"
            max={999999}
            placeholder={`Type (${base})`}
            value={userInput ?? ""}
            onChange={handleChange}
            className="input input-bordered input-md w-full max-w-xs"
          />

          <button className="btn btn-xs" onClick={refresh}>🔄</button>
        </div>
        <CurrencyToggles base="EUR" onChange={setBase} options={["EUR", "USD", "BRL"]} />
        <table className="table">
          <thead>
            <tr>
              <th></th>
              <th>Conversion</th>
              <th>Rate</th>
              <th>Sources</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(data.rates).map(([currency, rate], index) => {
              const asBase = formatToCurrency(
                userInput || 1,
                base.toLocaleLowerCase(),
              );
              const asTarget = formatToCurrency(userInput, currency, rate);
              const handleCopy = copy(`${asBase} = ${asTarget}`);

              return (
                <tr
                  key={currency}
                  title={currency}
                >
                  <th onClick={handleCopy}>{index + 1}</th>
                  <td onClick={handleCopy}>
                    {base} to {currency}
                  </td>
                  <td onClick={handleCopy}>
                    {asBase} = {asTarget}
                  </td>
                  <td>
                    {CurrencyProviders.map((provider) => (
                      <Badge
                        key={provider.name}
                        base={base}
                        target={currency}
                        amount={userInput || 1}
                        provider={provider}
                      />
                    ))}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
