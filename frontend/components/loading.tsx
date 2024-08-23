import React from 'react';
import { Loader2 } from 'lucide-react';

const Loading: React.FC = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-50">
      <div className="p-4 rounded-md shadow-md flex items-center space-x-2">
        <Loader2 className="h-5 w-5 animate-spin text-foreground" />
        <span className="text-sm font-medium text-foreground">Loading</span>
      </div>
    </div>
  );
};

export default Loading;
