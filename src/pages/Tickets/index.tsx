import { Tabbar } from '@/components/Header.tsx';
import ticketImg from '@/assets/ticket.png';
import { Badge, Modal } from '@ethsign/ui';
import { ReactNode, useState } from 'react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle
} from '@/components/Drawer.tsx';
import { XClose } from '@ethsign/icons';
import { AttestTabs } from '@/components/AttestTabs.tsx';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getTask } from '@/services';
import { cn } from '@/utils/tailwind.ts';

const TicketDrawer = ({
  trigger,
  title,
  desc,
  children,
  disabled,
  open,
  setOpen
}: {
  trigger: ReactNode;
  title: string;
  desc?: string;
  children: ReactNode;
  disabled?: boolean;
  open: boolean;
  setOpen: (v: boolean) => void;
}) => {
  return (
    <>
      <Drawer open={open} onOpenChange={setOpen} modal={false}>
        <DrawerContent customMask>
          <div className={'flex justify-end p-2'}>
            <DrawerClose asChild>
              <XClose className="size-[24px]" color="#667085" />
            </DrawerClose>
          </div>
          <div className="mx-auto w-full max-w-sm">
            <div className="px-6 pb-8 pt-2">
              <DrawerHeader className={'p-0'}>
                <DrawerTitle className={'font-bold text-[25px]'}>{title}</DrawerTitle>
                <DrawerDescription className={'space-y-2 text-left'}>{desc}</DrawerDescription>
                {children}
              </DrawerHeader>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
      <div
        onClick={() => {
          if (!disabled) {
            setOpen(true);
          }
        }}
      >
        {trigger}
      </div>
    </>
  );
};

export default function Tickets() {
  const [open1, setOpen1] = useState(false);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { data, refetch } = useQuery({
    queryKey: ['tasks'],
    queryFn: getTask
  });

  const handleCheck = () => {
    refetch();
    setOpen(false);
    setOpen1(true);
  };
  return (
    <div>
      <Tabbar title={'Earn Tickets'} />
      <div className={'h-[calc(100vh-48px)] bg-white px-6 py-10'}>
        <div className={'flex items-center justify-between'}>
          <div className={'font-bold text-xl text-gray-900'}>Earn Tickets</div>
        </div>
        <div className="mt-6 space-y-6">
          <TicketDrawer
            open={open}
            setOpen={setOpen}
            disabled={data?.remainingAvailableTasks === 0}
            title={'Sign event onchain'}
            trigger={
              <div
                className={cn(
                  'flex items-center gap-4 py-2 px-4 border border-gray-200 rounded-[8px]',
                  data?.remainingAvailableTasks === 0 ? 'bg-[#ECF2FF]' : 'bg-white'
                )}
              >
                <img src={ticketImg} className={'w-[46px]'} alt="" />
                <div className={'flex flex-col'}>
                  <div className={'text-sm font-semibold text-gray-900'}>Sign event offchain</div>
                  <div className={'mt-1 font-normal text-xs text-gray-600'}>
                    Get 1 ticket for every offchain attestation you make
                  </div>
                </div>
                <div className={''}>
                  <Badge className={'bg-gray-100 text-gray-500'}>{3 - (data?.remainingAvailableTasks || 0)}/3</Badge>
                </div>
              </div>
            }
          >
            <div className={'w-full'}>
              <div className={'mt-4 flex items-center justify-center gap-2 font-normal text-sm'}>
                <img src={ticketImg} className={'w-6'} />
                <div>Earn points for each offchain signing</div>
              </div>
              <AttestTabs onSuccess={handleCheck} />
            </div>
          </TicketDrawer>
        </div>
      </div>

      <Modal
        open={open1}
        onOpenChange={setOpen1}
        footerClassName={'flex-row gap-2 mt-0'}
        confirmButtonProps={{
          variant: 'primary',
          className: 'flex-1'
        }}
        confirmText={'Play'}
        cancelText={'Close'}
        cancelButtonProps={{
          className: 'flex-1'
        }}
        onConfirm={() => {
          navigate('/lucky-wheel');
        }}
        className={'w-[359px] rounded-[24px]'}
      >
        <div>
          <img src={ticketImg} className={'mx-auto w-[80px]'} alt="" />
        </div>
        <div className={'mt-4 text-center'}>
          <div className={'text-xl font-semibold text-black'}>1 Ticket Received</div>
          <div className={'mt-2 font-normal text-md text-gray-600'}>
            Spin the wheel with your tickets and earn Signie points
          </div>
        </div>
      </Modal>
    </div>
  );
}
