import { useNotification } from '@/providers/NotificationProvider';
import { useUserInfo } from '@/providers/UserInfoProvider';
import { Button } from '@ethsign/ui';
import { shortenWalletAddress } from '@ethsign/utils-web';
import classNames from 'classnames';
import { ArrowLeft } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

export interface TabbarProps {
  title: string;
  backUrl?: string;
}

export const Tabbar: React.FC<TabbarProps> = (props) => {
  const { title, backUrl } = props;

  const navigate = useNavigate();

  const backHome = () => {
    if (!backUrl) navigate(-1);
    else navigate(backUrl, { replace: true });
  };

  return (
    <div className="relative flex items-center justify-center px-4 py-3">
      <div
        className="absolute left-0 top-0 flex aspect-square h-full items-center justify-center px-[18px]"
        onClick={backHome}
      >
        <ArrowLeft size={24} color="#FFF" />
      </div>

      <span className="font-bold text-md text-white">{title}</span>
    </div>
  );
};

export const Header: React.FC = () => {
  const { user, bindWallet, isBindingWallet } = useUserInfo();

  const { notifyBarVisible } = useNotification();

  return (
    <div className="h-[72px]">
      <div
        className={classNames(
          'flex shrink-0 h-full items-center justify-between border-b border-[rgba(235,236,239,0.20)] px-4 text-[#344054]',
          { hidden: notifyBarVisible }
        )}
      >
        <img
          className="w-[78px] object-contain"
          src="https://sign-public-cdn.s3.us-east-1.amazonaws.com/Signie/logo_240723092933.svg"
          alt=""
        />

        <Button
          className={'gap-2 rounded-[12px] border-[#EBECEF] bg-[rgba(255,255,255,0.60)]'}
          variant={'outline'}
          loading={isBindingWallet}
          onClick={() => {
            if (!user?.walletAddress) bindWallet();
          }}
        >
          {user?.walletAddress ? (
            <>
              {shortenWalletAddress(user?.walletAddress, 'shorter')}
              <span className="inline-block size-[11px] rounded-full bg-[#99F36F]"></span>
            </>
          ) : (
            <>Connect Wallet</>
          )}
        </Button>
      </div>
    </div>
  );
};
