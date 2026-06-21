import "./home.css";
import { useState } from "react";
import { Links, experiments } from "@/constants";
import { CurrencyNow } from "@/components/currency-now/currency-now";
import { Modal } from "@/components/modal/modal";
import { usePasteable } from "@/pages/pasteable/hooks/use-pasteable";

type FilterKey = "all" | "social" | "professional" | "arts";

const sections = [
  { cat: "social" as const, name: "Social" },
  { cat: "professional" as const, name: "Work" },
  { cat: "arts" as const, name: "Arts" },
];

const filters: FilterKey[] = ["all", "social", "professional", "arts"];
const filterLabels: Record<FilterKey, string> = {
  all: "All",
  social: "Social",
  professional: "Work",
  arts: "Arts",
};

const labelOverrides: Record<string, string> = {
  email: "Email",
  Whatsapp: "WhatsApp",
  "x (Twitter)": "X / Twitter",
};

const handleOverrides: Record<string, string> = {
  Blog: "badcompiler",
  Playlists: "curated on YouTube",
};

const mixtapeLinks = Links.map((l) => ({
  label: labelOverrides[l.title] ?? l.title,
  handle: handleOverrides[l.title] ?? l.handle,
  cat: l.category,
  href: l.url,
}));

const currencyCard = {
  title: "Currency Tools",
  blurb: "A tiny FX converter that does one thing well.",
  href: null as string | null,
};

const allExperiments = [
  currencyCard,
  ...experiments.map((e) => ({ title: e.title, blurb: e.description, href: e.link })),
];

export const Home = () => {
  const [filter, setFilter] = useState<FilterKey>("all");
  const [showCurrency, setShowCurrency] = useState(false);
  const { handlePaste } = usePasteable(true);

  const visibleSections = sections.filter(
    (s) => filter === "all" || filter === s.cat
  );

  return (
    <div className="mx-home" onPaste={handlePaste}>
      <div className="mx-inner">
        {/* Intro */}
        <div className="mx-intro">
          <h1 className="mx-h1">Everywhere to find me.</h1>
          <p className="mx-subline">
            <span className="mx-desktop-only">
              a software engineer, currently recompiling for the AI era -
              Links, Vol. 2
            </span>
            <span className="mx-mobile-only">
              a software engineer, recompiling - Vol. 2
            </span>
          </p>
        </div>

        {/* Category filters */}
        <div className="mx-filters">
          {filters.map((f) => (
            <button
              key={f}
              className={`mx-filter-pill${filter === f ? " active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {filterLabels[f]}
            </button>
          ))}
        </div>

        <div className="mx-sections-wrapper">
          {/* Link sections */}
          {visibleSections.map((sec) => (
            <div key={sec.cat} className="mx-section">
              <div className="mx-section-header">
                <span className="mx-section-label">{sec.name}</span>
                <span className="mx-section-rule" />
              </div>
              {mixtapeLinks
                .filter((l) => l.cat === sec.cat)
                .map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="mx-link-row"
                    target={
                      link.href.startsWith("mailto:") ? undefined : "_blank"
                    }
                    rel={
                      link.href.startsWith("mailto:")
                        ? undefined
                        : "noopener noreferrer"
                    }
                  >
                    <span className="mx-link-left">
                      <span className="mx-link-label">{link.label}</span>
                      <span className="mx-link-handle">{link.handle}</span>
                    </span>
                    <span className="mx-link-open">
                      <span className="mx-link-open-text">Open </span>↗
                    </span>
                  </a>
                ))}
            </div>
          ))}

          {/* Experiments */}
          <div className="mx-experiments">
            <div className="mx-experiments-header">
              <h2 className="mx-h2">Experiments</h2>
              <span className="mx-experiments-note">
                a few small things I built for fun
              </span>
            </div>
            <div className="mx-experiments-grid">
              {allExperiments.map((exp) =>
                exp.href ? (
                  <a key={exp.title} href={exp.href} className="mx-exp-card">
                    <div className="mx-exp-card-content">
                      <div className="mx-exp-title">{exp.title}</div>
                      <div className="mx-exp-blurb">{exp.blurb}</div>
                    </div>
                    <div className="mx-exp-open">Open ↗</div>
                  </a>
                ) : (
                  <button
                    key={exp.title}
                    className="mx-exp-card"
                    onClick={() => setShowCurrency(true)}
                  >
                    <div className="mx-exp-card-content">
                      <div className="mx-exp-title">{exp.title}</div>
                      <div className="mx-exp-blurb">{exp.blurb}</div>
                    </div>
                    <div className="mx-exp-open">Open ↗</div>
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      <Modal
        title="Currency Tools"
        visible={showCurrency}
        onClose={() => setShowCurrency(false)}
      >
        <CurrencyNow />
      </Modal>
    </div>
  );
};
