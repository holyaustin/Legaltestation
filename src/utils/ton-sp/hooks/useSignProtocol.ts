import { useEffect } from 'react';
import { Address, OpenedContract } from '@ton/core';
import { useTonClient } from './useTonClient';
import { useAsyncInitialize } from './useAsyncInitialize';
import { Attestation, Schema, SignProtocol } from '../wrappers';
import { getTonSpInfo } from '@/constants/config';

const SP_ADDRESS = getTonSpInfo().spAddress;

export function useSignProtocol() {
  const client = useTonClient();

  const spContract = useAsyncInitialize(async () => {
    if (!client) return;
    const contract = new SignProtocol(Address.parse(SP_ADDRESS));
    return client.open(contract) as OpenedContract<SignProtocol>;
  }, [client]);

  useEffect(() => {
    async function getValue() {
      if (!spContract) return;
    }
    getValue();
  }, [spContract]);

  function getSchemaContract(address: string) {
    if (!client || !spContract || !address) return;

    const contract = new Schema(Address.parse(address));
    return client.open(contract) as OpenedContract<Schema>;
  }

  function getAttestationContract(address: string) {
    if (!client || !spContract || !address) return;

    const contract = new Attestation(Address.parse(address));
    return client.open(contract) as OpenedContract<Attestation>;
  }

  return {
    contract_address: spContract?.address.toString(),
    spContract,
    getSchemaContract,
    getAttestationContract
  };
}
