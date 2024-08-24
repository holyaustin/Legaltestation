import { Wallet, useTonConnectUI, useTonWallet } from '@tonconnect/ui-react';
import { Sender, SenderArguments } from '@ton/core';

export function useConnection(): { wallet: Wallet | null; sender: Sender; connected: boolean; publicKey: string } {
  const wallet = useTonWallet();
  const [TonConnectUI] = useTonConnectUI();

  return {
    wallet,
    publicKey: wallet?.account.publicKey ?? '',
    sender: {
      send: async (args: SenderArguments) => {
        TonConnectUI.sendTransaction({
          messages: [
            {
              address: args.to.toString(),
              amount: args.value.toString(),
              payload: args.body?.toBoc().toString('base64')
            }
          ],
          validUntil: Date.now() + 6 * 60 * 1000
        });
      }
    },
    connected: TonConnectUI?.connected
  };
}
