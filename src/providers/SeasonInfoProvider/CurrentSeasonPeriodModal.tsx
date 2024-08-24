import { SeasonInfo } from '@/types';
import { formatDateTime } from '@/utils/common';
import { XCircle } from '@ethsign/icons';
import { Modal } from '@ethsign/ui';
import classNames from 'classnames';
import React, { useRef } from 'react';
import { Transition } from 'react-transition-group';

const ModalContent: React.FC<{ color?: 'black' | 'white'; seasonInfo: SeasonInfo }> = (props) => {
  const { seasonInfo, color = 'white' } = props;

  return (
    <div className="relative h-max">
      <img
        className="mx-auto size-[140px] object-contain"
        src="https://sign-public-cdn.s3.us-east-1.amazonaws.com/Signie/prize-pool_240628022116.webp"
        alt=""
      />
      <div className="space-y-2">
        <h1
          className={classNames('text-center font-bold text-3xl', {
            'text-white': color === 'white',
            'text-[#1C1C1C] text-xl': color === 'black'
          })}
        >
          Prize pool awaits you
        </h1>
        <p
          className={classNames('mx-auto max-w-[273px] text-center font-semibold', {
            'text-gray-50': color === 'white',
            'text-[#475467] text-sm': color === 'black'
          })}
        >
          {seasonInfo.name} will be ended at {formatDateTime(seasonInfo.endTime)}
          <br />
          Let's start boosting your Signie points! The higher you rank, the more you win!
        </p>
      </div>
    </div>
  );
};

interface CurrentSeasonPeriodModalProps {
  open?: boolean;
  /** 是否显示 modal 的边框 */
  seasonInfo?: SeasonInfo;
  showModalFrame?: boolean;
  triggerClassName?: string;
  onOpenChange?: (open: boolean) => void;
}

export const CurrentSeasonPeriodModal: React.FC<CurrentSeasonPeriodModalProps> = (props) => {
  const { open, showModalFrame = false, triggerClassName, seasonInfo, onOpenChange } = props;

  const modalContainerRef = useRef<HTMLDivElement>(null);

  if (!seasonInfo) return null;

  if (showModalFrame) {
    return (
      <>
        <Modal
          className="w-[95vw] rounded-[24px] border border-white/20 bg-white p-4 pt-6 sm:w-[410px]"
          open={open}
          footer={false}
          onOpenChange={onOpenChange}
        >
          <ModalContent seasonInfo={seasonInfo} color="black" />
        </Modal>

        <img
          className={classNames(
            'size-[50px] object-contain animate-[attention-seek_2s_ease-in-out_infinite]',
            triggerClassName
          )}
          src="https://sign-public-cdn.s3.us-east-1.amazonaws.com/Signie/prize-pool_240628022116.webp"
          alt=""
          onClick={() => onOpenChange?.(true)}
        />
      </>
    );
  }

  return (
    <Transition unmountOnExit timeout={200} in={open} nodeRef={modalContainerRef}>
      {(state) => (
        <div
          ref={modalContainerRef}
          className={classNames(
            'fixed inset-0 flex h-screen w-screen flex-col justify-center bg-black/50 transition-all duration-200',
            {
              'backdrop-blur opacity-100': state === 'entered' || state === 'entering',
              'backdrop-blur-0 opacity-0': state === 'exiting' || state === 'exited'
            }
          )}
        >
          <div className="relative h-max">
            <XCircle
              className="absolute right-2 top-2 z-10"
              color="white"
              size={24}
              onClick={() => {
                onOpenChange?.(false);
              }}
            />
            <ModalContent seasonInfo={seasonInfo} color="white" />
          </div>
        </div>
      )}
    </Transition>
  );
};
