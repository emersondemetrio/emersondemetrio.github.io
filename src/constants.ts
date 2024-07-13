import { CurrencyProvider, Link, Repo } from "./types";
export const GITHUB_URL = "https://github.com/emersondemetrio/emersondemetrio.github.io/blob/main/"
export const API_URL = "https://api.exchangerate-api.com/v4/latest/";

export const HomeUrl = {
  title: '~/emersondemetrio',
  url: 'https://emerson.run',
};

export const Links: Array<Link> = [
  {
    title: 'Instagram',
    url: 'https://instagram.com/emersondemetrio/',
    category: 'social',
    handle: '@emersondemetrio'
  },
  {
    title: 'x (Twitter)',
    url: 'https://x.com/emersondemetrio/',
    category: 'social',
    handle: '@emersondemetrio'
  },
  {
    title: 'LinkedIn',
    url: 'https://linkedin.com/in/emersondemetrio/',
    category: 'professional',
    handle: '@emersondemetrio'
  },
  {
    title: 'GitHub',
    url: 'https://github.com/emersondemetrio?tab=repositories',
    category: 'professional',
    handle: '@emersondemetrio'
  },
  {
    title: 'Gist',
    url: 'https://gist.github.com/emersondemetrio',
    category: 'professional',
    handle: '@emersondemetrio'
  },
  {
    title: 'CodePen',
    url: 'https://codepen.io/emersondemetrio/',
    category: 'professional',
    handle: '@emersondemetrio'
  },
  {
    title: 'YouTube',
    url: 'https://youtube.com/@emersondemetrio/videos',
    category: 'arts',
    handle: '@emersondemetrio'
  },
  {
    title: 'Playlists',
    url: 'https://youtube.com/@emersondemetrio/playlists',
    category: 'arts',
    handle: 'YT Playlists'
  },
  {
    title: 'SoundCloud',
    url: 'https://soundcloud.com/emersondemetrio/tracks',
    category: 'arts',
    handle: '@emersondemetrio'
  },
  {
    title: 'Spotify',
    url: 'https://open.spotify.com/user/12156014938',
    category: 'arts',
    handle: '@emersondemetrio'
  },
  {
    title: 'Blog',
    url: 'https://badcompiler.tumblr.com',
    category: 'arts',
    handle: '@badcompiler'
  },
];

export const CurrencyProviders: CurrencyProvider[] = [
  {
    name: "Wise",
    nickname: "wis",
    url: (amount, currency) => {
      const wiseLikeUrl = `eur-to-${currency}-rate?amount=${amount}`.toLocaleLowerCase();
      return `https://wise.com/us/currency-converter/${wiseLikeUrl}`
    }
  },
  {
    name: "Google",
    nickname: "ggl",
    url: (amount, currency) => `https://google.com/search?q=${amount}+eur+to+${currency}`
  },
]

export const REPOS: Record<string, Repo> = {
  timezones: {
    name: 'Timezones',
    url: `${GITHUB_URL}src/pages/timezones/timezones.tsx`,
  },
  weather: {
    name: 'Weather App',
    url: `${GITHUB_URL}src/pages/weather-app/weather-app.tsx`,
  },
  codepen: {
    name: 'Code Pen',
    url: `${GITHUB_URL}src/pages/code-pen/pens`,
  },
}
