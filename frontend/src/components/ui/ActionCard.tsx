import { LucideIcon } from 'lucide-react';

interface ActionCardProps {
  title: string;
  backgroundColor: string;
  iconBgColor: string;
  Icon: LucideIcon;
  className?: string;
  onClick?: () => void;
  isClickable?: boolean;
}

export function ActionCard({
  title,
  backgroundColor,
  iconBgColor,
  Icon,
  className = '',
  onClick,
  isClickable = false,
}: ActionCardProps) {
  return (
    <div 
      className={`relative w-[180px] h-[167px] ${className} ${isClickable ? 'cursor-pointer' : ''}`}
      onClick={isClickable ? onClick : undefined}
    >
      <div 
        className="absolute left-0 top-0 w-[180px] h-[167px] rounded-[30px] shadow-lg"
        style={{ backgroundColor }}
      />
      <div className="absolute left-[18px] top-[20px] w-[126px] h-[54px] text-white text-base font-bold">
        {title}
      </div>
      <div 
        className="absolute right-[18px] bottom-[18px] w-[50px] h-[50px] rounded-full flex items-center justify-center"
        style={{ backgroundColor: `${iconBgColor}60` }}
      >
        <Icon className="text-white" size={28} />
      </div>
    </div>
  );
}