import { Icon } from "./icons";
import { TerminalActionsProps } from "./types";

const noop = () => {};

export const TerminalActions = ({ actions }: TerminalActionsProps) => {
  return (
    <div className="action-button-container">
      <Icon name="maximize" onClick={actions?.onMaximize || noop} />
      <Icon name="minimize" onClick={actions?.onMaximize || noop} />
      <Icon name="close" onClick={actions?.onMinimize || noop} />
    </div>
  );
};
