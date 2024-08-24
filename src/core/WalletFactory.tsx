import { WalletBase } from './WalletBase';
import { ChainType } from './types';
import { TonWallet } from './providers/ton';

export abstract class WalletFactory {
  private static instances: Record<string, WalletBase> = {};
  static getWallet(type: ChainType, userAddress?: string): WalletBase {
    if (!this.instances[type]) {
      let WalletClass;
      switch (type) {
        case ChainType.Ton:
          WalletClass = TonWallet;
          break;
        default:
          throw new Error('Unsupported wallet type');
      }

      if (!WalletClass) {
        throw new Error('Unsupported wallet type');
      }
      this.instances[type] = new WalletClass(type, userAddress);
    }
    return this.instances[type];
  }
}
