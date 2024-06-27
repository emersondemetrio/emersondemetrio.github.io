import "react";
import { Link } from "react-router-dom";
import { Toggle } from "../toggle/toggle";
const isMobile = window.innerWidth < 768;

export const Header = () => {
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
                className="col-lg-12 text-center"
                style={{
                    marginTop: 20,
                }}
            >
                <Link to={"/"}>
                    <h3 className="section-heading text-primary black-bg">
                        ~ Emerson Demetrio
                    </h3>
                </Link>
                <p className="text-primary black-bg">Software Engineer and musician.</p>
            </div>
            {
                !isMobile && (
                    <div
                        className="col-lg-12 text-center"
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
            {isMobile && (<div
                className="col-lg-12 text-center"
                style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                }}
            >
                <Toggle title="Menu" style={{
                    marginLeft: "10px",
                }}>
                    <div
                        className="col-lg-12 text-center"
                        style={{
                            display: "flex",
                            flexDirection: isMobile ? "column" : "row",
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
                                className="text-light black-bg p10"
                            >
                                {route.label}
                            </Link>
                        ))}
                    </div>
                </Toggle>
            </div>)}
        </div>
    );
};

