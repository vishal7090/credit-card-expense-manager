import React, { useState, useEffect, useRef } from 'react';
import { ScriptType, LogLine, AppConfig } from '../types';
import { Play, Pause, RotateCcw, FastForward, Terminal, CheckCircle2, ShieldAlert, Cpu } from 'lucide-react';

interface ConsoleSimulationProps {
  config: AppConfig;
  selectedScript: ScriptType;
}

export default function ConsoleSimulation({ config, selectedScript }: ConsoleSimulationProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [logs, setLogs] = useState<LogLine[]>([]);
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState<number>(1000); // ms delay per step
  const [metrics, setMetrics] = useState({
    examined: 0,
    created: 0,
    skipped: 0,
    sheetsIndex: 0
  });

  const stepRef = useRef<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const terminalBottomRef = useRef<HTMLDivElement | null>(null);

  // Define log script sequences based on config states
  const simulationSequences: Record<ScriptType, Array<{ text: string, level: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS', metricUpdate?: Partial<typeof metrics> }>> = {
    'drive-organizer': [
      { text: '🤖 Starting HDFC Credit Card Statement Organizer...', level: 'INFO' },
      { text: `📁 Searching for root folder directory matching: "${config.masterFolder || 'HDFC CreditCard'}"...`, level: 'INFO' },
      { text: `📁 Master folder located with ID: drive_folder_hdfc_cc_0192`, level: 'SUCCESS' },
      { text: '📂 Unsorted fallback folder check: retrieving "Card_Unsorted"...', level: 'INFO' },
      { text: '📂 Recalled existing fallback subfolder "Card_Unsorted".', level: 'SUCCESS' },
      { text: '🔍 Scanning active Google Drive with index: mimeType = \'application/pdf\' and (title contains \'hdfc\' or title contains \'statement\')', level: 'INFO', metricUpdate: { examined: 1 } },
      { text: '📄 Examining file: "Statement_HDFC_June_8002.pdf"', level: 'INFO' },
      { text: '💡 Regex match identified. Card digits signature extracted: "8002"', level: 'SUCCESS' },
      { text: '📂 Searching for card structure: retrieving subfolder "/HDFC CreditCard/Card_8002"...', level: 'INFO' },
      { text: '✨ Subfolder not present. Generated new folder node: "Card_8002"', level: 'SUCCESS' },
      { text: '🔗 Finalizing shortcut: targetFolder.createShortcut("file_id_hdfc_012")', level: 'INFO' },
      { text: '🔗 Shortcut cataloged in "Card_8002" -> Reference ID: short_hdfc_june_8002', level: 'SUCCESS', metricUpdate: { created: 1 } },
      { text: '📄 Examining file: "eStatement_HDFC_June_8002_Copy.pdf"', level: 'INFO', metricUpdate: { examined: 2 } },
      { text: '💡 Regex match identified. Card digits signature extracted: "8002"', level: 'SUCCESS' },
      { text: '📂 Retrieving subfolder "/HDFC CreditCard/Card_8002"...', level: 'INFO' },
      { text: '⏭️ Shortcut verification checks matches exist. Skipping double backup to avoid clutter.', level: 'WARNING', metricUpdate: { skipped: 1 } },
      { text: '📄 Examining file: "HDFC_Statement_May_6171.pdf"', level: 'INFO', metricUpdate: { examined: 3 } },
      { text: '💡 Regex match identified. Card digits signature extracted: "6171"', level: 'SUCCESS' },
      { text: '📂 Folder matching "Card_6171" located inside drive cache.', level: 'SUCCESS' },
      { text: '🔗 Creating link shortcut for MayStatement_6171 to folder path...', level: 'INFO' },
      { text: '🔗 Shortcut cataloged in "Card_6171" -> Reference ID: short_hdfc_may_6171', level: 'SUCCESS', metricUpdate: { created: 2 } },
      { text: '📄 Examining file: "Unidentified_EStatement_99.pdf"', level: 'INFO', metricUpdate: { examined: 4 } },
      { text: '⚠️ Parsing Regex failed. No standard 4-digit card sequences found inside string.', level: 'WARNING' },
      { text: '📁 Sorting file shortcut into fallback drawer "Card_Unsorted"...', level: 'INFO' },
      { text: '🔗 Shortcut cataloged in "Card_Unsorted" fallback folder.', level: 'SUCCESS', metricUpdate: { created: 3 } },
      { text: '==================================================', level: 'INFO' },
      { text: '🏁 Execution Summary completed successfully.', level: 'SUCCESS' },
      { text: '📝 Total Examined PDFs: 4 | ✅ Created Shortcuts: 3 | ⏭️ Skipped: 1', level: 'SUCCESS' },
      { text: '==================================================', level: 'INFO' }
    ],
    'gmail-ingestion': [
      { text: `📨 Initiating Gmail Statement Ingestion Pipeline... Looking lookback offset: ${config.scanPeriodMonths || 12} months`, level: 'INFO' },
      { text: `🏷️ Workspace registry search: user tracking label: "${config.processedLabel || 'Processed_Statement'}"...`, level: 'INFO' },
      { text: `🏷️ Custom tracking label found inside Gmail registry: "#${config.processedLabel || 'Processed_Statement'}"`, level: 'SUCCESS' },
      { text: `✉️ Mapping filter query: "from:HDFC Bank statement subject:"Credit Card Statement" after:2025/05/30 -label:${config.processedLabel || 'Processed_Statement'}"`, level: 'INFO' },
      { text: '📬 Inbox API scanned: uncovered 2 unlabelled threads matching statement patterns.', level: 'SUCCESS' },
      { text: '--- Processing Thread 1 (Subject: "HDFC Bank Credit Card Statement for Card 8002 - May 2026") ---', level: 'INFO' },
      { text: '✉️ Ingesting message ID: msg_hdfc_0981a2', level: 'INFO' },
      { text: '📄 Attachment payload verified: "June2026_8002.pdf" (application/pdf)', level: 'SUCCESS' },
      { text: '🔎 Analyzing digits: regex query extracted "8002" account signature from attachment key.', level: 'INFO' },
      { text: '📁 Directory verify: searching path "/Card_8002"...', level: 'INFO' },
      { text: '📁 Storage directory matched. Copying binary streams to Drive...', level: 'SUCCESS' },
      { text: '💾 Ingested statement saved recursively in Card_8002/June2026_8002.pdf', level: 'SUCCESS', metricUpdate: { examined: 1, created: 1 } },
      { text: `🏷️ Flagging label thread: adding tag "#${config.processedLabel || 'Processed_Statement'}" to thread`, level: 'INFO' },
      { text: '🏷️ Marked thread with label successfully.', level: 'SUCCESS' },
      { text: '--- Processing Thread 2 (Subject: "HDFC Statement for 8002 - April 2026") ---', level: 'INFO' },
      { text: '✉️ Ingesting message ID: msg_hdfc_0845a9', level: 'INFO' },
      { text: '📄 Attachment payload verified: "April2026_8002.pdf"', level: 'SUCCESS' },
      { text: '📁 Checking file presence inside "Card_8002" folder to prevent redownload...', level: 'INFO' },
      { text: '⏭️ File checking warns: "April2026_8002.pdf" is already registered under ID drive_xxx. Skipping file copy.', level: 'WARNING', metricUpdate: { examined: 2, skipped: 1 } },
      { text: `🏷️ Thread marked: applying tracking tag "#${config.processedLabel || 'Processed_Statement'}"`, level: 'INFO' },
      { text: '🏷️ Label applied successfully.', level: 'SUCCESS' },
      { text: '==================================================', level: 'INFO' },
      { text: '🏁 Ingestion complete. Downloaded threads parsed cleanly.', level: 'SUCCESS' },
      { text: '📥 Statements Saved: 1 | ⏭️ Skipped duplicate: 1 | 🏷️ Processed labels added: 2', level: 'SUCCESS' },
      { text: '==================================================', level: 'INFO' }
    ],
    'enterprise-ledger': [
      { text: '🚀 Bootstrap Enterprise Pipeline Tracker...', level: 'INFO' },
      { text: `📁 Master folder checks: resolving directory "${config.masterFolder || 'CreditCard_Statements'}"...`, level: 'INFO' },
      { text: `📁 Master folder found: "/${config.masterFolder || 'CreditCard_Statements'}" Path Verified`, level: 'SUCCESS' },
      { text: `📊 Financial indexing initialization. Locating Sheet: "${config.targetLedgerName || 'Credit Card Master Expenses Ledger'}"...`, level: 'INFO' },
      { text: '📊 Spreadsheet found! Loading schemas and index tabs...', level: 'SUCCESS' },
      { text: `🔍 Querying Gmail inbox filter: "subject:statement AND ("credit card" OR "e-statement") -label:${config.processedLabel || 'Processed_Card_Statement'}"`, level: 'INFO' },
      { text: '📬 Inbound Search: Found 3 emails waiting for portfolio indexing.', level: 'SUCCESS' },
      { text: '--- Ingesting Statement Thread [1/3] from "HDFC Bank Alert" ---', level: 'INFO', metricUpdate: { examined: 1 } },
      { text: '💡 Match detected: Statement title matched with Card "8002"', level: 'SUCCESS' },
      { text: '📂 Saving statement under directory: CreditCard_Statements/HDFC/Card_8002...', level: 'INFO' },
      { text: '💾 Backup succeeded: "HDFC_stmt_8002_May.pdf" copied to drive.', level: 'SUCCESS' },
      { text: '🔑 Configuration Check: Found statement password matching registry!', level: 'INFO' },
      { text: '🔑 Decrypting HDFC PDF statement using registered password sequence...', level: 'SUCCESS' },
      { text: '📖 Running parser tokenizer on decrypted balance streams in security memory...', level: 'INFO' },
      { text: '📊 Accessing sheets log tab: "HDFC_8002"...', level: 'INFO' },
      { text: '📝 Validating deduplication hashes across 5 columns in spreadsheet...', level: 'INFO' },
      { text: '📈 Recorded 4 new exclusive ledger transactions into HDFC_8002 sheet!', level: 'SUCCESS', metricUpdate: { created: 4, sheetsIndex: 4 } },
      { text: '⏭️ Automatically skipped 2 rows where MD5 compound hash matches existing ledger cell blocks!', level: 'WARNING', metricUpdate: { skipped: 2 } },
      { text: '--- Ingesting Statement Thread [2/3] from "ICICI Credit Alert" ---', level: 'INFO', metricUpdate: { examined: 2 } },
      { text: '💡 Match detected: Card digits "6171" located inside attachment subject.', level: 'SUCCESS' },
      { text: '📁 Backing up statement: "/CreditCard_Statements/ICICI/Card_6171/ICICI_6171_May.pdf"...', level: 'INFO' },
      { text: '🔑 PDF Unprotected (No account password configured). direct tokenization initialized.', level: 'INFO' },
      { text: '📈 Appended 5 new transaction lines directly into ICICI_6171 Ledger!', level: 'SUCCESS', metricUpdate: { created: 9, sheetsIndex: 9 } },
      { text: '--- Ingesting Statement Thread [3/3] from "SBI Card Card_Alert" ---', level: 'INFO', metricUpdate: { examined: 3 } },
      { text: '💡 Card digits "4991" identified from subject string.', level: 'SUCCESS' },
      { text: '📁 Backing up statement: "/CreditCard_Statements/SBI/Card_4991/SBI_stmt_4991.pdf"...', level: 'INFO' },
      { text: '📈 Appended 3 transaction lines directly into SBI_4991 Ledger!', level: 'SUCCESS', metricUpdate: { created: 12, sheetsIndex: 12 } },
      { text: '🏷️ Indexing tags processed: labeling threads with process markers.', level: 'INFO' },
      { text: '📊 Commencing sheet charting: Rebuilding Executive Dashboard layout...', level: 'INFO' },
      { text: '📊 Formula verification: recalculating spend sumifs and consolidated counters...', level: 'SUCCESS' },
      { text: '🎨 Design injected: Set bold table headers, summary values borders, and cell formatting.', level: 'SUCCESS' },
      { text: '📊 Chart Engine: Inserted Pie chart widget and Monthly Stacked Columns Spends widget programmatically!', level: 'SUCCESS' },
      { text: '==================================================', level: 'INFO' },
      { text: '🏆 ENTERPRISE AUTOMATION CYCLE SUCCESSFUL!', level: 'SUCCESS' },
      { text: '📤 Backup catalog: 3 PDFs | 📋 Ledger entries written: 12 | ⏭️ Skip Duplicates: 2', level: 'SUCCESS' },
      { text: '==================================================', level: 'INFO' }
    ]
  };

  const handleReset = () => {
    setIsPlaying(false);
    setProgress(0);
    setLogs([]);
    stepRef.current = 0;
    setMetrics({ examined: 0, created: 0, skipped: 0, sheetsIndex: 0 });
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const runStep = () => {
    const currentSequence = simulationSequences[selectedScript];
    if (stepRef.current >= currentSequence.length) {
      setIsPlaying(false);
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const currentLog = currentSequence[stepRef.current];
    const timestampStr = new Date().toISOString().slice(11, 19);

    const newLine: LogLine = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: timestampStr,
      level: currentLog.level,
      text: currentLog.text
    };

    setLogs((prev) => [...prev, newLine]);
    
    if (currentLog.metricUpdate) {
      setMetrics((prev) => ({
        ...prev,
        ...currentLog.metricUpdate
      }));
    }

    stepRef.current += 1;
    setProgress(Math.round((stepRef.current / currentSequence.length) * 100));
  };

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        runStep();
      }, speed);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, speed, selectedScript]);

  // Autoscroll terminal whenever logs update
  useEffect(() => {
    if (terminalBottomRef.current) {
      terminalBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  // Clean log set when script type shifts
  useEffect(() => {
    handleReset();
  }, [selectedScript]);

  return (
    <div id="simulated-workbench-terminal" className="bg-slate-900 rounded-xl border border-slate-800 shadow-md text-slate-100 p-5 flex flex-col h-full min-h-[500px] font-mono">
      
      {/* Simulation Header panel */}
      <div id="sim-control-header" className="flex items-center justify-between border-b border-slate-800 pb-4 flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-indigo-400 animate-pulse" />
          <div>
            <h4 className="text-xs font-bold font-sans uppercase tracking-widest text-[#a5b4fc]">Google Apps Script Simulator</h4>
            <p className="text-[10px] font-sans text-slate-400">Trigger runtime models to execute and verify Google Apps Script logs.</p>
          </div>
        </div>

        {/* Runtime Controller Widgets */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700">
            <button
              id="sim-play-trigger"
              onClick={() => setIsPlaying(!isPlaying)}
              className={`p-1.5 px-3.5 rounded-md text-xxs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                isPlaying 
                  ? 'bg-rose-600 text-white hover:bg-rose-700' 
                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
              }`}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3 h-3" /> Pause
                </>
              ) : (
                <>
                  <Play className="w-3 h-3" /> Execute Run
                </>
              )}
            </button>
            <button
              id="sim-step-trigger"
              onClick={runStep}
              disabled={isPlaying}
              className="p-1 px-2.5 rounded-md text-xs text-slate-300 hover:bg-slate-700 disabled:opacity-40"
              title="Forward Single Step"
            >
              <FastForward className="w-3.5 h-3.5" />
            </button>
            <button
              id="sim-reset-trigger"
              onClick={handleReset}
              className="p-1 px-2.5 rounded-md text-xs text-slate-300 hover:bg-slate-700 hover:text-rose-450"
              title="Reset Simulated Output"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Speed Selector widgets */}
          <div className="flex rounded-lg bg-slate-800 border border-slate-700 p-0.5 text-[10px] font-bold">
            <button 
              onClick={() => setSpeed(1500)}
              className={`px-2 py-1 rounded-md cursor-pointer ${speed === 1500 ? 'bg-slate-650 text-indigo-200' : 'text-slate-400'}`}
            >
              Slow
            </button>
            <button 
              onClick={() => setSpeed(700)}
              className={`px-2 py-1 rounded-md cursor-pointer ${speed === 700 ? 'bg-slate-650 text-indigo-200' : 'text-slate-400'}`}
            >
              Normal
            </button>
            <button 
              onClick={() => setSpeed(150)}
              className={`px-2 py-1 rounded-md cursor-pointer ${speed === 150 ? 'bg-slate-650 text-indigo-200' : 'text-slate-400'}`}
            >
              Fast
            </button>
          </div>
        </div>
      </div>

      {/* Progress metrics bars */}
      <div id="sim-progress-indicator" className="grid grid-cols-4 gap-2 bg-slate-950 px-3 py-2 rounded-lg my-4 text-[10px] uppercase font-sans border border-slate-800 tracking-wider">
        <div className="flex flex-col">
          <span className="text-slate-500 font-semibold text-xxs block">Scan index</span>
          <span className="text-emerald-400 font-bold font-mono text-sm">{metrics.examined} files</span>
        </div>
        <div className="flex flex-col border-l border-slate-800 pl-3">
          <span className="text-slate-500 font-semibold text-xxs block">Organized</span>
          <span className="text-blue-400 font-bold font-mono text-sm">{metrics.created} done</span>
        </div>
        <div className="flex flex-col border-l border-slate-800 pl-3">
          <span className="text-slate-500 font-semibold text-xxs block flex items-center gap-1">
            Duplicates
          </span>
          <span className="text-yellow-500 font-bold font-mono text-sm">{metrics.skipped} skipped</span>
        </div>
        <div className="flex flex-col border-l border-slate-800 pl-3">
          <span className="text-slate-500 font-semibold text-xxs block">Ledger Rows</span>
          <span className="text-indigo-400 font-bold font-mono text-sm">{metrics.sheetsIndex} rows</span>
        </div>
      </div>

      {/* Logging Text Terminal Block */}
      <div id="terminal-canvas-view" className="flex-1 overflow-auto bg-slate-950 border border-slate-800 rounded-lg p-3 min-h-[250px] font-mono text-xs space-y-1.5 flex flex-col justify-start select-text leading-relaxed">
        {logs.map((item) => {
          let levelColor = 'text-white opacity-95';
          if (item.level === 'SUCCESS') levelColor = 'text-emerald-400 font-semibold';
          if (item.level === 'WARNING') levelColor = 'text-yellow-400 font-medium';
          if (item.level === 'ERROR') levelColor = 'text-rose-500 font-bold';
          return (
            <div key={item.id} className="flex gap-2.5 items-start pl-1 border-l-2 hover:bg-slate-900 hover:bg-opacity-40 py-0.5 ${
              item.level === 'SUCCESS' ? 'border-emerald-500' : item.level === 'WARNING' ? 'border-yellow-500' : 'border-transparent'
            }">
              <span className="text-slate-500 select-none text-xxs font-mono translate-y-0.5 shrink-0">[{item.timestamp}]</span>
              <span className={`flex-1 pr-1 ${levelColor}`}>{item.text}</span>
            </div>
          );
        })}

        {logs.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-550 border-2 border-dashed border-slate-900 rounded bg-slate-950 p-6">
            <Cpu className="w-10 h-10 mb-2.5 text-slate-750 animate-bounce" />
            <span className="font-sans text-xs font-semibold text-slate-400 block pb-1">Ready for Runtime Execution</span>
            <span className="font-sans text-xxs text-slate-600">Click &quot;Execute Run&quot; above to view step-by-step Logger outputs.</span>
          </div>
        )}
        <div ref={terminalBottomRef} />
      </div>

      {/* Dynamic Progress indicator bar */}
      <div id="progress-meter-line" className="h-1 bg-slate-800 rounded-full mt-4 overflow-hidden relative border border-slate-950">
        <div 
          className="h-full bg-indigo-500 transition-all duration-300 rounded" 
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex justify-between text-xxs text-slate-400 font-sans mt-2">
        <span>Compilation Process: {stepRef.current} / {simulationSequences[selectedScript].length} tasks</span>
        <span className="font-semibold text-indigo-300">{progress}% Completed</span>
      </div>

    </div>
  );
}
