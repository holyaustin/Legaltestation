import { MiniCountdown } from '@/components/Countdown';
import { X } from '@ethsign/icons';
import classNames from 'classnames';
import React, { useMemo, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Transition } from 'react-transition-group';

interface NotificationBarProps {
  open: boolean;
  targetTime?: Date;
  onOpenChange?: (visible: boolean) => void;
}

export const NotificationBar: React.FC<NotificationBarProps> = (props) => {
  const { open, targetTime, onOpenChange } = props;

  const notificationRef = useRef<HTMLDivElement>(null);

  const location = useLocation();

  const visible = useMemo(() => {
    const whitelistRoute = ['/lucky-wheel', '/rank', '/tasks', '/rewards'];

    return whitelistRoute.includes(location.pathname);
  }, [location.pathname]);

  return (
    <Transition nodeRef={notificationRef} in={visible && open} unmountOnExit timeout={200}>
      {(state) => (
        <div
          ref={notificationRef}
          className={classNames('fixed top-0 left-0 w-screen overflow-hidden transition-all duration-200 h-[72px]', {
            'translate-y-0': state === 'entered' || state === 'entering',
            '-translate-y-full': state === 'exited' || state === 'exiting'
          })}
        >
          <div className="absolute inset-0 size-full scale-110 bg-white/20 blur-[10px]"></div>

          <div
            className="absolute right-1 top-1"
            onClick={() => {
              onOpenChange?.(false);
            }}
          >
            <X color="white" size={12} />
          </div>

          <div className="z-10 flex h-full items-center justify-between px-4 py-3">
            <div className="text-xs font-semibold text-white">
              Mystery Drop is coming.
              <br />
              Stay tuned and enjoy the gift!
            </div>

            {targetTime && (
              <MiniCountdown
                className="mr-1"
                targetDate={targetTime}
                onFinish={() => {
                  onOpenChange?.(false);
                }}
              />
            )}
          </div>
        </div>
      )}
    </Transition>
  );
};
