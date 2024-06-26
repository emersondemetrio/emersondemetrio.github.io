import { Page } from "@/components/page/page";
import "react";
import React from "react";
import { data } from "./data";
import "./resume.css";

import { Photo, Record, ResumeType, Section, SectionField } from "./types";

// Component to display photo
const PhotoViewer: React.FC<{ photo: Photo }> = ({ photo }) => (
  <img
    src={photo.dataCropped}
    alt="Profile"
    style={{
      width: "20%",
      height: "10%",
    }}
  />
);

// Component to display a section field
const SectionFieldViewer: React.FC<{ field: SectionField }> = ({ field }) => (
  <div className="SectionFieldViewer">
    <strong>{field.key}:</strong> {field.role}
  </div>
);

// Component to display a record
const RecordViewer: React.FC<{ record: Record }> = ({ record }) => (
  <div className="RecordViewer">
    {record.values.map((value, index) => {
      const key = record.key + index;
      if (value) {
        return (
          <div
            key={key}
            dangerouslySetInnerHTML={{
              __html: value,
            }}
          />
        );
      }

      return <div key={key} />;
    })}
  </div>
);

// Component to display a section
const SectionViewer: React.FC<{ section: Section }> = ({ section }) => (
  <div className="SectionViewer">
    <h3>{section.customSectionName || section.key}</h3>
    {section.fields.map((field) => (
      <SectionFieldViewer key={field.key} field={field} />
    ))}
    {section.records.map((record) => (
      <RecordViewer key={record.key} record={record} />
    ))}
  </div>
);

// Main Resume Viewer component
const ResumeViewer: React.FC<{ resume: ResumeType }> = ({ resume }) => {
  const { document } = resume;
  const { title, generatedTitle, photo, content } = document;

  return (
    <div className="ResumeViewer flex">
      <h1>{title}</h1>
      <h2>{generatedTitle}</h2>
      <div className="flex row">
        <div className="flex column">
          {content.sections.map((section) => (
            <SectionViewer key={section.key} section={section} />
          ))}
        </div>
        <PhotoViewer photo={photo} />
      </div>
    </div>
  );
};

export const Resume = () => {
  // https://daisyui.com/components/timeline/
  return (
    <ul className="timeline timeline-vertical">
      <li>
        <div className="timeline-start timeline-box">
          First Macintosh computer
        </div>
        <div className="timeline-middle">
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
        </div>
        <hr />
      </li>
      <li>
        <hr />
        <div className="timeline-start timeline-box">iMac</div>
        <div className="timeline-middle">
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
        </div>
        <hr />
      </li>
      <li>
        <hr />
        <div className="timeline-start timeline-box">iPod</div>
        <div className="timeline-middle">
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
        </div>
        <hr />
      </li>
      <li>
        <hr />
        <div className="timeline-start timeline-box">iPhone</div>
        <div className="timeline-middle">
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
        </div>
        <hr />
      </li>
      <li>
        <hr />
        <div className="timeline-start timeline-box">Apple Watch</div>
        <div className="timeline-middle">
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
        </div>
      </li>
    </ul>
  );
};

export const Resume2 = () => {
  return (
    <Page
      style={{
        paddingBottom: "100px",
      }}
    >
      <ResumeViewer resume={data} />
    </Page>
  );
};
