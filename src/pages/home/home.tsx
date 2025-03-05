import "react";
import { useState } from "react";
import { CurrencyNow } from "@/components/currency-now/currency-now";
import { Modal } from "@/components/modal/modal";
import { Terminal } from "@/components/terminal/terminal";
import { experiments, Links } from "@/constants";
import { Page } from "@/components/page/page";
import { Hero } from "@/components/hero/hero";
import { usePasteable } from "../pasteable/hooks/use-pasteable";

export const Home = () => {
  const [showCurrency, setShowCurrency] = useState(false);
  const { handlePaste } = usePasteable(true);

  return (
    <Page isHome name="Home" withoutName onPaste={handlePaste}>
      <Hero />
      <Terminal
        links={Links.sort((a, b) => (a.ranking > b.ranking ? 1 : -1))}
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
            about: "Compare currency worldwide.",
          },
        ]}
        experiments={experiments}
      />
      <Modal
        title="Currency Tools"
        visible={showCurrency}
        onClose={() => setShowCurrency(false)}
      >
        <CurrencyNow />
      </Modal>
    </Page>
  );
};
