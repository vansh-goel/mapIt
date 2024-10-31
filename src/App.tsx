import React from 'react';
import { Brain } from 'lucide-react';
import { NoteInput } from './components/NoteInput';
import { MindMapVisualization } from './components/MindMapVisualization';
import { NotesList } from './components/NotesList';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Brain className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Mind Map Generator</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <section className="flex justify-center">
            <NoteInput />
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-8">
              <NotesList />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-4">Mind Map Visualization</h2>
              <MindMapVisualization />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;