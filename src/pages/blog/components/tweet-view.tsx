import { handle } from "@/constants";
import { Link } from "react-router-dom";

type TweetViewProps = {
  tweet: {
    full_text: string;
    created_at: string;
    id_str?: string;
  };
  onClick: () => void;
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB");
};

export const TweetView = ({ tweet, onClick }: TweetViewProps) => {
  const tweetUrl = tweet.id_str
    ? `https://x.com/${handle.toLowerCase()}/status/${tweet.id_str}`
    : `https://x.com/${handle.toLowerCase()}`;

  return (
    <div
      className={`tweet-container w-[500px] h-[200px] bg-black text-[#e7e9ea] border border-[#71767b] rounded-md p-4 mb-4 flex flex-col`}
      onClick={onClick}
    >
      <div className="font-mono mb-4 flex-1 overflow-y-auto flex items-center justify-center">
        <div>{tweet.full_text}</div>
      </div>

      <div className="mt-auto">
        <hr className="border-[#71767b] mb-2" />

        <div className="flex justify-between items-center font-mono">
          <span>{handle.toLowerCase()}</span>
          <Link
            to={tweetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#4d5258] text-sm hover:text-blue-500"
            onClick={(e) => e.stopPropagation()}
          >
            {formatDate(tweet.created_at)}
          </Link>
        </div>
      </div>
    </div>
  );
};
