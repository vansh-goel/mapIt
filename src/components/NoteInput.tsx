import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { useMindMapStore } from '../store/mindMapStore';

export const NoteInput: React.FC = () => {
  const [note, setNote] = useState('');
  const addNote = useMindMapStore((state) => state.addNote);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (note.trim()) {
      addNote(note);
      setNote('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl">
      <div className="flex gap-2">
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Enter your notes here..."
          className="flex-1 p-4 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-32"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <PlusCircle size={20} />
          Add Note
        </button>
      </div>
    </form>
  );
};