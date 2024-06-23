import "react";
import { Link } from "react-router-dom";

export const Header = () => {
    const appRoutes = [
        {
            label: "Home",
            link: "/",
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
            <div
                className="col-lg-12 text-center"
                style={{
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                {appRoutes.map((route, index) => (
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
        </div>
    );
};

