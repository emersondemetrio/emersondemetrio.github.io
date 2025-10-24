import { TerminalHeaderProps } from "@/types";
import { TerminalActions } from "./terminal-actions";

export const TerminalHeader = ({ title, actions, Icon }: TerminalHeaderProps) => {
  return (
    <div className="rounded terminal-header">
      {Icon && <Icon className="m-2" />}
      <span className="title-container">
        ~/{title.toLowerCase().split(" ").join("-")}/
      </span>
      <TerminalActions actions={actions} />
    </div>
  );
};
