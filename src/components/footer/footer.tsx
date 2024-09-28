import { linkGet } from "@/constants";
import { Link } from "react-router-dom";
import { CurrencyNow } from "../currency-now/currency-now";
import { useIsMobile } from "@/hooks/use-is-mobile/use-is-mobile";

export const Footer = () => {
  const isMobile = useIsMobile();

  return (
    <footer className="bg-black px-3 py-12 text-center text-white border-t">
      <Link
        target="_blank"
        to={linkGet("linkedin").url}
        className="font-medium text-white-600 hover:underline"
      >
        Emerson Demetrio {new Date().getFullYear()}
      </Link>
      {!isMobile && (
        <div className="w-full flex items-center justify-center">
          <CurrencyNow asList />
        </div>
      )}
    </footer>
  );
};
