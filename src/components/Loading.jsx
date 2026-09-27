import React from 'react';
import { Loader2 } from 'lucide-react';

export const Loading = ({ text = 'Loading data...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
      <p className="text-sm font-medium text-slate-600">{text}</p>
    </div>
  );
};

export default Loading;
