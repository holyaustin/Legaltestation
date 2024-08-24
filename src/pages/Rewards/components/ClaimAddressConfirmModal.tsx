import { Button, Modal } from '@ethsign/ui';
import React from 'react';

interface ClaimAddressConfirmModalProps {
  open: boolean;
  address: string;
  loading: boolean;
  onConfirm: () => void;
  onOpenChange: (visible: boolean) => void;
}

export const ClaimAddressConfirmModal: React.FC<ClaimAddressConfirmModalProps> = (props) => {
  const { loading, address, open, onOpenChange, onConfirm } = props;

  return (
    <Modal
      hiddenCloseIcon
      maskClosable={false}
      className="w-[95vw] rounded-[24px] border border-white/20 bg-white p-4 pt-6 sm:w-[410px]"
      header={<h2 className="text-center font-bold text-xl">Are you sure you want to change the address?</h2>}
      open={open}
      onOpenChange={onOpenChange}
      footer={false}
    >
      <p className="text-md text-gray-600">
        The address will be changed to
        <span className="text-wrap break-all text-[#0052FF]">{address}</span>
      </p>

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
        <Button className="flex-1" onClick={onConfirm} loading={loading}>
          Change
        </Button>
      </div>
    </Modal>
  );
};
