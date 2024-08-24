import { Events, eventBus } from '@/eventbus';
import { addOnDateHandler } from '@/hooks/useClock';
import { useLotteryInfo } from '@/providers/LotteryInfoProvider';
import { useSeasonInfo } from '@/providers/SeasonInfoProvider';
import { CurrentSeasonPeriodModal } from '@/providers/SeasonInfoProvider/CurrentSeasonPeriodModal';
import { raffle } from '@/services';
import WebApp from '@twa-dev/sdk';
import classNames from 'classnames';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { PrizeCover, PrizeCoverVariant } from './PrizeCover';

export interface RaffleWheelProps {
  className?: string;
  onResult?: () => void;
  onStopped?: (prizeId: string) => void;
}

const BASE_DEGREE = 3600;
const SPIN_DURATION = 5000;

export const PrizePoolModal: React.FC = () => {
  const { currentSeason } = useSeasonInfo();

  const [shouldShowPrizePoolModal, setShouldShowPrizePoolModal] = useState(false);
  const [prizePoolModalVisible, setPrizePoolModalVisible] = useState(false);

  useEffect(() => {
    const popTime = currentSeason?.popTime;

    if (!popTime) {
      setShouldShowPrizePoolModal(false);
      return;
    }

    if (Date.now() > popTime) {
      setShouldShowPrizePoolModal(true);
      return;
    }

    const dispose = addOnDateHandler({
      date: popTime,
      handler: () => {
        setShouldShowPrizePoolModal(true);
      }
    });

    return dispose;
  }, [currentSeason?.popTime]);

  if (!shouldShowPrizePoolModal) return;

  return (
    <CurrentSeasonPeriodModal
      open={prizePoolModalVisible}
      onOpenChange={setPrizePoolModalVisible}
      seasonInfo={currentSeason}
      showModalFrame
      triggerClassName="absolute top-0 right-5 z-20"
    />
  );
};

export const RaffleWheel = React.forwardRef<HTMLDivElement, RaffleWheelProps>((props, ref) => {
  const { className, onResult, onStopped } = props;

  const { loading, prizes, remainingTimes, refresh } = useLotteryInfo();

  const [isSpining, setIsSpining] = useState(false);

  const [isRaffling, setIsRaffling] = useState(false);

  const [degree, setDegree] = useState(0);

  const currentPrizeId = useRef<string>();

  const canSpin = useMemo(
    () => !loading && !isSpining && !isRaffling && remainingTimes > 0,
    [isRaffling, isSpining, loading, remainingTimes]
  );

  const onSpinButtonClick = async () => {
    if (!canSpin) {
      if (remainingTimes < 1) eventBus.emit(Events.noTicketSpin);
      return;
    }

    eventBus.emit(Events.spin);

    setIsRaffling(true);

    const raffleResult = await raffle().catch((error) => {
      refresh();
      throw error;
    });

    currentPrizeId.current = raffleResult.prizeId;

    eventBus.emit(Events.raffleResultReceived);

    setIsRaffling(false);

    try {
      WebApp.HapticFeedback.impactOccurred('heavy');
    } catch (error) {
      console.error(error);
    }

    const prizeIndex = prizes.findIndex((item) => item.id === raffleResult.prizeId);

    onResult?.();

    setDegree(BASE_DEGREE - prizeIndex * 60 || 0);

    setIsSpining(true);
  };

  return (
    <div
      ref={ref}
      className={classNames(
        'relative flex aspect-square size-[110vw] max-w-[460px] max-h-[460px] shrink-0 items-center justify-center overflow-hidden select-none text-white',
        className
      )}
    >
      <PrizePoolModal />

      <div className="absolute inset-0 rounded-full bg-[linear-gradient(-135deg,#FDC347_9%,#FC8682_27%,#FA2CD7_52%,#987CDB_76%,#33D0E0_100%)]" />

      <div className="absolute flex size-[86%] items-center justify-center overflow-hidden rounded-full">
        <div className="absolute size-full translate-y-[-2%] rounded-full bg-[linear-gradient(135deg,#FDC347_9%,#FC8682_27%,#FA2CD7_52%,#987CDB_76%,#33D0E0_100%)]"></div>

        <div className="absolute z-10 size-[calc(100%-10px)] rounded-full shadow-[inset_0_2px_12px_0_#000000]"></div>

        <div
          style={{
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            '--tw-rotate': degree + 'deg',
            '--wheel-duration': SPIN_DURATION + 'ms'
          }}
          className={classNames(
            'absolute inset-0 size-full rotate-0 [transition-timing-function:cubic-bezier(0.5,0,0,1)] flex justify-center items-center',
            {
              '[transition-duration:var(--wheel-duration)] transition-all': isSpining
            }
          )}
          onTransitionEnd={() => {
            onStopped?.(currentPrizeId.current!);
            setIsSpining(false);
            setDegree(degree - BASE_DEGREE);
          }}
        >
          <img src="/wheel.svg" className="size-full object-contain" />

          <div className="absolute inset-[8%] flex items-center justify-center rounded-full">
            {prizes.map((prize, index) => (
              <div
                style={{
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-expect-error
                  '--tw-rotate': index * (360 / prizes.length) - 90 + 'deg'
                }}
                key={prize.id}
                className="absolute right-0 flex w-1/2 origin-left translate-x-0 items-center justify-end pr-[8%] text-[25px] font-extrabold"
              >
                {prize.type === 'point' ? (
                  <span className="[text-shadow:2px_2px_0px_black]">{prize.value}</span>
                ) : (
                  <PrizeCover prizeId={prize.id} variant={PrizeCoverVariant.Wheel} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <img src="/wheel-pointer.svg" className="absolute left-1/2 top-0 z-10 w-[20px] -translate-x-1/2" alt="" />

      <div className="relative z-10 flex size-[24%] items-center justify-center overflow-hidden rounded-full bg-[linear-gradient(226deg,#FEDC31_4.15%,#FDC347_13.8%,#FC8682_33.1%,#FA2CD7_59.91%,#987CDB_85.64%,#33D0E0_111.37%)]">
        <div
          className={classNames(
            'absolute inset-[6%] z-10 flex items-center justify-center rounded-full bg-black font-bold text-[28px]',
            {
              'transition-all duration-150 active:text-[30px]': canSpin
            }
          )}
          onClick={onSpinButtonClick}
        >
          Spin
        </div>
      </div>
    </div>
  );
});
