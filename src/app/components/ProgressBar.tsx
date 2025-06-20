'use client';

import { FC, useEffect, useState } from 'react';

interface ProgressBarProps {
  progress?: number; // progress value from 0 to 100
}

// Component to display a progress bar based on the current progress value
const ProgressBar: FC<ProgressBarProps> = ({ progress = 0 }) => {
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    if (progress > 0 && progress < 100) {
      setVisible(true);
    } else if (progress >= 100) {
      const timer = setTimeout(() => setVisible(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [progress]);

  if (!visible) return null;

  return (
    <div className="w-full bg-gray-200 rounded h-3 overflow-hidden">
      <div
        className="h-full bg-blue-500 transition-all duration-300 ease-in-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default ProgressBar;