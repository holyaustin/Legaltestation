import { Badge, Button } from '@ethsign/ui';
import { cn } from '@ethsign/ui/dist/lib/utils';
import cls from 'classnames';

export const ButtonSelect = ({
  options,
  value,
  onChange,
  className,
  disabled
}: {
  options: { label: string; value: string | boolean; description?: string }[];
  value: string | boolean;
  onChange: (value: string | boolean) => void;
  className?: string;
  disabled?: boolean;
}) => {
  return (
    <div className={cn('flex items-center rounded-md overflow-hidden border border-gray-200', className)}>
      {options.map((option, index) => (
        <Button
          disabled={disabled}
          variant="outline"
          key={index}
          onClick={() => onChange(option.value)}
          className={`h-auto flex-1 flex-col rounded-none border-none py-2.5 text-md font-bold hover:bg-[#ECF2FF] hover:text-primary ${
            value === option.value ? 'bg-[#ECF2FF] text-primary' : 'bg-card text-black'
          }`}
        >
          <div>{option.label}</div>
          {option.description && <div className={'text-xs font-normal text-gray-500'}>{option.description}</div>}
        </Button>
      ))}
    </div>
  );
};

export interface BadgeSelectOption {
  label: string;
  value: string;
  icon?: string;
  [index: string]: unknown;
}

export const BadgeSelect = <T extends BadgeSelectOption>({
  options,
  value,
  onChange,
  className,
  badgeClassName
}: {
  options: T[];
  value?: string;
  onChange: (value: string, option: T) => void;
  className?: string;
  badgeClassName?: string;
}) => {
  return (
    <div className={cn('flex items-center gap-3 flex-wrap', className)}>
      {options.map((option) => (
        <Badge
          key={option.value}
          onClick={() => onChange(option.value, option)}
          className={cls(
            'py-1 pl-1 pr-2 min-w-[97px] rounded-[32px] cursor-pointer flex gap-2 items-center text-xs bg-card-hover hover:bg-card text-white',
            {
              'border-tangerine-400': value === option.value,
              'border-[rgba(208,213,221,0.1)]': value !== option.value,
              '!pl-3': !option.icon
            },
            badgeClassName
          )}
        >
          {option.icon && <img src={option.icon} width={18}></img>}
          {option.label}
        </Badge>
      ))}
    </div>
  );
};
