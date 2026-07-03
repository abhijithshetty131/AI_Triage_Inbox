import React, { useEffect, useRef } from 'react';
import { TriageItem, Status, Priority } from '../types';
import InboxListItem from './InboxListItem';

interface InboxListProps {
  items: TriageItem[];
  selectedItemId: string | null;
  selectedItemIds: Set<string>;
  statusFilter: Status | null;
  priorityFilter: Priority | null;
  searchQuery: string;
  sortBy: 'received' | 'priority' | 'sender';
  onSelectItem: (itemId: string) => void;
  onToggleSelect: (itemId: string) => void;
  onMarkSelectedDone: () => void;
  onSetStatusFilter: (status: Status | null) => void;
  onSetPriorityFilter: (priority: Priority | null) => void;
  onSetSearchQuery: (query: string) => void;
  onSetSortBy: (sortBy: 'received' | 'priority' | 'sender') => void;
}

const InboxList: React.FC<InboxListProps> = ({
  items,
  selectedItemId,
  selectedItemIds,
  statusFilter,
  priorityFilter,
  searchQuery,
  sortBy,
  onSelectItem,
  onToggleSelect,
  onMarkSelectedDone,
  onSetStatusFilter,
  onSetPriorityFilter,
  onSetSearchQuery,
  onSetSortBy,
}) => {
  const listRef = useRef<HTMLDivElement>(null);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!listRef.current) return;

      // Don't trigger if focused on input
      if (e.target instanceof HTMLInputElement) return;

      const currentIndex = items.findIndex((item) => item.id === selectedItemId);

      switch (e.key) {
        case 'j':
          e.preventDefault();
          const nextIndex = Math.min(currentIndex + 1, items.length - 1);
          if (nextIndex >= 0 && nextIndex < items.length) {
            onSelectItem(items[nextIndex].id);
            scrollToItem(nextIndex);
          }
          break;

        case 'k':
          e.preventDefault();
          const prevIndex = Math.max(currentIndex - 1, 0);
          if (prevIndex >= 0 && prevIndex < items.length) {
            onSelectItem(items[prevIndex].id);
            scrollToItem(prevIndex);
          }
          break;

        case 'Enter':
          if (currentIndex >= 0) {
            e.preventDefault();
            // Open detail view (already selected)
          }
          break;

        case ' ':
          if (currentIndex >= 0) {
            e.preventDefault();
            onToggleSelect(items[currentIndex].id);
          }
          break;

        case 'd':
          if (selectedItemIds.size > 0) {
            e.preventDefault();
            onMarkSelectedDone();
          }
          break;

        case '/':
          e.preventDefault();
          const searchInput = document.querySelector('[data-search-input]') as HTMLInputElement;
          if (searchInput) {
            searchInput.focus();
          }
          break;

        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [items, selectedItemId, selectedItemIds, onSelectItem, onToggleSelect, onMarkSelectedDone]);

  const scrollToItem = (index: number) => {
    if (listRef.current) {
      const items = listRef.current.querySelectorAll('[data-item]');
      if (items[index]) {
        items[index].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  };

  return (
    <div className="w-full lg:w-80 bg-white border-b border-gray-200 lg:border-b-0 lg:border-r flex flex-col min-h-0 overflow-hidden">
      {/* Search and Filters */}
      <div className="border-b border-gray-200 p-4 space-y-3">
        {/* Search */}
        <div>
          <input
            type="text"
            data-search-input
            placeholder="Search (/ to focus)"
            value={searchQuery}
            onChange={(e) => onSetSearchQuery(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            aria-label="Search items"
          />
        </div>

        {/* Filter and Sort Controls */}
        <div className="grid gap-2 text-xs sm:grid-cols-3">
          {/* Status Filter */}
          <select
            value={statusFilter || ''}
            onChange={(e) => onSetStatusFilter((e.target.value as Status) || null)}
            className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Filter by status"
          >
            <option value="">All Status</option>
            <option value="New">New</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter || ''}
            onChange={(e) => onSetPriorityFilter((e.target.value as Priority) || null)}
            className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Filter by priority"
          >
            <option value="">All Priority</option>
            <option value="P1">P1</option>
            <option value="P2">P2</option>
            <option value="P3">P3</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => onSetSortBy(e.target.value as any)}
            className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Sort by"
          >
            <option value="received">Recent</option>
            <option value="priority">Priority</option>
            <option value="sender">Sender</option>
          </select>
        </div>

        {/* Bulk Actions */}
        {selectedItemIds.size > 0 && (
          <div className="flex gap-2 items-center">
            <span className="text-xs text-gray-600">{selectedItemIds.size} selected</span>
            <button
              onClick={onMarkSelectedDone}
              className="flex-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-lg transition-colors"
              aria-label="Mark selected as done"
            >
              Mark Done (D)
            </button>
          </div>
        )}

        {/* Help Text */}
        <div className="text-xs text-gray-500 space-y-1">
          <p className="flex flex-wrap gap-1 items-center">
            <kbd className="px-1 py-0.5 bg-gray-100 rounded text-gray-700">j</kbd>
            <span>/</span>
            <kbd className="px-1 py-0.5 bg-gray-100 rounded text-gray-700">k</kbd>
            <span>Navigate</span>
          </p>
          <p className="flex flex-wrap gap-1 items-center">
            <kbd className="px-1 py-0.5 bg-gray-100 rounded text-gray-700">Space</kbd>
            <span>Select</span>
            <kbd className="px-1 py-0.5 bg-gray-100 rounded text-gray-700">D</kbd>
            <span>Mark Done</span>
          </p>
        </div>
      </div>

      {/* Items List */}
      <div ref={listRef} className="flex-1 overflow-y-auto">
        {items.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <p className="text-sm">No items found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {items.map((item) => (
              <InboxListItem
                key={item.id}
                item={item}
                isSelected={item.id === selectedItemId}
                isSelectedCheckbox={selectedItemIds.has(item.id)}
                onSelect={() => onSelectItem(item.id)}
                onToggleSelect={() => onToggleSelect(item.id)}
                data-item
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InboxList;
