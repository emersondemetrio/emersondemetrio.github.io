import "./terminal.css";
import { TerminalHeader } from "./terminal-header";
import { TerminalFooter } from "./terminal-footer";
import { openUrl } from "@/utils/utils";
import { Actions } from "@/types";


type TerminalContentProps = {
  title: string;
  handle: string;
  category: string;
  url?: string;
  onClick?: () => void;
  actions?: Actions;
  keepFocus?: boolean;
  tabIndex: number;
  about: string;
  disabled?: boolean;
};

export const TerminalContent = ({
  category,
  title,
  handle,
  url,
  onClick,
  actions,
  keepFocus,
  tabIndex,
  disabled,
}: TerminalContentProps) => {
  const handleClick = () => {
    if (disabled) return;

    if (url) {
      return openUrl(url, keepFocus ? "_self" : "_blank");
    }

    if (typeof onClick === "function") {
      onClick();
    }
  };

  return (
    <a
      tabIndex={tabIndex}
      className={`md:p-0 px-6 rounded hover:outline hover:outline-solid outline-offset-2 ${
        disabled ? "opacity-50 cursor-not-allowed bg-gray-900" : ""
      }`}
      key={`${category}/${title}`}
    >
      <div className="rounded terminal-header">
      <span className="title-container">
        {title.toLowerCase().split(" ").join("-")}
      </span>
    </div>
      <div className="terminal-item-content" onClick={handleClick}>
        <span>{handle}</span>
      </div>
    </a>
  );
};
