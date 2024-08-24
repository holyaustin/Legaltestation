import React, { useMemo } from 'react';

export const Score: React.FC<{ value: number }> = (props) => {
  const { value } = props;

  const cells = useMemo(() => {
    const result = value.toString().split('');

    if (result.length < 5) {
      result.unshift(...Array.from({ length: 5 - result.length }, () => '0'));
    }

    return result;
  }, [value]);

  return (
    <div className="flex gap-[5px]">
      {cells.map((cell, index) => (
        <div
          key={index}
          className="flex h-[46px] w-[35px] items-center justify-center rounded-[4px] border border-[rgba(17,17,17,0.20)] bg-white font-bold text-2xl text-[#111]"
        >
          {cell}
        </div>
      ))}
    </div>
  );
};
