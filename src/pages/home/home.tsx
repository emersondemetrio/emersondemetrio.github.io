import "react";
import { useState } from "react";
import { CurrencyNow } from "@/components/currency-now/currency-now";
import { CustomModal } from "@/components/modal/modal";
import { Terminal } from "@/components/terminal/terminal";
import { Links } from "@/constants";
import { Page } from "@/components/page/page";

export const Home = () => {
  const [showCurrency, setShowCurrency] = useState(false);

  return (
    <Page>
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
      <CustomModal
        title="Currency Tools"
        visible={showCurrency}
        onClose={() => setShowCurrency(false)}
      >
        <CurrencyNow />
      </CustomModal>
    </Page>
  );
};
