import { useUserInfo } from '@/providers/UserInfoProvider';
import { updateClaimAddress } from '@/services';
import { Button, Modal, Textarea, toast } from '@ethsign/ui';
import { Address as TonAddress } from '@ton/core';
import React, { useEffect, useState } from 'react';
import { ClaimAddressConfirmModal } from './ClaimAddressConfirmModal';

function isTonAddress(address: string) {
  try {
    TonAddress.parse(address);
    return true;
  } catch (error) {
    return false;
  }
}

export interface ClaimAddressEditModalVisible {
  open: boolean;
  onOpenChange?: (visible: boolean) => void;
}

export const ClaimAddressEditModal: React.FC<ClaimAddressEditModalVisible> = (props) => {
  const { user, fetchUser } = useUserInfo();

  const { open, onOpenChange } = props;

  const [claimAddress, setClaimAddress] = useState(user?.claimWalletAddress);

  const [isSaving, setIsSaving] = useState(false);

  const [claimAddressConfirmModalVisible, setClaimAddressConfirmModalVisible] = useState(false);

  const onSaveButtonClick = () => {
    if (!claimAddress) return;

    if (!isTonAddress(claimAddress)) {
      toast({
        title: 'Error',
        description: 'Please enter a TON wallet address.',
        variant: 'error',
        duration: 2000
      });
      return;
    }

    setClaimAddressConfirmModalVisible(true);
  };

  const confirmUpdateAddress = async () => {
    if (!claimAddress) return;

    try {
      setIsSaving(true);

      await updateClaimAddress(claimAddress);
      setIsSaving(false);

      fetchUser();

      onOpenChange?.(false);

      toast({
        title: 'TON wallet address updated',
        variant: 'success',
        duration: 2000
      });
    } finally {
      setIsSaving(false);
      setClaimAddressConfirmModalVisible(false);
    }
  };

  useEffect(() => {
    if (open) {
      setClaimAddress(user?.claimWalletAddress);
    }
  }, [open, user?.claimWalletAddress]);

  return (
    <>
      <Modal
        maskClosable={false}
        className="w-[95vw] rounded-[24px] border border-white/20 bg-white p-4 pt-6 sm:w-[410px]"
        header={<h1 className="text-left text-xl font-semibold">Change Wallet Address</h1>}
        footer={false}
        open={open}
        onOpenChange={onOpenChange}
      >
        <div className="space-y-[6px] overflow-hidden">
          <div className="font-medium text-sm">New wallet address (TON Address)</div>
          <Textarea
            autoFocus
            disabled={isSaving}
            className="border-[#D0D5DD] focus:border-primary/20 "
            placeholder="Enter wallet address manually"
            value={claimAddress}
            onChange={(e) => {
              setClaimAddress(e.target.value);
            }}
          />
        </div>

        {user?.claimWalletAddress && (
          <div className="space-y-[6px] overflow-hidden">
            <div className="font-medium text-sm">Current wallet address</div>
            <div className="w-full overflow-hidden text-wrap break-all rounded-[8px] bg-[#F2F4F7] px-3 py-4 text-sm text-[#101828]">
              {user.claimWalletAddress}
            </div>
          </div>
        )}

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
          <Button className="flex-1" onClick={onSaveButtonClick} disabled={!claimAddress?.length} loading={isSaving}>
            Save
          </Button>
        </div>
      </Modal>

      <ClaimAddressConfirmModal
        address={claimAddress!}
        loading={isSaving}
        open={claimAddressConfirmModalVisible}
        onOpenChange={setClaimAddressConfirmModalVisible}
        onConfirm={confirmUpdateAddress}
      />
    </>
  );
};
