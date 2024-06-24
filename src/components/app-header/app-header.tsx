import "react";
import { Link } from "react-router-dom";
import { Toggle } from "../toggle/toggle";
import { useIsMobile } from "@/hooks/use-is-mobile/use-is-mobile";

<<<<<<< HEAD
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
=======
type HeaderProps = {
  routes: {
    label: string;
    link: string;
  }[];
}

export const Header = (
  { routes }: HeaderProps
) => {
>>>>>>> 9165f18 ([0000] Add resume)

  return (
    <div
      className="row"
      style={{
        display: "flex",
        flex: 1,
      }}
    >
      <div
<<<<<<< HEAD
        className="col-md-12 col-sm-12 text-center"
=======
        className="col-lg-12 text-center"
>>>>>>> 9165f18 ([0000] Add resume)
        style={{
          marginTop: 20,
        }}
      >
<<<<<<< HEAD
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
=======
        <Link to={"/"}>
          <h3 className="section-heading text-primary black-bg">
            ~ Emerson Demetrio
          </h3>
        </Link>
        <p className="text-primary black-bg">Software Engineer and musician.</p>
      </div>
      <div
        className="col-lg-12 text-center"
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        {routes.map((route, index) => (
          <Link
            key={index}
            to={route.link}
            style={{
              margin: 10,
              width: "100px",
            }}
            className="text-light black-bg p10"
          >
            {route.label}
          </Link>
        ))}
      </div>
>>>>>>> 9165f18 ([0000] Add resume)
    </div>
  );
};

