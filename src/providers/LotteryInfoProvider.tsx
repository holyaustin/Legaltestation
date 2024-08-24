import { Loading } from '@/components/Loading';
import { getLotteryInfo } from '@/services';
import { LotteryInfo, SeasonInfo } from '@/types';
import React, { PropsWithChildren, createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useLocalStorage } from 'react-use';

export interface LotteryInfoContextData {
  loading: boolean;
  totalPoint: number;
  hasSpinedToday: boolean;
  currentScore: number;
  prizes: LotteryInfo['prizes'];
  currentDayRaffleResult?: LotteryInfo['currentRaffleResult'];
  seasonList: SeasonInfo[];
  remainingTimes: LotteryInfo['remainingTimes'];
}

// eslint-disable-next-line react-refresh/only-export-components
export const DEFAULT_LOTTERY_INFO: LotteryInfoContextData = {
  loading: true,
  totalPoint: 0,
  currentScore: 0,
  hasSpinedToday: false,
  seasonList: [],
  prizes: [],
  remainingTimes: 0
};

export const LotteryInfoContext = createContext<
  LotteryInfoContextData & {
    flags: {
      doNotShowBackToWheelTipModal: boolean;
      backToWheelButtonClicked: boolean;
    };
    refresh: (props?: { showLoading?: boolean }) => Promise<void>;
    checkNotShowBackToWheelTipModal: () => void;
    setBackToWheelButtonClicked: (value: boolean) => void;
    getPrizeById: (id: string) => LotteryInfo['prizes'][number] | null;
  }
>({
  loading: true,
  totalPoint: 0,
  currentScore: 0,
  hasSpinedToday: false,
  prizes: [],
  remainingTimes: 0,
  flags: {
    doNotShowBackToWheelTipModal: false,
    backToWheelButtonClicked: false
  },
  seasonList: [],
  refresh: async () => {},
  checkNotShowBackToWheelTipModal: () => {},
  setBackToWheelButtonClicked: () => {},
  getPrizeById: () => null
});

export const LotteryInfoProvider: React.FC<PropsWithChildren> = (props) => {
  const { children } = props;

  const [lotteryInfo, setLotteryInfo] = useState<LotteryInfoContextData>(DEFAULT_LOTTERY_INFO);

  const [loadingVisible, setLoadingVisible] = useState(false);

  const [doNotShowBackToWheelTipModalFlag = false, setDoNotShowBackToWheelTipModal] = useLocalStorage(
    'v1.0.1_doNotShowBackToWheelTipModal',
    false
  );

  const [backToWheelButtonClicked, setBackToWheelButtonClicked] = useState(false);

  const fetchPageData = useCallback(async () => {
    setLotteryInfo((old) => ({ ...old, loading: true }));

    const response = await getLotteryInfo();

    setLotteryInfo({
      loading: false,
      totalPoint: response.totalPoint,
      currentScore: response.currentRaffleResult?.currentScore ?? 0,
      hasSpinedToday: response.currentRaffleResult !== null,
      prizes: response.prizes,
      seasonList: response.seasonList,
      currentDayRaffleResult: response.currentRaffleResult,
      remainingTimes: response.remainingTimes
    });
  }, []);

  const prizeMap = useMemo(() => {
    const map: Record<string, LotteryInfo['prizes'][number]> = lotteryInfo.prizes.reduce((acc, cur) => {
      acc[cur.id] = cur;
      return acc;
    }, {} as typeof map);

    return map;
  }, [lotteryInfo.prizes]);

  const refresh = useCallback(
    async (props: { showLoading?: boolean } = { showLoading: false }) => {
      const { showLoading } = props;

      if (showLoading) setLoadingVisible(true);

      const data = await fetchPageData();

      if (showLoading) setLoadingVisible(false);

      return data;
    },
    [fetchPageData]
  );

  const checkNotShowBackToWheelTipModal = useCallback(() => {
    setDoNotShowBackToWheelTipModal(true);
  }, [setDoNotShowBackToWheelTipModal]);

  const getPrizeById = useCallback((prizeId: string) => prizeMap[prizeId], [prizeMap]);

  return (
    <LotteryInfoContext.Provider
      value={{
        ...lotteryInfo,
        flags: {
          doNotShowBackToWheelTipModal: doNotShowBackToWheelTipModalFlag,
          backToWheelButtonClicked: backToWheelButtonClicked
        },
        refresh,
        checkNotShowBackToWheelTipModal,
        setBackToWheelButtonClicked,
        getPrizeById
      }}
    >
      {children}

      {loadingVisible && (
        <div className="fixed inset-0">
          <Loading />
        </div>
      )}
    </LotteryInfoContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useLotteryInfo = () => {
  const lotteryInfo = useContext(LotteryInfoContext);
  return lotteryInfo;
};
