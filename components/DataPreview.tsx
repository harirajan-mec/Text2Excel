import React from 'react';
import { ExtractedData } from '../types';
import { Table, AlertCircle } from 'lucide-react';

interface DataPreviewProps {
  data: ExtractedData | null;
}

export const DataPreview: React.FC<DataPreviewProps> = ({ data }) => {
  if (!data) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
        <div className="bg-slate-100 p-4 rounded-full mb-4">
            <Table className="w-8 h-8 text-slate-300" />
        </div>
        <p className="font-medium">No data generated yet</p>
        <p className="text-sm mt-1">Enter text and click "Convert to Excel"</p>
      </div>
    );
  }

  if (data.rows.length === 0) {
    return (
        <div className="h-full flex flex-col items-center justify-center text-amber-600 p-8 border border-amber-200 rounded-2xl bg-amber-50">
            <AlertCircle className="w-8 h-8 mb-2" />
            <p>No rows found in the provided text.</p>
        </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
        <div className="flex items-center gap-2 text-slate-700 font-medium">
            <Table className="w-4 h-4" />
            <h3>Preview: {data.filename}.xlsx</h3>
        </div>
        <div className="text-xs text-slate-500">
            {data.rows.length} rows • {data.columns.length} columns
        </div>
      </div>
      <div className="flex-grow overflow-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm">
            <tr>
              {data.columns.map((col, idx) => (
                <th 
                    key={idx} 
                    className="px-4 py-3 font-semibold text-slate-600 border-b border-slate-200 bg-slate-50"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.rows.map((row, rIdx) => (
              <tr key={rIdx} className="hover:bg-slate-50/80 transition-colors">
                {/* Handle cases where row might be shorter than columns or data is missing */}
                {data.columns.map((_, cIdx) => (
                  <td key={cIdx} className="px-4 py-2.5 text-slate-700 border-r border-transparent last:border-0">
                    {row[cIdx] !== undefined && row[cIdx] !== null ? String(row[cIdx]) : <span className="text-slate-300 italic">null</span>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {data.summary && (
         <div className="px-4 py-2 bg-yellow-50 border-t border-yellow-100 text-xs text-yellow-800">
            <span className="font-semibold">Summary:</span> {data.summary}
         </div>
      )}
    </div>
  );
};