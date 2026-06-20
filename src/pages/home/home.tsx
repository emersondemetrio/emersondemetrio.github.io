import "./home.css";
import { useState, useEffect } from "react";
import { Links } from "@/constants";
import { CurrencyNow } from "@/components/currency-now/currency-now";
import { Modal } from "@/components/modal/modal";

type FilterKey = "all" | "social" | "professional" | "arts";
type Theme = "light" | "dark";

const THEME_KEY = "mx-theme";

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
  Blog: "badcompiler.dev",
  Playlists: "curated on YouTube",
};

const mixtapeLinks = Links.map((l) => ({
  label: labelOverrides[l.title] ?? l.title,
  handle: handleOverrides[l.title] ?? l.handle,
  cat: l.category,
  href: l.url,
}));

const featuredExperiments = [
  {
    title: "Currency Tools",
    blurb: "A tiny FX converter that does one thing well.",
    href: null,
  },
  {
    title: "Remove Background",
    blurb: "Client-side image cutout — nothing leaves the tab.",
    href: "#/labs/background",
  },
  {
    title: "Canvas Game",
    blurb: "A small thing you can actually play.",
    href: "#/labs/game",
  },
];

function getInitialTheme(): Theme {
  const stored = localStorage.getItem(THEME_KEY) as Theme | null;
  if (stored === "light" || stored === "dark") return stored;
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark";
  return "light";
}

const RecordMark = ({ size }: { size: "sm" | "md" }) => (
  <div className={`mx-record mx-record-${size}`} />
);

export const Home = () => {
  const [filter, setFilter] = useState<FilterKey>("all");
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const [showCurrency, setShowCurrency] = useState(false);

  useEffect(() => {
    localStorage.setItem(THEME_KEY, theme);
    document.body.style.background = theme === "light" ? "#f4f1ea" : "#141210";
    return () => {
      document.body.style.background = "";
    };
  }, [theme]);

  useEffect(() => {
    document.title = "emerson.run";
  }, []);

  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  const visibleSections = sections.filter(
    (s) => filter === "all" || filter === s.cat
  );

  const Logo = ({ size }: { size: "sm" | "md" }) => (
    <div className="mx-logo">
      <RecordMark size={size} />
      <div className={`mx-wordmark mx-wordmark-${size}`}>
        EMERSON<span className="mx-accent-dot">·</span>RUN
      </div>
    </div>
  );

  const ThemeBtn = ({ showLabel }: { showLabel: boolean }) => (
    <button className="mx-theme-btn" onClick={toggleTheme}>
      <span>{theme === "light" ? "☾" : "☀"}</span>
      {showLabel && (
        <span>{theme === "light" ? "Dark" : "Light"}</span>
      )}
    </button>
  );

  return (
    <div className="mx-page" data-theme={theme}>
      {/* Mobile-only header */}
      <div className="mx-mobile-header">
        <Logo size="sm" />
        <ThemeBtn showLabel={false} />
      </div>

      <div className="mx-inner">
        {/* Desktop-only header */}
        <div className="mx-desktop-header">
          <Logo size="md" />
          <ThemeBtn showLabel={true} />
        </div>

        {/* Intro */}
        <div className="mx-intro">
          <h1 className="mx-h1">Everywhere to find me.</h1>
          <p className="mx-subline">
            <span className="mx-desktop-only">
              a software engineer, currently recompiling for the AI era —
              Links, Vol. 2
            </span>
            <span className="mx-mobile-only">
              a software engineer, recompiling — Vol. 2
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
                    target={link.href.startsWith("mailto:") ? undefined : "_blank"}
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
              {featuredExperiments.map((exp) =>
                exp.href ? (
                  <a
                    key={exp.title}
                    href={exp.href}
                    className="mx-exp-card"
                  >
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

          {/* Footer */}
          <div className="mx-page-footer">
            <span className="mx-desktop-only">
              © 2026 emerson.run — thanks for stopping by, whoever you are.
            </span>
            <span className="mx-mobile-only">
              © 2026 emerson.run — thanks for stopping by.
            </span>
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
