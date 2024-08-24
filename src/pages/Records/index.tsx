import { Tabbar } from '@/components/Header.tsx';
import rocketImg from '@/assets/rocket.png';
import { Badge, DatePicker, Progress, ScrollArea } from '@ethsign/ui';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { getRaffles } from '@/services';
import { formatDate, getUTCTimeByDate } from '@/utils/common.ts';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/Drawer.tsx';
import { ResultCard } from '@/components/Result.tsx';
import { useLotteryInfo } from '@/providers/LotteryInfoProvider.tsx';
import { getLevelInfo } from '@/utils/lottery.ts';
import { isExpired } from '@/utils/common';
import { cn } from '@/utils/tailwind.ts';
import { Loading } from '@/components/Loading.tsx';

const InviteModal = ({ data }: { data: any }) => {
  const [open, setOpen] = useState(false);
  const { prizes } = useLotteryInfo();
  const levelInfo = getLevelInfo({ ...data, levels: prizes } as any);
  const isCompleted = levelInfo?.reachedMax || isExpired(data.expandExpirationAt);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <div className={'flex items-center gap-4'}>
          <div>
            <img src={rocketImg} alt="" className={'w-10'} />
          </div>
          <div className={'flex-1'}>
            <div className={'flex justify-between'}>
              <div className={'text-sm font-semibold'}>
                Level {data.levelInfo.currentLevel}: {data.currentScore} pts
              </div>
              <Badge
                className={cn(
                  'text-xs font-medium',
                  isCompleted ? 'bg-gray-100 text-gray-500' : 'bg-slime-50 text-slime-500'
                )}
              >
                {isCompleted ? 'Completed' : 'In Progress'}
              </Badge>
            </div>
            <div className={'font-normal text-xs'}>{formatDate(data.raffleAt)}</div>
            <Progress
              value={levelInfo.progress}
              className={
                'mt-2.5 bg-[#EAECF0] [&>div]:rounded-full [&>div]:bg-[linear-gradient(90deg,#C7D9FF_0%,#0052FF_100%)]'
              }
            />
            <div className={'mt-2 flex items-center justify-between text-[12px]'}>
              <div>Current: {levelInfo?.currentScore} pts</div>
              <div>{levelInfo?.nextScore ? `Next Level: ${levelInfo?.nextScore} pts` : 'Max'}</div>
            </div>
          </div>
        </div>
      </DrawerTrigger>
      <DrawerContent>
        <div>
          <ResultCard data={{ ...data, levels: prizes }} />
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default function RecordsPage() {
  const [date, setDate] = useState(getUTCTimeByDate(new Date()));
  const { data, isLoading } = useQuery({
    queryKey: ['records', date],
    queryFn: () => getRaffles(date)
  });

  return (
    <div>
      <Tabbar title={'Boost Records'} />
      <ScrollArea className={'h-[calc(100vh-48px)] bg-white px-6 py-8'}>
        <div className={''}>
          <div className={'flex items-center justify-between'}>
            <div className={'font-bold text-md'}>Boost Records</div>
            <DatePicker
              autoHidden
              calendarProps={{
                footer: <div className={'px-2 text-xs text-[#667085]'}>Time Zone: UTC+0</div>
              }}
              className={'flex-[0_0_150px] text-xs'}
              value={new Date(date)}
              onChange={(date) => {
                if (date) {
                  setDate(getUTCTimeByDate(date));
                }
              }}
            />
          </div>
          <div className="space-y-6">
            {isLoading && <Loading />}
            {data?.rows?.map((item, index) => {
              return (
                <div className={'mt-4 rounded-[8px] border border-gray-200 px-4 py-2'} key={index}>
                  <InviteModal data={item} />
                </div>
              );
            })}
            {data && data?.rows?.length === 0 && (
              <div
                className={
                  'mt-6 flex flex-col items-center justify-center rounded-[8px] border border-gray-200 px-4 py-8 text-center'
                }
              >
                <div className={'flex size-12 items-center justify-center rounded-full bg-[#ECF2FF]'}>
                  <img src={rocketImg} alt="" className={'w-[30px]'} />
                </div>
                <div className={'mt-4 font-medium text-sm text-black'}>No Boost Records</div>
                <div className={'font-normal text-xs text-[#667085]'}>
                  There are no boost records. Spin the wheel to start boosting.
                </div>
              </div>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
