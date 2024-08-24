import { ENVS } from '@/constants/config';
import { ITMAInitData } from '@/types';
import WebApp from '@twa-dev/sdk';
import { parseQuery } from './common';

export const getTMAInitData = (): { raw: string; parsed: ITMAInitData } | null => {
  const initDataRaw = isTelegramApp() ? WebApp.initData : ENVS.INITDATA; // user=...&query_id=...&...

  if (!initDataRaw) return null;

  const initData = parseQuery(initDataRaw) as ITMAInitData;

  return {
    raw: initDataRaw,
    parsed: initData
  };
};

export const isTelegramApp = (): boolean => {
  return !!window.TelegramWebviewProxy;
};

export const initTelegramApp = () => {
  if (isTelegramApp()) {
    const onViewportChanged = () => {
      window.Telegram.WebApp.expand();
    };

    WebApp.ready();
    WebApp.setBackgroundColor('#fff');
    WebApp.setHeaderColor('#fff');

    WebApp.expand();
    WebApp.onEvent('viewportChanged', onViewportChanged);

    return () => {
      WebApp.offEvent('viewportChanged', onViewportChanged);
    };
  } else {
    return () => {};
  }
};

export function encodeTelegramStartParam(param: unknown) {
  return encodeURIComponent(window.btoa(JSON.stringify(param)));
}

export function decodeTelegramStartParam(encodedParam: string) {
  return JSON.parse(window.atob(decodeURIComponent(encodedParam)));
}

export function joinSignProtocolTGGroup() {
  const groupUrl = 'https://t.me/signprotocol';
  WebApp.openTelegramLink(groupUrl);
}
