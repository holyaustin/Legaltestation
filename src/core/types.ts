

export enum WalletType {
    EVM = 'evm',
    BITCOIN = 'bitcoin',
    SOLANA = 'solana',
    TON = 'ton',
    APTOS = 'aptos',
    PARTICLE = 'particle-evm',
    OKX = 'okx',
    StarkNet = 'starknet',
    WALLETCONNECT = 'walletconnect',
    Cardano = 'cardano'
}

export enum ChainType {
    EVM = 'evm',
    StarkNet = 'starknet',
    Ton = 'ton',
}

export enum ExtendedWalletType {
    UNISAT = 'unisat',
    OKXBTC = 'okx_btc'
}

export type ProviderType = WalletType | ExtendedWalletType;

export interface ISignResult {
    message: string;
    signature: string;
    [key: string]: any;
}

export interface ISignInMessage {
    domain?: string;
    version?: string;
    nonce: string;
    issuedAt: string;
    statement: string;
    chainId?: number | string;
    uri?: string;
    address?: string;
}
