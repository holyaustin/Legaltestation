import { SeasonInfoWithResult } from '@/types';
import { Button, Modal } from '@ethsign/ui';
import React from 'react';
import { useNavigate } from 'react-router-dom';

export interface LastSeasonEndedModalProps {
  open: boolean;
  seasonInfo?: SeasonInfoWithResult;
  onOpenChange: (visible: boolean) => void;
}

function titleCase(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

const IMAGES = {
  winner: 'https://sign-public-cdn.s3.us-east-1.amazonaws.com/Signie/season-ended-winner_240628061651.webp',
  notWinner: 'https://sign-public-cdn.s3.us-east-1.amazonaws.com/Signie/season-ended_240628061408.webp'
};

export const LastSeasonEndedModal: React.FC<LastSeasonEndedModalProps> = (props) => {
  const { seasonInfo, open, onOpenChange } = props;

  const navigate = useNavigate();

  if (!seasonInfo) return null;

  return (
    <Modal
      className="w-[95vw] rounded-[24px] border border-white/20 bg-white p-4 pt-6 sm:w-[410px]"
      open={open}
      onOpenChange={onOpenChange}
      header={false}
      footer={false}
    >
      <div className="flex justify-center">
        <img className="size-[140px]" src={IMAGES[seasonInfo.result?.hasGain ? 'winner' : 'notWinner']} alt="" />
      </div>

      <h1 className="text-center font-bold text-xl text-[#1C1C1C]">
        Signie Open Competition {titleCase(seasonInfo.name)} Ended
      </h1>

      <p className="text-center text-sm text-[#475467]">
        {seasonInfo.result?.hasGain ? (
          <>
            Your rank in {titleCase(seasonInfo.name)} is{' '}
            <span className="text-[#0052FF]">{seasonInfo.result?.rank}</span>. Check your rewards now.
          </>
        ) : (
          <>
            Your rank in {titleCase(seasonInfo.name)} is{' '}
            <span className="text-[#0052FF]">{seasonInfo.result?.rank}</span>, We are looking forward to see you on the
            leaderboard in the next season!
          </>
        )}
      </p>

      <div className="flex gap-2">
        <Button
          className="flex-1"
          variant="outline"
          onClick={() => {
            onOpenChange?.(false);
          }}
        >
          Close
        </Button>
        <Button
          className="flex-1"
          variant="primary"
          onClick={() => {
            navigate('/rewards');
            onOpenChange?.(false);
          }}
        >
          Go to Rewards
        </Button>
      </div>
    </Modal>
  );
};
