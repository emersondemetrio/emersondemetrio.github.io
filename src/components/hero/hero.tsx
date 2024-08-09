import { useIsMobile } from '@/hooks/use-is-mobile/use-is-mobile';

export const Hero = () => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div>
        <h1 className="my-4 text-2xl font-bold leading-tight text-center">
          ~/emersondemetrio
        </h1>
      </div>
    );
  }

  return (
    <>
      <div className="pt-2 w-full">
        <div className="flex items-center w-full">
          <div className="flex flex-col w-full  justify-center items-start text-center md:text-left">
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
