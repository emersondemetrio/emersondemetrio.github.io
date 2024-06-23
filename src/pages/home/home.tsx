import "react";
import { useState } from "react";
import { CurrencyNow } from "@/components/currency-now/currency-now";
import { CustomModal } from "@/components/modal/modal";
import { Terminal } from "@/components/terminal/terminal";
import { Links } from "@/constants";

export const Home = () => {
  const [showCurrency, setShowCurrency] = useState(false);

  return (
    <>
      <section className="page-section" id="services">
        <div className="home-container">
          <Terminal
            links={Links}
            tools={[
              {
                handle: "Currency Tools",
                category: "tools",
                title: "Currency Tools",
                actions: {
                  onMaximize: () => setShowCurrency(true),
                  onMinimize: () => setShowCurrency(false),
                  onClose: () => setShowCurrency(false),
                },
              },
            ]}
          />
        </div>
      </section>
      <CustomModal
        title="Currency Tools"
        visible={showCurrency}
        onClose={() => setShowCurrency(false)}
      >
        <CurrencyNow />
      </CustomModal>
    </>
  );
};
