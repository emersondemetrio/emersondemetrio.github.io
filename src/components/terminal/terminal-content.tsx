import "./terminal.css";
import { TerminalHeader } from "./terminal-header";
import { TerminalFooter } from "./terminal-footer";
import { openUrl } from "@/utils/utils";
import { Actions } from "@/types";
import { useState } from "react";

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
  about,
}: TerminalContentProps) => {
  const handleClick = () => {
    if (url) {
      return openUrl(url, keepFocus ? "_self" : "_blank");
    }

    if (typeof onClick === "function") {
      onClick();
    }
  };

  const [aboutVisibility, setAboutVisibility] = useState<boolean>(false);

  const showAbout = () => setAboutVisibility(true);
  const hideAbout = () => setAboutVisibility(false);

  return (
    <div
      tabIndex={tabIndex}
      className={"rounded hover:outline hover:outline-solid outline-offset-2 outline-cyan-500"}
      key={`${category}/${title}`}
      onFocus={showAbout}
      onBlur={hideAbout}
      onMouseEnter={showAbout}
      onMouseLeave={hideAbout}
    >
      <TerminalHeader title={title} actions={actions} />
      <div className="terminal-item-content" onClick={handleClick}>
        <span>{aboutVisibility ? `${handle}: ${about}` : handle}</span>
      </div>
      <TerminalFooter category={category} />
    </div>
  );
};
