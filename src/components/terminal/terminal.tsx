import "./terminal.css";
import { Link, Tool } from "@/types";
import { TerminalContent } from "./terminal-content";

type TerminalProps = {
  links: Link[];
  tools: Tool[];
};

export const Terminal = ({ links, tools = [] }: TerminalProps) => {
  return (
    <div className="terminal-container mb-5">
      {links.map(
        ({ handle, title, url, category, about, keepFocus = false }, index) => {
          return (
            <TerminalContent
              tabIndex={index}
              key={`${category}/${title}`}
              url={url}
              keepFocus={keepFocus}
              title={title}
              handle={handle}
              category={category}
              about={about}
            />
          );
        },
      )}
      {tools.map((tool, index) => {
        return (
          <TerminalContent
            tabIndex={index}
            actions={tool.actions}
            key={`tool-${index}`}
            onClick={tool.actions.onMaximize}
            title={tool.title}
            handle={tool.handle}
            category={tool.category}
            about={tool.about}
          />
        );
      })}
    </div>
  );
};
