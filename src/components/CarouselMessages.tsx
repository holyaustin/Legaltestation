import { useClock } from '@/hooks/useClock';
import classNames from 'classnames';
import { nanoid } from 'nanoid';
import React, { createRef, forwardRef, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { Transition, TransitionGroup } from 'react-transition-group';

export interface CarouselMessagesProps {
  className?: string;
  messages?: Omit<CarouselMessage, 'id'>[];
  duration?: number;
  icon?: React.ReactNode;
}

export interface CarouselMessage {
  id: string;
  content: React.ReactNode;
}

export interface CarouselMessageRef {
  addMessages: (messages: Omit<CarouselMessage, 'id'>[]) => void;
}

export const CarouselMessages = forwardRef<CarouselMessageRef, CarouselMessagesProps>((props, ref) => {
  const { className, icon, duration = 3000, messages = [] } = props;

  const internalMessages = useRef<CarouselMessage[]>(messages.map((message) => ({ ...message, id: nanoid() })));

  const [currentIndex, setCurrentIndex] = useState(0);

  const frame = useMemo(() => {
    const messages = internalMessages.current;

    const pickedMessages =
      currentIndex === messages.length - 1
        ? [messages[messages.length - 1], messages[0]]
        : messages.slice(currentIndex, currentIndex + 2);

    return {
      id: nanoid(),
      ref: createRef<HTMLDivElement>(),
      messages: pickedMessages
    };
  }, [currentIndex]);

  useClock(
    () => {
      if (internalMessages.current.length < 2) return;

      setCurrentIndex((old) => {
        if (old === internalMessages.current.length - 1) {
          return 0;
        }

        return old + 1;
      });
    },
    { interval: duration }
  );

  const addMessages = (messages: Omit<CarouselMessage, 'id'>[]) => {
    const old = internalMessages.current;

    const newMessages = messages
      .filter((message) => !old.some((item) => item.content === message.content))
      .map((message) => ({
        id: nanoid(),
        ...message
      }));

    if (newMessages.length > 0 || !old.length) {
      internalMessages.current = [...old, ...newMessages];
    }
  };

  useImperativeHandle(ref, () => ({ addMessages }));

  return (
    <div className={classNames('rounded-md bg-white relative flex items-center px-3', className)}>
      {icon}

      <TransitionGroup className="relative h-[34px] flex-1 overflow-hidden">
        <Transition key={frame.id} nodeRef={frame.ref} timeout={300} unmountOnExit>
          {(state) => (
            <div
              ref={frame.ref}
              className={classNames('absolute inset-0 duration-300 transition-all ease-linear', {
                '-translate-y-full': state === 'exiting'
              })}
            >
              {frame.messages.map((message) => (
                <div key={message.id} className="flex h-[34px] items-center gap-1 bg-white">
                  <p className="truncate font-medium text-xs text-[#0052FF]">{message.content}</p>
                </div>
              ))}
            </div>
          )}
        </Transition>
      </TransitionGroup>
    </div>
  );
});
