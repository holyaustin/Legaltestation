import { postEvent, Utils } from '@tma.js/sdk';

export const isTelegramApp = (): boolean => {
    return !!window.TelegramWebviewProxy;
    // return !!window.Telegram?.WebApp?.initData;
};

export function openLink(href: string, target = '_self'): void {
    // 模拟 a 标签点击跳转
    const aEl = document.createElement('a');
    aEl.href = href;
    // 是否要新窗口打开
    aEl.target = target;
    // 是否是下载文件
    aEl.rel = 'noopener';
    aEl.style.display = 'none';
    document.body.appendChild(aEl);
    aEl.click();
    document.body.removeChild(aEl);
}

export function openLinkBlank(href: string): void {
    openLink(href, '_blank');
}

export const getTmaUtilsInstance = (): Utils => {
    return new Utils(window.Telegram?.WebApp?.version, () => Math.random().toString(), postEvent);
};

export function openLinkInTelegram(href: string, isBlank = true): void {
    // 兼容telegram和safari浏览器
    if (isTelegramApp()) {
        const utils = getTmaUtilsInstance();
        if (isBlank) {
            utils.openLink(href);
        } else {
            window.Telegram?.WebApp.openTelegramLink(href);
        }
    } else {
        // ios blank无法打开
        openLinkBlank(href);
    }
}

