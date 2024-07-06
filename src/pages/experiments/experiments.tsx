import { Page } from "@/components/page/page";
import { Link } from "react-router-dom";

const githubBaseUrl =
  "https://github.com/emersondemetrio/emersondemetrio.github.io/blob/main/src";

const experiments = [
  {
    title: "Remove Background",
    description: "Remove background from images 🖼️",
    link: "/labs/background",
    repo: `${githubBaseUrl}/pages/remove-background/remove-background.tsx`,
  },
  {
    title: "Canvas Game",
    description: "Simple game using canvas 🪨✂️📜",
    link: "/labs/game",
    repo: `${githubBaseUrl}/pages/canvas-game/canvas-game.tsx`,
  },
  {
    title: "Timezones",
    description: "Timezones 🕰️",
    link: "/labs/timezones",
    repo: `${githubBaseUrl}/pages/timezones/timezones.tsx`,
  },
  {
    title: "Weather App",
    description: "Weather App 🌦️",
    link: "/experiments/weather",
    repo: `${githubBaseUrl}/pages/weather-app/weather-app.tsx`,
  },
];

export const Experiments = () => {
  return (
    <Page
      name="Labs"
      description="Some experiments I've been working on"
    >
      <div
        className="row"
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        {experiments.map((item) => (
          <div
            className="w-full md:w-1/3 flex flex-col flex-grow flex-shrink bg-gray-50 py-6"
            key={item.title}
          >
            <div className="flex-1 rounded-t rounded-b-none overflow-hidden shadow">
              <div className="flex flex-wrap no-underline hover:no-underline">
                <p className="w-full text-gray-600 text-xs md:text-sm px-6">
                  {item.title}
                </p>
                <div className="w-full font-bold text-xl text-gray-800 px-6">
                  {item.description}
                </div>
              </div>
            </div>
            <div className="flex mt-auto rounded-b rounded-t-none overflow-hidden shadow p-6">
              <Link className="btn btn-primary" to={item.link}>
                View
              </Link>
              <Link className="btn btn-dark" to={item.repo}>
                Code
              </Link>
            </div>
          </div>
        ))}
      </div>
    </Page>
  );
};
