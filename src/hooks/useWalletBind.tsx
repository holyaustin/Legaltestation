import { bindWallet } from '@/services';
import { getCustomNanoId } from '@/utils/common.ts';
import { useTonConnectUI, useTonWallet } from '@tonconnect/ui-react';
import { useRef, useState } from 'react';
import { WalletFactory } from '@/core/WalletFactory.tsx';
import { ChainType } from '@/core/types.ts';

export const useWalletBind = (props: { onBindSuccess?: () => void }) => {
  const { onBindSuccess } = props;

  const wallet = useTonWallet();
  const [tonConnectUI] = useTonConnectUI();

  const [binding, setBinding] = useState(false);

  const isBindingRef = useRef(false);

  const fullMessage = {
    statement: 'Welcome to Sign Mini APP',
    issuedAt: new Date().toISOString(),
    nonce: getCustomNanoId()
  };

  const originMsg = JSON.stringify(fullMessage, null, '  ');

  const handleConnect = async () => {
    if (wallet?.account) {
      await tonConnectUI.disconnect();
    }

    const walletIns = WalletFactory.getWallet(ChainType.Ton);
    const res = await walletIns.sign(originMsg);

    const info = walletIns.getWallet();

    handleBindWallet({
      message: res.message,
      signature: res.signature,
      publicKey: info.publicKey!
    });
  };

  const handleBindWallet = async (data: { message: string; signature: string; publicKey: string }) => {
    if (isBindingRef.current) return;

    try {
      setBinding(true);
      isBindingRef.current = true;
      await bindWallet(data);
      onBindSuccess?.();
    } finally {
      isBindingRef.current = false;
      setBinding(false);
    }
  };

  return {
    isBindingWallet: binding,
    bindWallet: handleConnect
  };
};
