import classNames from 'classnames';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';

const CONFETTI_IMAGE_URLS = Array.from(
  { length: 41 },
  (_, index) => `/confetti/images/confetti_component-${index}.png`
);

const animationStops = CONFETTI_IMAGE_URLS.map(
  (imageUrl, index) => `${(index * 100) / CONFETTI_IMAGE_URLS.length}% { background-image: url("${imageUrl}"); }`
).join('\n');

let id = 0;

export interface ConfettiRef {
  confetti: () => void;
}

export const Confetti = forwardRef<ConfettiRef>((_, ref) => {
  const [confetties, setConfetties] = useState<number[]>([]);

  const [isLoadingAssets, setIsLoadingAssets] = useState(false);

  useEffect(() => {
    const imageLoad = CONFETTI_IMAGE_URLS.map((url) => {
      return new Promise((resolve) => {
        const image = new Image();

        image.addEventListener('load', () => {
          resolve(image);
        });

        image.src = url;
      });
    });

    setIsLoadingAssets(true);

    Promise.all(imageLoad).then(() => {
      setIsLoadingAssets(false);
    });
  }, []);

  const addConfetti = () => {
    if (isLoadingAssets) return;
    setConfetties((old) => [...old, id++]);
  };

  useImperativeHandle(ref, () => ({
    confetti: addConfetti
  }));

  return (
    <>
      <style>{`@keyframes confetti { ${animationStops} }`}</style>

      {confetties.length > 0 && (
        <div className="pointer-events-none absolute inset-0 z-50">
          {confetties.map((confettiId) => (
            <div
              key={confettiId}
              className={classNames('absolute inset-0 animate-[confetti_1s] bg-no-repeat bg-cover bg-center')}
              onAnimationEnd={() => {
                setConfetties((old) => old.filter((id) => id !== confettiId));
              }}
            >
              <audio className="invisible" preload="none" autoPlay src="/confetti/confetti.mp3"></audio>
            </div>
          ))}
        </div>
      )}
    </>
  );
});
