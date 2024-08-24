import React, { PropsWithChildren, createContext, useContext, useRef } from 'react';
import { Confetti, ConfettiRef } from '../components/Confetti';

export const ConfettiContext = createContext({
  confetti: () => {}
});

export const ConfettiProvider: React.FC<PropsWithChildren> = (props) => {
  const { children } = props;

  const confettiRef = useRef<ConfettiRef>(null);

  return (
    <ConfettiContext.Provider
      value={{
        confetti: () => {
          confettiRef?.current?.confetti?.();
        }
      }}
    >
      {children}

      <Confetti ref={confettiRef} />
    </ConfettiContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useConfetti = () => {
  const { confetti } = useContext(ConfettiContext);

  return {
    confetti
  };
};
