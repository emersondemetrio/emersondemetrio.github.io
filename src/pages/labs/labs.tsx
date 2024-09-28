import { Page } from "@/components/page/page";
import { Link } from "react-router-dom";

const githubBaseUrl = "https://github.com/emersondemetrio/emersondemetrio.github.io/blob/main/src";

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
    title: "Weather App",
    description: "Weather App 🌦️",
    link: "/labs/weather",
    repo: `${githubBaseUrl}/pages/weather-app/weather-app.tsx`,
  },
  {
    title: "Code Pens",
    description: "Code Pens 🖊 ️",
    link: "/labs/code-pen",
    repo: `${githubBaseUrl}/pages/code-pen/code-pen.tsx`,
  },
  {
    title: "Countdown",
    description: "Countdown ⏳",
    link: "/labs/countdown",
    repo: `${githubBaseUrl}/pages/countdown/countdown.tsx`,
  },
  {
    title: "Camera",
    description: "Camera 📷",
    link: "/labs/camera",
    repo: `${githubBaseUrl}/pages/camera/camera.tsx`,
  },
];

export const Labs = () => {
  return (
    <Page name="Labs" description="Some experiments I've been working on">
      <div className="md:grid md:grid-cols-4 md:gap-4 flex flex-col items-center">
        {experiments.map((item) => (
          <div
            key={item.title}
            className="md:mb-0 mb-10 w-[350px] bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
          >
            <div className="flex flex-col items-center pt-4 pb-10">
              <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
                {item.title}
              </h5>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {item.description}
              </span>
              <div className="flex mt-4 md:mt-6">
                <Link
                  to={item.link}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  View
                </Link>
                <Link
                  to={item.repo}
                  className="py-2 px-4 ms-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                >
                  Code
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Page>
  );
};
