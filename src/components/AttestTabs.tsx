import { Button, Input, Label, Select, toast } from '@ethsign/ui';
import { getTonSpInfo, offChainSchema } from '@/constants/config.ts';
import { useState } from 'react';
import { useUserInfo } from '@/providers/UserInfoProvider.tsx';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { useSignProtocol } from '@/utils/ton-sp/hooks/useSignProtocol.ts';
import { useConnection } from '@/utils/ton-sp/hooks/useConnection.ts';
import { AttestationConfig } from '@/utils/ton-sp/wrappers';
import { Address } from '@ton/core';
import { DataLocation } from '@/utils/ton-sp/utils';
import { checkTask, submitAttestationByOffchain } from '@/services';
import { WalletFactory } from '@/core/WalletFactory.tsx';
import { ChainType } from '@/core/types.ts';
import { validateValues } from '@/utils/common.ts';
import { TaskTypeEnum } from '@/types';

export const AttestTabs = ({ onSuccess }: { onSuccess: () => void }) => {
  const spInfo = getTonSpInfo();
  const offchainSchemaConfig = spInfo.offchainSchemaConfig;
  const [type] = useState('offchain');
  const [template, setTemplate] = useState(offchainSchemaConfig[0].id);
  const [loading, setLoading] = useState(false);
  const { user, isBindingWallet, bindWallet } = useUserInfo();

  const [tonConnectUI] = useTonConnectUI();
  const { spContract, getSchemaContract, getAttestationContract } = useSignProtocol();
  const { wallet, sender, publicKey } = useConnection();
  const [values, setValues] = useState<any>({});

  const currentSchema = offchainSchemaConfig.find((it) => it.id === template);

  const createAttestationByOnchain = async () => {
    const schemaAddress = spInfo.schemaAddress;
    console.log(schemaAddress, getTonSpInfo(), 'schemaAddress');
    const schema = getSchemaContract(schemaAddress);
    const schemaData = await schema!.getSchemaData();
    setLoading(true);
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
    console.log('attestId', attestId);
    // 校验是否成功，2分钟后直接超时失败
    return await new Promise((resolve, reject) => {
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
  };

  const createAttestationByOffchain = async () => {
    const validateResult = validateValues(currentSchema?.schema.types as any[], values);

    if (!validateResult.success) {
      toast({
        title: 'Error',
        description: validateResult.message,
        variant: 'error'
      });
      return;
    }

    const attestationObj = {
      schemaId: currentSchema?.id,
      linkedAttestationId: '',
      validUntil: 0,
      recipients: [user?.walletAddress],
      // indexingValue: raffleId,
      dataLocation: offChainSchema.dataLocation,
      data: JSON.stringify(values)
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
      await checkTask({
        taskType: TaskTypeEnum.OFFCHAINATTEST,
        value: attestRes.attestationId
      });
      toast({
        title: 'Success',
        description: 'sign event has been made successfully',
        variant: 'success'
      });
      onSuccess();
    } catch (e: any) {
      toast({
        title: 'Error',
        description: e.message,
        variant: 'error'
      });
    } finally {
      setLoading(false);
    }
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
        <div className="space-y-6 py-6 text-left">
          <div className={'space-y-1'}>
            <Label>Choose a template</Label>
            <Select
              options={offchainSchemaConfig.map((it) => ({ label: it.schema.name, value: it.id }))}
              value={template}
              onChange={setTemplate}
            />
          </div>
          <div className={'space-y-1'}>
            <div className="space-y-4">
              {currentSchema?.schema?.types?.map((it) => {
                return (
                  <div key={it.name}>
                    <Label className="[text-transform:capitalize]">{it.name}</Label>
                    <Input
                      type="text"
                      className="focus:border-primary/20"
                      value={values[it.name] || ''}
                      placeholder={`Enter ${it.name.toLowerCase()}`}
                      onChange={(e: any) =>
                        setValues((pre: any) => {
                          return {
                            ...pre,
                            [it.name]: e.target.value
                          };
                        })
                      }
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            {user?.walletAddress ? (
              <Button loading={loading} className={'w-full'} onClick={handleSubmit}>
                {'Sign Event'}
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
  );
};
