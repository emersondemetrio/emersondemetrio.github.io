import { BaseCurrency } from "@/types";
import { useState } from "react";

type CurrencyTogglesProps = {
  base: BaseCurrency;
  options: BaseCurrency[];
  onChange: (base: BaseCurrency) => void;
};

export const CurrencyToggles = ({ base, options, onChange }: CurrencyTogglesProps) => {
  const [current, setCurrent] = useState<BaseCurrency>(base);

  return (
    <div className="p-10">
      {options.map((base) => {
        const className = `${current === base ? "btn-active" : "btn-accent"}`;

        return (
          <button
            key={base}
            className={`mx-2 btn btn-sm btn-outline ${className}`}
            onClick={() => {
              setCurrent(base);
              onChange(base);
            }}
          >
            {base}
          </button>
        );
      })}
    </div>
  );
};
