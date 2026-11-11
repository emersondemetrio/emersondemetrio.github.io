import "./resume.css";
import { useMemo, useState } from "react";
import {
  certifications,
  education,
  jobs,
  profile,
  projects,
  ProjectKind,
  spokenLanguages,
} from "./profile";

const ALL = "All";

const uniqueSorted = (values: string[]) =>
  [...new Set(values)].sort((a, b) => a.localeCompare(b));

const allLanguages = uniqueSorted(projects.flatMap((p) => p.languages));
const allStacks = uniqueSorted(projects.flatMap((p) => p.stack));
const kinds: (ProjectKind | typeof ALL)[] = [ALL, "Work", "Personal", "University"];

const Pills = ({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) => (
  <div className="rv-filter-row">
    <span className="rv-filter-label">{label}</span>
    <div className="rv-pills">
      {[ALL, ...options.filter((o) => o !== ALL)].map((o) => (
        <button
          key={o}
          className={`mx-filter-pill${value === o ? " active" : ""}`}
          onClick={() => onChange(o)}
        >
          {o}
        </button>
      ))}
    </div>
  </div>
);

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="rv-section">
    <div className="rv-section-header">
      <span className="rv-section-label">{title}</span>
      <span className="rv-section-rule" />
    </div>
    {children}
  </section>
);

export const Resume = () => {
  const [kind, setKind] = useState<string>(ALL);
  const [language, setLanguage] = useState<string>(ALL);
  const [stack, setStack] = useState<string>(ALL);
  const [search, setSearch] = useState("");

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return projects
      .filter((p) => kind === ALL || p.kind === kind)
      .filter((p) => language === ALL || p.languages.includes(language))
      .filter((p) => stack === ALL || p.stack.includes(stack))
      .filter(
        (p) =>
          !q ||
          `${p.name} ${p.description} ${p.languages.join(" ")} ${p.stack.join(" ")}`
            .toLowerCase()
            .includes(q),
      )
      .sort((a, b) => b.year - a.year);
  }, [kind, language, stack, search]);

  const pickTag = (tag: string) => {
    if (allLanguages.includes(tag)) setLanguage(tag);
    else if (allStacks.includes(tag)) setStack(tag);
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
  };

  const reset = () => {
    setKind(ALL);
    setLanguage(ALL);
    setStack(ALL);
    setSearch("");
  };

  document.title = "About | emerson.run";

  return (
    <div className="mx-home rv">
      <div className="mx-inner">
        <header>
          <h1 className="mx-h1">{profile.name}</h1>
          <p className="mx-subline">
            {profile.headline} · {profile.location}
          </p>
          <p className="rv-summary">{profile.summary}</p>
          <div className="rv-links">
            {profile.links.map((l) => (
              <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer">
                {l.label} ↗
              </a>
            ))}
          </div>
        </header>

        <Section title="Experience">
          {jobs.map((j) => (
            <article key={`${j.company}-${j.role}`} className="rv-job">
              <div className="rv-job-head">
                <div>
                  <h3 className="rv-job-role">{j.role}</h3>
                  <div className="rv-job-company">{j.company}</div>
                </div>
                <div className="rv-job-meta">
                  <div>{j.period}</div>
                  <div>{j.location}</div>
                </div>
              </div>
              {j.summary && <p className="rv-text">{j.summary}</p>}
              {j.highlights && (
                <ul className="rv-list">
                  {j.highlights.map((h) => <li key={h}>{h}</li>)}
                </ul>
              )}
              <div className="rv-tags">
                {j.stack.map((s) => {
                  const clickable = allLanguages.includes(s) || allStacks.includes(s);
                  return clickable
                    ? (
                      <button key={s} className="rv-tag rv-tag-link" onClick={() => pickTag(s)}>
                        {s}
                      </button>
                    )
                    : <span key={s} className="rv-tag">{s}</span>;
                })}
              </div>
            </article>
          ))}
        </Section>

        <section id="projects" className="rv-section">
          <div className="rv-section-header">
            <span className="rv-section-label">Projects · {visible.length}</span>
            <span className="rv-section-rule" />
          </div>

          <div className="rv-filters">
            <input
              className="rv-search"
              placeholder="Search projects…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Pills label="Type" options={kinds} value={kind} onChange={setKind} />
            <Pills label="Language" options={allLanguages} value={language} onChange={setLanguage} />
            <Pills label="Stack" options={allStacks} value={stack} onChange={setStack} />
          </div>

          {visible.length === 0 && (
            <p className="rv-empty">
              Nothing matches. <button className="rv-reset" onClick={reset}>Clear filters</button>
            </p>
          )}

          <div className="rv-grid">
            {visible.map((p) => {
              const body = (
                <>
                  <div className="rv-card-head">
                    <span className="rv-card-name">{p.name}</span>
                    <span className="rv-card-year">{p.year}</span>
                  </div>
                  <p className="rv-text">{p.description}</p>
                  <div className="rv-tags">
                    <span className="rv-tag rv-tag-kind">{p.kind}</span>
                    {[...p.languages, ...p.stack].map((t) => (
                      <span key={t} className="rv-tag">{t}</span>
                    ))}
                  </div>
                </>
              );
              return p.url
                ? (
                  <a key={p.name} className="rv-card" href={p.url} target="_blank" rel="noopener noreferrer">
                    {body}
                  </a>
                )
                : <div key={p.name} className="rv-card">{body}</div>;
            })}
          </div>
        </section>

        <Section title="Education">
          {education.map((e) => (
            <div key={e.title} className="rv-row">
              <div>
                <div className="rv-job-role">{e.title}</div>
                <div className="rv-job-company">{e.school}</div>
              </div>
              <div className="rv-job-meta">{e.period}</div>
            </div>
          ))}
        </Section>

        <Section title="Certifications">
          <ul className="rv-list">
            {certifications.map((c) => <li key={c}>{c}</li>)}
          </ul>
        </Section>

        <Section title="Languages">
          <ul className="rv-list">
            {spokenLanguages.map((l) => <li key={l}>{l}</li>)}
          </ul>
        </Section>
      </div>
    </div>
  );
};
