import { create } from 'zustand';
import { Node, Link, Note } from '../types';
import { generateMindMap } from '../utils/mindMapHelpers';

interface MindMapState {
  nodes: Node[];
  links: Link[];
  notes: Note[];
  addNote: (content: string) => void;
  updateMindMap: () => void;
  clearAll: () => void;
}

export const useMindMapStore = create<MindMapState>((set, get) => ({
  nodes: [],
  links: [],
  notes: [],

  addNote: (content: string) => {
    const newNote: Note = {
      id: Date.now().toString(),
      content,
      timestamp: Date.now(),
    };

    set((state) => ({
      notes: [...state.notes, newNote],
    }));

    get().updateMindMap();
  },

  updateMindMap: () => {
    const { notes } = get();
    const { nodes, links } = generateMindMap(notes);
    set({ nodes, links });
  },

  clearAll: () => {
    set({ nodes: [], links: [], notes: [] });
  },
}));