export type Link = {
	title: string;
	url: string;
	icon?: string;
	category: 'social' | 'professional' | 'arts';
};

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
		url: 'https://www.github.com/emersondemetrio/',
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

