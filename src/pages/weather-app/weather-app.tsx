import { Page } from "@/components/page/page";
import { useIsMobile } from "@/hooks/use-is-mobile/use-is-mobile";
import Place from "./components/place/Place";
import { places } from "./constants";
import { REPOS } from "@/constants";

export const WeatherApp = () => {
  const isMobile = useIsMobile();

  return (
    <Page name="Weather" withoutPadding={isMobile} repo={REPOS.weather.url}>
      <div className="flex flex-col w-full">
        {places.map((place) => <Place {...place} key={place.timeZone} />)}
      </div>
    </Page>
  );
};
