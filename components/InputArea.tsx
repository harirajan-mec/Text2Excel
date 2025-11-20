import React from 'react';
import { ClipboardPaste, Trash2, FileText } from 'lucide-react';

interface InputAreaProps {
  value: string;
  onChange: (val: string) => void;
  disabled: boolean;
  onClear: () => void;
}

export const InputArea: React.FC<InputAreaProps> = ({ value, onChange, disabled, onClear }) => {
  
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      onChange(text);
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-2 text-slate-700 font-medium">
          <FileText className="w-4 h-4" />
          <h3>Source Text</h3>
        </div>
        <div className="flex gap-2">
           <button
            onClick={handlePaste}
            disabled={disabled}
            className="text-xs flex items-center gap-1 px-2 py-1 rounded hover:bg-slate-200 text-slate-600 transition-colors disabled:opacity-50"
          >
            <ClipboardPaste className="w-3 h-3" /> Paste
          </button>
          <button
            onClick={onClear}
            disabled={disabled || !value}
            className="text-xs flex items-center gap-1 px-2 py-1 rounded hover:bg-red-50 text-red-600 transition-colors disabled:opacity-50"
          >
            <Trash2 className="w-3 h-3" /> Clear
          </button>
        </div>
      </div>
      <div className="flex-grow relative group">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder="Paste your unstructured text here... e.g., emails, reports, lists, or chat logs."
          className="w-full h-full p-4 resize-none focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500/50 text-sm leading-relaxed text-slate-700 font-mono bg-transparent"
        />
        {!value && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-40">
            <div className="text-center">
              <p className="text-sm text-slate-400">Start typing or paste content</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};