import { Ticket01 } from '@ethsign/icons';
import React, { useEffect, useRef, useState } from 'react';
import { useLotteryInfo } from '../../../providers/LotteryInfoProvider';
import { Events, eventBus } from '@/eventbus';
import classNames from 'classnames';
import { useNavigate } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';

export const TicketsButton: React.FC<{
  className?: string;
}> = (props) => {
  const { className } = props;
  const navigate = useNavigate();

  const { remainingTimes } = useLotteryInfo();

  const ticketButtonRef = useRef<HTMLDivElement>(null);

  const [tickets, setTickets] = useState(remainingTimes);

  useEffect(() => {
    setTickets(remainingTimes);
  }, [remainingTimes]);

  useEffect(() => {
    const onNoTicketSpin = () => {
      const ticketButtonEl = ticketButtonRef.current;

      if (!ticketButtonEl) return;

      const animationClassName = 'animate-shake';

      if (!animationClassName) return;

      ticketButtonEl.classList.remove(animationClassName);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          ticketButtonEl.classList.add(animationClassName);
        });
      });
    };

    const onRaffleResultReceived = () => {
      setTickets((old) => old - 1);
    };

    eventBus.on(Events.noTicketSpin, onNoTicketSpin);
    eventBus.on(Events.raffleResultReceived, onRaffleResultReceived);

    return () => {
      eventBus.off(Events.noTicketSpin, onNoTicketSpin);
      eventBus.off(Events.raffleResultReceived, onRaffleResultReceived);
    };
  }, []);

  return (
    <div
      onClick={() => {
        navigate('/tickets');
      }}
      className={classNames(
        'flex-1 rounded-[6px] bg-[#ECF2FF] px-4 py-2 text-center font-bold text-[#101828]',
        className
      )}
    >
      <div ref={ticketButtonRef} className="flex items-center justify-center gap-2 text-[#0052FF]">
        <Ticket01 size={16} color="#0052FF" />
        <span>{tickets}</span>
        <span>Ticket</span>
        <PlusCircle size={16} color="#0052FF" />
      </div>
    </div>
  );
};
