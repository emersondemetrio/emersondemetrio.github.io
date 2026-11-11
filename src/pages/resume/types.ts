export type ResumeLink = { label: string; url: string };

export type Job = {
  role: string;
  company: string;
  url?: string;
  period: string;
  location: string;
  summary?: string;
  highlights?: string[];
  stack: string[];
};

export type ProjectKind = "Work" | "Research" | "Personal" | "University";

export type Project = {
  name: string;
  kind: ProjectKind;
  company?: string;
  year: number;
  description: string;
  highlights?: string[];
  achievements?: string;
  languages: string[];
  stack: string[];
  links?: ResumeLink[];
};

export type ResumeData = {
  profile: {
    name: string;
    headline: string;
    location: string;
    summary: string[];
    links: ResumeLink[];
  };
  experience: Job[];
  projects: Project[];
  skills: { group: string; items: string[] }[];
  publications: { title: string; authors: string; venue: string; year: number }[];
  education: { title: string; school: string; period: string; note?: string; url?: string }[];
  certifications: string[];
  languages: { name: string; level: string }[];
  interests: string[];
};
