import "react";

type PageProps = {
    name: string;
    description: string;
};

export const Page = ({
    name,
    description = "Come back soon!",
}: PageProps): JSX.Element => {
    return (
        <section className="page-section" id="services">
            <div className="home-container">
                <h2>{name}</h2>
                <p>{description}</p>
            </div>
        </section>
    );
}
