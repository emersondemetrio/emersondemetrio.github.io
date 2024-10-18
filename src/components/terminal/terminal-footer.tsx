type TerminalFooterProps = {
  category: string;
};

export const TerminalFooter = ({ category }: TerminalFooterProps) => {
  const className = [
    "h-10",
    "flex",
    "justify-end",
    "items-center",
    "terminal-item-tag-container",
    "border-t-2",
    "bg-[#202427]",
    "border-t-[#202427]",
    "border-solid",
    "rounded-b-lg",
  ].join(" ");

  return (
    <div className={className}>
      <span className="badge badge-outline m-2">{category}</span>
    </div>
  );
};
