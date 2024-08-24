import { Tabbar } from '@/components/Header';
import { Star } from '@/components/Icons';
import { ENVS } from '@/constants/config';
import { useUserInfo } from '@/providers/UserInfoProvider';
import { getInvitationInfo } from '@/services';
import { InvitationInfo } from '@/types';
import { formatNumber, ordinalSuffix } from '@/utils/common';
import { encodeTelegramStartParam } from '@/utils/telegram';
import { UserPlus01 } from '@ethsign/icons';
import { Button, ScrollArea } from '@ethsign/ui';
import WebApp from '@twa-dev/sdk';
import classNames from 'classnames';
import { Check, Loader2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

const InviteFriendsPage: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const [invitationInfo, setInvitationInfo] = useState<InvitationInfo>();

  const { user } = useUserInfo();

  useEffect(() => {
    const refreshInvitationInfo = async () => {
      setLoading(true);

      const invitationInfo = await getInvitationInfo();

      setInvitationInfo(invitationInfo);

      setLoading(false);
    };

    refreshInvitationInfo();
  }, []);

  const steps = useMemo(() => {
    const rule = invitationInfo?.rules;
    if (!rule) return [];

    return rule.map((points, index) => {
      return {
        label: ordinalSuffix(index + 1),
        finished: index < (invitationInfo?.totalInvited ?? 0),
        points: points
      };
    });
  }, [invitationInfo?.rules, invitationInfo?.totalInvited]);

  const onInviteButtonClick = () => {
    if (invitationInfo && invitationInfo.totalInvited >= invitationInfo.rules.length) {
      return;
    }

    const inviteData = {
      invitedBy: user?.userId
    };

    const description = 'Come and play together to win $NOT！';

    const startParam = encodeTelegramStartParam(inviteData);

    const url = `https://t.me/share/url?url=${ENVS.TG_APP_LINK}?startapp=${startParam}&text=${encodeURIComponent(
      description
    )}`;

    if (WebApp) {
      WebApp.openTelegramLink(url);
    } else {
      window.open(url);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <Tabbar title={'Invite Friends'} />

      <ScrollArea className="h-[calc(100vh-48px)] bg-white">
        <div className="flex-1 space-y-4 bg-white px-6 pt-8">
          <div className="px-[26px] text-center">
            <h1 className="font-bold text-2xl">Invite Friends</h1>

            <p className="mt-2 font-medium text-sm text-[#667085]">
              Get bonuses by inviting new friends to play together
            </p>
          </div>

          <div className="rounded-[16px] p-5 shadow-[0px_8px_32px_0px_rgba(31,47,70,0.08)]">
            {loading ? (
              <div className="flex min-h-20 items-center justify-center">
                <Loader2 className="animate-spin text-primary" />
              </div>
            ) : (
              <div className="flex min-h-20 justify-between gap-2">
                {steps.map((step, index) => (
                  <div className="text-center" key={index}>
                    <div
                      className={classNames(
                        'flex flex-1 flex-col items-center justify-center min-w-[50px] min-h-[56px] pt-[6px] pb-2 rounded-[12px] border',
                        step.finished
                          ? 'border-transparent bg-[#EBF4FF] text-[#067DFE] font-semibold'
                          : 'border-[#E4E9F2] bg-white'
                      )}
                    >
                      <span className="font-medium text-xs">
                        +{step.points >= 1000 ? step.points / 1000 + 'K' : step.points}
                      </span>

                      <div
                        className={classNames(
                          'size-4 rounded-full flex justify-center items-center mt-1',
                          step.finished ? 'bg-[#067DFE]' : 'bg-[#C5CEE0]'
                        )}
                      >
                        {step.finished ? <Check size={12} color="white" /> : <Star />}
                      </div>
                    </div>

                    <span
                      className={classNames(
                        'mt-1 font-medium text-xs',
                        step.finished ? 'text-[#067DFE]' : 'text-[#8F9BB3]'
                      )}
                    >
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <Button className="mt-4 flex w-full items-center justify-center" onClick={onInviteButtonClick}>
              <UserPlus01 className="mr-2" size={16} color="white" />
              <span>Invite Friends</span>
            </Button>
          </div>

          <div
            hidden={!loading && !invitationInfo?.totalPoints}
            className="space-y-2 rounded-[16px] p-5 shadow-[0px_8px_32px_0px_rgba(31,47,70,0.08)]"
          >
            {loading && (
              <div className="flex min-h-[80px] items-center justify-center">
                <Loader2 className="animate-spin text-primary" />
              </div>
            )}

            {!loading && invitationInfo && (
              <>
                <h1 className="font-bold text-2xl">Received {formatNumber(invitationInfo.totalPoints)} points</h1>
                <div className="space-y-2">
                  {invitationInfo.invitedList.map((invitation, index) => (
                    <div key={invitation.username + index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <img
                          className="size-[35px]"
                          src="https://sign-public-cdn.s3.us-east-1.amazonaws.com/Signie/invite-friends-coin_240625071408.webp"
                          alt=""
                        />

                        <span className="font-bold text-xs">{invitation.username ?? invitation.userId}</span>
                      </div>

                      <div className="flex items-center gap-1 text-[#FEC84B]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="8" height="9" viewBox="0 0 8 9" fill="none">
                          <circle cx="4" cy="4.90625" r="4" fill="#FEC84B" />
                        </svg>
                        <span className="font-medium text-xs">+{formatNumber(invitation.points)} points</span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default InviteFriendsPage;
