import React from 'react';

interface StatProps {
  label: string;
  value: string | number;
}

export const EventStatCard = ({ label, value }: StatProps) => {
  return (
    <div className="w-45 h-45 bg-white border border-gray-200 rounded-[28px] p-6 flex flex-col justify-between shrink-0">
      <div className="flex justify-end">
        <span className="text-[52px] font-light text-gray-900 leading-none">
          {value}
        </span>
      </div>
      <div className="flex justify-center">
        <span className="text-[15px] font-normal text-gray-400">
          {label}
        </span>
      </div>
    </div>
  );
};