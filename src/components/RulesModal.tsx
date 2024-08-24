import { useLotteryInfo } from '@/providers/LotteryInfoProvider';
import { Modal, Table, TableBody, TableCell, TableRow } from '@ethsign/ui';
import React, { PropsWithChildren, useMemo, useState } from 'react';

export const LotteryRulesModal: React.FC<PropsWithChildren> = (props) => {
  const { children } = props;

  const { currentDayRaffleResult } = useLotteryInfo();

  const [modalVisible, setModalVisible] = useState(false);

  const tableData = useMemo(() => {
    const levels = currentDayRaffleResult?.levels ?? [];

    const data = [
      {
        label: 'Levels',
        values: levels.map((item) => (item.level === 0 ? 'Base' : 'Level ' + item.level))
      },
      {
        label: 'Bonus',
        values: levels.map((item) => item.multiplier + 'x')
      },
      {
        label: 'Level up',
        values: levels.map((item, index) => {
          const steps = index === 0 ? item.steps : item.steps - levels[index - 1].steps;

          return steps === 0 ? '-' : steps + ' steps';
        })
      }
    ];

    return data;
  }, [currentDayRaffleResult?.levels]);

  return (
    <>
      <Modal
        open={modalVisible}
        onOpenChange={(visible) => setModalVisible(visible)}
        className={'w-[95vw] rounded-[24px] border border-white/20 bg-white p-4 pt-6 sm:w-[410px]'}
        footer={false}
      >
        <div className={'text-gray-900'}>
          <h2 className={'text-center font-bold text-[25px]'}>Activity Rules</h2>
          <div className={'mt-3 font-normal text-[14px] [&_ul]:list-disc [&_ul]:pl-4'}>
            <p>Earn extra Signie points by asking friends to sign events through your referral link.</p>
            <ul className="my-2">
              <li>
                During the boosting process, you will go through 4 levels. Each time you level up, the Signie points
                will be inflated.
              </li>
              <li>
                Every event signed made by your friend will push you step forward to the next level.
                <ul>
                  <li>An event is worth 5 steps.</li>
                </ul>
              </li>
            </ul>

            <div className="">Detailed boosting rules are presented in the table below.</div>
          </div>
        </div>
        <div className={'overflow-hidden rounded-[8px] border border-gray-200'}>
          <Table className={'text-xs'}>
            <TableBody>
              {tableData.map((row, index) => (
                <TableRow key={index} className="border-gray-200">
                  <TableCell className="w-[76px] whitespace-nowrap px-2 font-medium">{row.label}</TableCell>

                  {row.values.map((value, index) => (
                    <TableCell key={index} className="w-[75px] whitespace-nowrap px-2">
                      {value}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Modal>

      <div className="inline-block" onClick={() => setModalVisible(true)}>
        {children ?? <span className={'font-medium text-white underline'}>Rules</span>}
      </div>
    </>
  );
};
