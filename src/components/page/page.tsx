import "react";

type PageProps = {
    name?: string;
    description?: string;
    children?: React.ReactNode;
    style?: React.CSSProperties;
};

export const Page = ({
    name,
    description,
    children,
    style = {},
}: PageProps): JSX.Element => {
    if (name && description) {
        return (
            <section className="page-section" id="services" style={style}>
                <div className="home-container">
                    <h2>{name}</h2>
                    <p>{description}</p>
                </div>
            </section>
        );
    }

    return (
        <section className="page-section" id="services" style={style}>
            <div className="home-container">
                {children}
            </div>
        </section>
    );
}
