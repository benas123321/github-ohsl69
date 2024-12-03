import React from 'react';

interface ProgressBarProps {
  total: number;
  completed: number;
}

export function ProgressBar({ total, completed }: ProgressBarProps) {
  const percentage = (completed / total) * 100;
  
  return (
    <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden">
      <div
        className="absolute inset-0 bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 animate-gradient"
        style={{ 
          width: `${percentage}%`,
          transition: 'width 0.5s ease-in-out'
        }}
      />
    </div>
  );
}