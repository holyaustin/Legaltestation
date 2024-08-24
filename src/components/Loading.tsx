import classNames from 'classnames';
import { Loader2 } from 'lucide-react';
import React, { ReactNode } from 'react';

export const Loading: React.FC<{ className?: string }> = (props) => {
  const { className } = props;

  return (
    <div
      className={classNames(
        'absolute inset-0 z-[99] flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm',
        className
      )}
    >
      <Loader2 className="animate-spin text-primary" size={32} />
    </div>
  );
};

export const Spin = ({ children, loading }: { children: ReactNode; loading: boolean }) => {
  return (
    <div className="relative size-full">
      {loading && (
        <div
          className={
            'absolute left-0 top-0 z-[9999] flex size-full items-center justify-center bg-background/80 backdrop-blur-sm'
          }
        >
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      )}
      <div className="relative h-full">{children}</div>
    </div>
  );
};
