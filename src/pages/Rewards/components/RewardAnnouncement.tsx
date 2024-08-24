import { useClock } from '@/hooks/useClock';
import { getRewardsAnnouncement } from '@/services';
import type { RewardAnnouncement as RewardAnnouncementType } from '@/types';
import { shuffle } from '@/utils';
import dayjs from 'dayjs';
import React, { useRef, useState } from 'react';
import { CarouselMessageRef, CarouselMessages } from '../../../components/CarouselMessages';

const POLLING_INTERVAL = 3 * 60 * 1000;

function createMessage(announcement: RewardAnnouncementType) {
  const { username, name, rewardAt } = announcement;

  const amount =
    announcement.type === 'physical' ? (announcement.amount === 1 ? 'a' : announcement.amount) : announcement.amount;

  const date = dayjs(rewardAt).format('MMMM DD, YYYY');

  const content = `@${username} won ${amount} ${name} on ${date}`;

  return content;
}

function sortAnnouncement(announcements: RewardAnnouncementType[]) {
  const nonTokenAnnouncements = announcements.filter((item) => item.type !== 'token');
  const tokenAnnouncements = announcements.filter((item) => item.type === 'token');

  return [...shuffle(nonTokenAnnouncements), ...shuffle(tokenAnnouncements)];
}

export const RewardAnnouncement: React.FC<{ className: string }> = (props) => {
  const { className } = props;

  const carouselMessageRef = useRef<CarouselMessageRef>(null);

  const [initMessages, setInitMessages] = useState<{ content: string }[]>([]);

  useClock(
    async () => {
      const response = await getRewardsAnnouncement();

      const messages = sortAnnouncement(response.rows).map((announcement) => {
        const content = createMessage(announcement);
        return { content };
      });

      setInitMessages(messages);

      carouselMessageRef?.current?.addMessages?.(messages);
    },
    { interval: POLLING_INTERVAL }
  );

  if (!initMessages.length) return null;

  return (
    <CarouselMessages
      ref={carouselMessageRef}
      messages={initMessages}
      className={className}
      duration={3000}
      icon={
        <img
          className="size-7"
          src="https://sign-public-cdn.s3.us-east-1.amazonaws.com/Signie/prize-pool_240628022116.webp"
        />
      }
    />
  );
};
