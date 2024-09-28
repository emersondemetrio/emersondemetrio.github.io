type TerminalBadgeProps = {
  name: string;
  onFocus: (name: string) => void;
  onFocusLost: () => void;
};

export const TerminalBadge = ({
  name,
  onFocus,
  onFocusLost,
}: TerminalBadgeProps) => {
  return (
    <div
      className="terminal-item-tag-container"
      onMouseEnter={() => onFocus(name)}
      onMouseLeave={onFocusLost}
    >
      <span className="badge badge-outline">{name}</span>
    </div>
  );
};
