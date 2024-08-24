import { Button, Modal } from '@ethsign/ui';
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

export interface GrabResult {
  /** 是否抢到了红包 */
  grabbed: boolean;
  /** 红包金额 */
  amount?: number;
  /** 货币名称 */
  token?: string;
}

export const ResultModal: React.FC<{
  open: boolean;
  result?: GrabResult;
  onOpenChange: (visible: boolean) => void;
}> = (props) => {
  const navigate = useNavigate();

  const { open, result, onOpenChange } = props;

  const { title, description } = useMemo(() => {
    if (!result) return {};

    const { grabbed, token, amount } = result;

    const content = amount ? `${amount} ${token}` : token;

    const title = grabbed ? `You got ${content}!` : 'All gifts have been grabbed';

    const description = grabbed ? 'The rewards can be claimed in the Rewards page.' : 'Come and try next time!';

    return {
      title,
      description
    };
  }, [result]);

  return (
    <Modal
      className="w-[95vw] rounded-[24px] border border-white/20 bg-white p-4 pt-6 sm:w-[410px]"
      open={open}
      footer={false}
      maskClosable={false}
      onOpenChange={onOpenChange}
    >
      <div className="flex items-center justify-center">
        <img
          className="size-[50px] object-contain"
          src="https://ethsign-public.s3.ap-east-1.amazonaws.com/telegram-miniapp/mystery-drop-reward_240613083241.webp"
          alt=""
        />
      </div>

      {result && (
        <>
          <div className="text-center font-bold text-xl">{title}</div>
          <p className="text-center text-md font-semibold text-[#475467]">{description}</p>
          {result.grabbed ? (
            <Button
              variant="primary"
              className="w-full"
              onClick={() => {
                navigate('/rewards');
                onOpenChange?.(false);
              }}
            >
              Check it now
            </Button>
          ) : (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                onOpenChange(false);
              }}
            >
              OK
            </Button>
          )}
        </>
      )}
    </Modal>
  );
};
