import { useIsMobile } from "@/hooks/use-is-mobile/use-is-mobile";

export const Hero = () => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div>
        <h1 className="my-4 text-2xl font-bold leading-tight text-center">
          ~/emerson/home
        </h1>
      </div>
    );
  }

  return (
    <>
      <div className="pt-2 w-full">
        <div className="flex items-center w-full">
          <div className="flex flex-col w-full justify-center items-start text-center md:text-left">
            <h1 className="my-4 text-1xl font-bold leading-tight">
              ~/emerson/home
            </h1>
            <p className="leading-normal text-1xl mb-8">
              Welcome. Useful links bellow.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
