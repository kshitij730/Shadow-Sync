import React, { useState } from 'react';
import { Send, Mic, Radio, Zap } from 'lucide-react';

interface IngestControlProps {
  onIngest: (text: string) => void;
  isProcessing: boolean;
}

const IngestControl: React.FC<IngestControlProps> = ({ onIngest, isProcessing }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isProcessing) {
      onIngest(input);
      setInput('');
    }
  };

  return (
    <div className="bg-shadow-800 border-t border-shadow-600 p-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-xs text-neon-blue font-mono font-bold flex items-center gap-2">
            <Radio size={12} className="animate-pulse" />
            CONTEXT_CAPTURE_LAYER
          </label>
          {isProcessing && (
            <span className="text-xs text-neon-purple font-mono animate-pulse flex items-center gap-1">
              <Zap size={10} /> PROCESSING STREAM...
            </span>
          )}
        </div>
        <div className="relative group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isProcessing}
            placeholder="Enter a thought, memory, task, or fact to sync..."
            className="w-full bg-shadow-900 text-white p-4 pr-24 rounded border border-shadow-600 focus:border-neon-blue focus:outline-none focus:ring-1 focus:ring-neon-blue/50 font-mono text-sm transition-all"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <button 
              type="button" 
              className="p-2 hover:bg-shadow-700 rounded-full text-gray-400 hover:text-white transition-colors"
              title="Voice Input (Simulated)"
            >
              <Mic size={18} />
            </button>
            <button 
              type="submit"
              disabled={!input.trim() || isProcessing}
              className={`p-2 rounded-full transition-colors flex items-center justify-center ${
                input.trim() && !isProcessing 
                  ? 'bg-neon-blue text-shadow-900 hover:bg-white' 
                  : 'bg-shadow-700 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
        <div className="flex gap-2 text-[10px] text-gray-500 font-mono">
          <span>Sources:</span>
          <span className="text-gray-300">Text</span>
          <span className="text-gray-600">|</span>
          <span className="text-gray-300">Voice</span>
          <span className="text-gray-600">|</span>
          <span className="text-gray-300">IDE</span>
          <span className="text-gray-600">|</span>
          <span className="text-gray-300">Browser</span>
        </div>
      </form>
    </div>
  );
};

export default IngestControl;