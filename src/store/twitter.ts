import { create } from "zustand";
import tweets from "./t.json";

export type Tweet = {
  id: string;
  tweet: {
    full_text: string;
    created_at: string;
  };
};

export type TweetsState = {
  tweets: Tweet[];
  currentPage: number;
  getTotalPages: () => number;
  error: null | string;
  setCurrentPage: (page: number) => void;
  getCurrentPageTweets: () => Tweet[];
};

const TWEETS_PER_PAGE = 10;

const sortTweetsByDate = (tweets: Tweet[]) => {
  return [...tweets].sort((a, b) => {
    const dateA = new Date(a.tweet.created_at);
    const dateB = new Date(b.tweet.created_at);
    return dateB.getTime() - dateA.getTime(); // newest first
  });
};

export const useTwitterStore = create<TweetsState>((set, get) => ({
  tweets: sortTweetsByDate(tweets as unknown as Tweet[]),
  currentPage: 1,
  getTotalPages: () => Math.ceil(get().tweets.length / TWEETS_PER_PAGE),
  error: null,

  setCurrentPage: (page: number) => {
    set({ currentPage: page });
  },

  getCurrentPageTweets: () => {
    const { tweets, currentPage } = get();
    const start = (currentPage - 1) * TWEETS_PER_PAGE;
    const end = start + TWEETS_PER_PAGE;
    return tweets.slice(start, end);
  },
}));
