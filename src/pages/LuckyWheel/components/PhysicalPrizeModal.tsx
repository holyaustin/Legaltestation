import { PrizeCover, PrizeCoverVariant } from '@/components/PrizeCover';
import { useLotteryInfo } from '@/providers/LotteryInfoProvider';
import { joinSignProtocolTGGroup } from '@/utils';
import { Button, Modal } from '@ethsign/ui';
import React, { useMemo } from 'react';

export interface PhysicalPrizeModalProps {
  open: boolean;
  prizeId: string;
  onOpenChange: (visible: boolean) => void;
}

export const PhysicalPrizeModal: React.FC<PhysicalPrizeModalProps> = (props) => {
  const { prizeId, open, onOpenChange } = props;

  const { getPrizeById } = useLotteryInfo();

  const prize = useMemo(() => getPrizeById(prizeId), [getPrizeById, prizeId]);

  if (!prize) return null;

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      className="w-[95vw] rounded-[24px] border border-white/20 bg-white p-4 pt-6 sm:w-[410px]"
      footer={false}
    >
      <div className="flex justify-center">
        <PrizeCover
          className="size-[60px] object-contain object-center"
          prizeId={prize.id}
          variant={PrizeCoverVariant.Normal}
        />
      </div>

      <h1 className="text-center font-bold text-xl text-[#1c1c1c]">
        Congratulations! <br />
        You won a {prize.name}
      </h1>

      <p className="mx-auto w-[220px] text-center font-medium text-sm text-[#475467]">
        Please send your shipping address through our official TG
      </p>

      <Button
        onClick={() => {
          joinSignProtocolTGGroup();
        }}
      >
        Send Address Now
      </Button>
    </Modal>
  );
};
