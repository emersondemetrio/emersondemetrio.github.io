import "./terminal.css";
import { TerminalHeader } from "./terminal-header";
import { TerminalFooter } from "./terminal-footer";
import { openUrl } from "@/utils/utils";
import { Actions } from "@/types";

type TerminalContentProps = {
  className: string;
  title: string;
  handle: string;
  category: string;
  onFocus: (category: string) => void;
  onLoseFocus: () => void;
  url?: string;
  onClick?: () => void;
  actions?: Actions;
};

export const TerminalContent = ({
  className,
  category,
  title,
  handle,
  onFocus,
  onLoseFocus,
  url,
  onClick,
  actions,
}: TerminalContentProps) => {
  const handleClick = () => {
    if (url) {
      return openUrl(url);
    }

    if (typeof onClick === "function") {
      onClick();
    }
  };

  return (
    <div
      className={className}
      key={`${category}/${title}`}
      onMouseEnter={() => onFocus(category)}
      onMouseLeave={() => onLoseFocus()}
    >
      <TerminalHeader title={title} actions={actions} />
      <div className="terminal-item-content" onClick={handleClick}>
        <span>{handle}</span>
      </div>
      <TerminalFooter category={category} />
    </div>
  );
};
