import { useState } from 'react';

type IconProps = {
  active: boolean;
};

const CloseIcon = ({ active }: IconProps) => {
  return (
    <g>
      <circle cx="15" cy="15" r="15" fill="#DF4744" />
      {active && (
        <g>
          <circle cx="14.9032" cy="14.9032" r="13.7419" fill="#FC5753" />
          <rect
            x="8.10388"
            y="20.0107"
            width="16.8387"
            height="2.12903"
            transform="rotate(-45 8.10388 20.0107)"
            fill="#7E0508"
          />
          <rect
            x="8.10388"
            y="9.60934"
            width="2.12903"
            height="16.8387"
            transform="rotate(-45 8.10388 9.60934)"
            fill="#7E0508"
          />
        </g>
      )}
    </g>
  );
};

const MinimizeIcon = ({ active }: IconProps) => {
  return (
    <g>
      <circle cx="15" cy="15" r="15" fill="#DE9F34" />
      {active && (
        <g>
          <circle cx="14.9032" cy="14.9032" r="13.7419" fill="#FDBC40" />
          <rect
            x="6.58064"
            y="13.9355"
            width="16.8387"
            height="2.12903"
            fill="#985712"
          />
        </g>
      )}
    </g>
  );
};

const MaximizeIcon = ({ active }: IconProps) => {
  return (
    <g>
      <circle cx="15" cy="15" r="15" fill="#27AA35" />
      {active && (
        <g>
          <circle cx="14.9032" cy="14.9032" r="13.7419" fill="#36C84B" />
          <path
            d="M21.3004 7.52811C21.8549 7.52653 22.3048 7.97644 22.3032 8.53095L22.2815 16.1749C22.2789 17.0644 21.2034 17.5081 20.5744 16.8791L12.9522 9.25696C12.3232 8.62796 12.7669 7.55239 13.6564 7.54986L21.3004 7.52811Z"
            fill="#0B650D"
          />
          <path
            d="M8.53096 22.3032C7.97645 22.3048 7.52654 21.8549 7.52811 21.3003L7.54986 13.6564C7.5524 12.7669 8.62797 12.3232 9.25697 12.9522L16.8791 20.5743C17.5081 21.2033 17.0644 22.2789 16.1749 22.2814L8.53096 22.3032Z"
            fill="#0B650D"
          />
        </g>
      )}
    </g>
  );
};

type GenericIconProps = {
  onClick: () => void;
  name: 'close' | 'minimize' | 'maximize';
};

export const Icon = ({ onClick, name }: GenericIconProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <svg
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      width="30"
      height="30"
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '15px', height: '15px' }}
    >
      {name === 'close' && <CloseIcon active={isHovered} />}
      {name === 'minimize' && <MinimizeIcon active={isHovered} />}
      {name === 'maximize' && <MaximizeIcon active={isHovered} />}
    </svg>
  );
};
