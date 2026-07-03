import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { formatDate } from '../utils/date';
const InboxListItem = ({ item, isSelected, isSelectedCheckbox, onSelect, onToggleSelect, }) => {
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
    return (_jsx("button", { onClick: onSelect, className: `w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-l-4 ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-transparent'} focus:outline-none focus:bg-blue-50`, role: "option", "aria-selected": isSelected, children: _jsxs("div", { className: "flex flex-col gap-3 sm:flex-row sm:items-start", children: [_jsx("input", { type: "checkbox", checked: isSelectedCheckbox, onChange: (e) => onToggleSelect(e), onClick: (e) => e.stopPropagation(), className: "mt-1 cursor-pointer flex-shrink-0", "aria-label": "Select item" }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between", children: [_jsxs("div", { className: "min-w-0", children: [_jsx("p", { className: "text-sm font-medium text-gray-900 truncate", children: item.sender.name }), _jsx("p", { className: `text-xs ${statusColors[item.status]}`, children: item.status })] }), _jsx("span", { className: `px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap ${priorityColors[item.priority]}`, children: item.priority })] }), _jsx("p", { className: "text-sm text-gray-700 mt-1 truncate", children: item.subject }), _jsxs("div", { className: "flex flex-col gap-2 mt-2 sm:flex-row sm:items-center sm:justify-between", children: [_jsx("p", { className: "text-xs text-gray-500", children: formatDate(item.received_at) }), _jsxs("div", { className: "flex flex-wrap gap-1", children: [item.tags.slice(0, 2).map((tag) => (_jsx("span", { className: "px-1.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded truncate", children: tag }, tag))), item.tags.length > 2 && (_jsxs("span", { className: "px-1.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded", children: ["+", item.tags.length - 2] }))] })] })] })] }) }));
};
export default InboxListItem;
//# sourceMappingURL=InboxListItem.js.map