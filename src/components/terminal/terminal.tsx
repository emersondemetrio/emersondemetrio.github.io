import "./terminal.css";
import { Experiments, Link, Tool } from "@/types";
import { TerminalContent } from "./terminal-content";

type TerminalProps = {
  links: Link[];
  tools: Tool[];
  experiments: Experiments[];
};

export const Terminal = ({
  links,
  tools = [],
  experiments = [],
}: TerminalProps) => {
  return (
    <div className="terminal-container mb-5">
      {links.map(
        ({ handle, title, url, category, about, keepFocus = false, disabled }, index) => {
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
              disabled={disabled}
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
            disabled={tool.disabled}
          />
        );
      })}
      {experiments.map((experiment, index) => {
        return (
          <TerminalContent
            url={experiment.link}
            keepFocus
            key={`experiment-${index}`}
            tabIndex={index}
            title={experiment.title}
            handle={experiment.title}
            category="experiments"
            about={experiment.description}
            disabled={experiment.disabled}
          />
        );
      })}
    </div>
  );
};
