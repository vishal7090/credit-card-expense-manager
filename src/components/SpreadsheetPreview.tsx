import React, { useState, useMemo, useRef, useEffect } from 'react';
import { AppConfig, Transaction } from '../types';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { LayoutGrid, CreditCard, Layers, Sparkles, TrendingUp, HelpCircle, Check, AlertTriangle, Download, X, Copy, FileText, ChevronLeft, ChevronRight, Eye, EyeOff, Settings, ArrowLeft, ArrowRight, GripVertical, ChevronDown, Search } from 'lucide-react';

interface SpreadsheetPreviewProps {
  config: AppConfig;
}

// Function to generate realistic extra transactions to test pagination
const generateExtraTransactions = (bankCode: string, count: number): Transaction[] => {
  const merchants = [
    'Netflix Subscription', 'Starbucks Coffee', 'Amazon Shopping Retail', 
    'Uber Eats Deliveries', 'Zara Apparel', 'Zomato Food Delivery', 
    'Adobe Creative Cloud', 'Swiggy Delivery', 'Myntra Fashion',
    'Apple Services iCloud', 'Google One Subscription', 'Airtel Bill Payment',
    'Chai Point Cafe', 'Ola Cabs In', 'BookMyShow Online Ticket', 'Blue Tokai Coffee'
  ];
  
  const transactions: Transaction[] = [];
  for (let i = 1; i <= count; i++) {
    const isDuplicate = i % 18 === 0; // occasional simulated duplicate
    const type = (i % 7 === 0) ? 'Credit' : 'Debit';
    const amount = Math.floor(Math.random() * 1900) + 90;
    
    // Format date in May 2026
    const dayValue = (i % 28) + 1;
    const day = String(dayValue).padStart(2, '0');
    const date = `2026-05-${day}`;
    
    const hash = `md5_dedup_${bankCode.toLowerCase()}_${i}_${dayValue}e9f0a`;
    
    transactions.push({
      date,
      merchant: merchants[i % merchants.length] + ((i % 4 === 0) ? ` #${i}` : ''),
      type,
      amount,
      isDuplicate,
      hash
    });
  }
  return transactions;
};

// Fixed mock databases for standard interactive previews
const MOCK_LEDGER_DATA: Record<string, Transaction[]> = {
  HDFC_8002: [
    { date: '2026-05-10', merchant: 'Starbucks Coffee', type: 'Debit', amount: 520.00, hash: 'ec4e9c70404fa3a3fdae' },
    { date: '2026-05-12', merchant: 'Amazon Shopping Retail', type: 'Debit', amount: 1840.50, hash: 'bf9161aed41fe6a1fda8' },
    { date: '2026-05-12', merchant: 'Amazon Shopping Retail', type: 'Debit', amount: 1840.50, isDuplicate: true, hash: 'bf9161aed41fe6a1fda8' }, // duplicate entry
    { date: '2026-05-15', merchant: 'CRED HDFC Bill Pay', type: 'Credit', amount: 10000.00, hash: '13a4bc6030ea6918daaa' },
    { date: '2026-05-18', merchant: 'Uber Eats Deliveries', type: 'Debit', amount: 650.00, hash: '9b0c2af240ffae3a8fda' },
    { date: '2026-05-22', merchant: 'Netflix Subscription', type: 'Debit', amount: 649.00, hash: 'c9f0eb10ed7df7a88002' },
    { date: '2026-05-22', merchant: 'Netflix Subscription', type: 'Debit', amount: 649.00, isDuplicate: true, hash: 'c9f0eb10ed7df7a88002' }, // duplicate entry
    ...generateExtraTransactions('HDFC_8002', 58) // 65 total items
  ],
  ICICI_6171: [
    { date: '2026-05-04', merchant: 'Adobe Creative Cloud Suite', type: 'Debit', amount: 4400.00, hash: 'fc8a90ec4e3bf602ea91' },
    { date: '2026-05-08', merchant: 'Steam Online Gaming', type: 'Debit', amount: 3250.00, hash: 'b9ea897a61c3bf708ee2' },
    { date: '2026-05-12', merchant: 'Walmart Family Groceries', type: 'Debit', amount: 6800.00, hash: 'a1b2c3d4e5f67890f1e2' },
    { date: '2026-05-14', merchant: 'ICICI Autopay Settlement', type: 'Credit', amount: 12000.00, hash: 'f2e3d4c5b6a78901e1d2' },
    { date: '2026-05-25', merchant: 'Airbnb Summer Retreat', type: 'Debit', amount: 18500.00, hash: '3e4f5a6b7c8d9e0f1a2b' },
    ...generateExtraTransactions('ICICI_6171', 50) // 55 total items
  ],
  SBI_4991: [
    { date: '2026-05-02', merchant: 'Shell Gas Station Fill', type: 'Debit', amount: 2800.00, hash: '7c8da9bf0ea98c76dafb' },
    { date: '2026-05-15', merchant: 'Zara Apparel Store', type: 'Debit', amount: 6200.00, hash: '8e9fa0bc1da22fc8e3db' },
    { date: '2026-05-28', merchant: 'Zomato Food Delivery', type: 'Debit', amount: 1120.00, hash: '9fa0b1c2d3ea90fcde4b' },
    ...generateExtraTransactions('SBI_4991', 12)
  ],
  UNSORTED: [
    { date: '2026-05-18', merchant: 'Unknown Merchant Store', type: 'Debit', amount: 1500.00, hash: 'f6b7c8d9ea987b6d1f02' }
  ]
};

const CHART_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#a855f7', '#64748b'];

export default function SpreadsheetPreview({ config }: SpreadsheetPreviewProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | string>('dashboard');
  const [csvPreviewContent, setCsvPreviewContent] = useState<string | null>(null);
  const [csvPreviewFilename, setCsvPreviewFilename] = useState<string>('');
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [exportDelimiter, setExportDelimiter] = useState<'comma' | 'semicolon' | 'tab'>('comma');
  const [showConfigurator, setShowConfigurator] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [colSearchQuery, setColSearchQuery] = useState<string>('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isDropdownOpen) {
      setColSearchQuery('');
    }
  }, [isDropdownOpen]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  const [columns, setColumnsState] = useState<Array<{ id: 'date' | 'merchant' | 'type' | 'amount' | 'hash'; label: string; visible: boolean }>>(() => {
    try {
      const saved = localStorage.getItem('spreadsheet_columns_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load columns from storage', e);
    }
    return [
      { id: 'date', label: 'Date', visible: true },
      { id: 'merchant', label: 'Merchant', visible: true },
      { id: 'type', label: 'Type', visible: true },
      { id: 'amount', label: 'Amount', visible: true },
      { id: 'hash', label: 'Hash', visible: true }
    ];
  });

  const setColumns = (newCols: Array<{ id: 'date' | 'merchant' | 'type' | 'amount' | 'hash'; label: string; visible: boolean }> | ((prev: Array<{ id: 'date' | 'merchant' | 'type' | 'amount' | 'hash'; label: string; visible: boolean }>) => Array<{ id: 'date' | 'merchant' | 'type' | 'amount' | 'hash'; label: string; visible: boolean }>)) => {
    setColumnsState(prev => {
      const next = typeof newCols === 'function' ? newCols(prev) : newCols;
      try {
        localStorage.setItem('spreadsheet_columns_v1', JSON.stringify(next));
      } catch (e) {
        console.error('Failed to save columns to storage', e);
      }
      return next;
    });
  };

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(index));
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    
    const updated = [...columns];
    const draggedItem = updated[draggedIndex];
    updated.splice(draggedIndex, 1);
    updated.splice(index, 0, draggedItem);
    
    setDraggedIndex(index);
    setColumns(updated);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const generateExportContent = (delim: 'comma' | 'semicolon' | 'tab') => {
    const data = MOCK_LEDGER_DATA[activeTab as keyof typeof MOCK_LEDGER_DATA] || [];
    if (data.length === 0) return { content: '', filename: '' };

    const delimiterChar = delim === 'semicolon' ? ';' : delim === 'tab' ? '\t' : ',';
    const extension = delim === 'tab' ? 'tsv' : 'csv';

    // Generate dynamic CSV/TSV headers based on active visible and ordered columns
    const activeCols = columns.filter(col => col.visible);
    
    const headers = ['Row', ...activeCols.map(c => {
      if (c.id === 'date') return 'Transaction Date';
      if (c.id === 'merchant') return 'Merchant/Description';
      if (c.id === 'type') return 'Type';
      if (c.id === 'amount') return 'Debit Amount';
      return 'Deduplication Hash (MD5)';
    }), 'Status'];

    const rows = data.map((row, idx) => {
      const parts = [String(idx + 2)];
      activeCols.forEach(col => {
        if (col.id === 'date') {
          parts.push(`"${row.date.replace(/"/g, '""')}"`);
        } else if (col.id === 'merchant') {
          parts.push(`"${row.merchant.replace(/"/g, '""')}"`);
        } else if (col.id === 'type') {
          parts.push(`"${row.type.replace(/"/g, '""')}"`);
        } else if (col.id === 'amount') {
          parts.push(String(row.type === 'Debit' ? row.amount : -row.amount));
        } else if (col.id === 'hash') {
          parts.push(`"${row.hash.replace(/"/g, '""')}"`);
        }
      });
      parts.push(row.isDuplicate ? '"Duplicate Skipped"' : '"Clean Ingested"');
      return parts;
    });

    const content = [
      headers.join(delimiterChar),
      ...rows.map(e => e.join(delimiterChar))
    ].join('\n');

    const filename = `ledger_${activeTab}_export.${extension}`;
    return { content, filename };
  };

  const handleExportCSV = () => {
    const { content, filename } = generateExportContent(exportDelimiter);
    if (!content) return;
    setCsvPreviewContent(content);
    setCsvPreviewFilename(filename);
    setIsCopied(false);
  };

  const triggerDownloadCSV = (content: string, filename: string) => {
    const mimeType = filename.endsWith('.tsv') ? 'text/tab-separated-values;charset=utf-8;' : 'text/csv;charset=utf-8;';
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setCsvPreviewContent(null);
  };

  const handleCopyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  // Dynamically resolve sheets based on active card profiles in configuration
  const cardTabs = useMemo(() => {
    return config.cards.map(c => ({
      key: `${c.bankName}_${c.cardNumber}`,
      label: `${c.bankName}_${c.cardNumber}`,
      bankName: c.bankName,
      cardNumber: c.cardNumber,
      isActive: c.isActive
    }));
  }, [config.cards]);

  // Aggregate totals and compute chart elements dynamically
  const consolidatedMetrics = useMemo(() => {
    let totalSpend = 0;
    let cardCount = 0;
    const itemsByCard: { name: string; spend: number; count: number }[] = [];

    cardTabs.forEach(tab => {
      if (!tab.isActive) return;
      cardCount++;
      const dataKey = `${tab.bankName}_${tab.cardNumber}` as keyof typeof MOCK_LEDGER_DATA;
      const rawRecords = MOCK_LEDGER_DATA[dataKey] || [];
      
      // Calculate exclusively and filter out mock duplicates
      const debitTransactions = rawRecords.filter(t => t.type === 'Debit' && !t.isDuplicate);
      const cardTotalSpend = debitTransactions.reduce((acc, curr) => acc + curr.amount, 0);
      totalSpend += cardTotalSpend;

      itemsByCard.push({
        name: `Card_${tab.cardNumber}`,
        spend: cardTotalSpend,
        count: debitTransactions.length
      });
    });

    // Fallback if no cards active
    if (itemsByCard.length === 0) {
      itemsByCard.push({ name: 'HDFC_8002', spend: 3658.50, count: 4 });
      totalSpend = 3658.50;
      cardCount = 1;
    }

    const highestCard = [...itemsByCard].sort((a,b) => b.spend - a.spend)[0]?.name || 'N/A';

    return {
      totalSpend,
      cardCount,
      highestCard,
      itemsByCard
    };
  }, [cardTabs]);

  // Compute pagination parameters dynamically
  const currentTabRecords = useMemo(() => {
    if (activeTab === 'dashboard') return [];
    return MOCK_LEDGER_DATA[activeTab as keyof typeof MOCK_LEDGER_DATA] || [];
  }, [activeTab]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(currentTabRecords.length / pageSize));
  }, [currentTabRecords, pageSize]);
  
  const activePage = useMemo(() => {
    return Math.min(currentPage, totalPages);
  }, [currentPage, totalPages]);

  const paginatedRecords = useMemo(() => {
    const startIndex = (activePage - 1) * pageSize;
    return currentTabRecords.slice(startIndex, startIndex + pageSize);
  }, [currentTabRecords, activePage, pageSize]);

  // Format currency
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div id="spreadsheet-viewport" className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full min-h-[600px] font-sans">
      
      {/* Spreadsheet Header Utility */}
      <div id="sheet-meta-header" className="bg-emerald-800 text-white p-4 flex justify-between items-center bg-radial from-emerald-800 to-emerald-950">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-emerald-700 rounded text-emerald-100 border border-emerald-600">
            <LayoutGrid className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h4 id="sheet-title-text" className="font-semibold text-sm leading-tight font-sans tracking-wide">
              {config.targetLedgerName || 'Credit Card Master Expenses Ledger'}
            </h4>
            <p className="text-xxs text-emerald-200 mt-0.5">Google Sheets Live Sandbox Preview • Auto-Synchronized via Apps Script</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-emerald-700 bg-opacity-65 text-emerald-200 px-2 py-0.5 rounded text-xxs font-mono">
            file_id: 1SS...dfXp
          </span>
        </div>
      </div>

      {/* Sheet Tab Selection Buttons */}
      <div id="sheet-nav-tabs" className="bg-gray-100 border-b border-gray-200 flex items-center px-1 py-1 overflow-x-auto gap-0.5">
        <button
          id="sheet-tab-dashboard"
          onClick={() => {
            setActiveTab('dashboard');
            setCurrentPage(1);
          }}
          className={`px-3.5 py-1.5 rounded-t text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer ${
            activeTab === 'dashboard'
              ? 'bg-white text-emerald-700 border-t-2 border-emerald-600 shadow-xxs'
              : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
          📊 Executive Dashboard
        </button>

        {cardTabs.map(tab => (
          tab.isActive && (
            <button
              key={tab.key}
              id={`sheet-tab-${tab.key}`}
              onClick={() => {
                setActiveTab(tab.key);
                setCurrentPage(1);
              }}
              className={`px-3.5 py-1.5 rounded-t text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer ${
                activeTab === tab.key
                  ? 'bg-white text-emerald-700 border-t-2 border-emerald-600 shadow-xxs'
                  : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5 text-blue-500" />
              {tab.label}
            </button>
          )
        ))}
      </div>

      {/* Spreadsheet Main Canvas Area */}
      <div id="spreadsheet-grid-canvas" className="flex-1 bg-slate-50 overflow-auto p-5 relative">
        
        {/* A. EXECUTIVE DASHBOARD RENDER */}
        {activeTab === 'dashboard' && (
          <div id="dashboard-tab-content" className="space-y-6 max-w-5xl mx-auto">
            
            {/* Portfolio Overview KPI Cards */}
            <div id="kpi-cards-grid" className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-3xs flex items-center gap-4">
                <div className="p-3 bg-red-50 text-red-600 rounded-xl">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xxs font-semibold text-gray-400 uppercase tracking-widest block">Total Card Expenses</span>
                  <span className="text-lg font-bold text-gray-800 font-sans tracking-tight">
                    {formatCurrency(consolidatedMetrics.totalSpend)}
                  </span>
                  <span className="text-xxs text-emerald-600 font-medium block mt-0.5">Calculated via =SUM(C5:C10)</span>
                </div>
              </div>

              <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-3xs flex items-center gap-4">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                  <Layers className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xxs font-semibold text-gray-400 uppercase tracking-widest block">Card Assets Linked</span>
                  <span className="text-lg font-bold text-gray-800 font-sans tracking-tight">
                    {consolidatedMetrics.cardCount} Ledger Tabs
                  </span>
                  <span className="text-xxs text-indigo-500 font-medium block mt-0.5">Active directory profiles</span>
                </div>
              </div>

              <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-3xs flex items-center gap-4">
                <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                  <Sparkles className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <span className="text-xxs font-semibold text-gray-400 uppercase tracking-widest block">Highest Outflow Card</span>
                  <span className="text-md font-bold text-amber-800 uppercase tracking-tight block">
                    {consolidatedMetrics.highestCard}
                  </span>
                  <span className="text-xxs text-amber-600 font-medium block mt-0.5">Utilizes heaviest balance ratio</span>
                </div>
              </div>
            </div>

            {/* Simulated Google Sheet Charts Panel */}
            <div id="recharts-dashboard" className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Stacked spending per Card */}
              <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-3xs">
                <h5 className="font-sans font-semibold text-xs text-gray-700 uppercase tracking-wider mb-3">Expenses per Card Account</h5>
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={consolidatedMetrics.itemsByCard}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} />
                      <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString()}`, 'Spent']} />
                      <Bar dataKey="spend" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Pie Allocation Distribution */}
              <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-3xs">
                <h5 className="font-sans font-semibold text-xs text-gray-700 uppercase tracking-wider mb-3">Wallet Outflow Distribution</h5>
                <div className="h-[250px] w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={consolidatedMetrics.itemsByCard}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={4}
                        dataKey="spend"
                      >
                        {consolidatedMetrics.itemsByCard.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString()}`, 'Spent']} />
                      <Legend verticalAlign="bottom" height={24} iconType="circle" wrapperStyle={{ fontSize: 10 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Dynamic Dashboard Index Sheet view */}
            <div id="compilation-list-grid" className="bg-white rounded-xl border border-gray-100 shadow-3xs overflow-hidden">
              <div className="bg-slate-50 px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                <h5 className="font-sans font-semibold text-xs text-gray-700 uppercase tracking-wider">Sheet Summary Card Indexes</h5>
                <span className="text-xxs text-gray-400">Formula driven cell matrix</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-[#f3f4f6]">
                    <tr className="border-b border-gray-200">
                      <th className="p-3 text-xxs font-bold text-gray-500 uppercase tracking-wider pl-6">Card Profile ID</th>
                      <th className="p-3 text-xxs font-bold text-gray-500 uppercase tracking-wider">Associated Agency</th>
                      <th className="p-3 text-xxs font-bold text-gray-500 uppercase tracking-wider text-right">Extracted Spends</th>
                      <th className="p-3 text-xxs font-bold text-gray-500 uppercase tracking-wider text-right pr-6">Ledger Records</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {consolidatedMetrics.itemsByCard.map((item, index) => (
                      <tr key={index} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3 font-mono text-gray-700 pl-6">{item.name}</td>
                        <td className="p-3 text-gray-600 font-medium">Auto-Ingested</td>
                        <td className="p-3 font-mono text-gray-800 text-right font-semibold">{formatCurrency(item.spend)}</td>
                        <td className="p-3 font-mono text-gray-500 text-right pr-6">{item.count} rows loaded</td>
                      </tr>
                    ))}
                    <tr className="bg-red-50 bg-opacity-40">
                      <td className="p-3 font-semibold text-gray-800 pr-6 pl-6" colSpan={2}>Grand Total Card Expenditures:</td>
                      <td className="p-3 font-mono text-red-650 text-right font-bold border-t-2 border-red-250">
                        {formatCurrency(consolidatedMetrics.totalSpend)}
                      </td>
                      <td className="p-3 text-gray-400 text-right pr-6">
                        {consolidatedMetrics.itemsByCard.reduce((a,c)=>a+c.count, 0)} total Rows
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
          </div>
        )}

        {/* B. DETAILED CARD TAB VIEW */}
        {activeTab !== 'dashboard' && (
          <div id="card-sheet-content" className="max-w-5xl mx-auto space-y-4">
            
            <div className="bg-yellow-50 border border-yellow-105 p-4 rounded-xl flex gap-3 text-xs text-yellow-800">
              <Check className="w-5 h-5 text-emerald-600 mt-0.5 hover:scale-110 transition-transform" />
              <div>
                <strong>Deduplication Shield Engaged:</strong> This panel simulates how the Google Apps Script's
                unique MD5 hashing system analyzes incoming transactions. Red highlighted items are matches
                from earlier statement cycles, indicating that the pipeline has safely filtered them out without duplicating spreadsheet logging lines.
              </div>
            </div>

            {/* Raw Grid Table mimicking Excel */}
            <div id="excel-grid-simulator" className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-2xs">
              
              {/* Table Header Controls */}
              <div className="bg-slate-50 border-b border-gray-200 px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="flex items-center gap-2">
                  <span className="font-sans text-xs font-bold text-gray-755 uppercase tracking-wide">
                    Sheet Ledger: {activeTab}
                  </span>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xxs">
                    {(MOCK_LEDGER_DATA[activeTab as keyof typeof MOCK_LEDGER_DATA] || []).length} rows
                  </span>
                </div>
                
                <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto shrink-0">
                  <div className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-250 border border-gray-200 px-2 py-1 rounded-lg transition-colors">
                    <span className="text-[10px] font-sans font-semibold text-gray-500 uppercase tracking-widest pl-0.5">Delimiter:</span>
                    <select
                      id="export-delimiter-selector"
                      value={exportDelimiter}
                      onChange={(e) => setExportDelimiter(e.target.value as 'comma' | 'semicolon' | 'tab')}
                      className="bg-transparent border-none p-0 pr-1 text-xs font-bold text-gray-755 focus:outline-hidden cursor-pointer"
                    >
                      <option value="comma">Comma (,)</option>
                      <option value="semicolon">Semicolon (;)</option>
                      <option value="tab">Tab (\t)</option>
                    </select>
                  </div>

                  {/* Multi-select Dropdown to toggle column visibility */}
                  <div className="relative" ref={dropdownRef}>
                    <button
                      id="column-visibility-dropdown-trigger"
                      type="button"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className={`px-3 py-1.5 font-sans text-xs font-medium rounded-lg flex items-center gap-1.5 cursor-pointer shadow-3xs transition-all border ${
                        isDropdownOpen
                          ? 'bg-slate-100 border-gray-350 text-gray-800'
                          : 'bg-white hover:bg-slate-100/70 border-gray-200 text-gray-600'
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Columns ({columns.filter(c => c.visible).length}/{columns.length})</span>
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isDropdownOpen && (
                      <div 
                        id="column-visibility-dropdown-menu" 
                        className="absolute right-0 mt-1.5 w-48 bg-white border border-gray-200 rounded-xl shadow-lg py-1.5 z-50 animate-fadeIn"
                      >
                        <div className="px-3 py-1 border-b border-gray-100 mb-1">
                          <span className="text-[10px] font-sans font-bold text-gray-400 uppercase tracking-wider">Toggle Columns</span>
                        </div>
                        
                        {/* Mini Search Bar */}
                        <div className="px-2.5 pb-2 pt-0.5 border-b border-gray-100 mb-1">
                          <div className="relative flex items-center">
                            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2 pointer-events-none" />
                            <input
                              type="text"
                              value={colSearchQuery}
                              onChange={(e) => setColSearchQuery(e.target.value)}
                              placeholder="Search columns..."
                              className="w-full pl-7 pr-6 py-1 bg-gray-50 border border-gray-200 rounded-lg text-xs font-sans text-gray-700 placeholder-gray-400 focus:outline-hidden focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all text-[11px]"
                            />
                            {colSearchQuery && (
                              <button
                                type="button"
                                onClick={() => setColSearchQuery('')}
                                className="absolute right-1.5 p-0.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col max-h-[160px] overflow-y-auto">
                          {columns.filter(col => col.label.toLowerCase().includes(colSearchQuery.toLowerCase())).length === 0 ? (
                            <div className="px-3 py-3 text-center text-[10px] text-gray-400 font-sans">
                              No results found
                            </div>
                          ) : (
                            columns
                              .filter(col => col.label.toLowerCase().includes(colSearchQuery.toLowerCase()))
                              .map((col) => (
                                <label
                                  key={col.id}
                                  className="flex items-center gap-2.5 px-3 py-1.5 hover:bg-slate-50 transition-colors cursor-pointer select-none text-xs font-medium text-gray-700"
                                >
                                  <input
                                    type="checkbox"
                                    checked={col.visible}
                                    onChange={() => {
                                      const updated = columns.map(c => {
                                        if (c.id === col.id) {
                                          const otherVisible = columns.filter(other => other.id !== col.id && other.visible).length > 0;
                                          return { ...c, visible: otherVisible ? !c.visible : c.visible };
                                        }
                                        return c;
                                      });
                                      setColumns(updated);
                                    }}
                                    className="rounded text-emerald-600 focus:ring-emerald-500 border-gray-300 accent-emerald-600 h-3.5 w-3.5 cursor-pointer"
                                  />
                                  <span className="font-sans">{col.label}</span>
                                </label>
                              ))
                          )}
                        </div>
                        
                        <div className="px-3 py-1 border-t border-gray-100 mt-1.5 pt-1.5 flex justify-between items-center">
                          <button
                            type="button"
                            onClick={() => {
                              setColumns(columns.map(c => ({ ...c, visible: true })));
                            }}
                            className="text-[10px] font-sans font-bold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
                          >
                            Show All
                          </button>
                          <span className="text-[9px] text-gray-400 font-sans">Real-time sync</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    id="toggle-column-configurator-btn"
                    type="button"
                    onClick={() => setShowConfigurator(!showConfigurator)}
                    className={`px-3 py-1.5 font-sans text-xs font-medium rounded-lg flex items-center gap-1.5 cursor-pointer shadow-3xs transition-all border ${
                      showConfigurator
                        ? 'bg-slate-800 border-slate-900 text-white'
                        : 'bg-white hover:bg-slate-100/70 border-gray-200 text-gray-600'
                    }`}
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>Configure Columns</span>
                  </button>

                  <button
                    id="export-ledger-csv-btn"
                    type="button"
                    onClick={handleExportCSV}
                    className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white font-sans text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-3xs transition-all border border-emerald-800/10 hover:border-emerald-850 shrink-0"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export to {exportDelimiter === 'tab' ? 'TSV' : 'CSV'}</span>
                  </button>
                </div>
              </div>
                           {/* Collapsible Column Configurator Panel */}
              {showConfigurator && (
                <div id="column-reorder-toggle-panel" className="bg-slate-50 border-b border-gray-250 p-4 animate-fadeIn transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                    <div>
                      <h5 className="font-sans font-bold text-xs text-slate-800 flex items-center gap-1.5 uppercase tracking-wide">
                        <Settings className="w-3.5 h-3.5 text-slate-600 animate-spin-slow" />
                        Spreadsheet Column Configuration
                      </h5>
                      <p className="text-[10px] text-gray-500 mt-0.5">Drag & drop the column blocks (using the grip handles) or use the left/right arrows to rearrange columns. Toggle the eye icon to hide/show. Layout is persisted as default for future exports.</p>
                    </div>
                    <button 
                      type="button"
                      onClick={() => {
                        setColumns([
                          { id: 'date', label: 'Date', visible: true },
                          { id: 'merchant', label: 'Merchant', visible: true },
                          { id: 'type', label: 'Type', visible: true },
                          { id: 'amount', label: 'Amount', visible: true },
                          { id: 'hash', label: 'Hash', visible: true }
                        ]);
                      }}
                      className="px-2 py-1 text-[10px] font-sans font-semibold bg-white border border-gray-200 hover:bg-gray-100 rounded text-slate-600 transition-all cursor-pointer self-start"
                    >
                      Reset Defaults
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2.5">
                    {columns.map((col, index) => {
                      const isLeftDisabled = index === 0;
                      const isRightDisabled = index === columns.length - 1;
                      return (
                        <div 
                          key={col.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, index)}
                          onDragOver={(e) => handleDragOver(e, index)}
                          onDragEnd={handleDragEnd}
                          className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border transition-all cursor-grab active:cursor-grabbing select-none ${
                            draggedIndex === index
                              ? 'bg-blue-50 border-blue-300 opacity-60 scale-95 shadow-inner'
                              : col.visible 
                                ? 'bg-white border-gray-200 hover:border-gray-300 shadow-xxs' 
                                : 'bg-gray-100 border-gray-150 text-gray-400'
                          }`}
                        >
                          {/* Drag handle */}
                          <div className="flex items-center text-gray-400 shrink-0">
                            <GripVertical className="w-3.5 h-3.5" />
                          </div>

                          {/* Toggle visibility */}
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...columns];
                              updated[index].visible = !updated[index].visible;
                              if (updated.filter(c => c.visible).length === 0) {
                                return; // enforce at least one column visible
                              }
                              setColumns(updated);
                            }}
                            title={col.visible ? 'Hide column' : 'Show column'}
                            className={`p-1 rounded-md transition-colors cursor-pointer ${
                              col.visible ? 'hover:bg-slate-105 text-slate-700' : 'hover:bg-slate-205 text-gray-400'
                            }`}
                          >
                            {col.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                          </button>

                          <span className="text-xs font-semibold font-sans min-w-[65px]">
                            {col.label}
                          </span>

                          {/* Reorder Buttons */}
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              disabled={isLeftDisabled}
                              onClick={(e) => {
                                e.stopPropagation();
                                const updated = [...columns];
                                const temp = updated[index];
                                updated[index] = updated[index - 1];
                                updated[index - 1] = temp;
                                setColumns(updated);
                              }}
                              title="Move left"
                              className="p-1 rounded-md bg-slate-50 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed border border-slate-200 cursor-pointer"
                            >
                              <ArrowLeft className="w-3 h-3 text-slate-600" />
                            </button>
                            <button
                              type="button"
                              disabled={isRightDisabled}
                              onClick={(e) => {
                                e.stopPropagation();
                                const updated = [...columns];
                                const temp = updated[index];
                                updated[index] = updated[index + 1];
                                updated[index + 1] = temp;
                                setColumns(updated);
                              }}
                              title="Move right"
                              className="p-1 rounded-md bg-slate-50 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed border border-slate-200 cursor-pointer"
                            >
                              <ArrowRight className="w-3 h-3 text-slate-600" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse font-sans text-xs">
                  <thead>
                    <tr className="bg-gray-100 text-gray-600 border-b border-gray-200">
                      <th className="p-2 border-r border-gray-200 text-center text-xxs font-mono text-gray-400 w-10">Row</th>
                      {columns.filter(c => c.visible).map(c => {
                        let label = 'Column';
                        let alignClass = '';
                        if (c.id === 'date') label = 'Transaction Date';
                        else if (c.id === 'merchant') label = 'Merchant/Description';
                        else if (c.id === 'type') label = 'Type';
                        else if (c.id === 'amount') { label = 'Debit amount ($)'; alignClass = 'text-right'; }
                        else if (c.id === 'hash') label = 'Deduplication Hash (MD5)';
                        
                        return (
                          <th key={c.id} className={`p-3 border-r border-gray-250 font-semibold text-gray-700 ${alignClass}`}>
                            {label}
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {paginatedRecords.map((row, idx) => {
                      const absoluteRowIndex = (activePage - 1) * pageSize + idx + 2;
                      return (
                        <tr 
                          key={idx} 
                          className={`transition-colors ${
                            row.isDuplicate 
                              ? 'bg-red-50 hover:bg-red-100 bg-opacity-70 text-red-900 border-l-4 border-red-500' 
                              : 'hover:bg-slate-50 text-gray-700'
                          }`}
                        >
                          <td className="p-2 text-center font-mono text-xxs text-gray-400 bg-gray-50 border-r border-gray-200">{absoluteRowIndex}</td>
                          {columns.filter(c => c.visible).map(c => {
                            if (c.id === 'date') {
                              return <td key="date" className="p-3 border-r border-gray-200 font-mono">{row.date}</td>;
                            }
                            if (c.id === 'merchant') {
                              return (
                                <td key="merchant" className="p-3 border-r border-gray-200 font-medium">
                                  <div className="flex items-center justify-between">
                                    <span>{row.merchant}</span>
                                    {row.isDuplicate && (
                                      <span className="bg-red-100 text-red-800 text-[9px] font-bold px-1.5 py-0.5 rounded-sm flex items-center gap-1">
                                        <AlertTriangle className="w-2.5 h-2.5" /> Duplicate Skipped
                                      </span>
                                    )}
                                  </div>
                                </td>
                              );
                            }
                            if (c.id === 'type') {
                              return (
                                <td key="type" className="p-3 border-r border-gray-200 text-center">
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                                    row.type === 'Debit' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-850'
                                  }`}>
                                    {row.type}
                                  </span>
                                </td>
                              );
                            }
                            if (c.id === 'amount') {
                              return (
                                <td key="amount" className="p-3 border-r border-gray-200 text-right font-mono font-medium">
                                  {row.type === 'Debit' ? formatCurrency(row.amount) : `-${formatCurrency(row.amount)}`}
                                </td>
                              );
                            }
                            if (c.id === 'hash') {
                              return <td key="hash" className="p-3 font-mono text-[10px] text-gray-400">{row.hash}</td>;
                            }
                            return null;
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Table Pagination Controls */}
              <div id="table-pagination-controls" className="bg-slate-50 border-t border-gray-200 px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-gray-600 font-sans">
                
                {/* Rows per page selector */}
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Rows per page:</span>
                  <select
                    id="page-size-selector"
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="bg-white border border-gray-200 px-2 py-1 rounded text-xs text-gray-700 outline-none hover:border-gray-350 hover:bg-slate-100/50 transition-all cursor-pointer font-semibold"
                  >
                    {[5, 10, 20, 50, 100].map(size => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                </div>

                {/* Displaying row range range information */}
                <div className="text-[11px] font-medium text-gray-400 uppercase tracking-wider text-center md:text-left">
                  Showing <strong className="text-gray-700">{currentTabRecords.length === 0 ? 0 : (activePage - 1) * pageSize + 1}</strong> to <strong className="text-gray-700">{Math.min(currentTabRecords.length, activePage * pageSize)}</strong> of <strong className="text-gray-700">{currentTabRecords.length}</strong> rows
                </div>

                {/* Action Controls for Navigation */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    id="prev-page-btn"
                    type="button"
                    disabled={activePage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    className="p-1 px-2 bg-white border border-gray-200 hover:border-gray-300 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed disabled:bg-gray-50 flex items-center gap-1 cursor-pointer shadow-3xs transition-all text-xs font-semibold select-none"
                  >
                    <ChevronLeft className="w-3.5 h-3.5 text-gray-500" />
                    <span>Prev</span>
                  </button>

                  <div className="flex items-center gap-1 max-w-[150px] overflow-x-auto px-1 scrollbar-thin">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                      <button
                        key={pageNum}
                        id={`page-btn-${pageNum}`}
                        type="button"
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-6.5 h-6.5 flex items-center justify-center rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          activePage === pageNum
                            ? 'bg-emerald-700 text-white shadow-3xs hover:bg-emerald-800'
                            : 'bg-white hover:bg-slate-100/65 text-gray-650 hover:text-gray-900 border border-gray-200'
                        }`}
                      >
                        {pageNum}
                      </button>
                    ))}
                  </div>

                  <button
                    id="next-page-btn"
                    type="button"
                    disabled={activePage === totalPages}
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    className="p-1 px-2 bg-white border border-gray-200 hover:border-gray-300 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed disabled:bg-gray-50 flex items-center gap-1 cursor-pointer shadow-3xs transition-all text-xs font-semibold select-none"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
                  </button>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* HIGH-FIDELITY CSV EXPORT PREVIEW MODAL */}
        {csvPreviewContent !== null && (
          <div id="csv-preview-modal" className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl border border-gray-150 shadow-xl max-w-2xl w-full mx-4 overflow-hidden transform animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
              
              {/* Modal Header */}
              <div className="px-5 py-4 border-b border-gray-150 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-sans font-bold text-gray-800 text-sm">Preview CSV Statement</h4>
                    <p className="font-sans text-[10px] text-gray-500 font-medium">Verify spreadsheet rows prior to executing the download link.</p>
                  </div>
                </div>
                
                <button
                  id="csv-preview-close-x"
                  type="button"
                  onClick={() => setCsvPreviewContent(null)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-150/50 rounded-lg transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body / Scrollable CSV Code Viewer */}
              <div className="p-5 overflow-y-auto flex-1 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-medium text-gray-500">
                  <div className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 border border-gray-200 px-2 py-1 rounded-lg transition-colors">
                    <span className="text-[10px] font-sans font-semibold text-gray-500 uppercase tracking-widest pl-0.5">Delimiter:</span>
                    <select
                      id="modal-export-delimiter-selector"
                      value={exportDelimiter}
                      onChange={(e) => {
                        const newDelim = e.target.value as 'comma' | 'semicolon' | 'tab';
                        setExportDelimiter(newDelim);
                        const { content, filename } = generateExportContent(newDelim);
                        setCsvPreviewContent(content);
                        setCsvPreviewFilename(filename);
                        setIsCopied(false);
                      }}
                      className="bg-transparent border-none p-0 pr-1 text-xs font-bold text-gray-755 focus:outline-hidden cursor-pointer"
                    >
                      <option value="comma">Comma (,)</option>
                      <option value="semicolon">Semicolon (;)</option>
                      <option value="tab">Tab (\t)</option>
                    </select>
                  </div>
                  <span className="font-mono bg-slate-100 text-slate-705 px-2 py-1 rounded border border-slate-200/50 self-start sm:self-auto text-[11px]">
                    Filename: {csvPreviewFilename}
                  </span>
                  <button
                    id="csv-preview-copy-btn"
                    type="button"
                    onClick={() => handleCopyToClipboard(csvPreviewContent)}
                    className="flex items-center gap-1.5 px-2.5 py-1 bg-white hover:bg-slate-50 text-gray-600 hover:text-gray-800 border border-gray-200 rounded-lg text-xs font-semibold cursor-pointer shadow-3xs transition-all self-start sm:self-auto"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy {exportDelimiter === 'tab' ? 'TSV' : 'CSV'}</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="relative mt-2">
                  <pre 
                    id="csv-content-scrollpane"
                    className="bg-slate-950 text-slate-100 p-4 rounded-lg font-mono text-[11px] leading-relaxed overflow-x-auto max-h-80 border border-slate-800 shadow-inner select-all custom-dark-scrollbar"
                  >
                    {csvPreviewContent}
                  </pre>
                </div>
                
                <div className="bg-blue-50 border border-blue-100 p-3.5 rounded-lg flex gap-2 w-full text-[11px] text-blue-800 font-medium font-sans">
                  <span className="text-blue-500 text-sm">💡</span>
                  <span>
                    Each line includes columns for <strong>Transaction Date</strong>, <strong>Merchant</strong>, <strong>Type</strong>, <strong>Debit Amount</strong>, and the unique <strong>Deduplication Hash (MD5)</strong> used by Google Apps Script triggers.
                  </span>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-5 py-3.5 border-t border-gray-150 flex items-center justify-end gap-2 bg-slate-50 shrink-0">
                <button
                  id="csv-preview-cancel-btn"
                  type="button"
                  onClick={() => setCsvPreviewContent(null)}
                  className="px-3.5 py-2 bg-white hover:bg-gray-50 text-gray-650 border border-gray-200 rounded-lg text-xs font-semibold cursor-pointer transition-all hover:text-gray-900 shadow-3xs font-sans"
                >
                  Cancel
                </button>
                <button
                  id="csv-preview-download-btn"
                  type="button"
                  onClick={() => triggerDownloadCSV(csvPreviewContent, csvPreviewFilename)}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold cursor-pointer border border-emerald-800 shadow-sm transition-all hover:border-emerald-850 flex items-center gap-1.5 shadow-3xs font-sans"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download {csvPreviewFilename.endsWith('.tsv') ? 'TSV' : 'CSV'} File</span>
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
      
    </div>
  );
}
