import React, { useState, useEffect, useRef, useCallback } from 'react';
import { TriageItem, AIAssistState } from '../types';
import { generateAIResponse, clearAICache } from '../services/aiService';

interface AIAssistPanelProps {
  item: TriageItem;
  debugMode: boolean;
}

const AIAssistPanel: React.FC<AIAssistPanelProps> = ({ item, debugMode: _debugMode }) => {
  const [state, setState] = useState<AIAssistState>({
    loading: false,
    error: null,
    data: null,
    generatingReply: false,
  });

  const [draftReply, setDraftReply] = useState('');
  const [editingReply, setEditingReply] = useState(false);
  const controllerRef = useRef<AbortController | null>(null);
  const replyRef = useRef<HTMLTextAreaElement>(null);

  const startAIRequest = useCallback(
    (currentItem: TriageItem) => {
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
          if (controller.signal.aborted) return;
          setState((prev) => ({
            ...prev,
            loading: false,
            data: response,
          }));
          setDraftReply((current) => current || response.draft_reply);
        })
        .catch((error) => {
          if (controller.signal.aborted) return;
          setState((prev) => ({
            ...prev,
            loading: false,
            error: error.message || 'Failed to generate AI response',
          }));
        });
    },
    []
  );

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

  const handleReplyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDraftReply(e.target.value);
  };

  const handleReplyBlur = () => {
    setEditingReply(false);
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(draftReply);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="border-b border-gray-200 bg-slate-50 p-4">
        <h3 className="text-sm font-semibold text-gray-900">AI Assist Panel</h3>
        <p className="text-xs text-gray-500 mt-1">Human-in-the-loop triage support</p>
      </div>

      <div className="p-4 space-y-4">
        {/* Loading State */}
        {state.loading && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <div className="inline-block animate-spin">⚙️</div>
            <p className="text-sm text-blue-800 mt-2">Analyzing message...</p>
          </div>
        )}

        {/* Error State */}
        {state.error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm font-medium text-red-900">Error</p>
            <p className="text-sm text-red-700 mt-1">{state.error}</p>
            <button
              onClick={handleRetry}
              className="mt-3 w-full px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty State */}
        {!state.loading && !state.error && !state.data && (
          <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-6 text-center">
            <p className="text-sm font-medium text-gray-700">No AI suggestions yet</p>
            <p className="text-sm text-gray-500 mt-1">
              Select an inbox item to generate triage suggestions.
            </p>
          </div>
        )}

        {/* AI Data */}
        {state.data && (
          <div className="space-y-4">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="grid gap-4">
                {/* Category */}
                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase">Category</p>
                  <p className="text-lg font-bold text-gray-900 mt-1">{state.data.category}</p>
                  <p className="text-xs text-gray-500 mt-1">Billing | Claims | Endorsement | General | Urgent | Spam</p>
                </div>

                {/* Summary */}
                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase mb-2">Summary</p>
                  <ul className="space-y-1">
                    {state.data.summary_bullets.map((bullet, i) => (
                      <li key={i} className="text-sm text-gray-700 flex gap-2">
                        <span className="text-gray-400">•</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Suggested Action */}
                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase mb-2">Suggested next action</p>
                  <p className="text-sm text-gray-700">{state.data.suggested_action}</p>
                </div>

                {/* Draft Reply */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-semibold text-gray-600 uppercase">Draft reply</p>
                    <button
                      onClick={handleCopyToClipboard}
                      className="text-xs text-gray-600 hover:text-gray-900"
                      title="Copy to clipboard"
                    >
                      📋
                    </button>
                  </div>
                  {editingReply ? (
                    <textarea
                      ref={replyRef}
                      value={draftReply}
                      onChange={handleReplyChange}
                      onBlur={handleReplyBlur}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm"
                      rows={6}
                    />
                  ) : (
                    <>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap break-words mb-2">
                        {draftReply}
                      </p>
                      <button
                        onClick={() => setEditingReply(true)}
                        className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Edit
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex gap-2">
              <button
                onClick={handleRetry}
                className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Regenerate
              </button>
            </div>
          </div>
        )}

        {/* Help Text */}
        {!state.loading && !state.error && (
          <div className="text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-lg p-3">
            <p>
              💡 <strong>Human-in-the-loop:</strong> All AI output is editable. Your changes won't be
              overwritten on regeneration.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAssistPanel;
