import React from 'react';
import { TriageItem, Status, Priority } from '../types';
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
declare const InboxList: React.FC<InboxListProps>;
export default InboxList;
//# sourceMappingURL=InboxList.d.ts.map