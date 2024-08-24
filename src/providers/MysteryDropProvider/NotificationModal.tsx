import { XCircle } from '@ethsign/icons';
import classNames from 'classnames';
import React, { useMemo, useRef } from 'react';
import { Transition } from 'react-transition-group';

const Star: React.FC = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none">
      <path
        d="M3.97575 0.827147L9.70261 7.3076L17.9105 4.58293L11.43 10.3098L14.1547 18.5177L8.42785 12.0372L0.219972 14.7619L6.70043 9.03503L3.97575 0.827147Z"
        fill="#FFE39C"
      />
    </svg>
  );
};

function formatTo12Hour(date: Date): string {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const suffix = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12;
  hours = hours ? hours : 12;

  const minutesStr = minutes < 10 ? '0' + minutes : minutes;

  return `${hours}:${minutesStr} ${suffix}`;
}
interface NotificationModalProps {
  open: boolean;
  startTime?: Date | number;
  endTime?: Date | number;
  onOpenChange: (visible: boolean) => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = (props) => {
  const { open, onOpenChange } = props;

  const [startTime, endTime] = useMemo(() => {
    if (!props.startTime || !props.endTime) return ['', ''];

    const startTime = new Date(props.startTime);
    const endTime = new Date(props.endTime);

    return [formatTo12Hour(startTime), formatTo12Hour(new Date(endTime))];
  }, [props]);

  const modalContainerRef = useRef<HTMLDivElement>(null);

  return (
    <Transition unmountOnExit timeout={200} in={open} nodeRef={modalContainerRef}>
      {(state) => (
        <div
          ref={modalContainerRef}
          className={classNames(
            'fixed inset-0 z-10 flex h-screen w-screen items-center justify-center overflow-hidden bg-black/50 transition-all duration-200',
            {
              'backdrop-blur opacity-100': state === 'entered' || state === 'entering',
              'backdrop-blur-0 opacity-0': state === 'exiting' || state === 'exited'
            }
          )}
        >
          <div
            className={classNames(
              'relative z-10 transition-all duration-200 flex-1 flex-col justify-center items-center',
              {
                'scale-100': state === 'entered' || state === 'entering',
                'scale-50': state === 'exiting' || state === 'exited'
              }
            )}
          >
            <XCircle
              className="absolute right-2 top-2 z-10"
              color="white"
              size={24}
              onClick={() => {
                onOpenChange?.(false);
              }}
            />

            <div className="relative flex h-[182px] items-end justify-center overflow-hidden">
              <img
                className="absolute inset-0 block w-full object-cover"
                src="https://ethsign-public.s3.ap-east-1.amazonaws.com/telegram-miniapp/mystery-drop-modal-light_240613040234.webp"
              />

              <img
                className="z-10 h-[152px]"
                src="https://ethsign-public.s3.ap-east-1.amazonaws.com/telegram-miniapp/mystery-drop-modal-clock_240613040234.webp"
              />
            </div>

            <div className="mt-4 flex flex-col items-center space-y-2 text-center">
              <p className="flex items-center gap-2 font-bold text-xl text-[#FEC84B] [-webkit-text-stroke-color:#FEF0C7] [-webkit-text-stroke-width:1px]">
                <Star />
                Mystery drop is coming between
                <Star />
              </p>

              {startTime && endTime && (
                <p className="font-bold text-xl text-[#FEC84B] [-webkit-text-stroke-color:#FEF0C7] [-webkit-text-stroke-width:1px]">
                  {[startTime, endTime].join(' - ')}
                </p>
              )}

              <p className="font-medium text-sm text-white">Come back and enjoy the gift!</p>
            </div>

            <button
              className="mx-auto mt-4 flex w-[262px] items-center justify-center rounded-full bg-[linear-gradient(180deg,#FF9460_0%,#FF2E37_100%)] py-[9px] text-md font-semibold text-white"
              onClick={() => {
                onOpenChange?.(false);
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </Transition>
  );
};
