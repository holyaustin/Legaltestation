import starImg from '@/assets/StarCoin.png';
import ticketImg from '@/assets/ticket.png';
import { CheckSuccess } from '@/components/Icons.tsx';
import { TaskRewardType } from '@/types';
import { cn } from '@/utils/tailwind.ts';
import { ChevronRight } from '@ethsign/icons';
import { ReactNode, useMemo } from 'react';

export interface TaskItemProps {
  title: string;
  description?: string;
  rewardText?: string;
  extra?: ReactNode;
  completed?: boolean;
  rewardImage?: string;
  rewardType?: TaskRewardType;
  onClick?: () => void;
}

export const TaskItem = (props: TaskItemProps) => {
  const { title, description, rewardText, extra, completed, rewardImage, rewardType, onClick } = props;

  const imageUrl = useMemo(() => {
    if (rewardImage) return rewardImage;

    const imageUrls: Record<TaskRewardType, string> = {
      [TaskRewardType.POINTS]: starImg,
      [TaskRewardType.TICKET]: ticketImg
    };

    return imageUrls[rewardType ?? TaskRewardType.POINTS];
  }, [rewardImage, rewardType]);

  return (
    <div
      onClick={() => {
        if (completed) return;
        onClick?.();
      }}
      className={cn(
        'flex items-center justify-between py-3 px-4 rounded-[8px] border border-gray-200 bg-white',
        completed ? 'bg-[#ECF2FF]' : 'bg-white'
      )}
    >
      <div className={'flex items-center gap-4'}>
        <img src={imageUrl} className={'size-[35px]'} alt="" />
        <div>
          <div className={'text-sm font-semibold'}>
            <span> {title}</span>
            {rewardText && <div className={'font-medium text-xs text-primary'}>+{rewardText}</div>}
          </div>
          <div className={'mt-1 font-normal text-xs text-gray-600'}>{description}</div>
        </div>
      </div>
      <div className={'flex items-center'}>
        {extra}
        {completed ? <CheckSuccess /> : <ChevronRight color={'#98A2B3'} />}
      </div>
    </div>
  );
};
