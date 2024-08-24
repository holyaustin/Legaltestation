import { nanoid } from 'nanoid';
import React, { createContext, PropsWithChildren, useContext, useState } from 'react';
import { CountdownNotificationConfig, CountdownNotifications } from './CountdownNotifications';

const NotificationContext = createContext<{
  notifyBarVisible: boolean;
  addCountdownNotification: (config: Omit<CountdownNotificationConfig, 'id'>) => void;
}>({
  notifyBarVisible: false,
  addCountdownNotification: () => {}
});

// eslint-disable-next-line react-refresh/only-export-components
export const useCountdownNotification = () => {
  const [countdownConfigs, setCountdownConfigs] = useState<CountdownNotificationConfig[]>([]);

  return {
    countdownConfigs,
    addCountdown: (config: Omit<CountdownNotificationConfig, 'id'>) => {
      const id = nanoid();
      setCountdownConfigs((old) => [...old, { ...config, id }]);

      return id;
    },
    removeCountdown(id: string) {
      setCountdownConfigs((old) => old.filter((config) => config.id !== id));
    }
  };
};

export const NotificationProvider: React.FC<PropsWithChildren> = (props) => {
  const { children } = props;

  const { countdownConfigs, addCountdown, removeCountdown } = useCountdownNotification();

  return (
    <NotificationContext.Provider
      value={{
        notifyBarVisible: countdownConfigs.length > 0,
        addCountdownNotification: addCountdown
      }}
    >
      <CountdownNotifications configs={countdownConfigs} onRemove={removeCountdown} />

      {children}
    </NotificationContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useNotification = () => {
  const context = useContext(NotificationContext);

  return context;
};
