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
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const TweetView = ({ tweet, onClick }: TweetViewProps) => {
  const tweetUrl = tweet.id_str
    ? `https://x.com/${handle.replace("@", "")}/status/${tweet.id_str}`
    : `https://x.com/${handle.replace("@", "")}`;

  return (
    <div className="bl-post" onClick={onClick}>
      <p className="bl-body">{tweet.full_text}</p>
      <div className="bl-footer">
        <span className="bl-handle">{handle}</span>
        <Link
          to={tweetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bl-date"
          onClick={(e) => e.stopPropagation()}
        >
          {formatDate(tweet.created_at)} ↗
        </Link>
      </div>
    </div>
  );
};
