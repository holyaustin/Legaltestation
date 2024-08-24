import { hashSha256 } from '@ethsign/utils-web';
import { TonConnectUI, TonProofItemReplySuccess, Wallet, toUserFriendlyAddress } from '@tonconnect/ui';
import {
  TonConnectUIProvider,
  TonConnectUIProviderProps,
  WalletInfoRemote,
  useTonConnectModal,
  useTonConnectUI,
  useTonWallet
} from '@tonconnect/ui-react';
import { EventEmitter } from 'events';
import { PropsWithChildren, useEffect } from 'react';
import { Cell } from 'ton-core';
import { proxy } from 'valtio';
import { WalletBase } from '../../WalletBase.ts';
import { ISignResult } from '../../types.ts';
import { getCustomNaNoId } from '../../utils';
import { openLinkInTelegram } from '../../utils/telegram.ts';

const TelegramWalletName = 'telegram-wallet';

export interface TonStoreType {
  account: ReturnType<typeof useTonWallet> | null;
  connectModal: ReturnType<typeof useTonConnectModal> | undefined;
  walletClient: ReturnType<typeof useTonConnectUI>[0] | undefined;
  config: Omit<TonConnectUIProviderProps, 'children'> | undefined;
  counter: number;
}

const tonStore = proxy<TonStoreType>({
  account: null,
  connectModal: undefined,
  walletClient: undefined,
  config: undefined,
  counter: 0
});

const eventBus = new EventEmitter();

const getEventKey = () => {
  return `ton_sign_${tonStore.counter}`;
};

export class TonWallet extends WalletBase {
  // private eventBus = new EventEmitter();
  //
  // private counter = 0;

  // private getEventKey() {
  //     return `ton_sign_${this.counter}`;
  // }
  get isConnected() {
    return !!tonStore.account?.account;
  }

  connect() {
    console.log(tonStore?.connectModal, 'connect');
    tonStore?.connectModal?.open?.();
    // const tonConnectUI = tonStore.walletClient as TonConnectUI;
    // tonConnectUI.onStatusChange(
    //     (walletInfo: Wallet | null) => {
    //         console.log('start listen status change', walletInfo);
    //         if ((walletInfo?.connectItems?.tonProof as TonProofItemReplySuccess)?.proof) {
    //             const eventKey = this.getEventKey();
    //             // log('onStatusChange success, emit event key = %s, data = %j', eventKey, walletInfo);
    //             console.log(eventKey, walletInfo);
    //             this.eventBus.emit(eventKey, walletInfo);
    //         } else {
    //             console.log('onStatusChange extra message %j', walletInfo);
    //         }
    //     },
    //     (err) => {
    //         console.log('onStatusChange error %j', err);
    //     }
    // );
  }

  async disconnect() {
    await tonStore.walletClient?.disconnect();
  }

  private getPublicKey(stateInit: string): string {
    const state_init = Cell.fromBase64(stateInit);
    const bits = state_init.refs[1].bits;
    const pubKey = bits.toString().substring(16, 80).toLowerCase();
    return pubKey;
  }

  async sign(originMsg: string): Promise<ISignResult> {
    // tonspace url长度限制100多字符，所以这里使用hash
    const message = await hashSha256(originMsg);
    const tonConnectUI = tonStore.walletClient as TonConnectUI;
    // const walletInfo = tonConnectUI?.wallet;
    const authType = '';
    // if (walletInfo?.jsBridgeKey && walletInfo?.openMethod !== 'qrcode') {
    //     authType = walletInfo.jsBridgeKey; //记录当前连接的方式，下次进来直接连接，只支持 浏览器插件 tonkeeper
    // }

    console.log(this.isConnected, tonConnectUI, 'connected');
    if (this.isConnected) {
      await tonConnectUI.disconnect();
    }
    tonStore.counter++;
    if (authType) {
      const wallets = await tonConnectUI.getWallets();

      const currentWallet = wallets.find((wallet) =>
        [wallet.name, wallet.appName].includes(authType)
      ) as WalletInfoRemote;

      const link = tonConnectUI.connector.connect(
        {
          bridgeUrl: currentWallet.bridgeUrl,
          universalLink: currentWallet.universalLink
        },
        {
          tonProof: message
        }
      );

      // tonspace在tg内部打开
      openLinkInTelegram(link, currentWallet.appName === TelegramWalletName ? false : true);
    } else {
      console.log('first time, call setConnectRequestParameters');
      tonConnectUI.setConnectRequestParameters({
        state: 'ready',
        value: {
          tonProof: message // 不能有空格，特殊字符
        }
      });
      this.connect();
    }

    const connectedWallet: Wallet = await new Promise((resolve) => {
      const eventKey = getEventKey();
      console.log('start listen event key, key = %s', eventKey);
      eventBus.once(eventKey, (data) => {
        console.log('listen event key success, event key = %s, data = %j', eventKey, data);
        resolve(data);
      });
    });

    this.provider = tonStore.walletClient;
    const proof = (connectedWallet.connectItems?.tonProof as TonProofItemReplySuccess)?.proof;
    this.publicKey = connectedWallet.account.publicKey || this.getPublicKey(connectedWallet.account.walletStateInit); //使用walletStateInit，publicKey由后端计算
    this.address = toUserFriendlyAddress(connectedWallet.account.address);
    const fullMessage = JSON.stringify({
      timestamp: proof.timestamp,
      payload: proof.payload,
      domain: proof.domain
    });
    const signature = proof.signature;

    return {
      message: JSON.stringify({
        fullMessage,
        message: originMsg
      }),
      signature,
      tonProof: message
    };
  }

  override async signin(statement?: string): Promise<ISignResult> {
    const fullMessage = {
      statement: statement || 'Welcome to Signie',
      issuedAt: new Date().toISOString(),
      nonce: getCustomNaNoId()
    };
    const signRes = await this.sign(JSON.stringify(fullMessage, null, '  '));
    return signRes;
  }
}

export const TonConnector = () => {
  const wallet = useTonWallet();
  const [tonConnectUI] = useTonConnectUI();
  const connectModal = useTonConnectModal();

  tonStore.connectModal = connectModal;
  tonStore.walletClient = tonConnectUI;
  tonStore.account = wallet;

  useEffect(() => {
    if (wallet) {
      eventBus.emit(getEventKey(), wallet);
    }
  }, [wallet]);

  return null;
};

export const TonProvider: React.FC<
  PropsWithChildren<{
    config: Omit<TonConnectUIProviderProps, 'children'>;
  }>
> = ({ children, config }) => {
  tonStore.config = config;

  return (
    <TonConnectUIProvider {...config}>
      {children}
      <TonConnector />
    </TonConnectUIProvider>
  );
};
