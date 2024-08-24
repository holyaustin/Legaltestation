import { nanoid } from 'nanoid';
import React, { useEffect, useRef, useState } from 'react';
import { Transition } from 'react-transition-group';

const DROP_IMAGES = [
  'https://ethsign-public.s3.ap-east-1.amazonaws.com/telegram-miniapp/drop-frame-21_240614083023.webp',
  'https://ethsign-public.s3.ap-east-1.amazonaws.com/telegram-miniapp/drop-frame-17_240614083022.webp',
  'https://ethsign-public.s3.ap-east-1.amazonaws.com/telegram-miniapp/drop-frame-13_240614083023.webp',
  'https://ethsign-public.s3.ap-east-1.amazonaws.com/telegram-miniapp/drop-frame-15_240614083023.webp',
  'https://ethsign-public.s3.ap-east-1.amazonaws.com/telegram-miniapp/drop-frame-pocket-3_240614083027.webp',
  'https://ethsign-public.s3.ap-east-1.amazonaws.com/telegram-miniapp/drop-frame-coin-3_240614083026.webp',
  'https://ethsign-public.s3.ap-east-1.amazonaws.com/telegram-miniapp/drop-frame-pocket-4_240614083029.webp',
  'https://ethsign-public.s3.ap-east-1.amazonaws.com/telegram-miniapp/drop-frame-box-3_240614083028.webp',
  'https://ethsign-public.s3.ap-east-1.amazonaws.com/telegram-miniapp/drop-frame-19_240614083023.webp',
  'https://ethsign-public.s3.ap-east-1.amazonaws.com/telegram-miniapp/drop-frame-8_240614083022.webp',
  'https://ethsign-public.s3.ap-east-1.amazonaws.com/telegram-miniapp/drop-frame-coin-1_240614083030.webp',
  'https://ethsign-public.s3.ap-east-1.amazonaws.com/telegram-miniapp/drop-frame-6_240614083022.webp',
  'https://ethsign-public.s3.ap-east-1.amazonaws.com/telegram-miniapp/drop-frame-3_240614083023.webp',
  'https://ethsign-public.s3.ap-east-1.amazonaws.com/telegram-miniapp/drop-frame-1_240614083022.webp',
  'https://ethsign-public.s3.ap-east-1.amazonaws.com/telegram-miniapp/drop-frame-pocket-1_240614083027.webp',
  'https://ethsign-public.s3.ap-east-1.amazonaws.com/telegram-miniapp/drop-frame-box-4_240614083025.webp',
  'https://ethsign-public.s3.ap-east-1.amazonaws.com/telegram-miniapp/drop-frame-coin-2_240614083029.webp',
  'https://ethsign-public.s3.ap-east-1.amazonaws.com/telegram-miniapp/drop-frame-box-1_240614083030.webp',
  'https://ethsign-public.s3.ap-east-1.amazonaws.com/telegram-miniapp/drop-frame-10_240614083032.webp',
  'https://ethsign-public.s3.ap-east-1.amazonaws.com/telegram-miniapp/drop-frame-box-2_240614083034.webp',
  'https://ethsign-public.s3.ap-east-1.amazonaws.com/telegram-miniapp/drop-frame-14_240614083034.webp'
];

interface Raindrop {
  id: string;
  url: string;
  left: string;
  delay: string;
  duration: string;
}

const getRandomValue = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

function getDrops(amount: number): Raindrop[] {
  let delay = 0;

  return Array.from({ length: amount }, () => {
    return {
      id: nanoid(),
      url: DROP_IMAGES[getRandomValue(0, DROP_IMAGES.length - 1)],
      left: getRandomValue(-10, 100) + '%',
      delay: (delay += getRandomValue(0, 50)) + 'ms',
      duration: getRandomValue(1000, 3000) + 'ms'
    };
  });
}

export const MysteryDrop: React.FC<{
  open: boolean;
  onOpenChange: (visible: boolean) => void;
  onPress: () => void;
}> = (props) => {
  const { open } = props;

  const [rainDrops, setRainDrops] = useState<Raindrop[]>([]);

  const timer = useRef<NodeJS.Timeout>();

  const pressed = useRef(false);

  const wrapperRef = useRef<HTMLDivElement>(null);

  const stopDrop = () => {
    pressed.current = false;
    if (timer.current) clearInterval(timer.current);
  };

  const onPress = async () => {
    if (pressed.current) return;
    pressed.current = true;

    props.onPress?.();
  };

  useEffect(() => {
    function startDrop() {
      if (rainDrops.length > 0) setRainDrops([]);

      timer.current = setInterval(() => {
        setRainDrops((old) => [...old, ...getDrops(8)]);
      }, 300);
    }

    if (open) startDrop();
    else stopDrop();

    return () => {
      stopDrop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <>
      <Transition nodeRef={wrapperRef} in={open} timeout={200} unmountOnExit>
        {() => (
          <div
            ref={wrapperRef}
            className="fixed inset-0 z-[10000] flex select-none flex-col justify-center bg-black/50 backdrop-blur"
          >
            <div className="absolute inset-0">
              {rainDrops.map((drop) => (
                <img
                  style={{
                    left: drop.left,
                    animationDelay: drop.delay,
                    animationDuration: drop.duration
                  }}
                  className="absolute top-[-100px] w-[60px] animate-[drop] ease-in"
                  key={drop.id}
                  src={drop.url}
                  onAnimationEnd={(event) => {
                    const element = event.target as HTMLImageElement;
                    element?.remove?.();
                  }}
                />
              ))}
            </div>

            <div className="relative z-10">
              <div className="space-y-2">
                <p className="text-center font-bold text-3xl text-white">Mystery drop is coming</p>
                <p className="text-center font-medium text-md text-white">Press quickly to snatch the gift</p>
              </div>

              <div className="relative mt-[30px] flex items-center justify-center rounded-full">
                <div className="absolute size-[110px]  scale-95 animate-[ripple_1.5s_linear_infinite] rounded-full [--ripple-color:254,223,137]"></div>

                <div
                  className="z-10 flex size-[110px] cursor-pointer items-center justify-center rounded-full bg-[linear-gradient(158deg,#FEDF89_12.27%,#F79009_89.48%)] active:scale-95"
                  onClick={onPress}
                >
                  <span className="font-bold text-md text-white">Press</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </Transition>
    </>
  );
};
