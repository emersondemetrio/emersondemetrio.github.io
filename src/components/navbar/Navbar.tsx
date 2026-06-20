import "./navbar.css";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "@/context/theme-context";

const navLinks = [
  { label: "About", to: "/about" },
  { label: "Blog", to: "/blog" },
];

export const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { pathname } = useLocation();

  return (
    <nav className="mx-nav">
      <div className="mx-nav-inner">
        <Link to="/" className="mx-nav-logo">
          <div className="mx-nav-record" />
          <span className="mx-nav-wordmark">
            EMERSON<span className="mx-accent-dot">·</span>RUN
          </span>
        </Link>

        <div className="mx-nav-right">
          {navLinks.map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              className={`mx-nav-link${pathname === to ? " active" : ""}`}
            >
              {label}
            </Link>
          ))}
          <div className="mx-nav-divider" />
          <button className="mx-theme-btn" onClick={toggleTheme}>
            <span>{theme === "light" ? "☾" : "☀"}</span>
            <span className="mx-theme-btn-label">
              {theme === "light" ? "Dark" : "Light"}
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
};
