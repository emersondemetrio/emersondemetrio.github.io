export type Actions = {
  onMaximize?: () => void;
  onMinimize?: () => void;
  onClose?: () => void;
};

export type TerminalHeaderProps = {
  title: string;
  actions?: Actions;
};

export type TerminalActionsProps = {
  actions?: Actions;
};
