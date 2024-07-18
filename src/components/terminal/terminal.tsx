import 'react';
import './terminal.css';
import { Link } from '../../types';
import { TerminalHeader } from './terminal-header';
import { Actions } from './types';
import { useState } from 'react';

const openUrl = (url: string) => window.open(url, '_blank');

type TerminalProps = {
  links: Link[];
  tools: Array<{
    title: string;
    handle: string;
    category: string;
    actions: Actions;
  }>;
};

const TerminalBadge = ({
  name,
  onFocus,
  onFocusLost,
}: {
  name: string;
  onFocus: (name: string) => void;
  onFocusLost: () => void;
}) => {
  return (
    <div
      className="terminal-item-tag-container"
      onMouseEnter={() => onFocus(name)}
      onMouseLeave={onFocusLost}
    >
      <span className="badge badge-outline">{name}</span>
    </div>
  );
};

export const Terminal = ({ links, tools = [] }: TerminalProps) => {
  const [activeBadge, setActiveBadge] = useState<string | null>(null);

  const handleBadgeMouseEnter = (name: string) => {
    setActiveBadge(name);
  };

  const handleBadgeMouseLeave = () => {
    setActiveBadge(null);
  };

  const getItemClass = (category: string) => {
    const base =
      activeBadge === category
        ? 'terminal-item terminal-item-active'
        : 'terminal-item';

    if (activeBadge) {
      return category === activeBadge ? base : `${base} terminal-item-inactive`;
    }

    return base;
  };

  return (
    <div className="terminal-container mb-5">
      {links.map(({ handle, title, url, category }) => {
        return (
          <div className={getItemClass(category)} key={`${category}/${title}`}>
            <TerminalHeader title={title} />
            <div
              className="btn btn-dark terminal-item-content"
              onClick={() => openUrl(url)}
            >
              <span>{handle}</span>
            </div>
            <TerminalBadge
              name={category}
              onFocus={handleBadgeMouseEnter}
              onFocusLost={handleBadgeMouseLeave}
            />
          </div>
        );
      })}
      {tools.map((tool, index) => {
        return (
          <div className={getItemClass(tool.category)} key={`tool-${index}`}>
            <TerminalHeader title={tool.title} actions={tool.actions} />
            <div
              className="btn btn-dark terminal-item-content"
              onClick={tool.actions.onMaximize}
            >
              <span>{tool.handle}</span>
            </div>
            <TerminalBadge
              name={tool.category}
              onFocus={handleBadgeMouseEnter}
              onFocusLost={handleBadgeMouseLeave}
            />
          </div>
        );
      })}
    </div>
  );
};
