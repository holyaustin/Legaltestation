import { CountdownUnit, MiniCountdown } from '@/components/Countdown';
import { X } from '@ethsign/icons';
import classNames from 'classnames';
import React, { createRef, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { Transition, TransitionGroup } from 'react-transition-group';

export interface CountdownNotificationConfig {
  id: string;
  title: React.ReactNode;
  date: Date | number;
  units?: CountdownUnit[];
  onTimeout?: () => void;
}

export interface CountdownNotificationsProps {
  configs: CountdownNotificationConfig[];
  onRemove: (id: string) => void;
}

export const CountdownNotifications: React.FC<CountdownNotificationsProps> = (props) => {
  const { configs, onRemove } = props;

  const configsWithNodeRef = useMemo(() => {
    return configs.map((config) => ({
      ...config,
      nodeRef: createRef<HTMLDivElement>(),
      date: new Date(config.date)
    }));
  }, [configs]);

  const location = useLocation();

  const visible = useMemo(() => {
    const whitelistRoute = ['/lucky-wheel', '/rank', '/tasks', '/rewards', '/debug'];

    return whitelistRoute.includes(location.pathname);
  }, [location.pathname]);

  if (!visible) return null;

  return (
    <TransitionGroup className="fixed left-0 top-0 h-0 w-screen">
      {configsWithNodeRef.slice(-2).map((config, index) => (
        <Transition key={config.id} nodeRef={config.nodeRef} unmountOnExit timeout={200}>
          {(state) => (
            <div
              ref={config.nodeRef}
              style={{
                zIndex: (index + 1) * 10
              }}
              className={classNames('transition-all absolute inset-0 duration-200 h-[72px] overflow-hidden', {
                'translate-y-0': state === 'entered' || state === 'entering',
                '-translate-y-full': state === 'exited' || state === 'exiting'
              })}
            >
              <div className="absolute left-0 top-0 h-screen w-screen bg-[linear-gradient(114deg,rgba(0,178,255,0.52)_0.81%,#9997FF_65.22%),linear-gradient(114deg,#00B2FF_0.81%,#9997FF_65.22%)]"></div>

              <div className="absolute inset-0 size-full scale-110 bg-white/20 blur-[10px]"></div>

              <div
                className="absolute right-1 top-1 z-20"
                onClick={() => {
                  onRemove?.(config.id);
                }}
              >
                <X color="white" size={12} />
              </div>

              <div className="relative z-10 flex h-full items-center justify-between px-4 py-3">
                <div className="text-xs font-semibold text-white">{config.title}</div>

                {config.date && (
                  <MiniCountdown
                    className="mr-1"
                    units={config.units}
                    targetDate={config.date}
                    onFinish={() => {
                      onRemove?.(config.id);
                      config.onTimeout?.();
                    }}
                  />
                )}
              </div>
            </div>
          )}
        </Transition>
      ))}
    </TransitionGroup>
  );
};
