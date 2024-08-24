import { Button, Modal } from '@ethsign/ui';
import React from 'react';

interface ClaimAddressTipModalProps {
  open: boolean;
  onOpenChange: (visible: boolean) => void;
}

export const ClaimAddressTipModal: React.FC<ClaimAddressTipModalProps> = (props) => {
  const { open, onOpenChange } = props;

  return (
    <Modal
      className="w-[95vw] rounded-[24px] border border-white/20 bg-white p-4 pt-6 sm:w-[410px]"
      header={<h2 className="text-center font-bold text-xl">What is wallet address for?</h2>}
      open={open}
      onOpenChange={onOpenChange}
      footer={false}
    >
      <section className="text-center text-md text-gray-600">
        <p>Use your wallet address to claim your token/NFT rewards. If entering manually, double-check for accuracy.</p>

        <br />

        <p>Rewards will be issued to your wallet at fixed times, and you'll notified within the app.</p>
      </section>

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
