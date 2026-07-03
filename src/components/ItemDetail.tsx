import React, { useState, useEffect, useRef, useCallback } from 'react';
import { TriageItem, Status, Priority } from '../types';
import { formatDate } from '../utils/date';
import AIAssistPanel from './AIAssistPanel';

interface ItemDetailProps {
  item: TriageItem;
  onUpdateItem: (item: TriageItem) => void;
  debugMode: boolean;
}

const ItemDetail: React.FC<ItemDetailProps> = ({ item, onUpdateItem, debugMode }) => {
  const [editingNotes, setEditingNotes] = useState(false);
  const [notes, setNotes] = useState(item.notes || '');
  const notesRef = useRef<HTMLTextAreaElement>(null);

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

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-200 p-6 space-y-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{item.subject}</h2>
          <p className="text-sm text-gray-500 mt-1">
            From: {item.sender.name} ({item.sender.email})
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Status */}
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">Status</label>
            <select
              value={item.status}
              onChange={(e) => onUpdateItem({ ...item, status: e.target.value as Status })}
              className={`px-3 py-1 rounded border font-medium text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 ${statusColors[item.status]}`}
            >
              <option value="New">New</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          </div>

          {/* Priority */}
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">Priority</label>
            <select
              value={item.priority}
              onChange={(e) => onUpdateItem({ ...item, priority: e.target.value as Priority })}
              className={`px-3 py-1 rounded border font-medium text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 ${priorityColors[item.priority]}`}
            >
              <option value="P1">P1</option>
              <option value="P2">P2</option>
              <option value="P3">P3</option>
            </select>
          </div>

          {/* Channel */}
          <div className="flex items-end gap-2">
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1">Channel</label>
              <span className="px-3 py-1 bg-gray-100 border border-gray-300 rounded text-sm capitalize">
                {item.channel}
              </span>
            </div>
          </div>

          {/* Time */}
          <div className="flex items-end gap-2 ml-auto">
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1">Received</label>
              <span className="text-sm text-gray-600">{formatDate(item.received_at)}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Body and AI Panel - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Message Body */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Message</h3>
            <div className="prose prose-sm max-w-none">
              <p className="text-sm text-gray-700 whitespace-pre-wrap break-words">
                {item.body}
              </p>
            </div>
          </div>

          {/* Notes Section */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-900">Internal Notes</h3>
              {!editingNotes && (
                <button
                  onClick={() => setEditingNotes(true)}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                  Edit
                </button>
              )}
            </div>
            {editingNotes ? (
              <textarea
                ref={notesRef}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                onBlur={handleNotesBlur}
                placeholder="Add internal notes..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={4}
              />
            ) : (
              <p className="text-sm text-gray-600">
                {notes || <span className="text-gray-400 italic">No notes yet</span>}
              </p>
            )}
          </div>

          {/* AI Assist Panel */}
          <div>
            <AIAssistPanel item={item} debugMode={debugMode} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;
