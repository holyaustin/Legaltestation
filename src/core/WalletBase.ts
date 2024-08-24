import { ISignResult } from './types';
import { prepareSignMessage } from './utils';

export abstract class WalletBase {
  chainType: string;
  provider: any;
  address?: string;
  publicKey?: string;
  chainId?: number | string;
  protocolTag?: string;
  authType: string;
  userAddress?: string;

  constructor(chainType: string, userAddress?: string) {
    this.chainType = chainType;
    this.provider = null;
    this.address = '';
    this.chainId = 1;
    this.authType = '';
    this.userAddress = userAddress || '';
    // this.init();
  }

  // abstract init(): void;
  protected get isConnected(): boolean {
    throw new Error('Not implemented');
  }

  protected get walletInfo(): {
    address?: string;
    isConnected: boolean;
    publicKey: string | undefined;
    chainType: string;
    provider: any;
  } {
    throw new Error('Not implemented');
  }

  abstract connect(_?: string): void;

  abstract disconnect(): void;

  // common sign
  abstract sign(_: string, _1?: string): Promise<ISignResult>;

  // checkAddressValidity(): boolean {
  //     console.log(this.userAddress, this.address);
  //     if (!this.address) {
  //         // 兼容ton的情况，ton只有sign之后才有地址
  //         return true;
  //     }
  //     if (this.userAddress && this.address !== this.userAddress) {
  //         console.error('Wallet address and user address do not match.');
  //         globalVm.toggleAccountChangedModal(true);
  //         return false;
  //     }
  //     return true;
  // }

  async safeSign(_: string, _1?: string): Promise<ISignResult> {
    // if (!this.checkAddressValidity()) {
    //     throw new Error('Wallet address and user address do not match.');
    // }
    return this.sign(_, _1);
  }

  async signin(statement?: string): Promise<ISignResult> {
    const msgRes = prepareSignMessage({ statement, chainId: this.chainId!, address: this.address! });
    return this.sign(JSON.stringify(msgRes, null, '  '));
  }

  // for metamask sign of EIP-712
  signByEIP712(_: string): Promise<ISignResult> {
    throw new Error(`received message:${_},Method not implemented.`);
  }

  getSignEIP712Message(_: { chainId: number | string; info: string; hash: string }): string {
    throw new Error(`received message:${JSON.stringify(_)},Method not implemented.`);
  }

  getWallet(): {
    address?: string;
    isConnected: boolean;
    publicKey: string | undefined;
    chainType: string;
    provider: any;
  } {
    // 获取钱包信息
    return {
      chainType: this.chainType,
      isConnected: this.isConnected,
      address: this.address,
      publicKey: this.publicKey,
      provider: this.provider
    };
  }

  // abstract decrypt(message: string, address: string): Promise<string>;
}
