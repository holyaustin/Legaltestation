import { useLotteryInfo } from '@/providers/LotteryInfoProvider';
import { Button, Checkbox, Modal } from '@ethsign/ui';
import React, { useState } from 'react';

export const BackToWheelModal: React.FC<{ open?: boolean; onOpenChange?: (visible: boolean) => void }> = (props) => {
  const { open, onOpenChange } = props;

  const { checkNotShowBackToWheelTipModal, setBackToWheelButtonClicked } = useLotteryInfo();

  const [checked, setChecked] = useState(false);

  return (
    <Modal
      open={open}
      onOpenChange={(visible) => onOpenChange?.(visible)}
      maskClosable={false}
      hiddenCloseIcon
      header={<div className="text-xl font-extrabold">Boosting Process Continues</div>}
      className="w-[95vw] rounded-[24px] border border-white/20 bg-white p-4 pt-6 sm:w-[410px]"
      footer={false}
    >
      <div className="">
        <p className="text-center text-md text-[#475467]">
          The boosting process will be kept, which can be revisited in ‘Boost records’ on the page of Lucky Wheel.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          checked={checked}
          className="border-[#D0D5DD]"
          onCheckedChange={(checked) => {
            setChecked(checked as boolean);
          }}
        />

        <span onClick={() => setChecked((old) => !old)}>Don't show again</span>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" className="flex-1" onClick={() => onOpenChange?.(false)}>
          Cancel
        </Button>
        <Button
          className="flex-1"
          onClick={() => {
            if (checked) checkNotShowBackToWheelTipModal();

            setBackToWheelButtonClicked(true);
            onOpenChange?.(false);
          }}
        >
          OK
        </Button>
      </div>
    </Modal>
  );
};
