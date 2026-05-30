import React, { useState, useEffect } from 'react';
import { ScriptType, AppConfig } from '../types';
import { generateDriveOrganizer, generateGmailIngestion, generateEnterpriseLedger } from '../codeTemplates';
import { Copy, Check, Download, FileCode, Coffee, RefreshCw, AlertCircle } from 'lucide-react';

interface ScriptViewerProps {
  config: AppConfig;
  selectedScript: ScriptType;
  onScriptChange: (script: ScriptType) => void;
}

export default function ScriptViewer({ config, selectedScript, onScriptChange }: ScriptViewerProps) {
  const [copied, setCopied] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');

  // Re-generate code whenever configuration states or choice of script change
  useEffect(() => {
    let code = '';
    if (selectedScript === 'drive-organizer') {
      code = generateDriveOrganizer(config);
    } else if (selectedScript === 'gmail-ingestion') {
      code = generateGmailIngestion(config);
    } else {
      code = generateEnterpriseLedger(config);
    }
    setGeneratedCode(code);
  }, [config, selectedScript]);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([generatedCode], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedScript === 'drive-organizer' ? 'HDFCDriveOrganizer' : selectedScript === 'gmail-ingestion' ? 'HDFCGmailIngestion' : 'EnterpriseCardLedger'}.gs`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div id="script-viewer-wrapper" className="bg-white rounded-xl border border-gray-100 shadow-xs overflow-hidden flex flex-col h-full min-h-[580px]">
      
      {/* Upper Navigation Tabs */}
      <div id="tabs-bar" className="flex items-center justify-between border-b border-gray-100 bg-slate-50 px-4 py-3 flex-wrap gap-2">
        <div className="flex gap-1">
          <button
            id="tab-btn-drive-organizer"
            onClick={() => onScriptChange('drive-organizer')}
            className={`px-3 py-1.5 rounded-lg font-sans text-xs font-semibold flex items-center gap-1.5 transition-all text-left ${
              selectedScript === 'drive-organizer'
                ? 'bg-white text-slate-900 shadow-xxs border border-gray-200'
                : 'text-gray-500 hover:text-gray-900 hover:bg-slate-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            Lvl 1: Drive Organizer
          </button>
          
          <button
            id="tab-btn-gmail-ingestion"
            onClick={() => onScriptChange('gmail-ingestion')}
            className={`px-3 py-1.5 rounded-lg font-sans text-xs font-semibold flex items-center gap-1.5 transition-all text-left ${
              selectedScript === 'gmail-ingestion'
                ? 'bg-white text-slate-900 shadow-xxs border border-gray-200'
                : 'text-gray-500 hover:text-gray-900 hover:bg-slate-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
            Lvl 2: Gmail Ingestion
          </button>
          
          <button
            id="tab-btn-enterprise-ledger"
            onClick={() => onScriptChange('enterprise-ledger')}
            className={`px-3 py-1.5 rounded-lg font-sans text-xs font-semibold flex items-center gap-1.5 transition-all text-left ${
              selectedScript === 'enterprise-ledger'
                ? 'bg-white text-slate-900 shadow-xxs border border-gray-200'
                : 'text-gray-500 hover:text-gray-900 hover:bg-slate-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
            Lvl 3: Enterprise Ledger
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="copy-code-btn"
            onClick={handleCopy}
            className="p-1.5 px-3 rounded-lg text-xs font-medium font-sans border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Copy Code to Clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-green-600" />
                <span className="text-green-600 font-semibold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Code</span>
              </>
            )}
          </button>

          <button
            id="download-gs-btn"
            onClick={handleDownload}
            className="p-1.5 px-3 rounded-lg text-xs font-medium font-sans border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Download script as .gs file"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* Description Summary of selected script */}
      <div id="meta-description-block" className="p-4 bg-amber-50 border-b border-amber-100 flex gap-3 text-xs text-amber-900">
        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          {selectedScript === 'drive-organizer' && (
            <p>
              <strong>Drive Shortcut Organizer</strong> looks for plain HDFC card statement PDFs already uploaded to your Google Drive. 
              It reads the filename, constructs target subfolders based on detected card signatures, and links statements cleanly 
              via <strong>Google Drive Shortcuts</strong> to protect original shared folders.
            </p>
          )}
          {selectedScript === 'gmail-ingestion' && (
            <p>
              <strong>Gmail Automated Ingestion</strong> hooks directly into your Gmail inbox, filters threads matching your card 
              statement patterns from the past year, downloads PDF statements, sorts them into target drive folders, and marks 
              messages with <strong>#{config.processedLabel}</strong> to ensure subsequent executions skip older threads.
            </p>
          )}
          {selectedScript === 'enterprise-ledger' && (
            <p>
              <strong>Enterprise Ledger System</strong> is a full financial journaling ecosystem. It pulls credit card statements 
              from diverse banks, backed-up securely inside structured folders in your Drive account, decrypts password-protected statements in-memory, 
              indexes raw balance records using md5 unique hashes to prevent double entries, and compiles a comprehensive portfolio dashboard sheet with 
              embedded charts!
            </p>
          )}
        </div>
      </div>

      {/* Visual Code Canvas */}
      <div id="raw-code-canvas-container" className="flex-1 bg-slate-900 text-slate-100 overflow-auto p-4 font-mono text-xs leading-relaxed relative selection:bg-indigo-500 selection:bg-opacity-30">
        <div className="absolute top-3 right-4 text-xxs text-slate-500 pointer-events-none select-none flex items-center gap-1">
          <FileCode className="w-3 h-3" />
          <span>javascript / google apps script</span>
        </div>
        
        <pre className="outline-hidden select-text whitespace-pre overflow-x-auto">
          {generatedCode.split('\n').map((line, index) => {
            let className = "text-slate-300";
            if (line.trim().startsWith('//') || line.trim().startsWith('/*') || line.trim().startsWith('*')) {
              className = "text-emerald-500 font-sans italic opacity-90";
            } else if (line.includes('const ') || line.includes('let ') || line.includes('function ') || line.includes('return ') || line.includes('if ') || line.includes('while ') || line.includes('else ')) {
              className = "text-indigo-300";
            }
            return (
              <div key={index} className="table-row group hover:bg-slate-800 hover:bg-opacity-40 rounded px-1 -mx-1">
                <span className="table-cell pr-4 text-slate-600 text-right select-none w-8 text-xxs border-r border-slate-800 mr-2">{index + 1}</span>
                <span className={`table-cell pl-4  ${className}`}>{line}</span>
              </div>
            );
          })}
        </pre>
      </div>

      {/* Footer Info bar */}
      <div id="code-status-indicator" className="px-4 py-2 bg-slate-50 border-t border-gray-100 flex items-center justify-between text-xxs text-gray-500">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          Code optimized for execution on V8 engine (Google Apps Script)
        </span>
        <span className="font-mono">{generatedCode.split('\n').length} lines • {Math.round(generatedCode.length / 102) / 10} KB</span>
      </div>

    </div>
  );
}
