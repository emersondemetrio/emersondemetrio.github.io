type PagerProps = {
  currentPage: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
};

export const Pager = ({ currentPage, totalPages, onPrev, onNext }: PagerProps) => (
  <div className="bl-pager">
    <button onClick={onPrev} disabled={currentPage === 1} className="bl-pager-btn" aria-label="Previous page">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M15 18l-6-6 6-6" />
      </svg>
    </button>
    <span className="bl-pager-count">{currentPage} / {totalPages}</span>
    <button onClick={onNext} disabled={currentPage === totalPages} className="bl-pager-btn" aria-label="Next page">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M9 18l6-6-6-6" />
      </svg>
    </button>
  </div>
);
