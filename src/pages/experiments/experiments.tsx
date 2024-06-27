import "react";
import { Page } from "@/components/page/page";
import { Link } from "react-router-dom";

export const Experiments = () => {
  return (
    <Page >
      <h1>Experiments</h1>
      <p>Some experiments I've been working on</p>

      <div className="row" style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "wrap",
        padding: 20,
      }}>
        {[
          {
            title: "Remove Background",
            description: "Remove background from images",
            link: "/bg",
          },
          {
            title: "Canvas Game",
            description: "Simple game using canvas",
            link: "/game",
          },
        ].map((item) => (
          <div key={item.title} style={{
            border: "solid 1px #ddd",
            margin: 5,
            padding: 5,
            borderRadius: 5,
            width: '500px',
            height: '300px',
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignContent: "center",
            alignItems: "center",
          }}>
            <h2>{item.title}</h2>
            <p>{item.description}</p>
            <div>
              <Link className="btn btn-light" to={item.link}>Go to {item.title}</Link>
            </div>
          </div>
        ))}
      </div>

    </Page>
  );
};
