import "react";
import { Links } from "../../constants";
import "./home.css";
import { Link } from "../../types";
import { CurrencyNow } from "../../components/currency-now/currency-now";
import { Toggle } from "../../components/toggle/toggle";
import { useState } from "react";

const CustomLink = ({ title, url, category }: Link) => {
  return (
    <a
      href={url}
      key={title}
      target="_blank"
      className={`grid-item text-uppercase ${category}`}
    >
      <div key={title}>{title}</div>
    </a>
  );
};

const groupByCategory = (items: Link[]) => {
  return items.reduce((acc, item) => {
    const { category } = item;
    if (!acc[category as string]) {
      acc[category as string] = [];
    }
    acc[category as string].push(item);
    return acc;
  }, {} as Record<string, Link[]>);
};

const Header = () => {
  return (
    <div className="row">
      <div
        className="col-lg-12 text-center"
        style={{
          marginBottom: 20,
        }}
      >
        <h3 className="section-heading text-primary black-bg">
          Emerson Demetrio
        </h3>
        <p className="text-primary black-bg">Software Engineer and musician.</p>
      </div>
    </div>
  );
};

const CategoryGroups = ({ group, links }: { group: string; links: Link[] }) => {
  return (
    <div className="">
      <div className="black-bg pl10 mt10 mb10">
        <p className="reset group-title text-primary white-text">{group}</p>
      </div>
      <div className="grid-container">
        {links.map(({ title, url, category }) => (
          <CustomLink key={title} title={title} url={url} category={category} />
        ))}
      </div>
    </div>
  );
};

export const Home = () => {
  const [showCurrency, setShowCurrency] = useState(false);

  return (
    <>
      <section
        className="page-section"
        id="services"
        style={{
          marginBottom: !showCurrency ? 75 : 0,
        }}
      >
        <div className="container">
          <Header />
          {Object.entries(groupByCategory(Links)).map(([group, links]) => (
            <CategoryGroups key={group} group={group} links={links} />
          ))}
          <div className="black-bg pl10 mt10 mb10">
            <p className="reset group-title text-primary white-text">Tools</p>
          </div>
          <Toggle onChange={setShowCurrency}>
            <CurrencyNow />
          </Toggle>
        </div>
      </section>
    </>
  );
};
