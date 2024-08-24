// POST /mini/auth
import { ENVS } from '@/constants/config.ts';
import {
  IRaffleRecord,
  IRankData,
  ITaskData,
  IUser,
  InvitationInfo,
  LotteryInfo,
  MysteryDropInfo,
  MysteryDropRaffleResult,
  QuizInfoData,
  RaffleInfo,
  RaffleResult,
  RewardAnnouncement,
  RewardResponse,
  SeasonInfo,
  SeasonInfoWithResult,
  TaskTypeEnum
} from '@/types';
import { ApiClient, apiClient } from '@/utils/api-client.ts';
import { OffChainRpc } from '@ethsign/sp-sdk';

export const auth = async (data: { webappData: Record<string, any>; referenceCode: string; invitedBy?: string }) => {
  return await apiClient.post('/mini/auth', data);
};

// POST /mini/bind-wallet
export const bindWallet = async (data: { publicKey: string; message: string; signature: string }) => {
  return await apiClient.post('/mini/bind-wallet', data);
};

// GET /mini/me
export const getMyInfo = async () => {
  return await apiClient.get<IUser>('/mini/me', {
    skipHandleError: true
  });
};

// POST mini/campaigns/lottery/raffle
export const raffle = async () => {
  return await apiClient.post<RaffleResult>('/mini/campaigns/lottery/raffle');
};

//GET /mini/campaigns/lottery
export const getLotteryInfo = async () => {
  return await apiClient.get<LotteryInfo>('/mini/campaigns/lottery');
};

//GET /mini/campaigns/lottery/tx-check
export const checkTx = async (data: { txHash: string; raffleId?: string }) => {
  return await apiClient.post('/mini/campaigns/lottery/tx-check', data);
};

// POST /mini/campaigns/lottery/task-check
export const checkTask = async (data: { taskType: TaskTypeEnum; taskId?: string; value?: string }) => {
  return await apiClient.post<{
    correctAnswer?: string[];
    result: boolean;
  }>('/mini/campaigns/lottery/task-check', data);
};

// GET mini/season
export const getSeasonList = async () => {
  return await apiClient.get<SeasonInfo[]>('/mini/season');
};

// GET /mini/rank
export const getRank = async (season: string) => {
  return await apiClient.get<IRankData>(`/mini/rank/${season}`);
};

// GET /mini/quiz-info
export const getQuizInfo = async () => {
  return await apiClient.get<QuizInfoData>('/mini/quiz-info');
};

// POST /mini/campaigns/lottery/attest-prepare
export const attestPrepare = async (data: { raffleId: string }) => {
  return await apiClient.post<{
    raffleId: string;
    signature: string;
    userId: string;
  }>('/mini/campaigns/lottery/attest-prepare', data);
};

// GET /mini/campaigns/lottery/raffle-info?id=EaAm_aeRPhjJuu8s5c87U
export const getRaffleInfo = async (id: string) => {
  return await apiClient.get<RaffleInfo>(`/mini/campaigns/lottery/raffle-info?id=${id}`);
};

// GET /mini/campaigns/lottery/raffles?date=1716799249189
export const getRaffles = async (date: number) => {
  return await apiClient.get<{ rows: IRaffleRecord[]; total: number }>(`/mini/campaigns/lottery/raffles?date=${date}`);
};

// GET mini/campaigns/lottery/task
export const getTask = async () => {
  return await apiClient.get<ITaskData>('/mini/campaigns/lottery/tasks');
};

const rpcMap = {
  dev: 'https://sign-mini.dev.ethsign.xyz/api', //'http://43.198.156.58:3020/api'
  prod: OffChainRpc.mainnet
};

const spClient = new ApiClient({ baseURL: rpcMap[ENVS.ENV as 'dev' | 'prod'] });

// POST /sp/schemas

interface ISchema {
  signType: string;
  publicKey: string;
  message: string;
  signature: string;
  schema: string;
}
export const submitSchema = async (data: ISchema) => {
  return await spClient.post('/sp/schemas', data);
};

interface IAttestation {
  signType: string;
  publicKey: string;
  message: string;
  signature: string;
  attestation: string;
}

export const submitAttestationByOffchain = async (data: IAttestation) => {
  return spClient.post<{ attestationId: string }>('/sp/attestations', data);
};

export const getMysteryDropInfo = async () => {
  return apiClient.get<MysteryDropInfo>('/mini/campaigns/mystery-drop/drop-info');
};

export const mysteryDropRaffle = async (dropId: string) => {
  return apiClient.post<MysteryDropRaffleResult>('/mini/campaigns/mystery-drop/raffle', { dropId });
};

export const getRewardsInfo = async () => {
  return apiClient.get<RewardResponse>('/mini/rewards');
};

export const updateClaimAddress = async (address: string) => {
  return apiClient.post('/mini/update-claim-address', {
    address
  });
};

export const getInvitationInfo = async () => {
  return apiClient.get<InvitationInfo>('/mini/campaigns/invitation/result/today');
};

export const getPreviousSeasonInfo = async () => {
  return apiClient.get<SeasonInfoWithResult>('/mini/season/previous/summary');
};

export const getRewardsAnnouncement = async () => {
  return apiClient.get<{
    rows: RewardAnnouncement[];
    total: number;
  }>('/mini/rewards/announcement');
};
