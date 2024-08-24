import { TourActionSheet } from '@/components/TourActionSheet.tsx';
import { LuckyWheel } from '@/pages/LuckyWheel/components/LuckyWheel';
import { ConfettiProvider } from '@/providers/ConfettiProvider';
import { useUserInfo } from '@/providers/UserInfoProvider';
import { Rocket01 } from '@ethsign/icons';
import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLotteryInfo } from '../../providers/LotteryInfoProvider';
import { TicketsButton } from './components/TicketsButton';

const LuckyWheelPage: React.FC = () => {
  const { user } = useUserInfo();

  const {
    totalPoint,
    hasSpinedToday,
    flags: { backToWheelButtonClicked },
    refresh
  } = useLotteryInfo();

  const navigate = useNavigate();

  const firstLoadingRef = useRef(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const init = async () => {
      if (!user) return;

      if (!firstLoadingRef.current) {
        firstLoadingRef.current = true;
        await refresh({ showLoading: true });
      }

      if (hasSpinedToday && !backToWheelButtonClicked) {
        timer = setInterval(() => {
          refresh({ showLoading: false });
        }, 10 * 1000);
      }
    };

    init();

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [backToWheelButtonClicked, hasSpinedToday, refresh, user]);

  return (
    <ConfettiProvider>
      <div className="relative space-y-2">
        <div className="space-y-6">
          <div className="relative rounded-[6px] bg-white px-4 py-2 text-center font-bold text-[#101828]">
            <span>Signie Points: </span>
            <span> {totalPoint}</span>

            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <TourActionSheet />
            </div>
          </div>

          {(!hasSpinedToday || (hasSpinedToday && backToWheelButtonClicked)) && (
            <div className="flex gap-3">
              <div
                className="flex-1 rounded-[6px] bg-white px-4 py-2 text-center font-bold text-[#101828] transition-all duration-75 active:shadow-lg"
                onClick={() => {
                  navigate('/records');
                }}
              >
                <div className="flex items-center gap-2">
                  <Rocket01 size={16} />
                  <span className="whitespace-nowrap">Boost Records</span>
                </div>
              </div>
              <TicketsButton />
            </div>
          )}
        </div>

        <LuckyWheel />
      </div>
    </ConfettiProvider>
  );
};

export default LuckyWheelPage;
