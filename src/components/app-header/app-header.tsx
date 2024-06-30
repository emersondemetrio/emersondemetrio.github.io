import "react";
import { Link } from "react-router-dom";
import { Toggle } from "../toggle/toggle";
import { useIsMobile } from "@/hooks/use-is-mobile/use-is-mobile";

export const Header = () => {
  const isMobile = useIsMobile();

  const appRoutes = [
    {
      label: "Home",
      link: "/",
    },
    {
      label: "Experiments",
      link: "/experiments",
    },
    {
      label: "About",
      link: "/about",
    },
    {
      label: "Blog",
      link: "/blog",
    },
  ]

  return (
    <div
      className="row"
      style={{
        display: "flex",
        flex: 1,
      }}
    >
      <div
        className="col-md-12 col-sm-12 text-center"
        style={{
          marginTop: 20,
        }}
      >
        {
          isMobile ? (
            <div style={{
              display: "flex",
              flexDirection: "row",
              alignContent: "center",
              alignItems: "center",
              justifyContent: "space-around",
              marginBottom: 20,
            }}>
              <Link to={"/"} className="btn btn-dark">
                ~/home
              </Link>
              <div
                className="col-sm-12 text-center"
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                <Toggle title="Menu">
                  <div
                    className="col-md-12 text-center"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    {appRoutes.map((route, index) => (
                      <Link
                        key={index}
                        to={route.link}
                        style={{
                          margin: isMobile ? "5px" : "10px",
                          minWidth: "100px",
                        }}
                        className="btn btn-secondary p10"
                      >
                        {route.label}
                      </Link>
                    ))}
                  </div>
                </Toggle>
              </div>
            </div>
          ) : (
            <Link to={"/"}>
              <h3 className="black-bg">
                Emerson Demetrio
              </h3>
              <p className="text-primary black-bg">Software Engineer and musician.</p>
            </Link>
          )
        }
      </div>
      {
        !isMobile && (
          <div

            className="col-md-12 text-center"
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            {appRoutes.map((route, index) => (
              <Link
                key={index}
                to={route.link}
                style={{
                  margin: "10px",
                  minWidth: "100px",
                }}
                className="text-light black-bg p10"
              >
                {route.label}
              </Link>
            ))}
          </div>
        )
      }
    </div>
  );
};

