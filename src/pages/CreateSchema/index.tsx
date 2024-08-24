import { Header } from '@/components/Header.tsx';
import { getTonSpInfo } from '@/constants/config';
import { WalletFactory } from '@/core/WalletFactory.tsx';
import { ChainType } from '@/core/types.ts';
import { submitSchema } from '@/services';
import { useConnection } from '@/utils/ton-sp/hooks/useConnection';
import { Button, Textarea, toast } from '@ethsign/ui';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { useState } from 'react';

export default function CreateSchema() {
  // offChainSchema offchainSchemaConfig[0].schema
  const spInfo = getTonSpInfo();
  const offchainSchemaConfig = spInfo.offchainSchemaConfig;
  const [schema] = useState(JSON.stringify(offchainSchemaConfig[0].schema, null, '  '));
  const [tonConnectUI] = useTonConnectUI();
  const { wallet } = useConnection();
  const [schemaResult, setSchemaResult] = useState<any>(null);
  const handleCreateSchema = async () => {
    if (wallet) {
      await tonConnectUI.disconnect();
    }
    const walletIns = WalletFactory.getWallet(ChainType.Ton);
    const res = await walletIns.sign(schema);
    console.log(res, 'res');
    const info = walletIns.getWallet();
    const msgRes = JSON.parse(res.message);
    const schemaInfo = await submitSchema({
      schema: schema,
      signature: res.signature,
      message: msgRes.fullMessage,
      publicKey: info.publicKey!,
      signType: 'ton-connect'
    });
    console.log(schemaInfo, 'info');
    setSchemaResult(schemaInfo);
    toast({
      variant: 'success',
      title: 'Schema created successfully'
    });
  };
  return (
    <div>
      <Header />
      <div className="py-8 px-6 space-y-6">
        <Textarea defaultValue={schema} readOnly className="h-[50vh]" />
        <Button className="w-full" onClick={handleCreateSchema}>
          Create Schema
        </Button>
        {schemaResult && <div className="text-slime-500 text-center">SchemaId: {schemaResult?.schemaId}</div>}
      </div>
    </div>
  );
}
