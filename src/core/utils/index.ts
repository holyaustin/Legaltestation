import { ISignInMessage } from "../types";
import { customAlphabet } from 'nanoid';


export const getCustomNaNoId = (): string => {
    const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 10);
    return nanoid();
};


export function prepareSignMessage({ chainId, address, statement }: { address: string; chainId: number | string; statement?: string }): ISignInMessage {
    return {
        statement: statement || 'Welcome to Signie',
        chainId: chainId,
        address: address,
        issuedAt: new Date().toISOString(),
        domain: window.location.host,
        uri: window.location.origin,
        version: '1',
        nonce: getCustomNaNoId()
    };
}

export const get4361Message = ({
    domain,
    version,
    nonce,
    issuedAt,
    statement,
    chainId,
    uri,
    address
}: ISignInMessage): string => {
    const header = `${domain} wants you to sign in with your Ethereum account:`;
    const uriField = `URI: ${uri}`;
    let prefix = [header, address].join('\n');
    const versionField = `Version: ${version}`;

    // const addressField = `Address: ` + address;

    const chainField = `Chain ID: ` + chainId || '1';

    const nonceField = `Nonce: ${nonce}`;

    const suffixArray = [uriField, versionField, chainField, nonceField];

    suffixArray.push(`Issued At: ${issuedAt}`);

    const suffix = suffixArray.join('\n');
    prefix = [prefix, statement].join('\n\n');
    if (statement) {
        prefix += '\n';
    }
    return [prefix, suffix].join('\n');
};
