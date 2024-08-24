import classNames from 'classnames';
import React from 'react';

// eslint-disable-next-line react-refresh/only-export-components
export enum PrizeCoverVariant {
  Normal = 'normal',
  Wheel = 'wheel'
}

export type PrizeCoversConfig = Record<string, Record<PrizeCoverVariant, React.ReactNode> | string>;

/**
 * 奖品的图片配置
 *
 * key 对用后端的 prizeId，value 为不用场景下对应的奖品资源图片，如果为字符串，则表示所有场景下都使用同一资源
 */
// eslint-disable-next-line react-refresh/only-export-components
export const PRIZE_COVERS_CONFIG: PrizeCoversConfig = {
  // $NOT
  c1: 'https://sign-public-cdn.s3.us-east-1.amazonaws.com/Signie/not-coin_240723093313.webp',
  // SignPass
  p4: {
    [PrizeCoverVariant.Normal]:
      'https://sign-public-cdn.s3.us-east-1.amazonaws.com/Signie/prize-signpass_240710030603.webp',
    [PrizeCoverVariant.Wheel]: (
      <img
        className="w-[47px] translate-x-[-3px] -rotate-90 object-contain object-right"
        src="https://sign-public-cdn.s3.us-east-1.amazonaws.com/Signie/prize-signpass-text_240710030602.webp"
      />
    )
  },
  // Ballet Wallet
  p5: 'https://sign-public-cdn.s3.us-east-1.amazonaws.com/Signie/prize-ballet_240710030602.webp',
  // Safepal
  p6: 'https://sign-public-cdn.s3.us-east-1.amazonaws.com/Signie/prize-safepal_240710030602.webp'
};

function normalizePrizeCoversConfig(config: PrizeCoversConfig) {
  const normalizedConfig: Record<string, Record<PrizeCoverVariant, React.ReactNode>> = {};

  Object.keys(config).forEach((key) => {
    const value = config[key];

    if (typeof value === 'string') {
      normalizedConfig[key] = {
        [PrizeCoverVariant.Normal]: value,
        [PrizeCoverVariant.Wheel]: value
      };
    } else {
      normalizedConfig[key] = value;
    }
  });

  return normalizedConfig;
}

const NORMALIZED_PRIZE_COVERS_CONFIG = normalizePrizeCoversConfig(PRIZE_COVERS_CONFIG);

export const PrizeCover: React.FC<{
  prizeId: string;
  variant?: PrizeCoverVariant;
  className?: string;
}> = (props) => {
  const { className, prizeId, variant = PrizeCoverVariant.Normal } = props;

  const coverConfig = NORMALIZED_PRIZE_COVERS_CONFIG[prizeId];

  if (!coverConfig[variant]) return null;

  const normalCover = coverConfig[PrizeCoverVariant.Normal];

  const wheelCover = coverConfig[PrizeCoverVariant.Wheel];

  switch (variant) {
    case PrizeCoverVariant.Wheel:
      return typeof wheelCover === 'string' ? (
        <img className="w-[34px] translate-x-[-14px] rotate-90 object-contain object-right" src={wheelCover} />
      ) : (
        wheelCover
      );

    case PrizeCoverVariant.Normal:
      return typeof normalCover === 'string' ? (
        <img className={classNames('size-8 object-contain object-center', className)} src={normalCover} alt="" />
      ) : (
        normalCover
      );
  }
};
