import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { InputArea } from './components/InputArea';
import { DataPreview } from './components/DataPreview';
import { extractDataFromText } from './services/geminiService';
import { generateAndDownloadExcel } from './utils/excelGenerator';
import { ExtractedData, ProcessingStatus } from './types';
import { ArrowRight, Loader2, Download, AlertTriangle } from 'lucide-react';

const App: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [status, setStatus] = useState<ProcessingStatus>(ProcessingStatus.IDLE);
  const [data, setData] = useState<ExtractedData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleExtract = useCallback(async () => {
    if (!inputText.trim()) return;

    setStatus(ProcessingStatus.PROCESSING);
    setError(null);
    setData(null);

    try {
      const result = await extractDataFromText(inputText);
      setData(result);
      setStatus(ProcessingStatus.SUCCESS);
    } catch (err) {
      console.error(err);
      setError("Failed to process text. Please try again or check your API key configuration.");
      setStatus(ProcessingStatus.ERROR);
    }
  }, [inputText]);

  const handleDownload = useCallback(() => {
    if (data) {
      generateAndDownloadExcel(data);
    }
  }, [data]);

  const handleClear = useCallback(() => {
    setInputText('');
    setData(null);
    setStatus(ProcessingStatus.IDLE);
    setError(null);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-grow container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Error Banner */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 flex items-start gap-3 text-red-800 animate-in fade-in slide-in-from-top-4">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold">Processing Error</h4>
              <p className="text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-12rem)] min-h-[600px]">
          
          {/* Left Column: Input */}
          <div className="flex flex-col gap-4 h-full">
            <div className="flex-grow">
               <InputArea 
                 value={inputText} 
                 onChange={setInputText} 
                 disabled={status === ProcessingStatus.PROCESSING}
                 onClear={handleClear}
               />
            </div>
            
            <div className="shrink-0">
              <button
                onClick={handleExtract}
                disabled={!inputText.trim() || status === ProcessingStatus.PROCESSING}
                className={`w-full py-4 px-6 rounded-xl font-semibold shadow-lg transition-all duration-200 flex items-center justify-center gap-2
                  ${!inputText.trim() || status === ProcessingStatus.PROCESSING
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-blue-500/20 hover:shadow-blue-600/30 hover:-translate-y-0.5 active:translate-y-0'
                  }`}
              >
                {status === ProcessingStatus.PROCESSING ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing Content...
                  </>
                ) : (
                  <>
                    Convert to Excel <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
              <p className="text-center text-xs text-slate-400 mt-3">
                Uses Gemini 2.5 Flash to identify tables, lists, and structured data automatically.
              </p>
            </div>
          </div>

          {/* Right Column: Preview & Action */}
          <div className="flex flex-col gap-4 h-full">
            <div className="flex-grow overflow-hidden">
               <DataPreview data={data} />
            </div>
            
            <div className="shrink-0">
               <button
                onClick={handleDownload}
                disabled={!data}
                className={`w-full py-4 px-6 rounded-xl font-semibold shadow-lg transition-all duration-200 flex items-center justify-center gap-2
                  ${!data
                    ? 'bg-slate-100 text-slate-300 border border-slate-200 cursor-not-allowed shadow-none'
                    : 'bg-green-600 hover:bg-green-700 text-white shadow-green-500/20 hover:shadow-green-600/30 hover:-translate-y-0.5 active:translate-y-0'
                  }`}
              >
                <Download className="w-5 h-5" />
                Download .XLSX File
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;