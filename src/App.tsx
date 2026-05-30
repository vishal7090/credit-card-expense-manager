import React, { useState } from 'react';
import { AppConfig, ScriptType } from './types';
import ConfigurationPanel from './components/ConfigurationPanel';
import ScriptViewer from './components/ScriptViewer';
import SpreadsheetPreview from './components/SpreadsheetPreview';
import ConsoleSimulation from './components/ConsoleSimulation';
import HowToGuide from './components/HowToGuide';
import { Sparkles, Terminal, FileSpreadsheet, Lock, ExternalLink, ShieldCheck, Settings, BookOpen } from 'lucide-react';

export default function App() {
  const [selectedScript, setSelectedScript] = useState<ScriptType>('enterprise-ledger');
  const [activeInteractiveTab, setActiveInteractiveTab] = useState<'spreadsheet' | 'manual'>('spreadsheet');

  // Initialize unified state config with real-world, high-fidelity default parameters
  const [config, setConfig] = useState<AppConfig>({
    masterFolder: 'CreditCard_Statements',
    gmailSearchQuery: 'subject:statement AND ("credit card" OR "e-statement")',
    processedLabel: 'Processed_Card_Statement',
    scanPeriodMonths: 12,
    targetLedgerName: 'Credit Card Master Expenses Ledger',
    cards: [
      { id: '1', bankName: 'HDFC', cardNumber: '8002', password: 'HDFC_PASS_8002', isActive: true },
      { id: '2', bankName: 'ICICI', cardNumber: '6171', password: 'VISH_ICICI_6171', isActive: true },
      { id: '3', bankName: 'SBI', cardNumber: '4991', isActive: true }
    ]
  });

  const handleUpdateConfig = (newConfig: AppConfig) => {
    setConfig(newConfig);
  };

  return (
    <div id="main-application-frame" className="min-h-screen bg-slate-50 flex flex-col selection:bg-slate-800 selection:bg-opacity-10">
      
      {/* 1. TOP PORTFOLIO APPLICATION HEADER */}
      <header id="application-navbar" className="bg-white border-b border-gray-100 py-4 px-6 md:px-8 shadow-3xs sticky top-0 z-40">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          
          <div className="flex items-center gap-4.5">
            <div className="w-11 h-11 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-sm shrink-0">
              <span className="font-mono text-base font-bold scale-110">⚡</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-sans font-bold text-gray-850 text-lg leading-snug tracking-tight">
                  Google Apps Script Financial Suite
                </h1>
                <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-600 animate-spin" /> Production Grade
                </span>
              </div>
              <p className="font-sans text-xs text-gray-500 mt-0.5">
                Dynamic builder &amp; visual execution playground for scanning GmailStatements, decryption card backups, and sheets ledger automation.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a 
              href="https://script.google.com" 
              target="_blank" 
              rel="noreferrer" 
              className="px-3.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-650 hover:text-gray-900 hover:bg-gray-50 transition-all flex items-center gap-1.5 cursor-pointer shadow-3xs"
            >
              <span>script.google.com</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            
            <a 
              href="https://drive.google.com" 
              target="_blank" 
              rel="noreferrer" 
              className="px-3.5 py-1.5 bg-slate-850 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-3xs"
            >
              <span>Google Drive Ingress</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>
      </header>

      {/* 2. MAIN SPLIT MULTI-PANEL VIEW */}
      <main id="applet-body-content" className="flex-1 p-4 md:p-6 max-w-[1440px] w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COMPILER BLOCK (COVERS SIDEBAR REGISTRY & HOW-TO-DEPLOY MANUAL) */}
        <div id="compiler-block-left" className="lg:col-span-5 space-y-6">
          
          <div className="flex items-center gap-2 mb-1">
            <Settings className="w-4.5 h-4.5 text-slate-800" />
            <h2 className="font-sans font-bold text-gray-800 text-sm uppercase tracking-wider">Configure Ingestion Profile</h2>
          </div>

          {/* Settings adjustments panel */}
          <ConfigurationPanel 
            config={config} 
            onUpdateConfig={handleUpdateConfig} 
          />

          {/* Deployment How-to-guide */}
          <HowToGuide />

        </div>

        {/* RIGHT PLAYGROUND CANVAS BLOCK (COVERS CODE CANVASES, RUNNERS & LIVE SHEET SIMULATORS) */}
        <div id="playground-canvas-right" className="lg:col-span-7 space-y-6">
          
          <div className="flex items-center justify-between border-b border-gray-150 pb-2 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Terminal className="w-4.5 h-4.5 text-slate-800" />
              <h2 className="font-sans font-bold text-gray-800 text-sm uppercase tracking-wider">Dynamic Sandbox Workbench</h2>
            </div>

            {/* Simulated Live Sheet toggle / Deployment manual view toggler */}
            <div className="flex bg-gray-250 border border-gray-300 rounded-lg p-0.5 text-xs font-medium">
              <button
                id="interactive-tab-toggle-spreadsheet"
                onClick={() => setActiveInteractiveTab('spreadsheet')}
                className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeInteractiveTab === 'spreadsheet'
                    ? 'bg-white text-emerald-800 shadow-3xs'
                    : 'text-gray-655 hover:text-gray-900'
                }`}
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                Ledger Live Preview
              </button>
              
              <button
                id="interactive-tab-toggle-debugger"
                onClick={() => setActiveInteractiveTab('manual')}
                className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeInteractiveTab === 'manual'
                    ? 'bg-white text-indigo-800 shadow-3xs'
                    : 'text-gray-655 hover:text-gray-900'
                }`}
              >
                <Terminal className="w-4 h-4 text-indigo-500" />
                Runtime Debugger
              </button>
            </div>
          </div>

          {/* SECTION A: DYNAMIC CODE EDITOR BLOCK */}
          <div className="space-y-1">
            <div className="flex justify-between items-center px-1">
              <span className="text-xxs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <span>Codebase Status: Ready compiled</span>
              </span>
            </div>
            
            <ScriptViewer 
              config={config}
              selectedScript={selectedScript}
              onScriptChange={(script) => setSelectedScript(script)}
            />
          </div>

          {/* SECTION B: TARGET VISUALS SIMULATORS */}
          <div className="animate-fadeIn">
            {activeInteractiveTab === 'spreadsheet' ? (
              <div className="space-y-4">
                <SpreadsheetPreview config={config} />
              </div>
            ) : (
              <div className="space-y-4">
                <ConsoleSimulation 
                  config={config} 
                  selectedScript={selectedScript} 
                />
              </div>
            )}
          </div>

        </div>

      </main>

      {/* 3. LOWER ACCORDION DISCLAIMER SHEET */}
      <footer id="applet-footer" className="bg-slate-900 text-slate-400 py-6 px-6 mt-12 border-t border-slate-800">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xxs font-mono">
          <div className="flex items-center gap-2">
            <div className="p-1 px-1.5 rounded bg-slate-800 text-emerald-400 font-bold">100% Client-Side Private</div>
            <span>No private emails, names, or accounts are analyzed externally. Sandbox simulated strictly in memory.</span>
          </div>
          <div>
            <span>Google Apps Script Credit Card Optimizer v2.4 • Crafted with React 19 &amp; Vite</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
