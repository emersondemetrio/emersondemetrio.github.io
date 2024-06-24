import "react";

type PageProps = {
  name?: string;
  description?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onPaste?: (event: React.ClipboardEvent) => void;
};

export const Page = ({
  name,
  description,
  children,
  style = {},
  onPaste = () => {},
}: PageProps): JSX.Element => {
  if (name && description) {
    return (
      <section style={style} className="page" onPaste={onPaste}>
        <div className="home-container">
          <h2>{name}</h2>
          <p>{description}</p>
        </div>
      </section>
    );
  }

  return (
    <section style={style} className="page" onPaste={onPaste}>
      <div className="home-container">{children}</div>
    </section>
  );
};
