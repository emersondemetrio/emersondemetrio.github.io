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
            <section style={style}>
                <div className="home-container">
                    <h2>{name}</h2>
                    <p>{description}</p>
                </div>
            </section>
        );
    }

    return (
        <section style={style}>
            <div className="home-container">
                {children}
            </div>
        </section>
    );
}
