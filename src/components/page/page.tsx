import { useIsMobile } from '@/hooks/use-is-mobile/use-is-mobile';
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

type PageProps = {
  name: string;
  description?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onPaste?: (event: React.ClipboardEvent) => void;
  className?: string;
  withoutName?: boolean;
  isHome?: boolean;
  withoutPadding?: boolean;
  repo?: string;
};

export const Page = ({
  name = 'Page Name',
  description,
  children,
  style = {},
  onPaste = () => {},
  className = '',
  withoutName = false,
  isHome = false,
  withoutPadding = false,
  repo,
}: PageProps): JSX.Element => {
  const isMobile = useIsMobile();
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isMobile && pageRef.current) {
      const handlePaste = (event: ClipboardEvent) => {
        onPaste(event as unknown as React.ClipboardEvent);
      };

      window.addEventListener('paste', handlePaste);

      return () => {
        if (window) {
          window.removeEventListener('paste', handlePaste);
        }
      };
    }
  }, [isMobile, onPaste]);

  const padding = withoutPadding ? '' : 'py-8';

  return (
    <section
      style={style}
      onPaste={onPaste}
      ref={pageRef}
      tabIndex={-1}
      data-page={`page-${name.toLowerCase().replace(/\s/g, '-')}`}
      className={`${isHome ? '' : 'page'} min-h-screen border-b ${padding} ${className}`}
    >
      <div className="container mx-auto flex flex-wrap pt-4 pb-12">
        {withoutName ? (
          <></>
        ) : (
          <div className="w-full flex justify-between items-center flex-col md:flex-row gap-6">
            <h2 className="my-2 text-5xl font-bold leading-tight text-center text-white-800">
              {name}
            </h2>
            {repo && (
              <Link
                to={repo}
                target="_blank"
                className="text-center text-white-800 items-center"
              >
                📋 Show me the code
              </Link>
            )}
          </div>
        )}
        {isHome && <div className="w-full flex flex-col">{children}</div>}
        {!isHome && (
          <div className="w-full flex flex-col">
            {description && (
              <div className="mb-6">
                <p className="text-lg">{description}</p>
              </div>
            )}
            <div className="w-full">{children}</div>
          </div>
        )}
      </div>
    </section>
  );
};
