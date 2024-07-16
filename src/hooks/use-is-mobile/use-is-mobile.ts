import { useEffect, useCallback, useState } from 'react';
// based on https://github.com/tufantunc/useIsMobile

export const useIsMobile = (mobileScreenSize = 768) => {
  if (typeof window.matchMedia !== 'function') {
    throw Error('matchMedia not supported by browser!');
  }
  const [isMobile, setIsMobile] = useState(
    window.matchMedia(`(max-width: ${mobileScreenSize}px)`).matches,
  );

  const checkIsMobile = useCallback((event: { matches: boolean }) => {
    setIsMobile(event.matches);
  }, []);

  useEffect(() => {
    const mediaListener = window.matchMedia(
      `(max-width: ${mobileScreenSize}px)`,
    );
    // try catch used to fallback for browser compatibility
    try {
      mediaListener.addEventListener('change', checkIsMobile);
    } catch {
      mediaListener.addListener(checkIsMobile);
    }

    return () => {
      try {
        mediaListener.removeEventListener('change', checkIsMobile);
      } catch {
        mediaListener.removeListener(checkIsMobile);
      }
    };
  }, [mobileScreenSize]);

  return isMobile;
};
