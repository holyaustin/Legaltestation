import React, { useEffect, useState, useRef, LegacyRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getRank, getSeasonList } from '@/services';
import { Loading } from '@/components/Loading.tsx';
import { useUserInfo } from '@/providers/UserInfoProvider.tsx';
import { Loader2 } from 'lucide-react';
import dayjs from 'dayjs';
import useDocumentTap from '../../hooks/useDocumentTap';

const RankPage: React.FC = () => {
  const { user } = useUserInfo();
  const { data, isFetching, refetch } = useQuery({
    queryKey: ['rank'],
    queryFn: () => getRank(selectedSeason),
    retry: false
  });

  const { data: seasonList } = useQuery({
    queryKey: ['season-list'],
    queryFn: () => getSeasonList()
  });

  const [selectedSeason, setSelectedSeason] = useState<string>('');
  const [showSeasonList, setShowSeasonList] = useState<boolean>(false);

  const ref: LegacyRef<HTMLUListElement> = useRef<HTMLUListElement>(null);
  useDocumentTap(ref, () => {
    setShowSeasonList(false);
  });

  useEffect(() => {
    const currentSeason = seasonList?.find((x) => x.isCurrent === true);
    if (currentSeason) {
      setSelectedSeason(currentSeason.seasonKey);
    }
  }, [seasonList]);

  useEffect(() => {
    refetch();
  }, [selectedSeason]);

  const handleClickSeasonList = (e: any) => {
    e.stopPropagation();
    setShowSeasonList(!showSeasonList);
  };

  const handleSeasonItemClick = (seasonKey: string) => {
    setSelectedSeason(seasonKey);
    setShowSeasonList(false);
  };

  const userData = data?.rows?.map((it) => ({
    ...it,
    username: it.username || 'Sign User'
  }));

  if (!userData)
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <Loading className="!bg-transparent" />
      </div>
    );

  if (!userData.length) {
    return <div className={'text-center text-white'}>No Data</div>;
  }

  const restUsers = userData.slice(3);
  return (
    <div className={'pt-0'}>
      <div className={'text-left'}>
        <div className="group mb-[16px]">
          <div
            className="bg-white rounded-[20px] w-[130px] h-[38px] text-center flex justify-center items-center"
            onClick={handleClickSeasonList}
          >
            <span>{seasonList?.find((x) => x.seasonKey === selectedSeason)?.name}</span>
            <img
              className="w-[12px] h-[7px] ml-1"
              src="https://sign-public-cdn.s3.us-east-1.amazonaws.com/Signie/selector-drop-icon_240718062129.webp"
              alt=""
            />
          </div>
          {showSeasonList && (
            <ul ref={ref} className="absolute z-10 scale-100 group-hover:scale-100 bg-white rounded-[12px] w-[200px]">
              {[...(seasonList || [])].reverse().map((season) => {
                const isChecked = season.seasonKey === selectedSeason;
                const endTimeDisplay = 'Ended ' + dayjs(season.endTime).format('MMMM DD');
                const classList =
                  'h-[38px] text-left leading-[38px] first:rounded-t-[12px] last:rounded-b-[12px] pl-[10px] text-[13px] font-medium ' +
                  (isChecked ? 'bg-[#ECF2FF]' : 'bg-white');
                return (
                  <li
                    key={season.seasonKey}
                    className={classList}
                    onClick={() => handleSeasonItemClick(season.seasonKey)}
                  >
                    <span>
                      {season.name} {season.isCurrent ? ' Current' : endTimeDisplay}
                    </span>
                    {isChecked && (
                      <img
                        className="w-[12px] h-[7px] ml-1 float-right mr-[16px] mt-[15px]"
                        src="https://sign-public-cdn.s3.us-east-1.amazonaws.com/Signie/check_240718061845.webp"
                        alt=""
                      />
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
      {/*<div className={'px-2 text-right text-white'}>*/}
      {/*  <LotteryRulesModal />*/}
      {/*</div>*/}
      <div className={'mt-0 flex items-end'}>
        <div className="flex flex-1 flex-col items-center rounded-l-[12px] bg-[#ECF2FF] py-2">
          <div
            className={
              'flex size-4 rotate-45 items-center justify-center rounded-[5px] bg-cyan-500 text-center text-white'
            }
          >
            <span className={'-rotate-45'}>2</span>
          </div>
          <div className={'mt-2.5 font-bold text-sm text-[#009BD6]'}>{userData[1]?.score}</div>
          <div className={'font-normal text-[12px] text-gray-500'}>{userData[1]?.username}</div>
        </div>
        <div className="flex h-[122px] flex-1 flex-col items-center rounded-t-[28px] bg-[#F4F8FF] py-6">
          <div
            className={
              'flex size-4 rotate-45 items-center justify-center rounded-[5px] bg-yellow-400 text-center text-white'
            }
          >
            <span className={'-rotate-45'}>1</span>
          </div>
          <div className={'mt-3 font-bold text-sm text-[#FFAA00]'}>{userData[0]?.score}</div>
          <div className={'font-normal text-[12px] text-gray-500'}>{userData[0]?.username}</div>
          {/*<div className={'mt-2 text-xs'}>@username</div>*/}
        </div>
        <div className="flex flex-1 flex-col items-center rounded-r-[12px] bg-[#ECF2FF] py-2">
          <div
            className={
              'flex size-4 rotate-45 items-center justify-center rounded-[5px] bg-slime-400 text-center text-white'
            }
          >
            <span className={'-rotate-45'}>3</span>
          </div>
          <div className={'mt-2.5 font-bold text-xs text-[#00D95F]'}>{userData[2]?.score}</div>
          <div className={'font-normal text-[12px] text-gray-500'}>{userData[2]?.username}</div>
          {/*<div className={'text-xs'}>@username</div>*/}
        </div>
      </div>
      <div className={'mt-4'}>
        <div className={'flex items-center justify-around font-normal text-xs text-white'}>
          <div className={'flex-1'}>Rank</div>
          <div className={'flex-[0_0_100px] pr-4 text-right'}>Points</div>
          {/*<div className={'flex-[0_0_80px] text-right'}>Rewards</div>*/}
        </div>
      </div>
      <div className={'mt-3 space-y-2'}>
        <div className={'flex items-center justify-around rounded-[4px] bg-[#ECF2FF] px-2 py-2.5 text-[#1C1C1C]'}>
          <div className={'flex flex-1 items-center gap-4'}>
            <div className={'w-[50px]'}>
              <span
                className={
                  'inline-flex h-6 min-w-6 items-center justify-center rounded-3xl px-[2px] font-medium text-xs'
                }
              >
                {data?.userRank?.rank}
              </span>
            </div>
            <div className={'w-[100px] text-ellipsis font-medium text-xs'}>{user?.username}</div>
          </div>
          <div className={'flex-[0_0_100px] pr-4 text-right font-normal text-xs'}>{data?.userRank?.score || '-'}</div>
          {/*<div className={'flex-[0_0_50px] px-2 text-right'}>--</div>*/}
        </div>
        {restUsers?.map((item, index) => {
          return (
            <div
              key={index}
              className={'flex items-center justify-around rounded-[4px] bg-white px-2 py-2.5 text-gray-900'}
            >
              <div className={'flex flex-1 items-center gap-4'}>
                <div className={'w-[50px]'}>
                  <span
                    className={
                      'flex size-6 items-center justify-center rounded-full bg-[#ECF2FF] font-medium text-xs text-primary'
                    }
                  >
                    {index + 4}
                  </span>
                </div>
                <div className={'w-[100px] text-ellipsis font-medium text-xs'}>{item.username}</div>
              </div>
              <div className={'flex-[0_0_100px] pr-4 text-right font-normal text-xs'}>{item.score}</div>
              {/*<div className={'flex-[0_0_50px] px-2 text-right'}>--</div>*/}
            </div>
          );
        })}
      </div>

      {isFetching && (
        <div
          className={
            'fixed top-0 bottom-[79px] left-0 right-0 bg-white opacity-60 flex min-h-[200px] items-center justify-center'
          }
        >
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      )}
    </div>
  );
};

export default RankPage;
