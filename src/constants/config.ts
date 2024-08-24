export const ENVS = {
  WALLET_CONNECT_PROJECT_ID: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID,
  CHAIN_ENV: import.meta.env.VITE_CHAIN_ENV,
  TG_APP_LINK: import.meta.env.VITE_TMA_LINK, //t.me/ethsignddev_bot/minidev t.me/ChainDevBot/chainapp
  ENV: import.meta.env.VITE_ENV,
  SHARE_DESC: 'Spin to win $NOT and more！',
  INITDATA: import.meta.env.VITE_INITDATA,
  TG_SIGN_GROUP_LINK: 'https://t.me/signeverythingonchain',
  TG_SAFEPAL_LINK: 'https://t.me/SafePalTG'
};

const schemaList = [
  {
    name: 'SIGNIE commitment',
    description: 'A general schema for committing anything onchain',
    revocable: true,
    maxValidFor: 0,
    types: [
      {
        name: 'Commitment content',
        type: 'string'
      }
    ],
    dataLocation: 'arweave'
  },
  {
    name: 'SIGNIE milestone event',
    description: 'Record any milestone or important event onchain',
    revocable: true,
    maxValidFor: 0,
    types: [
      {
        name: 'event',
        type: 'string'
      },
      {
        name: 'description',
        type: 'string'
      }
    ],
    dataLocation: 'arweave'
  }
];

export const tonSp = {
  dev: {
    spAddress: 'kQBbxPGNadGSWnVLDyDy0VqGVGHoI9fzXBED5sh3Vd3oadW5',
    schemaAddress: 'kQCcQmtTwkOktZCbrv8r8gTDCcebzdCNKiOBMxprpo9wRiWq',
    offchainSchemaId: 'SPS_65hQUkw_Z7YOTzVUbpgR5', // testnet:SPS_dh0JMcaQCZ2DPKzD0JFF0
    offchainSchemaConfig: [
      {
        id: 'SPS_-YGGvG50m2UF2LXfugnoi',
        schema: schemaList[0]
      },
      {
        id: 'SPS_yPRJxquxxMd1Ajbbqef3l',
        schema: schemaList[1]
      }
    ]
  },
  prod: {
    spAddress: '',
    schemaAddress: '',
    offchainSchemaId: 'SPS_2u3kCDZ488Am1woXA6odR',
    offchainSchemaConfig: [
      {
        id: 'SPS_TGVj7wO0St5qhpa1Q5jwj',
        schema: schemaList[0]
      },
      {
        id: 'SPS_kZ8Vzxw-hisHptdnJXVGY',
        schema: schemaList[1]
      }
    ]
  }
};
export function getTonSpInfo() {
  return tonSp[ENVS.ENV as 'dev' | 'prod'];
}

export const offChainSchema = {
  name: 'SIGNIE invitation response',
  description:
    'Manage responses to digital invitations/referrals, recoding key fields such as invite code, sender info and message.',
  revocable: true,
  maxValidFor: 0,
  types: [
    {
      name: 'userId',
      type: 'string'
    },
    {
      name: 'boostCode',
      type: 'string'
    },
    {
      name: 'message',
      type: 'string'
    },
    {
      name: 'signature',
      type: 'string'
    }
  ],
  dataLocation: 'arweave'
};
