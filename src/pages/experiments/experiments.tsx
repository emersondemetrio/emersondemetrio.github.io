import "react";
import { Page } from "@/components/page/page";
import { Link } from "react-router-dom";

const githubBaseUrl = "https://github.com/emersondemetrio/emersondemetrio.github.io/blob/main/src"

const experiments = [
  {
    title: "Remove Background",
    description: "Remove background from images 🖼️",
    link: "/experiments/bg",
    repo: `${githubBaseUrl}/pages/remove-background/remove-background.tsx`
  },
  {
    title: "Canvas Game",
    description: "Simple game using canvas 🪨✂️📜",
    link: "/experiments/game",
    repo: `${githubBaseUrl}/pages/canvas-game/canvas-game.tsx`
  },
  {
    title: "Timezones",
    description: "Timezones 🕰️",
    link: "/experiments/tz",
    repo: `${githubBaseUrl}/pages/timezones/timezones.tsx`
  }
];

export const Experiments = () => {
  return (
    <Page>
      <h1>Experiments</h1>
      <p>Some experiments I've been working on</p>

      <div
        className="row"
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
          flexWrap: "wrap",
          padding: 20,
        }}
      >
        {experiments.map((item) => (
          <div className="card lg:card-side bg-base-100 shadow-xl" key={item.title}>
            <figure>
              <img
                src="images/exp.svg"
                alt="Album"
                style={{ width: 200, background: '#fff' }} />
            </figure>
            <div className="card-body">
              <h2 className="card-title">{item.title}</h2>
              <p>{item.description}</p>
              <div className="card-actions justify-end">
                <Link className="btn btn-primary" to={item.link}>View</Link>
                <Link className="btn btn-ghost" to={item.repo}>Code</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Page>
  );
};
