import { about } from "@/constants";
import { useIsMobile } from "@/hooks/use-is-mobile/use-is-mobile";

export const Headline = () => {
  const isMobile = useIsMobile();
  const [about1, about2] = about;

  if (isMobile) {
    return (
      <div className="text-left mb-4 whitespace-pre-wrap">
        {about.map((line) => (
          <span key={line}>{line}</span>
        ))}
      </div>
    );
  }

  return (
    <div className="pt-2 w-full mb-4 border-b border-gray-200 pb-4">
      <div className="flex items-center w-full">
        <div className="flex flex-row w-full justify-between items-start">
          <div className="flex-1 pr-8">
            <span className="block">{about1}</span>
          </div>
          <div className="flex-1 pl-8">
            <span className="block">{about2}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
