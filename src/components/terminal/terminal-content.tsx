import { Actions } from "@/types";
import { openUrl } from "@/utils/utils";
import { TerminalFooter } from "./terminal-footer";
import { TerminalHeader } from "./terminal-header";
import "./terminal.css";
import { IconType } from "react-icons";

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
  Icon?: IconType
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
  Icon,
}: TerminalContentProps) => {
  const handleClick = () => {
    if (url) {
      return openUrl(url, keepFocus ? "_self" : "_blank");
    }

    if (typeof onClick === "function") {
      onClick();
    }
  };

  const categoryClassLookup: Map<string, string[]> = new Map([
    ["experiments", ["outline", "outline-rose-800", "outline-rose-500"]],
    ["tools", ["outline-cyan-500", "outline-cyan-300"]],
    ["social", ["outline-blue-400", "outline-blue-200"]],
    ["professional", ["outline-green-400", "outline-green-200"]],
    ["arts", ["outline-purple-400", "outline-purple-200"]],
  ]);

  const categoryClass = categoryClassLookup.get(category)?.join(" ");

  return (
    <div
      tabIndex={tabIndex}
      className={`${categoryClass} terminal-item md:p-0 px-2 sm:px-6 rounded hover:outline hover:outline-solid outline-offset-2`}
      key={`${category}/${title}`}
    >
      <TerminalHeader title={title} actions={actions} Icon={Icon} />
      <div className="terminal-item-content" onClick={handleClick}>
        <span>{handle}</span>
        {about && <><br /><span>{about}</span></>}
      </div>
      <TerminalFooter category={category} />
    </div>
  );
};
