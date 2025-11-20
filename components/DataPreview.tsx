import React from 'react';
import { ExtractedData } from '../types';
import { Table, AlertCircle, Eye } from 'lucide-react';

interface DataPreviewProps {
  data: ExtractedData | null;
}

export const DataPreview: React.FC<DataPreviewProps> = ({ data }) => {
  // Limit for preview rows
  const MAX_PREVIEW_ROWS = 10;

  if (!data) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 p-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-900/50 transition-colors duration-200">
        <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-full mb-4 transition-colors">
            <Table className="w-8 h-8 text-slate-300 dark:text-slate-600" />
        </div>
        <p className="font-medium">No data generated yet</p>
        <p className="text-sm mt-1 opacity-80">Enter text and click "Convert to Excel"</p>
      </div>
    );
  }

  if (data.rows.length === 0) {
    return (
        <div className="h-full flex flex-col items-center justify-center text-amber-600 dark:text-amber-400 p-8 border border-amber-200 dark:border-amber-800 rounded-2xl bg-amber-50 dark:bg-amber-900/10 transition-colors">
            <AlertCircle className="w-8 h-8 mb-2" />
            <p>No rows found in the provided text.</p>
        </div>
    );
  }

  const displayedRows = data.rows.slice(0, MAX_PREVIEW_ROWS);
  const hiddenCount = data.rows.length - MAX_PREVIEW_ROWS;

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors duration-200">
      <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200 font-medium">
            <Table className="w-4 h-4" />
            <h3>Preview: {data.filename}.xlsx</h3>
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400">
            {data.rows.length} total rows
        </div>
      </div>
      
      <div className="flex-grow overflow-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-50 dark:bg-slate-800/80 sticky top-0 z-10 shadow-sm">
            <tr>
              {data.columns.map((col, idx) => (
                <th 
                    key={idx} 
                    className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {displayedRows.map((row, rIdx) => (
              <tr key={rIdx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                {/* Handle cases where row might be shorter than columns or data is missing */}
                {data.columns.map((_, cIdx) => (
                  <td key={cIdx} className="px-4 py-2.5 text-slate-700 dark:text-slate-300 border-r border-transparent last:border-0">
                    {row[cIdx] !== undefined && row[cIdx] !== null ? String(row[cIdx]) : <span className="text-slate-300 dark:text-slate-600 italic">null</span>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        
        {hiddenCount > 0 && (
          <div className="p-8 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 bg-gradient-to-b from-transparent to-slate-50 dark:to-slate-900/50">
             <Eye className="w-6 h-6 mb-2 opacity-50" />
             <p className="font-medium text-sm">Preview limited to {MAX_PREVIEW_ROWS} rows</p>
             <p className="text-xs mt-1 opacity-75">Download the file to see all {data.rows.length} rows</p>
          </div>
        )}
      </div>

      {data.summary && (
         <div className="shrink-0 px-4 py-2 bg-yellow-50 dark:bg-yellow-900/20 border-t border-yellow-100 dark:border-yellow-800/50 text-xs text-yellow-800 dark:text-yellow-200">
            <span className="font-semibold">Summary:</span> {data.summary}
         </div>
      )}
    </div>
  );
};