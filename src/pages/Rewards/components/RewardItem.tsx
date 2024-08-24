import { PrizeCover } from '@/components/PrizeCover';
import { CampaignType, MiniRewardStatus, type RewardInfo } from '@/types';
import { joinSignProtocolTGGroup } from '@/utils';
import { Button } from '@ethsign/ui';
import classNames from 'classnames';
import React, { useMemo } from 'react';

interface RewardItemProps {
  reward: RewardInfo;
}

const CAMPAIGN_TYPE_LABEL_MAP: Record<CampaignType, string> = {
  [CampaignType.Competition]: 'Competition',
  [CampaignType.MysteryDrop]: 'Mystery Drop'
};

function formatDate(dateString: number | string): string {
  const date = new Date(dateString);

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  return date.toLocaleDateString('en-US', options);
}

export const RewardItem: React.FC<RewardItemProps> = (props) => {
  const { reward } = props;

  const claimed = useMemo(() => reward.status === MiniRewardStatus.Claimed, [reward.status]);

  return (
    <div
      className={classNames('flex justify-between items-center rounded-[8px] border bg-white px-4 py-3 min-h-[70px]', {
        '!bg-gray-200': claimed
      })}
      key={reward.id}
    >
      <div className="flex flex-1 items-center gap-4">
        {reward.prizeId ? (
          <PrizeCover prizeId={reward.prizeId} />
        ) : (
          <img className="size-8 object-contain" src={reward.image} alt="" />
        )}

        <div className="space-y-1">
          <div className="flex items-center">
            <span className="whitespace-nowrap font-bold text-sm text-[#101828]">
              {reward.type === 'token' ? `${reward.amount} ${reward.name}` : reward.name}
            </span>

            <div
              className={classNames(
                'ml-2 h-[18px] rounded-full bg-secondary px-2 text-xs text-primary whitespace-nowrap',
                {
                  '!bg-gray-50 !text-gray-700': claimed
                }
              )}
            >
              {reward.type === 'physical'
                ? 'Wheel'
                : CAMPAIGN_TYPE_LABEL_MAP[reward.campaignType as CampaignType] ?? reward.campaignType}
            </div>
          </div>

          <div className="font-medium text-xs text-[#475467]">{formatDate(reward.rewardAt)}</div>
        </div>
      </div>

      {!claimed && reward.type === 'physical' && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            joinSignProtocolTGGroup();
          }}
        >
          Contact Us
        </Button>
      )}

      {claimed && (
        <div className="shrink-0">
          <img
            className="size-11 object-contain"
            src="https://sign-public-cdn.s3.us-east-1.amazonaws.com/Signie/reward-claimd_240626073340.svg"
            alt="claimed"
          />
        </div>
      )}
    </div>
  );
};
