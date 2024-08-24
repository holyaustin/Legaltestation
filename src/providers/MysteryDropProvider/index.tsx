import { Events, eventBus } from '@/eventbus';
import { getMysteryDropInfo, mysteryDropRaffle } from '@/services';
import { MysteryDropInfo } from '@/types';
import React, { PropsWithChildren, createContext, useContext, useEffect, useState } from 'react';
import { useLocalStorage } from 'react-use';
import { MysteryDrop } from './MysteryDrop';
import { NotificationBar } from './NotificationBar';
import { NotificationModal } from './NotificationModal';
import { GrabResult, ResultModal } from './ResultModal';

enum MysteryDropPhase {
  // 今天不会下红包雨
  notTody = 'notTody',
  // 今天将下红包雨
  willStartOnToday = 'willStartOnToday',
  // 即将下红包雨
  aboutToStart = 'aboutToStart',
  // 正在下红包雨
  started = 'started',
  // 红包雨已结束
  ended = 'ended'
}

const getPhase = (startTime?: Date, endTime?: Date) => {
  if (!startTime || !endTime) return MysteryDropPhase.notTody;
  // 提前 5 分钟开始倒计时
  const countdownDuration = 5 * 60 * 1000;

  const nowDate = new Date();
  const now = nowDate.getTime();
  const delta = startTime.getTime() - now;

  if (isSameDay(startTime, nowDate)) {
    if (now < startTime.getTime() && delta < countdownDuration) {
      return MysteryDropPhase.aboutToStart;
    }

    if (now > startTime.getTime() && now < endTime.getTime()) {
      return MysteryDropPhase.started;
    }

    if (now > endTime.getTime()) return MysteryDropPhase.ended;

    return MysteryDropPhase.willStartOnToday;
  }

  return MysteryDropPhase.notTody;
};

const MysteryDropContext = createContext({
  notifyBarVisible: false
});

function isSameDay(date1: Date, date2: Date) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

export const MysteryDropProvider: React.FC<PropsWithChildren> = (props) => {
  const { children } = props;

  const [notifyBarVisible, setNotifyBarVisible] = useState(false);

  const [notifyModalVisible, setNotifyModalVisible] = useState(false);

  const [notifyModalClosedManually, setNotifyModalClosedManually] = useLocalStorage(
    'mystery_modal_closed_manually_' + new Date().toLocaleDateString(),
    false
  );

  const [mysteryDropVisible, setMysteryDropVisible] = useState(false);

  const [timeframe, setTimeFrame] = useState<Date[]>([]);

  const [nextDropInfo, setNextDropInfo] = useState<MysteryDropInfo['nextMysteryDrop']>();

  const [resultModalVisible, setResultModalVisible] = useState(false);

  const [grabResult, setGrabResult] = useState<GrabResult>();

  const onPress = async () => {
    if (!nextDropInfo) return;

    try {
      const result = await mysteryDropRaffle(nextDropInfo?.id);

      setGrabResult({
        grabbed: result.grabbed,
        token: result.token,
        amount: result.amount
      });

      if (result.grabbed) {
        eventBus.emit(Events.mysteryDropGrabbed);
      }

      // 最多延迟 3s 之后给出结果
      const timeRemains = timeframe[1].getTime() - Date.now();

      const timeout = timeRemains > 3000 ? 3000 : timeRemains;

      setTimeout(() => {
        setResultModalVisible(true);
        setMysteryDropVisible(false);
      }, timeout);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const fetchLatestMysteryDropInfo = async () => {
      const mysteryDropInfo = await getMysteryDropInfo();
      const nextMysteryDrop = mysteryDropInfo.nextMysteryDrop;
      if (!nextMysteryDrop?.startTime || !nextMysteryDrop?.endTime) return null;
      setNextDropInfo(nextMysteryDrop);

      const startTime = new Date(nextMysteryDrop.startTime);
      const endTime = new Date(nextMysteryDrop.endTime);

      setTimeFrame([startTime, endTime]);

      return { startTime, endTime };
    };

    const init = async () => {
      let lastPhase: MysteryDropPhase | null = null;
      let startTime: Date | undefined = undefined;
      let endTime: Date | undefined = undefined;

      fetchLatestMysteryDropInfo().then((result) => {
        startTime = result?.startTime;
        endTime = result?.endTime;
      });

      const onTimeThrough = () => {
        const phase = getPhase(startTime, endTime);

        if (phase === lastPhase) {
          return;
        }

        switch (phase) {
          case MysteryDropPhase.notTody: {
            setNotifyBarVisible(false);
            setNotifyModalVisible(false);
            setMysteryDropVisible(false);
            break;
          }

          case MysteryDropPhase.willStartOnToday: {
            if (!notifyModalClosedManually) setNotifyModalVisible(true);
            break;
          }

          case MysteryDropPhase.aboutToStart: {
            setNotifyBarVisible(true);
            setNotifyModalVisible(false);
            break;
          }

          case MysteryDropPhase.started: {
            setNotifyBarVisible(false);
            setMysteryDropVisible(true);
            break;
          }

          case MysteryDropPhase.ended: {
            setMysteryDropVisible(false);
            fetchLatestMysteryDropInfo().then((result) => {
              startTime = result?.startTime;
              endTime = result?.endTime;
            });
            break;
          }
        }

        lastPhase = phase;
      };

      timer = setInterval(onTimeThrough, 1000);
    };

    init();

    return () => {
      if (timer) clearInterval(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <MysteryDropContext.Provider value={{ notifyBarVisible }}>
      <NotificationBar open={notifyBarVisible} targetTime={timeframe[0]} onOpenChange={setNotifyBarVisible} />

      <NotificationModal
        startTime={nextDropInfo?.noticeStartTime}
        endTime={nextDropInfo?.noticeEndTime}
        open={notifyModalVisible}
        onOpenChange={(visible) => {
          if (!visible) setNotifyModalClosedManually(true);
          setNotifyModalVisible(visible);
        }}
      />

      <MysteryDrop open={mysteryDropVisible} onOpenChange={setMysteryDropVisible} onPress={onPress} />

      <ResultModal open={resultModalVisible} result={grabResult} onOpenChange={setResultModalVisible} />

      {children}
    </MysteryDropContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useMysteryDropContext = () => {
  const { notifyBarVisible } = useContext(MysteryDropContext);

  return { notifyBarVisible };
};
