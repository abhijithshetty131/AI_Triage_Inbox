import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect, useRef, useCallback } from 'react';
import { generateAIResponse, clearAICache } from '../services/aiService';
const AIAssistPanel = ({ item, debugMode: _debugMode }) => {
    const [state, setState] = useState({
        loading: false,
        error: null,
        data: null,
        generatingReply: false,
    });
    const [draftReply, setDraftReply] = useState('');
    const [editingReply, setEditingReply] = useState(false);
    const controllerRef = useRef(null);
    const replyRef = useRef(null);
    const startAIRequest = useCallback((currentItem) => {
        controllerRef.current?.abort();
        const controller = new AbortController();
        controllerRef.current = controller;
        setState({
            loading: true,
            error: null,
            data: null,
            generatingReply: false,
        });
        setDraftReply('');
        setEditingReply(false);
        generateAIResponse(currentItem, {
            signal: controller.signal,
            onPartialReply: (chunk) => {
                if (!controller.signal.aborted) {
                    setDraftReply((prev) => prev + chunk);
                }
            },
        })
            .then((response) => {
            if (controller.signal.aborted)
                return;
            setState((prev) => ({
                ...prev,
                loading: false,
                data: response,
            }));
            setDraftReply((current) => current || response.draft_reply);
        })
            .catch((error) => {
            if (controller.signal.aborted)
                return;
            setState((prev) => ({
                ...prev,
                loading: false,
                error: error.message || 'Failed to generate AI response',
            }));
        });
    }, []);
    useEffect(() => {
        startAIRequest(item);
        return () => {
            controllerRef.current?.abort();
        };
    }, [item, startAIRequest]);
    const handleRetry = useCallback(() => {
        clearAICache(item.id);
        startAIRequest(item);
    }, [item, startAIRequest]);
    const handleReplyChange = (e) => {
        setDraftReply(e.target.value);
    };
    const handleReplyBlur = () => {
        setEditingReply(false);
    };
    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(draftReply);
    };
    return (_jsxs("div", { className: "bg-white border border-gray-200 rounded-lg overflow-hidden", children: [_jsxs("div", { className: "border-b border-gray-200 bg-slate-50 p-4", children: [_jsx("h3", { className: "text-sm font-semibold text-gray-900", children: "AI Assist Panel" }), _jsx("p", { className: "text-xs text-gray-500 mt-1", children: "Human-in-the-loop triage support" })] }), _jsxs("div", { className: "p-4 space-y-4", children: [state.loading && (_jsxs("div", { className: "bg-blue-50 border border-blue-200 rounded-lg p-4 text-center", children: [_jsx("div", { className: "inline-block animate-spin", children: "\u2699\uFE0F" }), _jsx("p", { className: "text-sm text-blue-800 mt-2", children: "Analyzing message..." })] })), state.error && (_jsxs("div", { className: "bg-red-50 border border-red-200 rounded-lg p-4", children: [_jsx("p", { className: "text-sm font-medium text-red-900", children: "Error" }), _jsx("p", { className: "text-sm text-red-700 mt-1", children: state.error }), _jsx("button", { onClick: handleRetry, className: "mt-3 w-full px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded transition-colors", children: "Retry" })] })), !state.loading && !state.error && !state.data && (_jsxs("div", { className: "bg-gray-50 border border-dashed border-gray-300 rounded-lg p-6 text-center", children: [_jsx("p", { className: "text-sm font-medium text-gray-700", children: "No AI suggestions yet" }), _jsx("p", { className: "text-sm text-gray-500 mt-1", children: "Select an inbox item to generate triage suggestions." })] })), state.data && (_jsxs("div", { className: "space-y-4", children: [_jsx("div", { className: "bg-white border border-gray-200 rounded-lg p-4", children: _jsxs("div", { className: "grid gap-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs font-semibold text-gray-600 uppercase", children: "Category" }), _jsx("p", { className: "text-lg font-bold text-gray-900 mt-1", children: state.data.category }), _jsx("p", { className: "text-xs text-gray-500 mt-1", children: "Billing | Claims | Endorsement | General | Urgent | Spam" })] }), _jsxs("div", { children: [_jsx("p", { className: "text-xs font-semibold text-gray-600 uppercase mb-2", children: "Summary" }), _jsx("ul", { className: "space-y-1", children: state.data.summary_bullets.map((bullet, i) => (_jsxs("li", { className: "text-sm text-gray-700 flex gap-2", children: [_jsx("span", { className: "text-gray-400", children: "\u2022" }), _jsx("span", { children: bullet })] }, i))) })] }), _jsxs("div", { children: [_jsx("p", { className: "text-xs font-semibold text-gray-600 uppercase mb-2", children: "Suggested next action" }), _jsx("p", { className: "text-sm text-gray-700", children: state.data.suggested_action })] }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("p", { className: "text-xs font-semibold text-gray-600 uppercase", children: "Draft reply" }), _jsx("button", { onClick: handleCopyToClipboard, className: "text-xs text-gray-600 hover:text-gray-900", title: "Copy to clipboard", children: "\uD83D\uDCCB" })] }), editingReply ? (_jsx("textarea", { ref: replyRef, value: draftReply, onChange: handleReplyChange, onBlur: handleReplyBlur, className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm", rows: 6 })) : (_jsxs(_Fragment, { children: [_jsx("p", { className: "text-sm text-gray-700 whitespace-pre-wrap break-words mb-2", children: draftReply }), _jsx("button", { onClick: () => setEditingReply(true), className: "text-xs text-blue-600 hover:text-blue-700 font-medium", children: "Edit" })] }))] })] }) }), _jsx("div", { className: "flex gap-2", children: _jsx("button", { onClick: handleRetry, className: "flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors", children: "Regenerate" }) })] })), !state.loading && !state.error && (_jsx("div", { className: "text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-lg p-3", children: _jsxs("p", { children: ["\uD83D\uDCA1 ", _jsx("strong", { children: "Human-in-the-loop:" }), " All AI output is editable. Your changes won't be overwritten on regeneration."] }) }))] })] }));
};
export default AIAssistPanel;
//# sourceMappingURL=AIAssistPanel.js.map