import { CurrencyProvider, Lab, Link, Repo } from "./types";
export const GITHUB_URL = "https://github.com/emersondemetrio/emersondemetrio.github.io/blob/main/";
export const API_URL = "https://api.exchangerate-api.com/v4/latest/";

export const handle = "@emersondemetrio";

export const HomeUrl = {
  title: "~/emersondemetrio",
  url: "https://emerson.run",
};

const Instagram: Link = {
  title: "Instagram",
  url: "https://instagram.com/emersondemetrio/",
  handle: "@emersondemetrio",
  ranking: 9,
  category: "social",
  about: "Instagram profile",
};

export const Links: Array<Link> = [
  {
    title: "Whatsapp",
    url: `https://wa.me/${atob('KzU1NDg5OTk0NTM1ODE=')}?text=Hey,%20Emerson!`,
    category: "social",
    handle: "@emersondemetrio",
    ranking: 0,
    keepFocus: false,
    about: "Whatsapp profile",
  },
  Instagram,
  {
    title: "x (Twitter)",
    url: "https://x.com/emersondemetrio/",
    category: "social",
    handle: "@emersondemetrio",
    ranking: 10,
    about: "X profile",
  },
  {
    title: "LinkedIn",
    url: "https://linkedin.com/in/emersondemetrio/",
    category: "professional",
    handle: "@emersondemetrio",
    ranking: 2,
    about: "LinkedIn profile",
  },
  {
    title: "GitHub",
    url: "https://github.com/emersondemetrio?tab=repositories",
    category: "professional",
    handle: "@emersondemetrio",
    ranking: 1,
    about: "GitHub profile",
  },
  {
    title: "Gist",
    url: "https://gist.github.com/emersondemetrio",
    category: "professional",
    handle: "@emersondemetrio",
    ranking: 3,
    about: "Gist profile",
  },
  {
    title: "CodePen",
    url: "https://codepen.io/emersondemetrio/",
    category: "professional",
    handle: "@emersondemetrio",
    ranking: 4,
    about: "CodePen profile",
  },
  {
    title: "YouTube",
    url: "https://youtube.com/@emersondemetrio/videos",
    category: "arts",
    handle: "@emersondemetrio",
    ranking: 5,
    about: "YouTube channel",
  },
  {
    title: "Playlists",
    url: "https://youtube.com/@emersondemetrio/playlists",
    category: "arts",
    handle: "YT Playlists",
    ranking: 6,
    about: "YouTube playlists",
  },
  {
    title: "SoundCloud",
    url: "https://soundcloud.com/emersondemetrio/tracks",
    category: "arts",
    handle: "@emersondemetrio",
    ranking: 7,
    about: "SoundCloud profile",
  },
  {
    title: "Spotify",
    url: "https://open.spotify.com/user/12156014938",
    category: "arts",
    handle: "@emersondemetrio",
    ranking: 8,
    about: "Spotify profile",
  },
  {
    title: "Blog",
    url: "https://badcompiler.tumblr.com",
    category: "arts",
    handle: "@badcompiler",
    ranking: 10,
    about: "Personal Blog",
  }
];

export type AvailableLinks =
  | "instagram"
  | "twitter"
  | "linkedin"
  | "github"
  | "gist"
  | "codepen"
  | "youtube"
  | "playlists"
  | "soundcloud"
  | "spotify"
  | "blog";

export const linkGet = (title: AvailableLinks): Link => {
  const found = Links.find((link) => link.title.toLowerCase() === title);

  if (!found) {
    return Instagram;
  }

  return found;
};

export const CurrencyProviders: CurrencyProvider[] = [
  {
    name: "Wise",
    nickname: "wis",
    url: (base, target, amount) => {
      const wiseLikeUrl = `${base}-to-${target}-rate?amount=${amount}`.toLocaleLowerCase();
      return `https://wise.com/us/currency-converter/${wiseLikeUrl}`;
    },
  },
  {
    name: "Google",
    nickname: "ggl",
    url: (base, target, amount) => `https://google.com/search?q=${amount}+${base}+to+${target}`,
  },
];

export const REPOS: Record<string, Repo> = {
  timezones: {
    name: "Timezones",
    url: `${GITHUB_URL}src/pages/timezones/timezones.tsx`,
  },
  weather: {
    name: "Weather App",
    url: `${GITHUB_URL}src/pages/weather-app/weather-app.tsx`,
  },
  codepen: {
    name: "Code Pen",
    url: `${GITHUB_URL}src/pages/code-pen/pens`,
  },
};

export const MAX_CURRENCY_CONVERT = 5_000_000;

export const githubBaseUrl =
  "https://github.com/emersondemetrio/emersondemetrio.github.io/blob/main/src";

export const experiments: Lab[] = [
  {
    title: "Remove Background",
    description: "Remove background from images 🖼️",
    link: "#/labs/background",
    repo: `${githubBaseUrl}/pages/remove-background/remove-background.tsx`,
  },
  {
    title: "Canvas Game",
    description: "Simple game using canvas 🪨✂️📜",
    link: "#/labs/game",
    repo: `${githubBaseUrl}/pages/canvas-game/canvas-game.tsx`,
  },
  {
    title: "Weather App",
    description: "Weather App 🌦️",
    link: "#/labs/weather",
    repo: `${githubBaseUrl}/pages/weather-app/weather-app.tsx`,
  },
  {
    title: "Code Pens",
    description: "Code Pens 🖊 ️",
    link: "#/labs/code-pen",
    repo: `${githubBaseUrl}/pages/code-pen/code-pen.tsx`,
  },
  {
    title: "Countdown",
    description: "Countdown ⏳",
    link: "#/labs/countdown",
    repo: `${githubBaseUrl}/pages/countdown/countdown.tsx`,
  },
  {
    title: "Camera",
    description: "Camera 📷",
    link: "#/labs/camera",
    repo: `${githubBaseUrl}/pages/camera/camera.tsx`,
  },
  {
    title: "Pasteable",
    description: "Create an image from your clipboard 🖼️",
    link: "#/labs/paste",
    repo: `${githubBaseUrl}/pages/pasteable/pasteable.tsx`,
  },
  {
    title: "Audio FX Studio",
    description: "Professional audio effects processing 🎵",
    link: "#/labs/audio-fx",
    repo: `${githubBaseUrl}/pages/audio-fx/audio-fx.tsx`,
  },
];
