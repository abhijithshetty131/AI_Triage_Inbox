import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useCallback, useMemo } from 'react';
import { mockData } from './data/mockData';
import InboxList from './components/InboxList';
import ItemDetail from './components/ItemDetail';
import DebugPanel from './components/DebugPanel';
function App() {
    const [state, setState] = useState({
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
            filtered = filtered.filter((item) => item.subject.toLowerCase().includes(query) ||
                item.sender.name.toLowerCase().includes(query) ||
                item.sender.email.toLowerCase().includes(query) ||
                item.body.toLowerCase().includes(query));
        }
        // Apply sorting
        const sortFn = (a, b) => {
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
    const handleSelectItem = useCallback((itemId) => {
        setState((prev) => ({
            ...prev,
            selectedItemId: itemId,
        }));
    }, []);
    const handleUpdateItem = useCallback((updatedItem) => {
        setState((prev) => ({
            ...prev,
            items: prev.items.map((item) => (item.id === updatedItem.id ? updatedItem : item)),
        }));
    }, []);
    const handleToggleSelect = useCallback((itemId) => {
        setState((prev) => {
            const newSelected = new Set(prev.selectedItemIds);
            if (newSelected.has(itemId)) {
                newSelected.delete(itemId);
            }
            else {
                newSelected.add(itemId);
            }
            return { ...prev, selectedItemIds: newSelected };
        });
    }, []);
    const handleMarkSelectedDone = useCallback(() => {
        setState((prev) => ({
            ...prev,
            items: prev.items.map((item) => prev.selectedItemIds.has(item.id) ? { ...item, status: 'Done' } : item),
            selectedItemIds: new Set(),
        }));
    }, []);
    const handleSetStatusFilter = useCallback((status) => {
        setState((prev) => ({
            ...prev,
            statusFilter: status,
        }));
    }, []);
    const handleSetPriorityFilter = useCallback((priority) => {
        setState((prev) => ({
            ...prev,
            priorityFilter: priority,
        }));
    }, []);
    const handleSetSearchQuery = useCallback((query) => {
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
    const handleSetSortBy = useCallback((sortBy) => {
        setState((prev) => ({
            ...prev,
            sortBy,
        }));
    }, []);
    return (_jsxs("div", { className: "flex flex-col min-h-screen bg-white overflow-hidden", children: [_jsx("header", { className: "bg-white border-b border-gray-200 px-4 py-4 sm:px-6 shadow-sm", children: _jsxs("div", { className: "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "AI Triage Inbox" }), _jsxs("p", { className: "text-sm text-gray-600 mt-1", children: [filteredItems.length, " items", state.selectedItemIds.size > 0 && ` • ${state.selectedItemIds.size} selected`] })] }), _jsx("button", { onClick: handleToggleDebugMode, className: "px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors", title: "Toggle debug mode", children: state.debugMode ? '🐛 Debug ON' : '🐛 Debug' })] }) }), _jsxs("div", { className: "flex flex-1 flex-col lg:flex-row overflow-hidden", children: [_jsx(InboxList, { items: filteredItems, selectedItemId: state.selectedItemId, selectedItemIds: state.selectedItemIds, statusFilter: state.statusFilter, priorityFilter: state.priorityFilter, searchQuery: state.searchQuery, sortBy: state.sortBy, onSelectItem: handleSelectItem, onToggleSelect: handleToggleSelect, onMarkSelectedDone: handleMarkSelectedDone, onSetStatusFilter: handleSetStatusFilter, onSetPriorityFilter: handleSetPriorityFilter, onSetSearchQuery: handleSetSearchQuery, onSetSortBy: handleSetSortBy }), selectedItem ? (_jsx(ItemDetail, { item: selectedItem, onUpdateItem: handleUpdateItem, debugMode: state.debugMode })) : (_jsx("div", { className: "flex-1 flex items-center justify-center bg-gray-50", children: _jsx("div", { className: "text-center", children: _jsx("p", { className: "text-gray-600 text-lg", children: "Select an item to view details" }) }) }))] }), state.debugMode && _jsx(DebugPanel, { items: state.items })] }));
}
export default App;
//# sourceMappingURL=App.js.map