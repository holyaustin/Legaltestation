'use client';
import { Loading } from '@/components/Loading';
import { auth, getMyInfo } from '@/services';
import { IUser } from '@/types';
import { debugLog } from '@/utils';
import { decodeTelegramStartParam, getTMAInitData } from '@/utils/telegram';
import { useQuery } from '@tanstack/react-query';
import React, { PropsWithChildren, createContext, useContext, useEffect, useMemo } from 'react';
import { useWalletBind } from '../hooks/useWalletBind';

interface UserInfoContextProps {
  user?: IUser;
  isLoading: boolean;
  needAuth?: boolean;
  isBindingWallet: boolean;
  fetchUser: () => void;
  bindWallet: () => Promise<void>;
}

const UserInfoContext = createContext<UserInfoContextProps>({
  user: undefined,
  isLoading: false,
  needAuth: true,
  isBindingWallet: false,
  fetchUser: () => {},
  bindWallet: async () => {}
});

// eslint-disable-next-line react-refresh/only-export-components
export const useFetchUser = () => {
  const {
    data,
    refetch: fetchUser,
    isLoading,
    isFetched
  } = useQuery({
    queryKey: ['user'],
    queryFn: () => getMyInfo(),
    retry: false
  });
  return {
    user: data,
    fetchUser,
    isLoading,
    isFetched
  };
};

export const UserInfoProvider: React.FC<PropsWithChildren> = (props) => {
  const { children } = props;

  const { user, isLoading, fetchUser } = useFetchUser();

  const tgInitData = getTMAInitData();

  const { bindWallet, isBindingWallet } = useWalletBind({
    onBindSuccess: fetchUser
  });

  const startParam = useMemo(() => {
    const startParam = tgInitData?.parsed?.start_param;

    try {
      if (startParam) {
        const decodedStartParam = decodeTelegramStartParam(startParam);

        return {
          raffleId: decodedStartParam?.raffleId,
          inviteUser: decodedStartParam?.inviteUser,
          invitedBy: decodedStartParam?.invitedBy
        };
      }
      return null;
    } catch (e) {
      console.error(e);
      return null;
    }
  }, [tgInitData]);

  const login = async () => {
    if (!tgInitData?.parsed) return;

    await auth({
      webappData: tgInitData.parsed,
      referenceCode: startParam?.raffleId || '',
      invitedBy: startParam?.invitedBy
    });

    fetchUser();
  };

  useEffect(() => {
    debugLog(`initData raw: ` + tgInitData?.raw);

    login();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!user) return null;

  return (
    <UserInfoContext.Provider
      value={{
        user: {
          ...user,
          code: startParam?.raffleId,
          inviteUser: startParam?.inviteUser
        },
        isLoading,
        isBindingWallet,
        fetchUser,
        bindWallet
      }}
    >
      {children}

      {isBindingWallet && (
        <div className="fixed inset-0">
          <Loading />
        </div>
      )}
    </UserInfoContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useUserInfo = () => {
  return useContext(UserInfoContext);
};
