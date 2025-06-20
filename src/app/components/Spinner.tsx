'use client';

import { FC, ReactNode } from 'react';

interface SpinnerProps {
    children?: ReactNode;
  }

const Spinner: FC<SpinnerProps> = ({ children }) => {
  return (
    <div className="flex justify-center items-center py-6">
      <svg
        className="w-24 h-24 animate-spinner"
        viewBox="25 25 50 50"
        fill="none"
        role="status"
      >
        <circle
          className="spinner-path"
          cx="50"
          cy="50"
          r="20"
          fill="none"
          strokeWidth="5"
        />
      </svg>

      {/* Central overlay with timer */}
      {children && (
        <div className="absolute text-sm font-medium text-blue-700">
          {children}
        </div>
      )}

      <style jsx>{`
        .animate-spinner {
          animation: rotate 2s linear infinite;
        }

        .spinner-path {
          stroke: #4285F4;
          stroke-linecap: round;
          animation: dash 1.5s ease-in-out infinite, colors 6s ease-in-out infinite;
        }

        @keyframes rotate {
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes dash {
          0% {
            stroke-dasharray: 1, 150;
            stroke-dashoffset: 0;
          }
          50% {
            stroke-dasharray: 90, 150;
            stroke-dashoffset: -35;
          }
          100% {
            stroke-dasharray: 90, 150;
            stroke-dashoffset: -124;
          }
        }

        @keyframes colors {
          0% {
            stroke: #4285F4; /* blue */
          }
          25% {
            stroke: #EA4335; /* red */
          }
          50% {
            stroke: #FBBC05; /* yellow */
          }
          75% {
            stroke: #34A853; /* green */
          }
          100% {
            stroke: #4285F4;
          }
        }
      `}</style>
    </div>
  );
};

export default Spinner;