import { Tabbar } from '@/components/Header.tsx';
import { Button, Label, Modal, RadioGroup, RadioGroupItem, toast } from '@ethsign/ui';
import chestImg from '@/assets/Chest.png';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkTask, getQuizInfo } from '@/services';
import { TaskTypeEnum } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { cn } from '@/utils/tailwind.ts';
import { X } from 'lucide-react';
import { Check } from '@/components/Icons.tsx';
import { Spin } from '@/components/Loading.tsx';
import { sleep } from '@/utils/common.ts';

export default function Quizzes() {
  const [quitModal, setQuitModal] = useState(false);
  const navigate = useNavigate();
  const { data, refetch, isLoading, isRefetching } = useQuery({
    queryKey: ['quiz-info'],
    queryFn: getQuizInfo,
    refetchOnWindowFocus: false
  });
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState('');
  const [isFinish, setIsFinish] = useState(false);
  const [result, setResult] = useState<string[]>([]);

  const isRight = result.includes(answer);

  const handleSubmit = async () => {
    if (!answer) {
      toast({
        variant: 'error',
        title: 'Error',
        description: 'Please select an answer'
      });
      return;
    }
    try {
      setLoading(true);
      const res = await checkTask({
        taskType: TaskTypeEnum.QUIZ,
        taskId: data?.currentQuiz?.quizId,
        value: answer
      });
      setResult(res?.correctAnswer || []);
      await sleep(isRight ? 1000 : 2000);
      setAnswer('');
      refetch();
      setResult([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!data?.remainingQuizzes) {
      setIsFinish(true);
    }
  }, [data]);

  return (
    <div>
      <Tabbar title={'Quizzes for fun'} />
      <Spin loading={isLoading || isRefetching}>
        <div className={'relative h-[calc(100vh-48px)] bg-white px-6 py-8'}>
          <div className={'rounded-[12px] bg-[#ECF2FF] px-5 py-2.5'}>
            Signie points earned:
            <span className={'ml-2 font-bold text-md text-primary'}>{data?.pointsByQuiz} points</span>
          </div>

          <div className={'mt-8 px-6'}>
            <div className={'font-normal text-sm text-gray-500'}>
              {(data?.committedQuizzes || 0) + 1}/{data?.dailyMaximum || 0}
            </div>
            <div className={'mt-2 flex-1 text-md font-semibold'}>{data?.currentQuiz?.title}</div>
            <div className={'space-y-2 pt-4'}>
              <RadioGroup
                value={answer}
                onValueChange={(v) => {
                  setAnswer(v);
                }}
              >
                {data?.currentQuiz?.options?.map((option, index) => {
                  return (
                    <div
                      key={index}
                      className={cn(
                        'p-4 border border-gray-200 rounded-[8px]',
                        result?.length
                          ? result.includes(option.value)
                            ? 'bg-slime-400'
                            : !isRight
                            ? 'bg-red-500'
                            : ''
                          : ''
                      )}
                    >
                      <Label htmlFor={option.value} className={'flex w-full items-center justify-between gap-2'}>
                        <div
                          className={cn(
                            'flex-1',
                            result?.length
                              ? result.includes(option.value)
                                ? 'text-white'
                                : !isRight
                                ? 'text-white'
                                : ''
                              : ''
                          )}
                        >
                          {option.title}
                        </div>
                        <div className={'flex-[0_0_20px]'}>
                          {result?.length ? (
                            result.includes(option.value) ? (
                              <div className={'flex size-4 items-center justify-center rounded-full bg-white'}>
                                <Check />
                              </div>
                            ) : !isRight ? (
                              <div className={'flex size-4 items-center justify-center rounded-full bg-white'}>
                                <X className={'text-red-500'} size={10} />
                              </div>
                            ) : (
                              <RadioGroupItem
                                className={'border-gray-300'}
                                id={option.value}
                                value={option.value}
                              ></RadioGroupItem>
                            )
                          ) : (
                            <RadioGroupItem
                              className={'border-gray-300'}
                              id={option.value}
                              value={option.value}
                            ></RadioGroupItem>
                          )}
                        </div>
                      </Label>
                    </div>
                  );
                })}
              </RadioGroup>
            </div>
          </div>

          <div className={'absolute inset-x-6 bottom-8 flex justify-between gap-2'}>
            <Button
              variant={'outline'}
              className={'flex-1'}
              onClick={() => {
                setQuitModal(true);
              }}
            >
              Quit
            </Button>
            <Button loading={loading || isRefetching || isLoading} className={'flex-1'} onClick={handleSubmit}>
              Next
            </Button>
          </div>
        </div>
      </Spin>

      <Modal
        maskClosable={false}
        hiddenCloseIcon
        open={isFinish}
        onOpenChange={setIsFinish}
        footer={false}
        className={'w-[359px] rounded-[24px]'}
      >
        <div>
          <img src={chestImg} className={'mx-auto w-[55px]'} alt="" />
        </div>
        <div className={'mt-4 text-center'}>
          <div className={'text-xl font-semibold text-black'}>You won {data?.pointsByQuiz} pts</div>
          <div className={'mt-2 font-normal text-md text-gray-600'}>Come and take the quiz tomorrow</div>
        </div>
        <Button
          className={'text-primary'}
          variant={'link-color'}
          onClick={() => {
            navigate(-1);
          }}
        >
          Ok
        </Button>
      </Modal>
      <Modal
        open={quitModal}
        onOpenChange={setQuitModal}
        confirmText={'Quit'}
        cancelText={'Cancel'}
        className={'w-[359px] rounded-[24px]'}
        footerClassName={'flex-row gap-2 mt-0'}
        confirmButtonProps={{
          variant: 'primary',
          className: 'flex-1'
        }}
        cancelButtonProps={{
          className: 'flex-1'
        }}
        onConfirm={() => {
          navigate(-1);
        }}
        onCancel={() => {
          setQuitModal(false);
        }}
      >
        <div>
          <img src={chestImg} className={'mx-auto w-[55px]'} alt="" />
        </div>
        <div className={'mt-4 text-center'}>
          <div className={'text-xl font-semibold text-black'}>Are you sure to quit?</div>
          <div className={'mt-2 font-normal text-md text-gray-600'}>
            You’ve won {data?.pointsByQuiz} pt, but you can always come back at anytime
          </div>
        </div>
      </Modal>
    </div>
  );
}
