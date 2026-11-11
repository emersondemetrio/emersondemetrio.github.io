import "./resume.css";
import { useEffect, useMemo, useState } from "react";
import data from "./resume.json";
import { ProjectKind, ResumeData } from "./types";

const resume = data as ResumeData;
const { profile, experience, projects, skills, publications, education, certifications, languages, interests } =
  resume;

const ALL = "All";

const uniqueSorted = (values: string[]) => [...new Set(values)].sort((a, b) => a.localeCompare(b));

const allLanguages = uniqueSorted(projects.flatMap((p) => p.languages));
const allStacks = uniqueSorted(projects.flatMap((p) => p.stack));
const kinds: ProjectKind[] = ["Work", "Research", "Personal", "University"];

const external = { target: "_blank", rel: "noopener noreferrer" };

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
      {[ALL, ...options].map((o) => (
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

const Section = ({ id, title, children }: { id?: string; title: string; children: React.ReactNode }) => (
  <section id={id} className="rv-section">
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

  useEffect(() => {
    document.title = "About | emerson.run";
  }, []);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return projects
      .filter((p) => kind === ALL || p.kind === kind)
      .filter((p) => language === ALL || p.languages.includes(language))
      .filter((p) => stack === ALL || p.stack.includes(stack))
      .filter((p) => {
        if (!q) return true;
        const haystack = [p.name, p.company, p.description, p.achievements, ...(p.highlights ?? []), ...p.languages, ...p.stack]
          .join(" ")
          .toLowerCase();
        return haystack.includes(q);
      })
      .sort((a, b) => kinds.indexOf(a.kind) - kinds.indexOf(b.kind) || b.year - a.year);
  }, [kind, language, stack, search]);

  const pickTag = (tag: string) => {
    setKind(ALL);
    setSearch("");
    if (allLanguages.includes(tag)) {
      setLanguage(tag);
      setStack(ALL);
    } else {
      setStack(tag);
      setLanguage(ALL);
    }
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
  };

  const reset = () => {
    setKind(ALL);
    setLanguage(ALL);
    setStack(ALL);
    setSearch("");
  };

  const isFilterable = (tag: string) => allLanguages.includes(tag) || allStacks.includes(tag);

  const Tag = ({ tag }: { tag: string }) =>
    isFilterable(tag)
      ? <button className="rv-tag rv-tag-link" onClick={() => pickTag(tag)}>{tag}</button>
      : <span className="rv-tag">{tag}</span>;

  return (
    <div className="mx-home rv">
      <div className="mx-inner">
        <header>
          <h1 className="mx-h1">{profile.name}</h1>
          <p className="mx-subline">
            {profile.headline} · {profile.location}
          </p>
          {profile.summary.map((p) => <p key={p} className="rv-summary">{p}</p>)}
          <div className="rv-links">
            {profile.links.map((l) => (
              <a key={l.url} href={l.url} {...external}>
                {l.label} ↗
              </a>
            ))}
            <a href="#projects" onClick={(e) => {
              e.preventDefault();
              document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
            }}>
              Projects ↓
            </a>
          </div>
        </header>

        <Section title="Experience">
          {experience.map((j) => (
            <article key={`${j.company}-${j.role}`} className="rv-job">
              <div className="rv-job-head">
                <div>
                  <h3 className="rv-job-role">{j.role}</h3>
                  {j.url
                    ? <a className="rv-job-company" href={j.url} {...external}>{j.company}</a>
                    : <div className="rv-job-company">{j.company}</div>}
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
                {j.stack.map((s) => <Tag key={s} tag={s} />)}
              </div>
            </article>
          ))}
        </Section>

        <Section id="projects" title={`Projects · ${visible.length}`}>
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
            {visible.map((p) => (
              <article key={p.name} className={`rv-card${p.highlights ? " rv-card-wide" : ""}`}>
                <div className="rv-card-head">
                  <span className="rv-card-name">{p.name}</span>
                  <span className="rv-card-year">
                    {p.company ? `${p.company} · ` : ""}
                    {p.year}
                  </span>
                </div>
                <p className="rv-text">{p.description}</p>
                {p.highlights && (
                  <details className="rv-details">
                    <summary>What I built</summary>
                    <ul className="rv-list">
                      {p.highlights.map((h) => <li key={h}>{h}</li>)}
                    </ul>
                  </details>
                )}
                {p.achievements && <p className="rv-achievements">{p.achievements}</p>}
                <div className="rv-tags">
                  <span className="rv-tag rv-tag-kind">{p.kind}</span>
                  {[...p.languages, ...p.stack].map((t) => <Tag key={t} tag={t} />)}
                </div>
                {p.links && (
                  <div className="rv-card-links">
                    {p.links.map((l) => (
                      <a key={l.url} href={l.url} {...external}>
                        {l.label} ↗
                      </a>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        </Section>

        <Section title="Skills">
          <div className="rv-skills">
            {skills.map((s) => (
              <div key={s.group}>
                <div className="rv-skill-group">{s.group}</div>
                <ul className="rv-plain">
                  {s.items.map((i) => <li key={i}>{i}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Publications">
          {publications.map((p) => (
            <div key={p.title} className="rv-row">
              <div>
                <div className="rv-job-role">“{p.title}”</div>
                <div className="rv-muted">
                  {p.authors} · {p.venue}
                </div>
              </div>
              <div className="rv-job-meta">{p.year}</div>
            </div>
          ))}
        </Section>

        <Section title="Education">
          {education.map((e) => (
            <div key={e.title} className="rv-row">
              <div>
                <div className="rv-job-role">{e.title}</div>
                <div className="rv-job-company">{e.school}</div>
                {e.note && (
                  e.url
                    ? <a className="rv-muted rv-underline" href={e.url} {...external}>{e.note} ↗</a>
                    : <div className="rv-muted">{e.note}</div>
                )}
              </div>
              <div className="rv-job-meta">{e.period}</div>
            </div>
          ))}
        </Section>

        <div className="rv-columns">
          <Section title="Certifications">
            <ul className="rv-plain">
              {certifications.map((c) => <li key={c}>{c}</li>)}
            </ul>
          </Section>

          <Section title="Languages">
            <ul className="rv-plain">
              {languages.map((l) => (
                <li key={l.name}>
                  {l.name} <span className="rv-muted">· {l.level}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Interests">
            <ul className="rv-plain">
              {interests.map((i) => <li key={i}>{i}</li>)}
            </ul>
          </Section>
        </div>
      </div>
    </div>
  );
};
