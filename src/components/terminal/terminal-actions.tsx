import { Icon } from './icons';
import { TerminalActionsProps } from './types';
import { noop } from '@/utils/utils';

export const TerminalActions = ({ actions }: TerminalActionsProps) => {
  return (
    <div className="action-button-container">
      <Icon name="maximize" onClick={actions?.onMaximize || noop} />
      <Icon name="minimize" onClick={actions?.onMaximize || noop} />
      <Icon name="close" onClick={actions?.onMinimize || noop} />
    </div>
  );
};
