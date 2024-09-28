import { Page } from "@/components/page/page";
import "react";
import "./resume.css";

import { reverseRange } from "@/utils/utils";
import { Toggle } from "@/components/toggle/toggle";

type Experience = {
  year: number;
  title: string;
  description: string;
};

type Education = {
  year: number;
  title: string;
  description: string;
};

type ResumeItem = {
  experiences: Experience[];
  education: Education[];
};

type Resume = Map<number, ResumeItem>;

const resume: Resume = new Map();

reverseRange(2008, 2024).map((year) => {
  resume.set(year, {
    experiences: [
      {
        year: year,
        title: "Software Engineer",
        description: `Developed software for the company.
Developed software for the company.
Developed software for the company.
Developed software for the company.`,
      },
    ],
    education: [
      {
        year: year,
        title: "Computer Science",
        description: "Learned computer science.",
      },
    ],
  });
});

const Bullet = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="h-5 w-5"
  >
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
      clipRule="evenodd"
    />
  </svg>
);

export const Resume = () => {
  return (
    <Page name="About Me (Under construction)">
      <Toggle title="Show progress so far">
        <ul className="timeline timeline-snap-icon max-md:timeline-compact timeline-vertical">
          {Array.from(resume).map(([year, item], index) => {
            const direction = index % 2 === 0 ? "timeline-start md:text-end" : "timeline-end";

            return item.experiences.map((item, index) => (
              <li key={index}>
                <div className="timeline-middle">
                  <Bullet />
                </div>
                <div className={`${direction} mb-10`}>
                  <time className="font-mono">{year}</time>
                  <div className="text-lg font-black">{item.title}</div>
                  {item.description}
                </div>
                <hr />
              </li>
            ));
          })}
        </ul>
      </Toggle>
    </Page>
  );
};
