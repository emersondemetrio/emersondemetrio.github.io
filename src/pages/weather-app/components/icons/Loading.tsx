export const Loading = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    style={{
      display: "block",
      shapeRendering: "auto",
    }}
    width="40px"
    height="40px"
    viewBox="0 0 100 100"
    preserveAspectRatio="xMidYMid"
  >
    <circle
      cx="50"
      cy="50"
      r="32"
      strokeWidth="8"
      stroke="#0a0a0a"
      strokeDasharray="50.26548245743669 50.26548245743669"
      fill="none"
      strokeLinecap="round"
    >
      <animateTransform
        attributeName="transform"
        type="rotate"
        repeatCount="indefinite"
        dur="1s"
        keyTimes="0;1"
        values="0 50 50;360 50 50"
      >
      </animateTransform>
    </circle>
  </svg>
);
