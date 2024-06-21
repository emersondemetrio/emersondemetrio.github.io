import "react";
import "./terminal.css";
import { Link } from "../../types";
import { TerminalHeader } from "./terminal-header";
import { Actions } from "./types";

const openUrl = (url: string) => window.open(url, "_blank");

type TerminalProps = {
  links: Link[];
  tools: Array<{
    title: string;
    handle: string;
    category: string;
    actions: Actions;
  }>;
};

export const Terminal = ({ links, tools = [] }: TerminalProps) => {
  return (
    <div className="terminal-container">
      {links.map(({ handle, title, url, category }) => {
        return (
          <div className="terminal-item" key={`${category}/${title}`}>
            <TerminalHeader title={title} />
            <div
              className="btn btn-dark terminal-item-content"
              onClick={() => openUrl(url)}
            >
              <span>{handle}</span>
            </div>
            <div className="terminal-item-tag-container">
              <span className="badge badge-light">{category}</span>
            </div>
          </div>
        );
      })}
      {tools.map((tool, index) => {
        return (
          <div className="terminal-item" key={`tool-${index}`}>
            <TerminalHeader title={tool.title} actions={tool.actions} />
            <div
              className="btn btn-dark terminal-item-content"
              onClick={tool.actions.onMaximize}
            >
              <span>{tool.handle}</span>
            </div>
            <div className="terminal-item-tag-container">
              <span className="badge badge-light">{tool.category}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
