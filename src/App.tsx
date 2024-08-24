import { useErudaDebugger } from '@/hooks/useDebug.tsx';
import { UserInfoProvider, useUserInfo } from '@/providers/UserInfoProvider';
import { useEffect, useRef } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { MysteryDropProvider } from './providers/MysteryDropProvider';
import { NotificationProvider } from './providers/NotificationProvider';
import { SeasonInfoProvider } from './providers/SeasonInfoProvider';
import { initTelegramApp, isTelegramApp } from './utils/telegram';

const TGAPP = () => {
  const isInTelegram = isTelegramApp();

  const { debug } = useErudaDebugger();

  useEffect(() => {
    const dispose = initTelegramApp();

    return dispose;
  }, []);

  if (!isInTelegram && !debug) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[linear-gradient(114deg,rgba(0,178,255,0.52)_0.81%,#9997FF_65.22%),linear-gradient(114deg,#00B2FF_0.81%,#9997FF_65.22%)] text-white">
        <h1>Please open in Telegram</h1>
      </div>
    );
  }

  return (
    <NotificationProvider>
      <UserInfoProvider>
        <MysteryDropProvider>
          <SeasonInfoProvider>
            <App />
          </SeasonInfoProvider>
        </MysteryDropProvider>
      </UserInfoProvider>
    </NotificationProvider>
  );
};

function App() {
  const { user } = useUserInfo();

  const navigate = useNavigate();

  const redirected = useRef(false);

  useEffect(() => {
    if (!redirected.current && user?.code) {
      navigate('/attest', { replace: true });
      redirected.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-[linear-gradient(114deg,rgba(0,178,255,0.52)_0.81%,#9997FF_65.22%),linear-gradient(114deg,#00B2FF_0.81%,#9997FF_65.22%)]">
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export default TGAPP;
