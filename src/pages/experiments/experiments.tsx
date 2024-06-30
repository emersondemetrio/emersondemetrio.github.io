import "react";
import { Page } from "@/components/page/page";
import { Link } from "react-router-dom";
const experiments = [
  {
    title: "Remove Background",
    description: "Remove background from images 🖼️",
    link: "/experiments/bg",
    repo: "https://github.com/emersondemetrio/emersondemetrio.github.io/blob/main/src/pages/remove-background/remove-background.tsx",
  },
  {
    title: "Canvas Game",
    description: "Simple game using canvas 🪨✂️📜",
    link: "/experiments/game",
    repo: "https://github.com/emersondemetrio/emersondemetrio.github.io/blob/main/src/pages/canvas-game/canvas-game.tsx",
  },
  {
    title: "Timezones",
    description: "Timezones 🕰️",
    link: "/experiments/tz",
    repo: "https://github.com/emersondemetrio/emersondemetrio.github.io/blob/main/src/pages/timezones/timezones.tsx",
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
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "wrap",
          padding: 20,
        }}
      >
        {experiments.map((item) => (
          <div
            key={item.title}
            style={{
              border: "solid 1px #ddd",
              margin: 5,
              padding: 5,
              borderRadius: 5,
              width: "400px",
              height: "250px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignContent: "center",
              alignItems: "center",
            }}
          >
            <h2>{item.title}</h2>
            <p>{item.description}</p>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: 10,
                alignItems: "center",
              }}
            >
              <Link className="btn btn-light" to={item.link}>
                See live: {item.title}
              </Link>
              <br />
              <Link className="btn btn-secondary" to={item.repo}>
                Show me the code
              </Link>
            </div>
          </div>
        ))}
      </div>
    </Page>
  );
};
