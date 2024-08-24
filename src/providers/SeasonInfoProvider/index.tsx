import { addOnDateHandler } from '@/hooks/useClock';
import { getPreviousSeasonInfo } from '@/services';
import { SeasonInfo, SeasonInfoWithResult } from '@/types';
import { formatDateTime } from '@/utils';
import React, { PropsWithChildren, createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useLotteryInfo } from '../LotteryInfoProvider';
import { useNotification } from '../NotificationProvider';
import { CurrentSeasonPeriodModal } from './CurrentSeasonPeriodModal';
import { LastSeasonEndedModal } from './LastSeasonEndedModal';

function getStorageFlag(flagName: string) {
  return localStorage.getItem(flagName) === 'true';
}

function setStorageFlag(flagName: string) {
  return localStorage.setItem(flagName, 'true');
}

// eslint-disable-next-line react-refresh/only-export-components
export const useSeasonInfo = () => {
  const seasonInfo = useContext(SeasonInfoContext);

  return seasonInfo;
};

const SeasonInfoContext = createContext<{
  seasons: SeasonInfo[];
  currentSeason?: SeasonInfo;
}>({
  seasons: []
});

export const SeasonInfoProvider: React.FC<PropsWithChildren> = (props) => {
  const { children } = props;

  const { seasonList, refresh: refreshLotteryInfo } = useLotteryInfo();

  const { addCountdownNotification } = useNotification();

  const countdownNotificationShown = useRef(false);

  const [seasonEndedModalVisible, setSeasonEndedModalVisible] = useState(false);
  const [prizePoolModalVisible, setPrizePoolModalVisible] = useState(false);

  const currentSeason = useMemo(() => {
    return seasonList?.find((season) => season.isCurrent === true);
  }, [seasonList]);

  const [fullLastSeasonInfo, setFullLastSeasonInfo] = useState<SeasonInfoWithResult>();

  useEffect(() => {
    const disposes: (() => void)[] = [];

    const refreshSeasonData = async () => {
      if (!seasonList.length) {
        await refreshLotteryInfo();
        return;
      }

      if (currentSeason) {
        const { popTime, endTime, seasonKey } = currentSeason;

        const prizePoolModalShownFlag = 'prizePoolModalShown_' + seasonKey;
        const modalShown = getStorageFlag(prizePoolModalShownFlag);

        if (popTime) {
          if (!countdownNotificationShown.current) {
            disposes.push(
              addOnDateHandler({
                date: popTime,
                executeInstantly: true,
                handler: () => {
                  addCountdownNotification({
                    date: endTime,
                    title: (
                      <>
                        Allocate rewards at <br />
                        {formatDateTime(endTime, { year: false })}
                      </>
                    )
                  });
                  countdownNotificationShown.current = true;
                }
              })
            );
          }

          if (!modalShown) {
            disposes.push(
              addOnDateHandler({
                date: currentSeason.popTime,
                executeInstantly: true,
                handler: () => {
                  setPrizePoolModalVisible(true);
                  setStorageFlag(prizePoolModalShownFlag);
                }
              })
            );
          }
        }

        // 当前赛季结束之后刷新赛季信息
        disposes.push(
          addOnDateHandler({
            date: endTime,
            handler: async () => {
              await refreshLotteryInfo();
              refreshSeasonData();
            }
          })
        );
      }

      const currentSeasonIndex = seasonList.findIndex((season) => season.isCurrent === true);
      const lastSeason = seasonList[currentSeasonIndex - 1] ?? null;

      if (lastSeason) {
        const { allocatedPopTime, seasonKey } = lastSeason;

        const lastSeasonEndedModalShownFlag = 'lastSeasonEndedModalShown_' + seasonKey;
        const shown = getStorageFlag(lastSeasonEndedModalShownFlag);

        if (allocatedPopTime && !shown) {
          const handler = async () => {
            const fullInfo = await getPreviousSeasonInfo();

            if (!fullInfo) return;

            setFullLastSeasonInfo(fullInfo);
            setSeasonEndedModalVisible(true);
            setStorageFlag(lastSeasonEndedModalShownFlag);
          };

          addOnDateHandler({
            date: allocatedPopTime,
            executeInstantly: true,
            handler
          });
        }
      }
    };

    refreshSeasonData();

    return () => {
      disposes.forEach((dispose) => {
        if (typeof disposes === 'function') dispose();
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSeason, seasonList]);

  return (
    <SeasonInfoContext.Provider value={{ seasons: seasonList, currentSeason }}>
      {children}

      <LastSeasonEndedModal
        seasonInfo={fullLastSeasonInfo}
        open={seasonEndedModalVisible}
        onOpenChange={setSeasonEndedModalVisible}
      />

      <CurrentSeasonPeriodModal
        seasonInfo={currentSeason}
        open={prizePoolModalVisible}
        onOpenChange={setPrizePoolModalVisible}
      />
    </SeasonInfoContext.Provider>
  );
};
