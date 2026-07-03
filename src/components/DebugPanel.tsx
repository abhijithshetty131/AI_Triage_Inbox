import React from 'react';
import { TriageItem } from '../types';

interface DebugPanelProps {
  items: TriageItem[];
}

const DebugPanel: React.FC<DebugPanelProps> = ({ items }) => {
  return (
    <div className="bg-gray-900 border-t border-gray-700 px-6 py-4 max-h-32 overflow-y-auto">
      <p className="text-xs font-mono text-gray-300 mb-2">📊 Debug Info</p>
      <pre className="text-xs text-gray-400 font-mono overflow-x-auto">
        {JSON.stringify(
          {
            total_items: items.length,
            statuses: items.reduce(
              (acc, item) => {
                acc[item.status] = (acc[item.status] || 0) + 1;
                return acc;
              },
              {} as Record<string, number>
            ),
            priorities: items.reduce(
              (acc, item) => {
                acc[item.priority] = (acc[item.priority] || 0) + 1;
                return acc;
              },
              {} as Record<string, number>
            ),
            channels: items.reduce(
              (acc, item) => {
                acc[item.channel] = (acc[item.channel] || 0) + 1;
                return acc;
              },
              {} as Record<string, number>
            ),
          },
          null,
          2
        )}
      </pre>
    </div>
  );
};

export default DebugPanel;
