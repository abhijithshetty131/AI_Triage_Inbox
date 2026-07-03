import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const DebugPanel = ({ items }) => {
    return (_jsxs("div", { className: "bg-gray-900 border-t border-gray-700 px-6 py-4 max-h-32 overflow-y-auto", children: [_jsx("p", { className: "text-xs font-mono text-gray-300 mb-2", children: "\uD83D\uDCCA Debug Info" }), _jsx("pre", { className: "text-xs text-gray-400 font-mono overflow-x-auto", children: JSON.stringify({
                    total_items: items.length,
                    statuses: items.reduce((acc, item) => {
                        acc[item.status] = (acc[item.status] || 0) + 1;
                        return acc;
                    }, {}),
                    priorities: items.reduce((acc, item) => {
                        acc[item.priority] = (acc[item.priority] || 0) + 1;
                        return acc;
                    }, {}),
                    channels: items.reduce((acc, item) => {
                        acc[item.channel] = (acc[item.channel] || 0) + 1;
                        return acc;
                    }, {}),
                }, null, 2) })] }));
};
export default DebugPanel;
//# sourceMappingURL=DebugPanel.js.map