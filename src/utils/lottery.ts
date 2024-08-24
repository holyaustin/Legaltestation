import { LotteryInfo } from '@/types';

export const getLevelInfo = (data?: LotteryInfo['currentRaffleResult']) => {
  if (!data) return {};

  const {
    currentScore,
    levelInfo: { nextLevel, currentSteps, currentLevel, currentMultiplier },
    levels
  } = data;

  const remainSteps = nextLevel ? nextLevel.steps - currentSteps : 0;
  const nextScore = nextLevel ? (currentScore / currentMultiplier) * nextLevel.multiplier : null;
  const hasNextLevel = nextLevel !== undefined && nextLevel !== null;

  const currentLevelInfo = levels.find((item) => item.level === currentLevel);
  const minStepsInCurrentLevel = currentLevelInfo?.steps ?? 0;
  const progress = nextLevel
    ? ((currentSteps - minStepsInCurrentLevel) / (nextLevel.steps - minStepsInCurrentLevel)) * 100
    : 100;

  const reachedMax = currentLevel !== undefined && currentLevel > 0 && !hasNextLevel;

  return { progress, remainSteps, currentScore, nextScore, hasNextLevel, nextLevel, currentLevel, reachedMax };
};
