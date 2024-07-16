import { useState } from 'react';
import { formatToCurrency, useCurrencyNow } from '../../hooks/use-currency-now';
import { Loading } from '../loading/loading';
import { Badge } from '../badge/badge';
import { CurrencyProviders } from '../../constants';

export const CurrencyNow = () => {
  const { data, isLoading, error } = useCurrencyNow();
  const [userInput, setUserInput] = useState<number | null>(null);

  if (isLoading) {
    return <Loading />;
  }

  const copy = (message: string) => () => {
    navigator.clipboard.writeText(message);
    alert('Copied to clipboard!');
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
      <div className="overflow-x-auto">
        <input
          type="number"
          max={999999}
          placeholder="Type (EUR)"
          value={userInput ?? ''}
          onChange={handleChange}
          className="input input-bordered input-md w-full max-w-xs"
        />
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
              const asEuros = formatToCurrency(userInput || 1, 'eur');
              const asCurrency = formatToCurrency(userInput, currency, rate);

              return (
                <tr
                  key={currency}
                  title={currency}
                  onClick={copy(`${asEuros} = ${asCurrency}`)}
                >
                  <th>{index + 1}</th>
                  <td>EUR to {currency}</td>
                  <td>
                    {asEuros} = {asCurrency}
                  </td>
                  <td>
                    {CurrencyProviders.map(provider => (
                      <Badge
                        key={provider.name}
                        currency={currency}
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
