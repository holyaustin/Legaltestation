import classNames from 'classnames';
import React, { PropsWithChildren } from 'react';

export const Card: React.FC<PropsWithChildren<{ className?: string }>> = (props) => {
  const { children, className } = props;

  return <div className={classNames('rounded-[6px] border-[#272B40] bg-[#101828] p-6', className)}>{children}</div>;
};
