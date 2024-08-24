export interface ITMAInitData {
  user: string;
  query_id: string;
  hash: string;
  auth_date: string;
  start_param?: string; //code
}

export interface IUser {
  userId: string;
  username: string;
  walletAddress: string;
  code?: string;
  inviteUser?: string;
  claimWalletAddress: string;
}

export interface LotteryInfo {
  prizes: {
    id: string;
    type: string;
    name: string;
    value: number;
    image: string;
  }[];
  totalPoint: number;
  remainingTimes: number;
  currentRaffleResult?: {
    raffleId: string;
    prizeId: string;
    raffleAt: string;
    dayEnd: number;
    expandExpirationAt: number;
    currentScore: number;
    levels: {
      level: number;
      steps: number;
      multiplier: number;
    }[];
    levelInfo: {
      currentLevel: number;
      currentSteps: number;
      currentMultiplier: number;
      nextLevel?: {
        level: number;
        steps: number;
        multiplier: number;
      };
    };
  };
  seasonList: SeasonInfo[];
}

export interface RaffleResult {
  raffleId: string;
  prizeId: string;
}

export interface IRankData {
  total: number;
  rows: IRank[];
  size: number;
  userRank: { score: number; rank: number };
}

export interface IRank {
  score: string;
  username: string;
  walletAddress: string;
}

export interface RaffleInfo {
  expandExpirationAt: number;
  prizeId: string;
  raffleAt: number;
  userIdHash: string;
}

export interface IRaffleRecord {
  raffleAt: number;
  prizeId: string;
  currentScore: number;
  levelInfo: LevelInfo;
  userIdHash: string;
  expandExpirationAt: number;
}

export interface LevelInfo {
  currentLevel: number;
  currentSteps: number;
  currentMultiplier: number;
  nextLevel: NextLevel;
}

export interface NextLevel {
  level: number;
  steps: number;
  multiplier: number;
}

export interface ITaskData {
  remainingAvailableTasks: number;
  addressBound: boolean;
  groupJoined: boolean;
  visitBalletCrypto: boolean;
  visitSafepal: boolean;
  joinSafePalTgGroup: boolean;
  visitTriangleIncubator: boolean;
  visitSign: boolean;
  visitSignCommunity: boolean;
  visitTokenTable: boolean;
}

export enum TaskTypeEnum {
  QUIZ = 'quiz',
  JOIN_GROUP = 'join_group',
  OFFCHAINATTEST = 'offchain_attest',
  VisitBalletCrypto = 'visit_ballet_crypto',
  VisitSafepal = 'visit_safepal',
  JoinSafePalTgGroup = 'join_safe_pal_tg_group',
  VisitTriangle = 'visit_triangle_incubator',
  VisitSign = 'visit_sign',
  VisitSignCommunity = 'visit_sign_community',
  VisitTokenTable = 'visit_token_table'
}

export interface QuizInfoData {
  pointsByQuiz: number;
  remainingQuizzes: number;
  committedQuizzes: number;
  dailyMaximum: number;
  currentQuiz: CurrentQuiz;
}

export interface CurrentQuiz {
  quizId: string;
  type: string;
  title: string;
  answer: string;
  options: Option[];
  createdAt: string;
  updatedAt: string;
}

export interface Option {
  title: string;
  value: string;
}

export interface MysteryDropInfo {
  nextMysteryDrop: {
    id: string;
    noticeStartTime: number;
    noticeEndTime: number;
    startTime: number;
    endTime: number;
  };
}

export interface MysteryDropRaffleResult {
  grabbed: boolean;
  amount: number;
  token: string;
}

export enum MiniRewardStatus {
  /** 奖品待分配 */
  PendingAllocation = 'pending_allocation',
  /** 奖品已分配 */
  Allocated = 'allocated',
  /** 奖品已领取 */
  Claimed = 'claimed'
}

export interface RewardInfo {
  id: string;
  prizeId: string;
  status: MiniRewardStatus;
  amount: number;
  rewardAt: string;
  campaignType: CampaignType;
  type: 'token' | 'physical';
  name: string;
  image: string;
}

export interface RewardResponse {
  total: number;
  rows: RewardInfo[];
}

export interface InvitationInfo {
  totalInvited: number;
  totalPoints: number;
  rules: number[];
  invitedList: {
    userId: string;
    username: string;
    points: number;
  }[];
}

export enum TaskRewardType {
  POINTS = 'points',
  TICKET = 'ticket'
}

export interface SeasonInfo {
  isCurrent: boolean;
  startTime: number;
  endTime: number;
  popTime: number;
  allocatedPopTime: number;
  seasonKey: string;
  name: string;
}

export type SeasonInfoWithResult = SeasonInfo & {
  result: {
    score: number;
    rank: number;
    hasGain: boolean;
    rewardStatus: MiniRewardStatus;
  };
};

export enum CampaignType {
  MysteryDrop = 'mystery_drop',
  Competition = 'competition'
}

export interface RewardAnnouncement {
  status: string;
  amount: number;
  campaignType: CampaignType;
  rewardAt: number;
  username: string;
  type: 'physical' | 'token';
  name: string;
}
