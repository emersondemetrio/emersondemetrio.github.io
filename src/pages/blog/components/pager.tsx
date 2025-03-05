type PagerProps = {
  currentPage: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
};

const btnClass =
  "w-8 h-8 flex items-center justify-center bg-blue-500 text-white disabled:bg-blue-900 disabled:text-[#4d5258] disabled:cursor-not-allowed text-sm hover:bg-blue-600 rounded-full";

export const Pager = ({ currentPage, totalPages, onPrev, onNext }: PagerProps) => (
  <div className="w-[500px] bg-black text-[#e7e9ea] rounded-md pb-4 pt-4 flex justify-between items-center font-mono">
    <button
      onClick={onPrev}
      disabled={currentPage === 1}
      className={btnClass}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M15 18l-6-6 6-6" />
      </svg>
    </button>
    <span className="text-[#4d5258] text-sm">
      {currentPage} / {totalPages}
    </span>
    <button
      onClick={onNext}
      disabled={currentPage === totalPages}
      className={btnClass}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M9 18l6-6-6-6" />
      </svg>
    </button>
  </div>
);
