import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef } from 'react';
import InboxListItem from './InboxListItem';
const InboxList = ({ items, selectedItemId, selectedItemIds, statusFilter, priorityFilter, searchQuery, sortBy, onSelectItem, onToggleSelect, onMarkSelectedDone, onSetStatusFilter, onSetPriorityFilter, onSetSearchQuery, onSetSortBy, }) => {
    const listRef = useRef(null);
    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!listRef.current)
                return;
            // Don't trigger if focused on input
            if (e.target instanceof HTMLInputElement)
                return;
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
                    const searchInput = document.querySelector('[data-search-input]');
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
    const scrollToItem = (index) => {
        if (listRef.current) {
            const items = listRef.current.querySelectorAll('[data-item]');
            if (items[index]) {
                items[index].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }
    };
    return (_jsxs("div", { className: "w-full lg:w-80 bg-white border-b border-gray-200 lg:border-b-0 lg:border-r flex flex-col min-h-0 overflow-hidden", children: [_jsxs("div", { className: "border-b border-gray-200 p-4 space-y-3", children: [_jsx("div", { children: _jsx("input", { type: "text", "data-search-input": true, placeholder: "Search (/ to focus)", value: searchQuery, onChange: (e) => onSetSearchQuery(e.target.value), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm", "aria-label": "Search items" }) }), _jsxs("div", { className: "grid gap-2 text-xs sm:grid-cols-3", children: [_jsxs("select", { value: statusFilter || '', onChange: (e) => onSetStatusFilter(e.target.value || null), className: "w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500", "aria-label": "Filter by status", children: [_jsx("option", { value: "", children: "All Status" }), _jsx("option", { value: "New", children: "New" }), _jsx("option", { value: "In Progress", children: "In Progress" }), _jsx("option", { value: "Done", children: "Done" })] }), _jsxs("select", { value: priorityFilter || '', onChange: (e) => onSetPriorityFilter(e.target.value || null), className: "flex-1 px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500", "aria-label": "Filter by priority", children: [_jsx("option", { value: "", children: "All Priority" }), _jsx("option", { value: "P1", children: "P1" }), _jsx("option", { value: "P2", children: "P2" }), _jsx("option", { value: "P3", children: "P3" })] }), _jsxs("select", { value: sortBy, onChange: (e) => onSetSortBy(e.target.value), className: "flex-1 px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500", "aria-label": "Sort by", children: [_jsx("option", { value: "received", children: "Recent" }), _jsx("option", { value: "priority", children: "Priority" }), _jsx("option", { value: "sender", children: "Sender" })] })] }), selectedItemIds.size > 0 && (_jsxs("div", { className: "flex gap-2 items-center", children: [_jsxs("span", { className: "text-xs text-gray-600", children: [selectedItemIds.size, " selected"] }), _jsx("button", { onClick: onMarkSelectedDone, className: "flex-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-lg transition-colors", "aria-label": "Mark selected as done", children: "Mark Done (D)" })] })), _jsxs("div", { className: "text-xs text-gray-500 space-y-1", children: [_jsxs("p", { className: "flex flex-wrap gap-1 items-center", children: [_jsx("kbd", { className: "px-1 py-0.5 bg-gray-100 rounded text-gray-700", children: "j" }), _jsx("span", { children: "/" }), _jsx("kbd", { className: "px-1 py-0.5 bg-gray-100 rounded text-gray-700", children: "k" }), _jsx("span", { children: "Navigate" })] }), _jsxs("p", { className: "flex flex-wrap gap-1 items-center", children: [_jsx("kbd", { className: "px-1 py-0.5 bg-gray-100 rounded text-gray-700", children: "Space" }), _jsx("span", { children: "Select" }), _jsx("kbd", { className: "px-1 py-0.5 bg-gray-100 rounded text-gray-700", children: "D" }), _jsx("span", { children: "Mark Done" })] })] })] }), _jsx("div", { ref: listRef, className: "flex-1 overflow-y-auto", children: items.length === 0 ? (_jsx("div", { className: "p-4 text-center text-gray-500", children: _jsx("p", { className: "text-sm", children: "No items found" }) })) : (_jsx("div", { className: "divide-y divide-gray-200", children: items.map((item) => (_jsx(InboxListItem, { item: item, isSelected: item.id === selectedItemId, isSelectedCheckbox: selectedItemIds.has(item.id), onSelect: () => onSelectItem(item.id), onToggleSelect: () => onToggleSelect(item.id), "data-item": true }, item.id))) })) })] }));
};
export default InboxList;
//# sourceMappingURL=InboxList.js.map