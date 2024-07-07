import "react";
import { Page } from "@/components/page/page";
import { Link } from "react-router-dom";
import "./timezones.css";
import { REPOS } from "@/constants";

type Timezone = {
  name: string;
  offset: number;
};

const timezones: Timezone[] = [
  {
    name: "UTC",
    offset: 0,
  },
  {
    name: "CET",
    offset: 1,
  },
  {
    name: "EET",
    offset: 2,
  },
  {
    name: "MSK",
    offset: 3,
  },
  {
    name: "IST",
    offset: 5.5,
  },
  {
    name: "SGT",
    offset: 8,
  },
  {
    name: "JST",
    offset: 9,
  },
  {
    name: "AEDT",
    offset: 11,
  },
];

const getToday = () => {
  const today = new Date();
  return today.toLocaleDateString("en-GB");
};

export const Timezones = () => {
  return (
    <Page name="Timezones App" repo={REPOS.timezones.url}>
      <div className="container">
        <table className="table table-bordered timezones-table">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Offset</th>
              <th scope="col">{getToday()}</th>
              {Array.from({ length: 10 }, (_, i) => i).map((i) => (
                <th className="ruler" key={i} />
              ))}
            </tr>
          </thead>
          <tbody>
            {timezones.map((tz, index) => (
              <tr key={index}>
                <td>{tz.name}</td>
                <td>{tz.offset}</td>
                {Array.from({ length: 10 }, (_, i) => i).map((i) => (
                  <td key={i}>
                    {
                      <div key={i} className="ruler-item col">
                        <span className="badge badge-secondary">{i}</span>
                      </div>
                    }
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="text-center p10">
          <Link
            target="_blank"
            to="https://www.worldtimebuddy.com/"
            className="btn btn-secondary"
          >
            Inspired by this tool
          </Link>
        </div>
      </div>
    </Page>
  );
};
