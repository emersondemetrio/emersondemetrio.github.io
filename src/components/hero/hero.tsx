import { useIsMobile } from "@/hooks/use-is-mobile/use-is-mobile";

export const Hero = () => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <div>
      <h1 className="my-4 text-2xl font-bold leading-tight">
        ~/emersondemetrio
      </h1>
    </div>
  }

  return (
    <>
      <div className="pt-2">
        <div className="container px-3 mx-auto flex flex-wrap flex-col md:flex-row items-center">
          <div className="flex flex-col w-full md:w-2/5 justify-center items-start text-center md:text-left">
            <h1 className="my-4 text-2xl font-bold leading-tight">
              ~/emersondemetrio
            </h1>
            <p className="leading-normal text-2xl mb-8">
              Software Engineer and music enthusiast.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
