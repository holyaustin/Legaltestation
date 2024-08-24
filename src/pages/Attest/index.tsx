import { Button, Input, Label, Modal, Select, toast } from '@ethsign/ui';
import { useState } from 'react';
// import { ButtonSelect } from '@/components/ButtonSelect.tsx';
import { attestPrepare, checkTx, getRaffleInfo, submitAttestationByOffchain } from '@/services';
import { useUserInfo } from '@/providers/UserInfoProvider';
import { ChainType } from '@/core/types.ts';
import { WalletFactory } from '@/core/WalletFactory.tsx';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { useSignProtocol } from '@/utils/ton-sp/hooks/useSignProtocol';
import { getTonSpInfo } from '@/constants/config';
import { AttestationConfig } from '@/utils/ton-sp/wrappers';
import { Address } from '@ton/core';
import { useConnection } from '@/utils/ton-sp/hooks/useConnection.ts';
import { DataLocation } from '@/utils/ton-sp/utils';
import { offChainSchema } from '@/constants/config';
import { useQuery } from '@tanstack/react-query';
import { Tabbar } from '@/components/Header';

export const AboutModal = () => {
  return (
    <Modal
      footer={false}
      className={'w-[95vw] rounded-[24px] border border-white/20'}
      trigger={
        <Button className={'bg-[#ECF2FF] text-primary'} variant={'outline'}>
          What are attestations?
        </Button>
      }
    >
      <div className="text-center">
        <h1 className={'text-[21px] font-semibold'}>What are attestations?</h1>
        <div className={'mt-3 font-normal text-md text-gray-600'}>
          An attestation is the act of confirming and certifying the validity of a claim or assertion, such as a
          statement, event, or even a legal document. This provides support for an assessor (a.k.a. verifier) to be able
          to confidently accept or reject a given claim that they are presented with.
        </div>
      </div>
    </Modal>
  );
};

// const schemaId = 'SPS_uRupYWqUadWNjKuPHUOyh';

export default function AttestPage() {
  const [type] = useState('offchain');
  const [template, setTemplate] = useState(offChainSchema.name);
  const [loading, setLoading] = useState(false);
  const { user, isBindingWallet, bindWallet } = useUserInfo();
  const [tonConnectUI] = useTonConnectUI();
  const { spContract, getSchemaContract, getAttestationContract } = useSignProtocol();
  const { wallet, sender, publicKey } = useConnection();
  const { offchainSchemaId: schemaId } = getTonSpInfo();
  const raffleId = user?.code;
  const { data } = useQuery({
    queryKey: ['raffle', raffleId],
    queryFn: () => getRaffleInfo(raffleId!)
  });

  const isExpired = data?.expandExpirationAt && data.expandExpirationAt < Date.now();

  const createAttestationByOffchain = async () => {
    if (!raffleId) {
      toast({
        title: 'Error',
        description: 'User code is not found',
        variant: 'error'
      });
      return;
    }
    const prepareData = await attestPrepare({ raffleId: raffleId });
    console.log(prepareData, 'prepareData');
    const data = {
      userId: prepareData.userId,
      boostCode: raffleId,
      message: `Hey, ${user?.inviteUser}! I've boosted Signie points for you. --${user?.username || 'Sign User'}`, // TODO
      signature: prepareData.signature
    };

    const attestationObj = {
      schemaId,
      linkedAttestationId: '',
      validUntil: 0,
      recipients: [user?.walletAddress],
      indexingValue: raffleId,
      dataLocation: offChainSchema.dataLocation,
      data: JSON.stringify(data)
    };

    const attestationString = JSON.stringify(attestationObj, null, '  ');

    const walletIns = WalletFactory.getWallet(ChainType.Ton);
    const res = await walletIns.sign(attestationString);
    console.log(res, 'res');
    const info = walletIns.getWallet();

    if (info.address?.toLowerCase() !== user?.walletAddress.toLowerCase()) {
      toast({
        title: 'Error',
        description: `Current Wallet address ${info.address} does not match the user bind's wallet address ${user?.walletAddress}`,
        variant: 'error'
      });
      return;
    }
    const msgRes = JSON.parse(res.message);
    console.log(info, msgRes);

    try {
      setLoading(true);
      const attestRes = await submitAttestationByOffchain({
        signType: 'ton-connect',
        publicKey: info.publicKey!,
        signature: res.signature,
        message: msgRes.fullMessage,
        attestation: attestationString
      });

      console.log(attestRes, 'attestRes');
      await checkTx({
        txHash: attestRes.attestationId,
        raffleId: raffleId
      });
      toast({
        title: 'Success',
        description: 'sign event has been made successfully',
        variant: 'success'
      });
    } finally {
      setLoading(false);
    }
  };

  const createAttestationByOnchain = async () => {
    const schemaAddress = getTonSpInfo().schemaAddress;
    console.log(schemaAddress, getTonSpInfo(), 'schemaAddress');
    const schema = getSchemaContract(schemaAddress);
    const schemaData = await schema!.getSchemaData();
    const attestation: AttestationConfig = {
      attestationCounterId: (await spContract?.getAttestationCounter()) ?? 0,
      attester: Address.parse(wallet?.account.address ?? ''),
      attesterPubKey: publicKey || '',
      attestTimestamp: new Date(),
      data: 'Test',
      dataLocation: DataLocation.ONCHAIN,
      linkedAttestationCounterId: 0,
      recipients: [Address.parse('0QCm4j6oTqRNqS8k0MIQyuqeSoAgApoXzVLX0_dYvAfD_64N')],
      schemaCounterId: schemaData.schemaCounterId,
      schemaId: Address.parse(schemaAddress),
      validUntil: new Date('2024-12-12')
    };
    await spContract?.sendAttest(sender, attestation, schemaData);
    const attestId = await spContract?.getAttestationId(attestation);
    // 校验是否成功，2分钟后直接超时失败
    await new Promise((resolve, reject) => {
      const intervaler = setInterval(async () => {
        try {
          const attestationContract = await getAttestationContract(attestId?.toString() ?? '');
          const data = await attestationContract?.getAttestationData();
          if (data) {
            clearInterval(intervaler);
            resolve(attestId?.toString());
            console.log('Attestation Data', data);
          }
        } catch (error) {
          console.log(error);
        }
      }, 2000);
      setTimeout(() => {
        clearInterval(intervaler);
        reject('Timeout');
      }, 120000);
    });

    console.log('attestId', attestId);
  };

  const handleSubmit = async () => {
    if (type === 'offchain') {
      if (wallet) {
        await tonConnectUI.disconnect();
      }
      await createAttestationByOffchain();
    } else {
      if (tonConnectUI.connected) {
        await createAttestationByOnchain();
      } else {
        await tonConnectUI.openModal();
      }
      console.log('lala');
    }
  };

  console.log(user, 'user');

  return (
    <div>
      <Tabbar title={'Sign Event'} />

      <div className={'h-[calc(100vh-48px)] space-y-4 bg-white p-6'}>
        {/*<div className="rounded-[6px] border border-gray-200 bg-white p-3">*/}
        {/*  <h1 className={'text-center text-md font-bold text-gray-900'}>*/}
        {/*    Sign any event on Sign Protocol to earn Sign points*/}
        {/*  </h1>*/}

        {/*  <div className={'mt-4 flex justify-center'}>*/}
        {/*    <AboutModal />*/}
        {/*  </div>*/}
        {/*</div>*/}

        <div className="rounded-[6px] bg-white">
          {/*<ButtonSelect*/}
          {/*  options={[*/}
          {/*    {*/}
          {/*      label: 'On-Chain',*/}
          {/*      value: 'onchain'*/}
          {/*    },*/}
          {/*    {*/}
          {/*      label: 'Off-Chain',*/}
          {/*      value: 'offchain'*/}
          {/*    }*/}
          {/*  ]}*/}
          {/*  value={type}*/}
          {/*  onChange={(v) => setType(v as string)}*/}
          {/*/>*/}
          <div className="space-y-6 py-6">
            <div className={'space-y-1'}>
              <Label>Choose a template</Label>
              <Select
                options={[{ label: 'Boost Signie points for a friend', value: offChainSchema.name }]}
                value={template}
                onChange={setTemplate}
              />
            </div>

            <div className={'space-y-1'}>
              <Label>Invite User</Label>
              <Input value={user?.inviteUser} readOnly />
            </div>

            <div>
              {user?.walletAddress ? (
                <Button loading={loading} disabled={!!isExpired} className={'w-full'} onClick={handleSubmit}>
                  {isExpired ? 'Boost Expired' : 'Sign Event'}
                </Button>
              ) : (
                <Button loading={isBindingWallet} className={'w-full'} onClick={bindWallet}>
                  Bind Wallet
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
