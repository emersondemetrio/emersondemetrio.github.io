import "./terminal.css";
import { Lab, Link, Tool } from "@/types";
import { TerminalContent } from "./terminal-content";
import { AiFillExperiment } from "react-icons/ai";

type TerminalProps = {
  links: Link[];
  tools: Tool[];
  experiments: Lab[];
};

export const Terminal = ({
  links,
  tools = [],
  experiments = [],
}: TerminalProps) => {

  return (
    <div className="terminal-container mb-5">
      {links.map(({ handle, title, url, category, about, icon, keepFocus = false }, index) => {
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
            Icon={icon}
          />
        );
      })}
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
            Icon={AiFillExperiment}
          />
        );
      })}
    </div>
  );
};
