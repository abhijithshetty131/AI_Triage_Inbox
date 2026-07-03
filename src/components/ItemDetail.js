import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef, useCallback } from 'react';
import { formatDate } from '../utils/date';
import AIAssistPanel from './AIAssistPanel';
const ItemDetail = ({ item, onUpdateItem, debugMode }) => {
    const [editingNotes, setEditingNotes] = useState(false);
    const [notes, setNotes] = useState(item.notes || '');
    const notesRef = useRef(null);
    const priorityColors = {
        P1: 'bg-red-100 text-red-800 border-red-300',
        P2: 'bg-orange-100 text-orange-800 border-orange-300',
        P3: 'bg-green-100 text-green-800 border-green-300',
    };
    const statusColors = {
        New: 'bg-blue-100 text-blue-800 border-blue-300',
        'In Progress': 'bg-amber-100 text-amber-800 border-amber-300',
        Done: 'bg-gray-100 text-gray-800 border-gray-300',
    };
    // Handle notes blur
    const handleNotesBlur = useCallback(() => {
        if (notes !== item.notes) {
            onUpdateItem({ ...item, notes });
        }
        setEditingNotes(false);
    }, [notes, item, onUpdateItem]);
    // Focus notes textarea when editing starts
    useEffect(() => {
        if (editingNotes && notesRef.current) {
            notesRef.current.focus();
        }
    }, [editingNotes]);
    return (_jsxs("div", { className: "flex-1 flex flex-col bg-white overflow-hidden min-h-0", children: [_jsxs("div", { className: "border-b border-gray-200 p-6 space-y-4", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900", children: item.subject }), _jsxs("p", { className: "text-sm text-gray-500 mt-1", children: ["From: ", item.sender.name, " (", item.sender.email, ")"] })] }), _jsxs("div", { className: "flex items-center gap-3 flex-wrap", children: [_jsxs("div", { children: [_jsx("label", { className: "text-xs font-medium text-gray-600 block mb-1", children: "Status" }), _jsxs("select", { value: item.status, onChange: (e) => onUpdateItem({ ...item, status: e.target.value }), className: `px-3 py-1 rounded border font-medium text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 ${statusColors[item.status]}`, children: [_jsx("option", { value: "New", children: "New" }), _jsx("option", { value: "In Progress", children: "In Progress" }), _jsx("option", { value: "Done", children: "Done" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs font-medium text-gray-600 block mb-1", children: "Priority" }), _jsxs("select", { value: item.priority, onChange: (e) => onUpdateItem({ ...item, priority: e.target.value }), className: `px-3 py-1 rounded border font-medium text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 ${priorityColors[item.priority]}`, children: [_jsx("option", { value: "P1", children: "P1" }), _jsx("option", { value: "P2", children: "P2" }), _jsx("option", { value: "P3", children: "P3" })] })] }), _jsx("div", { className: "flex items-end gap-2", children: _jsxs("div", { children: [_jsx("label", { className: "text-xs font-medium text-gray-600 block mb-1", children: "Channel" }), _jsx("span", { className: "px-3 py-1 bg-gray-100 border border-gray-300 rounded text-sm capitalize", children: item.channel })] }) }), _jsx("div", { className: "flex items-end gap-2 ml-auto", children: _jsxs("div", { children: [_jsx("label", { className: "text-xs font-medium text-gray-600 block mb-1", children: "Received" }), _jsx("span", { className: "text-sm text-gray-600", children: formatDate(item.received_at) })] }) })] })] }), _jsx("div", { className: "flex-1 overflow-y-auto", children: _jsxs("div", { className: "p-6 space-y-6", children: [_jsxs("div", { className: "bg-gray-50 border border-gray-200 rounded-lg p-4", children: [_jsx("h3", { className: "text-sm font-semibold text-gray-900 mb-3", children: "Message" }), _jsx("div", { className: "prose prose-sm max-w-none", children: _jsx("p", { className: "text-sm text-gray-700 whitespace-pre-wrap break-words", children: item.body }) })] }), _jsxs("div", { className: "bg-gray-50 border border-gray-200 rounded-lg p-4", children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsx("h3", { className: "text-sm font-semibold text-gray-900", children: "Internal Notes" }), !editingNotes && (_jsx("button", { onClick: () => setEditingNotes(true), className: "text-xs text-blue-600 hover:text-blue-700 font-medium", children: "Edit" }))] }), editingNotes ? (_jsx("textarea", { ref: notesRef, value: notes, onChange: (e) => setNotes(e.target.value), onBlur: handleNotesBlur, placeholder: "Add internal notes...", className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none", rows: 4 })) : (_jsx("p", { className: "text-sm text-gray-600", children: notes || _jsx("span", { className: "text-gray-400 italic", children: "No notes yet" }) }))] }), _jsx("div", { children: _jsx(AIAssistPanel, { item: item, debugMode: debugMode }) })] }) })] }));
};
export default ItemDetail;
//# sourceMappingURL=ItemDetail.js.map