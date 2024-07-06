import { useIsMobile } from "@/hooks/use-is-mobile/use-is-mobile";
import React, { useEffect, useRef } from "react";

type PageProps = {
  name: string;
  description?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onPaste?: (event: React.ClipboardEvent) => void;
  className?: string;
  withoutName?: boolean;
  isHome?: boolean;
};

export const Page = ({
  name = "Page Name",
  description,
  children,
  style = {},
  onPaste = () => { },
  className = "",
  withoutName = false,
  isHome = false,
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

  return (
    <section
      style={style}
      onPaste={onPaste}
      ref={pageRef}
      tabIndex={-1}
      data-page={`page-${name.toLowerCase().replace(/\s/g, "-")}`}
      className={`${isHome ? '' : 'page'} min-h-screen border-b py-8 ${className}`}
    >
      <div className="container mx-auto flex flex-wrap pt-4 pb-12">
        {withoutName ? null : (
          <div>
            <h2 className="w-full my-2 text-5xl font-bold leading-tight text-center text-white-800">
              {name}
            </h2>
          </div>
        )}
        <div className="w-full mb-4">
          <div className="h-1 mx-auto gradient w-64 opacity-25 my-0 py-0 rounded-t"></div>
        </div>
        <div className="w-full md:w-1/3 flex flex-col flex-grow flex-shrink">
          <div className="mb-6">
            <p className="text-lg">{description}</p>
          </div>
          <div>
            {children}
          </div>
        </div>
      </div>
    </section>
  );
};
