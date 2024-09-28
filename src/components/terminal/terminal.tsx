import "./terminal.css";
import { Link, Tool } from "@/types";
import { TerminalHeader } from "./terminal-header";
import { useState } from "react";
import { TerminalBadge } from "@/components//terminal-badge/terminal-badge";
import { openUrl } from "@/utils/utils";

type TerminalProps = {
  links: Link[];
  tools: Tool[];
};

export const Terminal = ({ links, tools = [] }: TerminalProps) => {
  const [activeBadge, setActiveBadge] = useState<string | null>(null);

  const handleBadgeMouseEnter = (name: string) => setActiveBadge(name);
  const handleBadgeMouseLeave = () => setActiveBadge(null);

  const getItemClass = (category: string, type: "link" | "tool" = "link") => {
    const base = `${type === "tool" ? "outline outline-offset-2 outline-cyan-500" : ""} ${
      activeBadge === category
        ? "terminal-item outline outline-offset-2 outline-cyan-500"
        : "terminal-item"
    }`;

    if (activeBadge) {
      return category === activeBadge ? base : `${base} opacity-25`;
    }

    return base;
  };

  return (
    <div className="terminal-container mb-5">
      {links.map(({ handle, title, url, category }) => {
        return (
          <div className={getItemClass(category)} key={`${category}/${title}`}>
            <TerminalHeader title={title} />
            <div
              className="btn btn-dark terminal-item-content"
              onClick={() => openUrl(url)}
            >
              <span>{handle}</span>
            </div>
            <TerminalBadge
              name={category}
              onFocus={handleBadgeMouseEnter}
              onFocusLost={handleBadgeMouseLeave}
            />
          </div>
        );
      })}
      {tools.map((tool, index) => {
        return (
          <div
            className={getItemClass(tool.category, "tool")}
            key={`tool-${index}`}
          >
            <TerminalHeader title={tool.title} actions={tool.actions} />
            <div
              className="btn btn-dark terminal-item-content"
              onClick={tool.actions.onMaximize}
            >
              <span>{tool.handle}</span>
            </div>
            <TerminalBadge
              name={tool.category}
              onFocus={handleBadgeMouseEnter}
              onFocusLost={handleBadgeMouseLeave}
            />
          </div>
        );
      })}
    </div>
  );
};
