import { TerminalHeaderProps } from "./types";
import { TerminalActions } from "./terminal-actions";

export const TerminalHeader = ({ title, actions }: TerminalHeaderProps) => {
  return (
    <div className="terminal-header">
      <span className="title-container">~/{title.toLowerCase().split(' ').join('-')}/</span>
      <TerminalActions actions={actions} />
    </div>
  );
};
