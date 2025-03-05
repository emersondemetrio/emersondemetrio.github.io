export type Actions = {
  onMaximize?: () => void;
  onMinimize?: () => void;
  onClose?: () => void;
};

export type TerminalHeaderProps = {
  title: string;
  actions?: Actions;
};

export type TerminalActionsProps = {
  actions?: Actions;
};

export type LinkCategory = "social" | "professional" | "arts";

export type Link = {
  title: string;
  url: string;
  icon?: string;
  category: LinkCategory;
  handle: string;
  ranking: number;
  keepFocus?: boolean;
  about: string;
};

export type Tool = {
  title: string;
  handle: string;
  category: string;
  actions: Actions;
  about: string;
};

export type Lab = {
  title: string;
  description: string;
  link: string;
  repo: string;
};

export const TargetCurrencies = ["EUR", "USD", "GBP", "BRL"];

export type BaseCurrency = "BRL" | "USD" | "EUR" | "GBP" | "CAD";

export type Currency = {
  provider: string;
  time_last_updated: number;
  rates: Record<string, number>;
};

export type UseCurrencyHook = {
  data: Currency | null;
  isLoading: boolean;
  error: Error | null;
  refresh: () => void;
};

export type CurrencyProvider = {
  name: string;
  nickname: string;
  url: (base: string, target: string, amount: number) => string;
};

export type Repo = {
  name: string;
  url: string;
};

// Weather API types
export type WeatherAPIResult = {
  current: {
    condition: {
      text: string;
      icon: string;
    };
    temp_c: number;
    feelslike_c: number;
  };
  error: {
    code: number;
    message: string;
  };
} & {
  source: "cache" | "api";
};

// Add these new tweet-related types
export type TweetMetrics = {
  retweet_count: number;
  reply_count: number;
  like_count: number;
  quote_count: number;
};

export type TweetAuthor = {
  name: string;
  username: string;
  profile_image_url: string;
};

export type TweetEditInfo = {
  initial: {
    editTweetIds: string[];
    editableUntil: string;
    editsRemaining: string;
    isEditEligible: boolean;
  };
};

export type TweetEntities = {
  hashtags: unknown[];
  symbols: unknown[];
  user_mentions: unknown[];
  urls: unknown[];
};

export type Tweet = {
  tweet: {
    edit_info: TweetEditInfo;
    retweeted: boolean;
    source: string;
    entities: TweetEntities;
    display_text_range: [number, number];
    favorite_count: string;
    id_str: string;
    truncated: boolean;
    retweet_count: string;
    id: string;
    created_at: string;
    favorited: boolean;
    full_text: string;
    lang: string;
  };
};

export type TweetsState = {
  tweets: Tweet[];
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;
  setTweets: (tweets: Tweet[]) => void;
  setCurrentPage: (page: number) => void;
  fetchTweets: () => void;
};
