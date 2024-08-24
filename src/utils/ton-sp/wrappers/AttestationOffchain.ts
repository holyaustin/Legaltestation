import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';
import { dateToUnixTimestamp, hexStringToInt, unixTimestampToDate } from '../utils';

export type AttestationOffchainConfig = {
  attester: Address;
  attesterPubKey: string;
  timestamp?: Date;
};

export function attestationOffchainConfigToCell(config: AttestationOffchainConfig): Cell {
  const { attester, attesterPubKey, timestamp } = config;

  return beginCell()
    .storeAddress(attester)
    .storeUint(hexStringToInt(attesterPubKey), 256)
    .storeUint(timestamp ? dateToUnixTimestamp(timestamp) : 0, 32)
    .endCell();
}

export class AttestationOffchain implements Contract {
  constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

  static createFromAddress(address: Address) {
    return new AttestationOffchain(address);
  }

  static createFromConfig(config: AttestationOffchainConfig, code: Cell, workchain = 0) {
    const data = attestationOffchainConfigToCell(config);
    const init = { code, data };
    return new AttestationOffchain(contractAddress(workchain, init), init);
  }

  async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
    await provider.internal(via, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell().endCell()
    });
  }

  async getOffchainAttestationData(provider: ContractProvider): Promise<AttestationOffchainConfig> {
    const result = await provider.get('get_offchain_attestation_data', []);
    const cellHash = result.stack.readCell().beginParse();

    return {
      attester: cellHash.loadAddress(),
      attesterPubKey: cellHash.loadUint(256).toString(16),
      timestamp: unixTimestampToDate(cellHash.loadUint(32))
    };
  }
}
