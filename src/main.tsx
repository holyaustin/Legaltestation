import { Router } from '@/Router.tsx';
import { ENVS } from '@/constants/config.ts';
import { TonProvider } from '@/core/providers/ton';
import { ThemeProvider, Toaster } from '@ethsign/ui';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { LotteryInfoProvider } from './providers/LotteryInfoProvider';

// eslint-disable-next-line react-refresh/only-export-components
const TonConfig = {
  manifestUrl: 'https://app.ethsign.xyz/manifest.json',
  actionsConfiguration: {
    twaReturnUrl: ENVS.TG_APP_LINK as `${string}://${string}`
  }
};

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <TonProvider config={TonConfig}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme={'light'} storageKey={'theme'}>
          <LotteryInfoProvider>
            <Router />
            <Toaster />
          </LotteryInfoProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </TonProvider>
  </React.StrictMode>
);
