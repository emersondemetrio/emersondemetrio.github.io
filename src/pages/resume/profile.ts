export type Job = {
  role: string;
  company: string;
  period: string;
  location: string;
  summary?: string;
  highlights?: string[];
  stack: string[];
};

export type ProjectKind = "Work" | "Personal" | "University";

export type Project = {
  name: string;
  description: string;
  kind: ProjectKind;
  year: number;
  languages: string[];
  stack: string[];
  url?: string;
};

export const profile = {
  name: "Emerson Demetrio",
  headline: "Senior Product & AI Engineer",
  location: "Florianópolis, Brazil · Remote",
  summary:
    "Senior product engineer building agentic solutions at scale for US start-ups. " +
    "I lead projects from architecture to delivery across the stack with TypeScript, Python, React and Node.js, " +
    "focused on performance, maintainability and developer experience.",
  links: [
    { label: "LinkedIn", url: "https://linkedin.com/in/emersondemetrio" },
    { label: "GitHub", url: "https://github.com/emersondemetrio" },
  ],
};

export const jobs: Job[] = [
  {
    role: "Staff Engineer",
    company: "HoneyBee",
    period: "Oct 2025 – Present",
    location: "United States · Remote · Part-time",
    stack: ["AI"],
  },
  {
    role: "Senior Product Engineer",
    company: "Arist",
    period: "2026",
    location: "New York, US · Remote · Contract",
    summary:
      "Building Arist Diagnostic™ and agentic AI features on an L&D platform: conversational agents, voice interviews and AI-driven workflows that replace manual discovery with end-to-end automation.",
    stack: ["AI", "Agents", "Product Design", "Design Engineering"],
  },
  {
    role: "Senior Software Engineer · Tech Lead",
    company: "AE Studio",
    period: "Jan 2025 – Nov 2025",
    location: "Los Angeles, US · Remote",
    summary:
      "Built scalable, AI-driven products across the stack and led projects from architecture to delivery on education, automation and data platforms like Instill, OneRoster and MTSS.",
    stack: ["TypeScript", "Python", "React", "Node.js", "AI", "AWS"],
  },
  {
    role: "Senior Software Engineer",
    company: "Kyte",
    period: "Dec 2021 – 2024",
    location: "Munich, Germany · On-site",
    summary:
      "Led multiple projects: React/Next.js and React Native development, architecture planning, CI/CD automation and onboarding peers.",
    highlights: [
      "Driver app with QR code scanning, photo uploads and live location tracking",
    ],
    stack: ["React", "Next.js", "React Native", "TypeScript", "GitLab", "CI/CD"],
  },
  {
    role: "Front End Lead",
    company: "CondoConta",
    period: "Mar 2020 – Aug 2021",
    location: "Florianópolis, Brazil",
    highlights: [
      "Team leadership, recruiting and the internship program",
      "React Native development and operations",
      "Interop with third-party teams",
    ],
    stack: ["React Native", "TypeScript"],
  },
  {
    role: "Senior Full Stack Engineer",
    company: "CondoConta",
    period: "Aug 2019 – Feb 2020",
    location: "Florianópolis, Brazil",
    highlights: [
      "Integrated the core product with bank APIs and built the base payment methods",
      "Automated Lambda deployments, later moved to CloudFormation",
      "Shipped the first stable React Native build and the first iOS build",
      "Migrated the app (3k+ files) from JavaScript to TypeScript",
    ],
    stack: ["React Native", "TypeScript", "Java", "Python", "Node.js", "AWS", "Bash"],
  },
  {
    role: "Full Stack Engineer",
    company: "Salsa Technology",
    period: "Nov 2018 – Jul 2019",
    location: "Florianópolis, Brazil",
    highlights: [
      "Drove the AngularJS → Angular 2+ migration and ran team deep dives",
      "InfoBip integration (back end and front end)",
      "Front-end team lead; introduced Git flow and code review",
    ],
    stack: ["Angular", "AngularJS", "Java", "TypeScript"],
  },
  {
    role: "Full Stack Engineer",
    company: "Dimension Data",
    period: "Apr 2017 – Oct 2018",
    location: "Florianópolis, Brazil",
    highlights: [
      "Built the Real Time Service Layer for Tour de France events with Node.js and Socket.IO",
      "Live map of every racer, each tracked by a connected device",
      "Microsoft Office API integrations and PM2 deployment automation",
    ],
    stack: ["Node.js", "Socket.IO", "TypeScript", "Angular", "React", "OpenStreetMap"],
  },
  {
    role: "Developer Analyst",
    company: "AeroTD",
    period: "Jun 2015 – Apr 2017",
    location: "Florianópolis, Brazil",
    highlights: [
      "Web systems, systems integration and legacy maintenance (Moodle LMS)",
    ],
    stack: ["CakePHP", "PHP", "Node.js", "Python"],
  },
  {
    role: "Web Developer · Front-end Lead",
    company: "INCOD",
    period: "Mar 2013 – Jun 2015",
    location: "Florianópolis, Brazil · Part-time",
    stack: ["CakePHP", "Spring MVC", "PHP", "Java"],
  },
  {
    role: "Web Developer",
    company: "inc48",
    period: "Nov 2013 – Jul 2014",
    location: "Florianópolis, Brazil · Part-time",
    summary:
      "Maintained client MVC sites and in-house products, like an event-driven social media tool integrated with Twitter and Instagram.",
    stack: ["CodeIgniter", "PHP", "Bootstrap"],
  },
  {
    role: "Web Developer · IT Support",
    company: "Audiovisual Lab, UFSC",
    period: "2010 – 2013",
    location: "Florianópolis, Brazil",
    stack: ["PHP", "Moodle"],
  },
];

const gh = (repo: string) => `https://github.com/emersondemetrio/${repo}`;

export const projects: Project[] = [
  // Work
  {
    name: "Arist Diagnostic™",
    description: "Agentic AI on an L&D platform: conversational agents, voice interviews and automated discovery workflows.",
    kind: "Work",
    year: 2026,
    languages: [],
    stack: ["AI", "Agents", "Product Design"],
  },
  {
    name: "Instill · OneRoster · MTSS",
    description: "AI-driven education, automation and data platforms built at AE Studio.",
    kind: "Work",
    year: 2025,
    languages: ["TypeScript", "Python"],
    stack: ["React", "Node.js", "AI", "AWS"],
  },
  {
    name: "Kyte driver app",
    description: "Driver app with QR code scanning, photo uploads and live location tracking.",
    kind: "Work",
    year: 2023,
    languages: ["TypeScript"],
    stack: ["React Native", "Next.js"],
  },
  {
    name: "CondoConta bank app",
    description: "First stable and iOS builds, a 3k+ file JS → TS migration, bank API integrations and payment methods.",
    kind: "Work",
    year: 2020,
    languages: ["TypeScript", "Java", "Python"],
    stack: ["React Native", "AWS", "Node.js"],
  },
  {
    name: "Tour de France real-time layer",
    description: "Real-time service layer and live map tracking every racer during the events.",
    kind: "Work",
    year: 2018,
    languages: ["JavaScript"],
    stack: ["Node.js", "Socket.IO", "OpenStreetMap"],
  },

  // Personal
  { name: "emerson.run", description: "This site: links, labs and experiments.", kind: "Personal", year: 2026, languages: ["TypeScript"], stack: ["React", "Vite", "Tailwind", "DaisyUI"], url: gh("emersondemetrio.github.io") },
  { name: "claude-code-mods", description: "Customizations for Claude Code.", kind: "Personal", year: 2026, languages: ["TypeScript"], stack: ["AI", "Claude Code"], url: gh("claude-code-mods") },
  { name: "local-agent", description: "A local AI agent.", kind: "Personal", year: 2026, languages: ["Python"], stack: ["AI", "Agents"], url: gh("local-agent") },
  { name: "slideaway", description: "An interactive presentation tool.", kind: "Personal", year: 2026, languages: ["Python", "JavaScript"], stack: ["Svelte", "Docker"], url: gh("slideaway") },
  { name: "python-course", description: "Python course material.", kind: "Personal", year: 2026, languages: ["Python"], stack: [], url: gh("python-course") },
  { name: "decision-matrix", description: "A decision matrix tool.", kind: "Personal", year: 2026, languages: ["TypeScript"], stack: [], url: gh("decision-matrix") },
  { name: "dotfiles", description: "A collection of useful bash shortcuts and commands.", kind: "Personal", year: 2026, languages: ["Shell", "Python", "Go"], stack: ["Bash"], url: gh("dotfiles") },
  { name: "task-api", description: "An API for a task application.", kind: "Personal", year: 2026, languages: ["TypeScript"], stack: ["Node.js", "Docker"], url: gh("task-api") },
  { name: "ts-advanced-types", description: "A collection of advanced TypeScript code.", kind: "Personal", year: 2026, languages: ["TypeScript"], stack: [], url: gh("ts-advanced-types") },
  { name: "advanced-dev-topics", description: "Advanced TypeScript topics.", kind: "Personal", year: 2026, languages: ["TypeScript", "Python"], stack: [], url: gh("advanced-dev-topics") },
  { name: "game-theory", description: "Game theory experiments.", kind: "Personal", year: 2025, languages: ["TypeScript"], stack: [], url: gh("game-theory") },
  { name: "experiments-api", description: "An API for experiments.", kind: "Personal", year: 2025, languages: ["JavaScript"], stack: ["Node.js"], url: gh("experiments-api") },
  { name: "openfinance", description: "Open finance experiments.", kind: "Personal", year: 2025, languages: ["TypeScript"], stack: [], url: gh("openfinance") },
  { name: "breathly", description: "Breath pacing app: inhale for N seconds, exhale for 2N.", kind: "Personal", year: 2025, languages: ["TypeScript"], stack: ["React"], url: gh("breathly") },
  { name: "semantic-date-api", description: "Semantic date API.", kind: "Personal", year: 2024, languages: ["TypeScript"], stack: ["Node.js"], url: gh("semantic-date-api") },
  { name: "simple-mock-server", description: "Simple mock server.", kind: "Personal", year: 2024, languages: ["JavaScript"], stack: ["Node.js"], url: gh("simple-mock-server") },
  { name: "puzze-galme", description: "Puzzle game.", kind: "Personal", year: 2024, languages: ["TypeScript"], stack: [], url: gh("puzze-galme") },
  { name: "docker-trainning", description: "Docker training.", kind: "Personal", year: 2024, languages: ["JavaScript"], stack: ["Docker", "Node.js"], url: gh("docker-trainning") },
  { name: "node-pipelines", description: "Experimenting with Node.js stream pipelines.", kind: "Personal", year: 2024, languages: ["JavaScript"], stack: ["Node.js"], url: gh("node-pipelines") },
  { name: "tvfx", description: "CSS + JS TV off-air effect.", kind: "Personal", year: 2024, languages: ["JavaScript", "CSS"], stack: [], url: gh("tvfx") },
  { name: "weather-api", description: "Weather API.", kind: "Personal", year: 2024, languages: ["JavaScript"], stack: ["Node.js"], url: gh("weather-api") },
  { name: "timezones", description: "Timezones app.", kind: "Personal", year: 2024, languages: ["JavaScript"], stack: [], url: gh("timezones") },
  { name: "python-threads", description: "Python threads experiments.", kind: "Personal", year: 2024, languages: ["Python"], stack: [], url: gh("python-threads") },
  { name: "number-puzze-game", description: "Number puzzle game.", kind: "Personal", year: 2022, languages: ["TypeScript"], stack: [], url: gh("number-puzze-game") },
  { name: "random-color-palette", description: "Random color palette generator.", kind: "Personal", year: 2022, languages: ["TypeScript"], stack: [], url: gh("random-color-palette") },
  { name: "l33t", description: "l33t text converter.", kind: "Personal", year: 2021, languages: ["TypeScript"], stack: [], url: gh("l33t") },
  { name: "mp3Recorder", description: "Mobile MP3 recorder.", kind: "Personal", year: 2020, languages: ["Dart"], stack: ["Flutter"], url: gh("mp3Recorder") },
  { name: "chess", description: "Yet another chess implementation.", kind: "Personal", year: 2019, languages: ["JavaScript"], stack: [], url: gh("chess") },
  { name: "tetris", description: "Yet another Tetris implementation.", kind: "Personal", year: 2019, languages: ["JavaScript"], stack: [], url: gh("tetris") },
  { name: "tcp-io", description: "TCP data stream experiments.", kind: "Personal", year: 2019, languages: ["JavaScript"], stack: ["Node.js"], url: gh("tcp-io") },
  { name: "upcoming-movies", description: "Upcoming movies web app.", kind: "Personal", year: 2019, languages: ["TypeScript"], stack: ["Angular"], url: gh("upcoming-movies") },
  { name: "angularMVP", description: "Angular 7+ MVP.", kind: "Personal", year: 2019, languages: ["TypeScript"], stack: ["Angular"], url: gh("angularMVP") },
  { name: "socketIOServer", description: "Socket.IO server.", kind: "Personal", year: 2019, languages: ["JavaScript"], stack: ["Node.js", "Socket.IO"], url: gh("socketIOServer") },
  { name: "branch-removing-tool", description: "Removes old branches from your local copy.", kind: "Personal", year: 2017, languages: ["Shell"], stack: ["Bash", "Git"], url: gh("branch-removing-tool") },

  // University
  { name: "Music genre classification (BSc thesis)", description: "Classifying music genres with artificial intelligence.", kind: "University", year: 2018, languages: ["Python", "JavaScript"], stack: ["AI"], url: gh("tcc") },
  { name: "ine5633_trabalhos", description: "Coursework for INE5633.", kind: "University", year: 2015, languages: ["Java"], stack: [], url: gh("ine5633_trabalhos") },
  { name: "finalaps", description: "University project.", kind: "University", year: 2014, languages: ["Java"], stack: [], url: gh("finalaps") },
];

export const education = [
  { title: "BSc, Information Systems", school: "Federal University of Santa Catarina (UFSC)", period: "2010 – 2018" },
  { title: "Bilingual Professional Certification, English", school: "Wizard by Pearson", period: "2020 – 2021" },
];

export const certifications = [
  "Agile Scrum Foundation, Universidade Estabilis (2019)",
  "DevOps Essentials Professional Certificate (DEPC), CertiProf",
  "Shaping up with AngularJS, Code School",
];

export const spokenLanguages = [
  "Portuguese, native",
  "English, professional",
];
