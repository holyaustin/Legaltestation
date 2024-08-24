import { Button, Modal } from '@ethsign/ui';
import React from 'react';
import { useNavigate } from 'react-router-dom';

export const NewRewardIssuedModal: React.FC<{ open: boolean; onOpenChange: (visible: boolean) => void }> = (props) => {
  const { open, onOpenChange } = props;

  const navigate = useNavigate();

  return (
    <Modal
      className="w-[95vw] rounded-[24px] border border-white/20 bg-white p-4 pt-6 sm:w-[410px]"
      header={<h2 className="text-center font-bold text-xl">Your rewards has been issued</h2>}
      footer={false}
      open={open}
      hiddenCloseIcon
      onOpenChange={onOpenChange}
    >
      <p className="text-center text-sm text-gray-900">Please check 'Rewards' page.</p>

      <div className="flex gap-2">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => {
            onOpenChange?.(false);
          }}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          className="flex-1"
          onClick={() => {
            navigate('/rewards');
            onOpenChange?.(false);
          }}
        >
          Check Now
        </Button>
      </div>
    </Modal>
  );
};
