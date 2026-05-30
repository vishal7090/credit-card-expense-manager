import React, { useState } from 'react';
import { BookOpen, Key, Calendar, ShieldCheck, Mail, Sparkles, Code } from 'lucide-react';

export default function HowToGuide() {
  const [activeGuideTab, setActiveGuideTab] = useState<'deployment' | 'triggers' | 'decryption'>('deployment');

  return (
    <div id="deployment-guide-card" className="bg-white rounded-xl border border-gray-100 shadow-xs p-6 space-y-6">
      <div id="guide-title-container" className="flex items-center gap-3 border-b border-gray-100 pb-4">
        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
          <BookOpen className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-sans font-semibold text-gray-850 text-base leading-tight">Implementation &amp; Deployment Manual</h3>
          <p className="font-sans text-xs text-gray-500 mt-1">Detailed, step-by-step instructions to install and execute scripts inside script.google.com</p>
        </div>
      </div>

      {/* Manual Tab selectors */}
      <div id="guide-nav-tabs" className="flex border-b border-gray-100 gap-2">
        <button
          onClick={() => setActiveGuideTab('deployment')}
          className={`pb-3 text-xs font-semibold px-2 border-b-2 transition-all cursor-pointer ${
            activeGuideTab === 'deployment'
              ? 'border-emerald-600 text-emerald-700 font-bold'
              : 'border-transparent text-gray-550 hover:text-gray-900'
          }`}
        >
          1. Deployment (Step-by-Step)
        </button>
        <button
          onClick={() => setActiveGuideTab('triggers')}
          className={`pb-3 text-xs font-semibold px-2 border-b-2 transition-all cursor-pointer ${
            activeGuideTab === 'triggers'
              ? 'border-emerald-600 text-emerald-700 font-bold'
              : 'border-transparent text-gray-550 hover:text-gray-900'
          }`}
        >
          2. Automation (Time Triggers)
        </button>
        <button
          onClick={() => setActiveGuideTab('decryption')}
          className={`pb-3 text-xs font-semibold px-2 border-b-2 transition-all cursor-pointer ${
            activeGuideTab === 'decryption'
              ? 'border-emerald-600 text-emerald-700 font-bold'
              : 'border-transparent text-gray-550 hover:text-gray-900'
          }`}
        >
          3. Decryption &amp; Permissions
        </button>
      </div>

      <div id="guide-tabs-data" className="text-xs text-gray-600 leading-relaxed font-sans space-y-4">
        
        {/* A. DEPLOYMENT */}
        {activeGuideTab === 'deployment' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="bg-emerald-50 text-emerald-900 p-4 rounded-xl flex gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong>Bypass safety limits:</strong> Google Apps Script is free, cloud-hosted, and sandboxed directly in your Google profile. 
                Running these scripts requires no external API tokens, keeping all card statements securely insulated inside your own account!
              </div>
            </div>

            <ol className="list-decimal list-inside space-y-3.5 pl-1.5">
              <li>
                <strong>Initialize Project:</strong> Open <a href="https://script.google.com" target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline font-semibold">script.google.com</a> and sign in with your target Google mail profile. Click the <strong>&quot;New Project&quot;</strong> button in the top left side.
              </li>
              <li>
                <strong>Copy Codebase:</strong> Select the tab representing your desired complexity level (e.g., Lvl 3: Enterprise Ledger), 
                click <strong>&quot;Copy Code&quot;</strong>, delete any placeholder functions inside the Code.gs editor, and paste the code segment.
              </li>
              <li>
                <strong>Sheet Ingress (Lvl 3):</strong> If you chose Lvl 3, initialize a Google Spreadsheet in Drive, name it exactly matching your registry config: 
                <code className="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded font-mono font-medium text-xxs">Credit Card Master Expenses Ledger</code>, then link it to your script (or let the script build it automatically!).
              </li>
              <li>
                <strong>Run Setup Test:</strong> Select the core orchestrator function from the drop-down menu toolbar:
                <ul className="list-disc list-inside pl-4 mt-1.5 space-y-1 text-gray-550">
                  <li>Lvl 1: <code className="bg-gray-100 px-1 py-0.5 rounded font-mono text-[10px]">organizeHDFCStatements</code></li>
                  <li>Lvl 2: <code className="bg-gray-100 px-1 py-0.5 rounded font-mono text-[10px]">ingestStatementsFromGmail</code></li>
                  <li>Lvl 3: <code className="bg-gray-100 px-1 py-0.5 rounded font-mono text-[10px]">executeEnterprisePipeline</code></li>
                </ul>
              </li>
              <li>
                <strong>Authorize Scopes:</strong> Click the <strong>&quot;Run&quot;</strong> command. Google will popup a permission menu. Give 
                allowance to access <code className="bg-gray-100 px-1 py-0.5 rounded text-indigo-500 font-mono text-xxs">GmailApp</code>, 
                <code className="bg-gray-100 px-1 py-0.5 rounded text-indigo-500 font-mono text-xxs">DriveApp</code>, and 
                <code className="bg-gray-100 px-1 py-0.5 rounded text-indigo-500 font-mono text-xxs">SpreadsheetApp</code>.
              </li>
            </ol>
          </div>
        )}

        {/* B. TRIGGERS AUTOMATION */}
        {activeGuideTab === 'triggers' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex gap-3 items-start bg-indigo-50 text-indigo-900 p-4 rounded-xl">
              <Calendar className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <strong>Time-Driven Redundant Triggers:</strong> Running the ingestion pipeline manually is cumbersome.
                Setting standard Google Apps Script time-driven cron-triggers runs the scripts every day at 3 AM in the background!
              </div>
            </div>

            <p>Follow these steps to schedule automated nightly indexing:</p>
            <ul className="space-y-3.5 pl-1 bg-slate-50 border border-slate-100 p-4 rounded-xl">
              <li className="flex gap-3">
                <span className="bg-slate-200 text-slate-850 font-bold px-1.5 py-0.5 h-6 rounded flex items-center justify-center font-mono text-[11px] shrink-0">I</span>
                <div>
                  <strong>Access the Trigger Matrix:</strong> Inside the left navigation panel of script.google.com, click the <strong>Alarm Clock icon (&quot;Triggers&quot;)</strong>.
                </div>
              </li>
              <li className="flex gap-3">
                <span className="bg-slate-200 text-slate-850 font-bold px-1.5 py-0.5 h-6 rounded flex items-center justify-center font-mono text-[11px] shrink-0">II</span>
                <div>
                  <strong>Configure Settings:</strong> Click on the blue circular <strong>&quot;Add Trigger&quot;</strong> overlay page in the bottom-right side, then fill parameters:
                  <ul className="list-disc list-inside pl-4 mt-1.5 space-y-1 font-sans text-gray-550 text-xxs">
                    <li>Choose function to execute: <span className="font-mono bg-white px-1 border border-slate-150 rounded">executeEnterprisePipeline</span></li>
                    <li>Choose deployment: <span className="font-bold">Head</span></li>
                    <li>Select event source: <span className="text-indigo-600 font-semibold font-sans">Time-driven</span></li>
                    <li>Select type of time based trigger: <span className="text-indigo-600 font-semibold font-sans">Day timer</span></li>
                    <li>Select hour interval: <span className="text-slate-800 font-bold">2 AM to 3 AM</span></li>
                  </ul>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="bg-slate-200 text-slate-850 font-bold px-1.5 py-0.5 h-6 rounded flex items-center justify-center font-mono text-[11px] shrink-0">III</span>
                <div>
                  <strong>Set Failure Notice Options:</strong> Ensure your Failure Notification Settings are set to <strong>&quot;Notify me Daily&quot;</strong>. This emails you instantly if any password decryption fails or bank formats change!
                </div>
              </li>
            </ul>
          </div>
        )}

        {/* C. DECRYPTION AND SECURITY */}
        {activeGuideTab === 'decryption' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="bg-amber-50 text-amber-900 border border-amber-100 p-4 rounded-xl flex gap-3">
              <Key className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong>PDF Cryptography Rules:</strong> HDFC and other enterprise bank statements are standardly encrypted 
                using unique combinations (e.g., lowercase PAN characters matched with your Day of Birth).
              </div>
            </div>

            <div className="space-y-3 pl-1 text-[11px]">
              <h5 className="font-sans font-bold text-gray-800 flex items-center gap-1.5">
                <Code className="w-4 h-4 text-emerald-600" />
                How PDF In-Memory Decryption Works inside standard JS:
              </h5>
              <p>
                Google Apps Script operates a restricted JavaScript sandbox lacking native C++ Decryption bindings. 
                To cleanly parse PDF transaction balance sheets, the pipeline takes three routes:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-xl space-y-2">
                  <span className="font-mono text-xxs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Option A (Standard/Free)</span>
                  <p className="text-xxs text-gray-550 leading-relaxed">
                    Deploy a brief serverless decryption helper node in a free Cloud Flare worker or AWS Lambda running PDF.js. 
                    The script triggers a brief post request containing PDF binary vectors and password string arrays to parse text nodes securely.
                  </p>
                </div>
                
                <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-xl space-y-2">
                  <span className="font-mono text-xxs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">Option B (Google Drive OCR)</span>
                  <p className="text-xxs text-gray-550 leading-relaxed">
                    Temporarily convert plain PDFs to Google Document blocks using Drive's built-in OCR capability, 
                    pull native text parameters, append cell rows into the Sheet, and securely trash the temp files. This bypasses structural decryption entirely!
                  </p>
                </div>
              </div>

              <div className="border border-red-100 bg-red-50 bg-opacity-35 p-3.5 rounded-xl text-red-900 space-y-1.5 mt-3">
                <span className="font-bold text-xxs uppercase tracking-wider block">⚠️ A Note on Security and Credentials:</span>
                <p className="text-xxs leading-relaxed">
                  Never commit card security passwords or sensitive credentials directly to public GitHub repositories! 
                  Instead, store password credentials securely in Google Apps Script <strong>Properties Service (Project Settings &gt; Script Properties)</strong>, 
                  accessing them inside your Javascript via: <code className="bg-white border border-red-200 px-1 rounded font-mono text-[10px]">PropertiesService.getScriptProperties().getProperty(&apos;CARD_PASS&apos;)</code>.
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
