import { useIsMobile } from "@/hooks/use-is-mobile/use-is-mobile";
import React, { useEffect, useRef } from "react";

type PageProps = {
  name?: string;
  description?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onPaste?: (event: React.ClipboardEvent) => void;
  className?: string;
};

export const Page = ({
  name,
  description,
  children,
  style = {},
  onPaste = () => { },
  className = ""
}: PageProps): JSX.Element => {
  const isMobile = useIsMobile();
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isMobile && pageRef.current) {
      const handlePaste = (event: ClipboardEvent) => {
        onPaste(event as unknown as React.ClipboardEvent);
      };

      window.addEventListener("paste", handlePaste);

      return () => {
        if (window) {
          window.removeEventListener("paste", handlePaste);
        }
      };
    }
  }, [isMobile, onPaste]);

  if (!children && name && description) {
    return (
      <section
        style={style}
        className={`page container p-8 mx-auto xl:px-0 ${className}`}
        onPaste={onPaste}
        ref={pageRef}
        tabIndex={-1}
        data-page={`page-${name.toLowerCase().replace(/\s/g, "-")}`}
      >
        <div className="home-container">
          <h2>{name}</h2>
          <p>{description}</p>
        </div>
      </section>
    );
  }

  return (
    <section
      style={style}
      className={`page container p-8 mx-auto xl:px-0 ${className}`}
      onPaste={onPaste}
      ref={pageRef}
      tabIndex={-1}
      data-page={"page-content"}
    >
      <div className="home-container">{children}</div>
    </section>
  );
};
