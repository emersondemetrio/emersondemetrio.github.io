import { CurrencyProvider, Link } from "./types";

export const API_URL = "https://api.exchangerate-api.com/v4/latest/";

export const HomeUrl = {
	title: 'emerson.run',
	url: 'https://emerson.run',
};

export const Links: Array<Link> = [
	{
		title: 'Instagram',
		url: 'https://www.instagram.com/emersondemetrio/',
		category: 'social'
	},
	{
		title: 'Twitter',
		url: 'https://www.twitter.com/emersondemetrio/',
		category: 'social'
	},
	{
		title: 'LinkedIn',
		url: 'https://www.linkedin.com/in/emersondemetrio/',
		category: 'professional'
	},
	{
		title: 'GitHub',
		url: 'https://github.com/emersondemetrio?tab=repositories',
		category: 'professional'
	},
	{
		title: 'Gist',
		url: 'https://gist.github.com/emersondemetrio',
		category: 'professional'
	},
	{
		title: 'CodePen',
		url: 'https://codepen.io/emersondemetrio/',
		category: 'professional'
	},
	{
		title: 'YouTube',
		url: 'https://www.youtube.com/@emersondemetrio/videos',
		category: 'arts'
	},
	{
		title: 'Playlists',
		url: 'https://www.youtube.com/@emersondemetrio/playlists',
		category: 'arts'
	},
	{
		title: 'SoundCloud',
		url: 'https://soundcloud.com/emersondemetrio/tracks',
		category: 'arts'
	},
	{
		title: 'Blog',
		url: 'https://badcompiler.tumblr.com',
		category: 'arts'
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
		url: (amount, currency) => `https://www.google.com/search?q=${amount}+eur+to+${currency}`
	},
]
