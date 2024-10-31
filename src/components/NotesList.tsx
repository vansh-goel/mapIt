import React from 'react';
import { Trash2 } from 'lucide-react';
import { useMindMapStore } from '../store/mindMapStore';

export const NotesList: React.FC = () => {
  const notes = useMindMapStore((state) => state.notes);
  const clearAll = useMindMapStore((state) => state.clearAll);

  return (
    <div className="w-full max-w-2xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Your Notes</h2>
        {notes.length > 0 && (
          <button
            onClick={clearAll}
            className="text-red-600 hover:text-red-700 flex items-center gap-2"
          >
            <Trash2 size={20} />
            Clear All
          </button>
        )}
      </div>
      <div className="space-y-4">
        {notes.map((note) => (
          <div
            key={note.id}
            className="p-4 bg-white rounded-lg shadow border border-gray-100"
          >
            <p className="text-gray-700">{note.content}</p>
            <span className="text-sm text-gray-400">
              {new Date(note.timestamp).toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};