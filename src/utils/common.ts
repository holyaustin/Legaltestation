import { ENVS } from '@/constants/config';
import dayjs from 'dayjs';
import { customAlphabet } from 'nanoid';
import queryString from 'query-string';

export const parseQuery = (params: string): Record<string, any> => {
  return queryString.parse(params);
};

export const getCustomNanoId = (): string => {
  const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 10);
  return nanoid();
};

export const formatDate = (time: number) => {
  return dayjs(time).format('MMMM DD, YYYY');
};

export function formatDateTime(
  dateOrTimeStamp: Date | number,
  config: {
    year: boolean;
  } = { year: true }
): string {
  const date = new Date(dateOrTimeStamp);
  const hours = date.getUTCHours().toString().padStart(2, '0');
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');

  const month = date.toLocaleString('en-US', { month: 'long', timeZone: 'UTC' });
  const day = date.getUTCDate();
  const year = date.getUTCFullYear();

  const timeZone = 'UTC+0';

  // 返回格式化后的字符串
  return `${hours}:${minutes}, ${month} ${ordinalSuffix(day)} ${config.year ? year + ' ' : ''}(${timeZone})`;
}

export function getUTCTimeByDate(date: Date) {
  const utcYear = date.getFullYear();
  const utcMonth = date.getMonth();
  const utcDate = date.getDate();
  return new Date(Date.UTC(utcYear, utcMonth, utcDate, 0, 0, 0, 0)).valueOf();
}

export function validateValues(dataSchema: any[], values: Record<string, any>) {
  // 检查dataSchema是否有数据定义
  if (!dataSchema || !Array.isArray(dataSchema)) {
    throw new Error('Invalid data schema');
  }

  // 遍历所有的数据定义
  for (const field of dataSchema) {
    // 检查values对象是否包含所有必需的字段
    if (!(field.name in values)) {
      return {
        success: false,
        message: `Missing field: ${field.name}`
      };
    }
  }

  // 如果所有字段都通过验证，返回成功
  return {
    success: true,
    message: 'All fields are valid'
  };
}

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const isExpired = (date?: number) => {
  if (!date) return false;

  const now = new Date().getTime();
  const expire = new Date(date).getTime();

  return expire - now <= 0;
};

/** 将数字转换为序数词 */
export function ordinalSuffix(n: number): string {
  // 处理特殊情况，比如 11, 12, 13 这些数字
  if (n % 100 >= 11 && n % 100 <= 13) {
    return n + 'th';
  }

  switch (n % 10) {
    case 1:
      return n + 'st';
    case 2:
      return n + 'nd';
    case 3:
      return n + 'rd';
    default:
      return n + 'th';
  }
}

/** 将数字转换位常用的货币格式，如 10,000 */
export function formatNumber(value: number): string {
  return value.toLocaleString('en-US');
}

export const isDevelopmentEnv = () => ENVS.ENV === 'dev';

export function debugLog(message?: string) {
  if (!isDevelopmentEnv()) return;

  let innerMessage = '[debug] ';

  if (typeof message !== 'string') {
    innerMessage += JSON.stringify(message);
  } else {
    innerMessage += message;
  }

  console.debug(innerMessage);
}

export function shuffle<T>(array: T[]): T[] {
  const shuffledArray = array.slice();

  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[randomIndex]] = [shuffledArray[randomIndex], shuffledArray[i]];
  }

  return shuffledArray;
}
