import { useState, useCallback, useMemo } from 'react';
import { TriageItem, Status, Priority } from './types';
import { mockData } from './data/mockData';
import InboxList from './components/InboxList';
import ItemDetail from './components/ItemDetail';
import DebugPanel from './components/DebugPanel';

type SortField = 'received' | 'priority' | 'sender';

interface AppState {
  items: TriageItem[];
  selectedItemId: string | null;
  statusFilter: Status | null;
  priorityFilter: Priority | null;
  searchQuery: string;
  selectedItemIds: Set<string>;
  debugMode: boolean;
  sortBy: SortField;
}

function App() {
  const [state, setState] = useState<AppState>({
    items: mockData,
    selectedItemId: mockData[0]?.id || null,
    statusFilter: null,
    priorityFilter: null,
    searchQuery: '',
    selectedItemIds: new Set(),
    debugMode: false,
    sortBy: 'received',
  });

  // Filter and sort items
  const filteredItems = useMemo(() => {
    let filtered = state.items;

    // Apply filters
    if (state.statusFilter) {
      filtered = filtered.filter((item) => item.status === state.statusFilter);
    }

    if (state.priorityFilter) {
      filtered = filtered.filter((item) => item.priority === state.priorityFilter);
    }

    if (state.searchQuery) {
      const query = state.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.subject.toLowerCase().includes(query) ||
          item.sender.name.toLowerCase().includes(query) ||
          item.sender.email.toLowerCase().includes(query) ||
          item.body.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    const sortFn = (a: TriageItem, b: TriageItem) => {
      switch (state.sortBy) {
        case 'priority':
          const priorityOrder = { P1: 0, P2: 1, P3: 2 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        case 'sender':
          return a.sender.name.localeCompare(b.sender.name);
        case 'received':
        default:
          return new Date(b.received_at).getTime() - new Date(a.received_at).getTime();
      }
    };

    return [...filtered].sort(sortFn);
  }, [state.items, state.statusFilter, state.priorityFilter, state.searchQuery, state.sortBy]);

  const selectedItem = state.items.find((item) => item.id === state.selectedItemId);

  const handleSelectItem = useCallback((itemId: string) => {
    setState((prev) => ({
      ...prev,
      selectedItemId: itemId,
    }));
  }, []);

  const handleUpdateItem = useCallback((updatedItem: TriageItem) => {
    setState((prev) => ({
      ...prev,
      items: prev.items.map((item) => (item.id === updatedItem.id ? updatedItem : item)),
    }));
  }, []);

  const handleToggleSelect = useCallback((itemId: string) => {
    setState((prev) => {
      const newSelected = new Set(prev.selectedItemIds);
      if (newSelected.has(itemId)) {
        newSelected.delete(itemId);
      } else {
        newSelected.add(itemId);
      }
      return { ...prev, selectedItemIds: newSelected };
    });
  }, []);

  const handleMarkSelectedDone = useCallback(() => {
    setState((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        prev.selectedItemIds.has(item.id) ? { ...item, status: 'Done' as const } : item
      ),
      selectedItemIds: new Set(),
    }));
  }, []);

  const handleSetStatusFilter = useCallback((status: Status | null) => {
    setState((prev) => ({
      ...prev,
      statusFilter: status,
    }));
  }, []);

  const handleSetPriorityFilter = useCallback((priority: Priority | null) => {
    setState((prev) => ({
      ...prev,
      priorityFilter: priority,
    }));
  }, []);

  const handleSetSearchQuery = useCallback((query: string) => {
    setState((prev) => ({
      ...prev,
      searchQuery: query,
    }));
  }, []);

  const handleToggleDebugMode = useCallback(() => {
    setState((prev) => ({
      ...prev,
      debugMode: !prev.debugMode,
    }));
  }, []);

  const handleSetSortBy = useCallback((sortBy: SortField) => {
    setState((prev) => ({
      ...prev,
      sortBy,
    }));
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-4 sm:px-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">AI Triage Inbox</h1>
            <p className="text-sm text-gray-600 mt-1">
              {filteredItems.length} items
              {state.selectedItemIds.size > 0 && ` • ${state.selectedItemIds.size} selected`}
            </p>
          </div>
          <button
            onClick={handleToggleDebugMode}
            className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            title="Toggle debug mode"
          >
            {state.debugMode ? '🐛 Debug ON' : '🐛 Debug'}
          </button>
        </div>
      </header>

      <div className="flex flex-1 flex-col lg:flex-row overflow-hidden">
        {/* Inbox List */}
        <InboxList
          items={filteredItems}
          selectedItemId={state.selectedItemId}
          selectedItemIds={state.selectedItemIds}
          statusFilter={state.statusFilter}
          priorityFilter={state.priorityFilter}
          searchQuery={state.searchQuery}
          sortBy={state.sortBy}
          onSelectItem={handleSelectItem}
          onToggleSelect={handleToggleSelect}
          onMarkSelectedDone={handleMarkSelectedDone}
          onSetStatusFilter={handleSetStatusFilter}
          onSetPriorityFilter={handleSetPriorityFilter}
          onSetSearchQuery={handleSetSearchQuery}
          onSetSortBy={handleSetSortBy}
        />

        {/* Detail View */}
        {selectedItem ? (
          <ItemDetail
            item={selectedItem}
            onUpdateItem={handleUpdateItem}
            debugMode={state.debugMode}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <p className="text-gray-600 text-lg">Select an item to view details</p>
            </div>
          </div>
        )}
      </div>

      {/* Debug Panel */}
      {state.debugMode && <DebugPanel items={state.items} />}
    </div>
  );
}

export default App;
