import { TaskRewardType } from '@/types';
import { Button } from '@ethsign/ui';
import { forwardRef, useMemo } from 'react';
import { DrawerRef, TaskDrawer } from './TaskDrawer';
import { TaskItem } from './TaskItem';

export interface TaskProps {
  title: string;
  action?:
    | {
        text?: string;
        loading?: boolean;
        handler?: () => void;
      }
    | (() => void);
  rewardText?: string;
  description?: string;
  completed?: boolean;
  ref?: React.MutableRefObject<DrawerRef | null>;
  rewardType?: TaskRewardType;
  drawerTitle?: string;
  drawerDescription?: string;
}

export const Task = forwardRef<DrawerRef, TaskProps>((props, ref) => {
  const { rewardType, completed, description, drawerDescription, drawerTitle, rewardText, title, action } = props;

  const drawerEnabled = useMemo(() => !!drawerDescription || !!drawerTitle, [drawerDescription, drawerTitle]);

  if (drawerEnabled)
    return (
      <TaskDrawer
        ref={ref}
        completed={completed}
        title={drawerTitle ?? title}
        desc={drawerDescription ?? drawerDescription ?? ''}
        trigger={
          <TaskItem
            rewardType={rewardType}
            completed={completed}
            title={title}
            description={description}
            rewardText={rewardText}
          />
        }
        action={
          typeof action === 'function' ? (
            <Button className={'mt-8'} onClick={action}>
              Confirm
            </Button>
          ) : (
            <Button className={'mt-8'} onClick={action?.handler} loading={action?.loading}>
              {action?.text}
            </Button>
          )
        }
      />
    );

  return (
    <TaskItem
      rewardType={rewardType}
      completed={completed}
      title={title}
      description={description ?? ''}
      rewardText={rewardText}
      onClick={() => {
        const handler = typeof action === 'function' ? action : action?.handler;
        handler?.();
      }}
    />
  );
});
