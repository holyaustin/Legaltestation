import { useClock } from '@/hooks/useClock';
import classNames from 'classnames';
import { createRef, useMemo, useRef, useState } from 'react';
import { Transition, TransitionGroup } from 'react-transition-group';

export type CountdownUnit = 'DYS' | 'HRS' | 'MIN' | 'SEC';

export interface CountdownProps {
  targetDate: Date;
  className?: string;
  units?: CountdownUnit[];
  onFinish?: () => void;
}

function formatCountdownTime(milliseconds: number) {
  if (milliseconds <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const SEC = 1000;
  const MIN = SEC * 60;
  const HOUR = MIN * 60;
  const DAY = HOUR * 24;

  const days = Math.floor(milliseconds / DAY);
  const hours = Math.floor((milliseconds % DAY) / HOUR);
  const minutes = Math.floor((milliseconds % HOUR) / MIN);
  const seconds = Math.ceil((milliseconds % MIN) / SEC);

  return { days, hours, minutes, seconds };
}

function padZero(num: number, length: number = 2): string {
  let numStr = num.toString();

  const zerosNeeded = length - numStr.length;

  if (zerosNeeded > 0) {
    numStr = '0'.repeat(zerosNeeded) + numStr;
  }

  return numStr;
}

const splitDigits = (time: number) => (time < 10 ? ['0', time.toString()] : time.toString().split(''));

// eslint-disable-next-line react-refresh/only-export-components
export const useCountdown = (props: { targetDate: Date; onFinish?: () => void }) => {
  const { targetDate, onFinish } = props;

  const [now, setNow] = useState(Date.now());

  const finished = useRef(false);

  const remain = useMemo(() => {
    const ms = targetDate.getTime() - now;

    return formatCountdownTime(ms);
  }, [now, targetDate]);

  useClock((now) => {
    setNow(now);

    const ms = targetDate.getTime() - now;

    if (ms <= 0 && !finished.current) {
      onFinish?.();
      finished.current = true;
    }
  });

  return remain;
};

export const Countdown: React.FC<CountdownProps> = (props) => {
  const { targetDate, className, onFinish } = props;

  const { hours, minutes, seconds } = useCountdown({
    targetDate,
    onFinish
  });

  const groups = useMemo(() => {
    return [
      {
        label: 'HOURS',
        value: splitDigits(hours)
      },
      {
        label: 'MINUTES',
        value: splitDigits(minutes)
      },
      {
        label: 'SECONDS',
        value: splitDigits(seconds)
      }
    ];
  }, [hours, minutes, seconds]);

  return (
    <div className={className}>
      <div className="flex w-min justify-between gap-[20px]">
        {groups.map((groupItem, groupIndex) => (
          <div className="flex flex-col items-center gap-1" key={groupIndex}>
            <div className="flex items-center justify-center gap-2 font-bold text-2xl text-white">
              {groupItem.value.map((digit, digitIndex) => {
                const ref = createRef<HTMLDivElement>();

                return (
                  <TransitionGroup
                    key={digitIndex}
                    className="relative h-[46px] min-w-[35px] overflow-hidden rounded-md border px-[10px] py-[6px]"
                  >
                    <Transition unmountOnExit key={digit} timeout={1000} nodeRef={ref}>
                      {(state) => (
                        <div
                          ref={ref}
                          className={classNames(
                            'absolute left-0 top-0 flex h-[46px] min-w-[35px] items-center justify-center overflow-hidden rounded-md bg-white px-[10px] py-[6px] text-[#1D2939] transition-[top] duration-1000',
                            {
                              'top-full': state === 'exiting'
                            }
                          )}
                        >
                          {digit}
                        </div>
                      )}
                    </Transition>
                  </TransitionGroup>
                );
              })}
            </div>
            <div className="font-normal text-xs text-[#6B7280]">{groupItem.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const MiniCountdown: React.FC<CountdownProps> = (props) => {
  const { targetDate, className, units = ['DYS', 'HRS', 'MIN', 'SEC'], onFinish } = props;

  const timeRemains = useCountdown({
    targetDate,
    onFinish
  });

  const cells = useMemo(() => {
    const { days, hours, minutes, seconds } = timeRemains;

    const unitMap: Record<CountdownUnit, { label: string; value: string }> = {
      DYS: { label: 'DYS', value: padZero(days, 2) },
      HRS: { label: 'HRS', value: padZero(hours, 2) },
      MIN: { label: 'MIN', value: padZero(minutes, 2) },
      SEC: { label: 'SEC', value: padZero(seconds, 2) }
    };

    return units.map((unit) => unitMap[unit]);
  }, [timeRemains, units]);

  return (
    <div className={classNames('flex gap-2', className)}>
      {cells.map((cell, index) => (
        <div key={index} className="flex flex-col items-center">
          <div className="flex items-center justify-center rounded-sm bg-white px-2 py-1 font-bold text-xs text-[#0052ff]">
            {cell.value}
          </div>

          <span className="font-normal text-xs text-white">{cell.label}</span>
        </div>
      ))}
    </div>
  );
};
