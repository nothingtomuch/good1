import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface Props {
  timeLeft: number;
  initialTime: number;
  className?: string;
  size?: number;
  strokeWidth?: number;
}

export default function CircularTimer({ 
  timeLeft, 
  initialTime, 
  className, 
  size = 60, 
  strokeWidth = 4 
}: Props) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = timeLeft / initialTime;
  const offset = circumference - progress * circumference;

  return (
    <div className={cn("relative flex items-center justify-center", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="rotate-[-90deg]">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-[#E2E8F0] opacity-20"
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.5, ease: "linear" }}
          strokeLinecap="round"
          className={cn(
            "transition-colors duration-300",
            timeLeft < 5 ? "text-red-600" : "text-[#D69E2E]"
          )}
        />
      </svg>
      <span className={cn(
        "absolute font-mono font-bold tabular-nums",
        size > 80 ? "text-2xl" : "text-sm",
        timeLeft < 5 ? "text-red-600 animate-pulse" : "text-[#1A365D]"
      )}>
        {timeLeft}
      </span>
    </div>
  );
}
