import { Button, Modal } from '@ethsign/ui';
import React from 'react';

interface HowToClaimModalProps {
  open: boolean;
  onOpenChange: (visible: boolean) => void;
}

export const HowToClaimModal: React.FC<HowToClaimModalProps> = (props) => {
  const { open, onOpenChange } = props;

  return (
    <Modal
      className="w-[95vw] rounded-[24px] border border-white/20 bg-white p-4 pt-6 sm:w-[410px]"
      header={<h2 className="text-center font-bold text-xl">How to claim?</h2>}
      open={open}
      onOpenChange={onOpenChange}
      footer={false}
    >
      <p className="text-sm text-gray-900">
        We will issue rewards to you at fixed times and notify you to provide wallet address.
      </p>

      <Button
        variant="primary"
        className="w-full"
        onClick={() => {
          onOpenChange?.(false);
        }}
      >
        OK
      </Button>
    </Modal>
  );
};
