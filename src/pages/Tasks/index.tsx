import { ENVS } from '@/constants/config.ts';
import { useUserInfo } from '@/providers/UserInfoProvider.tsx';
import { checkTask as checkTaskRequest, getQuizInfo, getTask } from '@/services';
import { TaskRewardType, TaskTypeEnum } from '@/types';
import { Badge } from '@ethsign/ui';
import { useQuery } from '@tanstack/react-query';
import WebApp from '@twa-dev/sdk';
import { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Task, TaskProps } from './components/Task';
import { DrawerRef } from './components/TaskDrawer';
import { TaskItem } from './components/TaskItem';

export default function Tasks() {
  const navigate = useNavigate();

  const { isBindingWallet, bindWallet } = useUserInfo();
  const [isJoiningSignGroup, setIsJoiningSignGroup] = useState(false);

  const { data: taskData, refetch } = useQuery({ queryKey: ['tasks'], queryFn: getTask });
  const { data: quizData } = useQuery({ queryKey: ['quiz-info'], queryFn: getQuizInfo });

  const bindingWalletDrawerRef = useRef<DrawerRef>(null);
  const joinSignGroupDrawerRef = useRef<DrawerRef>(null);

  const handleBindWallet = async () => {
    await bindWallet();
    refetch();
    bindingWalletDrawerRef.current?.close();
  };

  const joinTelegtamGroup = async (props: { groupUrl: string; taskType: TaskTypeEnum }) => {
    const { groupUrl, taskType } = props;
    try {
      setIsJoiningSignGroup(true);

      if (WebApp) {
        WebApp.openTelegramLink(groupUrl);
      } else {
        window.open(groupUrl);
      }

      const res = await checkTaskRequest({ taskType });

      if (res.result) {
        refetch();
        joinSignGroupDrawerRef.current?.close();
        return;
      }
    } finally {
      setIsJoiningSignGroup(false);
    }
  };

  const checkTask = async (taskType: TaskTypeEnum) => {
    const res = await checkTaskRequest({ taskType });

    if (res.result) {
      refetch();
    }
  };

  const oneTimeTasks = useMemo(() => {
    const tasks: TaskProps[] = [
      {
        completed: taskData?.visitTokenTable,
        title: 'Follow TokenTable’s X',
        rewardText: '500 pts',
        rewardType: TaskRewardType.POINTS,
        action: async () => {
          WebApp.openLink('https://x.com/tokentable');
          await checkTask(TaskTypeEnum.VisitTokenTable);
        }
      },
      {
        completed: taskData?.visitSign,
        title: `Follow Sign's X`,
        rewardText: '500 pts',
        rewardType: TaskRewardType.POINTS,
        action: async () => {
          WebApp.openLink('https://x.com/ethsign');
          await checkTask(TaskTypeEnum.VisitSign);
        }
      },
      {
        completed: taskData?.visitSignCommunity,
        title: `Join Sign X community`,
        rewardText: '500 pts',
        rewardType: TaskRewardType.POINTS,
        action: async () => {
          WebApp.openLink('https://x.com/i/communities/1808883915714933045');
          await checkTask(TaskTypeEnum.VisitSignCommunity);
        }
      },
      {
        completed: taskData?.addressBound,
        title: 'Connect wallet',
        ref: bindingWalletDrawerRef,
        // description: 'Earn 1 free tickets per day',
        drawerDescription: 'Connect wallet to earn 1 free tickets per day',
        drawerTitle: 'Connect wallet',
        rewardText: '1 free ticket/day',
        rewardType: TaskRewardType.TICKET,
        action: {
          handler: handleBindWallet,
          loading: isBindingWallet,
          text: 'Connect wallet now'
        }
      },
      {
        completed: taskData?.groupJoined,
        title: 'Join TG group',
        ref: joinSignGroupDrawerRef,
        // description: 'Earn 1 free tickets per day',
        drawerDescription: 'Join our TG channel to keep up to date and earn 1 free tickets per day',
        drawerTitle: 'Join our TG channel',
        rewardText: '1 free ticket/day',
        rewardType: TaskRewardType.TICKET,
        action: {
          handler: () =>
            joinTelegtamGroup({
              groupUrl: ENVS.TG_SIGN_GROUP_LINK,
              taskType: TaskTypeEnum.JOIN_GROUP
            }),
          loading: isJoiningSignGroup,
          text: 'Join now'
        }
      },
      {
        completed: taskData?.visitBalletCrypto,
        title: 'Visit Ballet Cold Storage X',
        rewardText: '200 pts',
        rewardType: TaskRewardType.POINTS,
        action: async () => {
          WebApp.openLink('https://x.com/BalletCrypto/');
          await checkTask(TaskTypeEnum.VisitBalletCrypto);
        }
      },
      {
        completed: taskData?.visitSafepal,
        title: 'Visit Safepal X',
        rewardText: '200 pts',
        rewardType: TaskRewardType.POINTS,
        action: async () => {
          WebApp.openLink('https://www.twitter.com/isafepal');
          await checkTask(TaskTypeEnum.VisitSafepal);
        }
      },
      {
        completed: taskData?.joinSafePalTgGroup,
        title: 'Join Safepal X TG Group',
        drawerTitle: 'Join Safepal X TG Group',
        drawerDescription: 'Join Safepal’s TG group to earn Signie points',
        rewardText: '300 pts',
        rewardType: TaskRewardType.POINTS,
        action: {
          handler: () =>
            joinTelegtamGroup({
              groupUrl: ENVS.TG_SAFEPAL_LINK,
              taskType: TaskTypeEnum.JoinSafePalTgGroup
            }),
          loading: isJoiningSignGroup,
          text: 'Join now'
        }
      },
      {
        completed: taskData?.visitTriangleIncubator,
        title: "Discover Sign's Journey in Triangle",
        rewardText: '500 pts',
        rewardType: TaskRewardType.POINTS,
        action: async () => {
          WebApp.openLink('https://x.com/ethsign/status/1811102961302671669');
          await checkTask(TaskTypeEnum.VisitTriangle);
        }
      }
    ];

    tasks.sort((a, b) => Number(a.completed) - Number(b.completed));

    return tasks;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskData, isBindingWallet, isJoiningSignGroup]);

  const dailyTasks = [
    {
      completed: quizData?.remainingQuizzes === 0,
      title: 'Quizzes for fun',
      description: 'Accure points by taking quizzes',
      extra: (
        <div className={'ml-4 mr-2'}>
          <Badge className={'bg-gray-100 text-gray-500 hover:bg-gray-50 hover:text-gray-600'}>
            {quizData?.committedQuizzes ?? 0}/{quizData?.dailyMaximum || 0}
          </Badge>
        </div>
      ),
      onClick: () => {
        if (quizData?.remainingQuizzes === 0) return;
        navigate('/quizzes');
      }
    },
    {
      completed: false,
      onClick: () => {
        navigate('/invite-friends');
      },
      title: 'Invite friends',
      description: 'Receive bonuses by inviting new friends'
    }
  ];

  return (
    <div>
      <h2 className={'font-bold text-xl text-white'}>Daily Tasks</h2>

      <div className={'mt-2 space-y-2'}>
        {dailyTasks.map((task, index) => (
          <TaskItem
            title={task.title}
            description={task.description}
            extra={task.extra}
            key={index}
            onClick={task.onClick}
            completed={task.completed}
          />
        ))}
      </div>

      <h2 className={'mt-4 font-bold text-xl text-white'}>Tasks</h2>

      <div className={'mt-2 space-y-2'}>
        {oneTimeTasks.map((task, index) => (
          <Task key={index} {...task} />
        ))}
      </div>
    </div>
  );
}
