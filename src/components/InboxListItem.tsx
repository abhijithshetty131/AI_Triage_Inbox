import React from 'react';
import { TriageItem } from '../types';
import { formatDate } from '../utils/date';

interface InboxListItemProps {
  item: TriageItem;
  isSelected: boolean;
  isSelectedCheckbox: boolean;
  onSelect: () => void;
  onToggleSelect: (e: React.MouseEvent) => void;
  'data-item'?: boolean;
}

const InboxListItem: React.FC<InboxListItemProps> = ({
  item,
  isSelected,
  isSelectedCheckbox,
  onSelect,
  onToggleSelect,
}) => {
  const priorityColors = {
    P1: 'bg-red-100 text-red-800',
    P2: 'bg-orange-100 text-orange-800',
    P3: 'bg-green-100 text-green-800',
  };

  const statusColors = {
    New: 'text-blue-600 font-semibold',
    'In Progress': 'text-amber-600 font-medium',
    Done: 'text-gray-500 line-through',
  };

  return (
    <button
      onClick={onSelect}
      className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-l-4 ${
        isSelected ? 'border-blue-500 bg-blue-50' : 'border-transparent'
      } focus:outline-none focus:bg-blue-50`}
      role="option"
      aria-selected={isSelected}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        {/* Checkbox */}
        <input
          type="checkbox"
          checked={isSelectedCheckbox}
          onChange={(e) => onToggleSelect(e as any)}
          onClick={(e) => e.stopPropagation()}
          className="mt-1 cursor-pointer flex-shrink-0"
          aria-label="Select item"
        />

        <div className="flex-1 min-w-0">
          {/* Sender and Subject */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{item.sender.name}</p>
              <p className={`text-xs ${statusColors[item.status]}`}>{item.status}</p>
            </div>
            <span className={`px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap ${priorityColors[item.priority]}`}>
              {item.priority}
            </span>
          </div>

          {/* Subject */}
          <p className="text-sm text-gray-700 mt-1 truncate">{item.subject}</p>

          {/* Meta */}
          <div className="flex flex-col gap-2 mt-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-gray-500">{formatDate(item.received_at)}</p>
            <div className="flex flex-wrap gap-1">
              {item.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded truncate"
                >
                  {tag}
                </span>
              ))}
              {item.tags.length > 2 && (
                <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                  +{item.tags.length - 2}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </button>
  );
};

export default InboxListItem;
