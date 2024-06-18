import "react";
import { useState } from "react";
import { CurrencyNow } from "../../components/currency-now/currency-now";
import { Modal } from "../../components/modal/modal";
import { Terminal } from "../../components/terminal/terminal";
import { Links } from "../../constants";
import "./home.css";

const Header = () => {
  return (
    <div
      className="row"
      style={{
        display: "flex",
        flex: 1,
      }}
    >
      <div
        className="col-lg-12 text-center"
        style={{
          marginTop: 20,
          marginBottom: 20,
        }}
      >
        <h3 className="section-heading text-primary black-bg">
          ~ Emerson Demetrio
        </h3>
        <p className="text-primary black-bg">Software Engineer and musician.</p>
      </div>
    </div>
  );
};

export const Home = () => {
  const [showCurrency, setShowCurrency] = useState(false);

  return (
    <>
      <section className="page-section" id="services">
        <div className="home-container">
          <Header />
          <Terminal
            links={Links}
            tools={[
              {
                handle: "Currency Tools",
                category: "currency",
                title: "tools",
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
      <Modal
        title="Currency Tools"
        visible={showCurrency}
        onClose={() => setShowCurrency(false)}
      >
        <CurrencyNow />
      </Modal>
    </>
  );
};
