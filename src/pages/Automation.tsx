import React from 'react';
import { AutomationControl } from '@/components/automation/AutomationControl';

export const Automation = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Browser Automation</h1>
        <p className="text-muted-foreground">
          Control and monitor automated browser interactions with chat platforms
        </p>
      </div>
      
      <AutomationControl />
    </div>
  );
};