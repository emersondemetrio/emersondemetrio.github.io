import React, { useState } from "react";

type ToggleProps = {
  children: React.ReactNode;
  title: string;
  onChange?: (visible: boolean) => void;
  style?: React.CSSProperties;
};

export const Toggle = ({
  children,
  title,
  onChange,
  style = {},
}: ToggleProps) => {
  const [visible, setVisible] = useState(false);

  const handleChange = () => {
    setVisible(!visible);
    if (typeof onChange !== "function") return;

    onChange(!visible);
  };

  return (
    <div
      style={{
        display: "flex",
        flex: 1,
        flexDirection: "column",
        ...style,
      }}
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "left",
        }}
      >
        <button className="btn btn-primary" onClick={handleChange}>
          {title} {visible ? "↑" : "↓"}
        </button>
      </div>
      <div style={{}}>{visible && children}</div>
    </div>
  );
};
