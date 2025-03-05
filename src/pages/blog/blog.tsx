import { Page } from "@/components/page/page";
import { TweetView } from "./components/tweet-view";
import { Pager } from "./components/pager";
import { useTwitterStore } from "@/store/twitter";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";

export const Blog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { currentPage, getTotalPages, setCurrentPage, getCurrentPageTweets } = useTwitterStore();
  const currentTweets = getCurrentPageTweets();
  const totalPages = getTotalPages();

  useEffect(() => {
    const page = parseInt(searchParams.get("page") || "1");
    setCurrentPage(page);
  }, [searchParams]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSearchParams({ page: page.toString() });
  };

  return (
    <Page name="Blog">
      <div className="mx-auto px-4 bg-black min-h-screen">
        <div className="space-y-4">
          {currentTweets.map((data) => <TweetView key={data.id} tweet={data.tweet} />)}
        </div>

        {currentTweets.length > 0 && (
          <Pager
            currentPage={currentPage}
            totalPages={totalPages}
            onPrev={() => handlePageChange(currentPage - 1)}
            onNext={() => handlePageChange(currentPage + 1)}
          />
        )}
      </div>
    </Page>
  );
};
