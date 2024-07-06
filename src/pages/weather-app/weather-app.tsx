import { Page } from "@/components/page/page";
import Place from "./components/place/Place";
import { places } from "./constants";
import "./weather.css";

export const WeatherApp = () => {
  return (
    <Page className="App">
      <header>
        <h3>Time Zones</h3>
      </header>

      <div className="row">
        {places.map((place) => (
          <Place {...place} key={place.timeZone} />
        ))}
      </div>
    </Page>
  );
};
