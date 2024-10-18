import "./terminal.css";
import { Link, Tool } from "@/types";
import { useState } from "react";
import { TerminalContent } from "./terminal-content";
import { delay, unDelay } from "@/utils/utils";

type TerminalProps = {
  links: Link[];
  tools: Tool[];
};

export const Terminal = ({ links, tools = [] }: TerminalProps) => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const getItemClass = (category: string, type: "link" | "tool" = "link") => {
    const base = `${
      type === "tool"
        ? "outline outline-offset-2 outline-cyan-500"
        : "transition duration-300 ease-in-out"
    } ${
      activeCategory === category
        ? "terminal-item outline outline-offset-2 outline-cyan-500"
        : "terminal-item"
    }`;

    if (activeCategory) {
      return category === activeCategory ? base : `${base} opacity-25`;
    }

    return base;
  };

  const [pendingAction, setPendingAction] = useState<NodeJS.Timeout>();

  const handleDelay = (callback: () => void) => () => {
    const currentId = delay(callback);
    setPendingAction(currentId);
  };

  return (
    <div className="terminal-container mb-5">
      {links.map(({ handle, title, url, category }) => {
        return (
          <TerminalContent
            key={`${category}/${title}`}
            url={url}
            title={title}
            handle={handle}
            category={category}
            className={getItemClass(category)}
            onLoseFocus={handleDelay(() => setActiveCategory(null))}
            onFocus={unDelay(pendingAction, () => setActiveCategory(category))}
          />
        );
      })}
      {tools.map((tool, index) => {
        return (
          <TerminalContent
            actions={tool.actions}
            key={`tool-${index}`}
            onClick={tool.actions.onMaximize}
            title={tool.title}
            handle={tool.handle}
            onFocus={unDelay(pendingAction, () => setActiveCategory(tool.category))}
            onLoseFocus={handleDelay(() => setActiveCategory(null))}
            category={tool.category}
            className={getItemClass(tool.category, "tool")}
          />
        );
      })}
    </div>
  );
};
