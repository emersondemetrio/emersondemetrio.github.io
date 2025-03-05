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
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Page name="Blog">
      <div className="mx-auto px-4 bg-black min-h-screen">
        <div className="space-y-4 flex flex-col items-center">
          {currentTweets.map((data) => (
            <div key={data.id} className="w-full max-w-[500px] sm:w-[500px]">
              <TweetView
                tweet={data.tweet}
                onClick={() => {}}
              />
            </div>
          ))}
        </div>
        {currentTweets.length > 0 && (
          <div className="flex justify-center">
            <Pager
              currentPage={currentPage}
              totalPages={totalPages}
              onPrev={() => handlePageChange(currentPage - 1)}
              onNext={() => handlePageChange(currentPage + 1)}
            />
          </div>
        )}
      </div>
    </Page>
  );
};
