import { LucideIcon } from 'lucide-react';

interface ActionCardProps {
  title: string;
  backgroundColor: string;
  iconBgColor: string;
  Icon: LucideIcon;
  className?: string;
}

export function ActionCard({
  title,
  backgroundColor,
  iconBgColor,
  Icon,
  className = '',
}: ActionCardProps) {
  return (
    <div className={`relative w-[180px] h-[167px] ${className}`}>
      <div 
        className="absolute left-0 top-0 w-[180px] h-[167px] rounded-[30px] shadow-lg"
        style={{ backgroundColor }}
      />
      <div className="absolute left-[18px] top-[20px] w-[126px] h-[54px] text-white text-base font-bold">
        {title}
      </div>
      <div 
        className="absolute left-[117px] top-[104px] w-[45px] h-11 rounded-full"
        style={{ backgroundColor: `${iconBgColor}60` }}
      />
      <div className="absolute left-[158.50px] top-[144px] w-[37px] h-[37px] origin-top-left rotate-[179.22deg] overflow-hidden">
        <Icon className="text-white" size={37} />
      </div>
    </div>
  );
}