import React, { useState, useMemo } from 'react';
import { AppConfig, Transaction } from '../types';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { LayoutGrid, CreditCard, Layers, Sparkles, TrendingUp, HelpCircle, Check, AlertTriangle } from 'lucide-react';

interface SpreadsheetPreviewProps {
  config: AppConfig;
}

// Fixed mock databases for standard interactive previews
const MOCK_LEDGER_DATA: Record<string, Transaction[]> = {
  HDFC_8002: [
    { date: '2026-05-10', merchant: 'Starbucks Coffee', type: 'Debit', amount: 520.00, hash: 'ec4e9c70404fa3a3fdae' },
    { date: '2026-05-12', merchant: 'Amazon Shopping Retail', type: 'Debit', amount: 1840.50, hash: 'bf9161aed41fe6a1fda8' },
    { date: '2026-05-12', merchant: 'Amazon Shopping Retail', type: 'Debit', amount: 1840.50, isDuplicate: true, hash: 'bf9161aed41fe6a1fda8' }, // duplicate entry
    { date: '2026-05-15', merchant: 'CRED HDFC Bill Pay', type: 'Credit', amount: 10000.00, hash: '13a4bc6030ea6918daaa' },
    { date: '2026-05-18', merchant: 'Uber Eats Deliveries', type: 'Debit', amount: 650.00, hash: '9b0c2af240ffae3a8fda' },
    { date: '2026-05-22', merchant: 'Netflix Subscription', type: 'Debit', amount: 649.00, hash: 'c9f0eb10ed7df7a88002' },
    { date: '2026-05-22', merchant: 'Netflix Subscription', type: 'Debit', amount: 649.00, isDuplicate: true, hash: 'c9f0eb10ed7df7a88002' } // duplicate entry
  ],
  ICICI_6171: [
    { date: '2026-05-04', merchant: 'Adobe Creative Cloud Suite', type: 'Debit', amount: 4400.00, hash: 'fc8a90ec4e3bf602ea91' },
    { date: '2026-05-08', merchant: 'Steam Online Gaming', type: 'Debit', amount: 3250.00, hash: 'b9ea897a61c3bf708ee2' },
    { date: '2026-05-12', merchant: 'Walmart Family Groceries', type: 'Debit', amount: 6800.00, hash: 'a1b2c3d4e5f67890f1e2' },
    { date: '2026-05-14', merchant: 'ICICI Autopay Settlement', type: 'Credit', amount: 12000.00, hash: 'f2e3d4c5b6a78901e1d2' },
    { date: '2026-05-25', merchant: 'Airbnb Summer Retreat', type: 'Debit', amount: 18500.00, hash: '3e4f5a6b7c8d9e0f1a2b' }
  ],
  SBI_4991: [
    { date: '2026-05-02', merchant: 'Shell Gas Station Fill', type: 'Debit', amount: 2800.00, hash: '7c8da9bf0ea98c76dafb' },
    { date: '2026-05-15', merchant: 'Zara Apparel Store', type: 'Debit', amount: 6200.00, hash: '8e9fa0bc1da22fc8e3db' },
    { date: '2026-05-28', merchant: 'Zomato Food Delivery', type: 'Debit', amount: 1120.00, hash: '9fa0b1c2d3ea90fcde4b' }
  ],
  UNSORTED: [
    { date: '2026-05-18', merchant: 'Unknown Merchant Store', type: 'Debit', amount: 1500.00, hash: 'f6b7c8d9ea987b6d1f02' }
  ]
};

const CHART_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#a855f7', '#64748b'];

export default function SpreadsheetPreview({ config }: SpreadsheetPreviewProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | string>('dashboard');

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
          onClick={() => setActiveTab('dashboard')}
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
              onClick={() => setActiveTab(tab.key)}
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
            
            <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-xl flex gap-3 text-xs text-yellow-800">
              <Check className="w-5 h-5 text-emerald-600 mt-0.5 hover:scale-110 transition-transform" />
              <div>
                <strong>Deduplication Shield Engaged:</strong> This panel simulates how the Google Apps Script's
                unique MD5 hashing system analyzes incoming transactions. Red highlighted items are matches
                from earlier statement cycles, indicating that the pipeline has safely filtered them out without duplicating spreadsheet logging lines.
              </div>
            </div>

            {/* Raw Grid Table mimicking Excel */}
            <div id="excel-grid-simulator" className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse font-sans text-xs">
                  <thead>
                    <tr className="bg-gray-100 text-gray-600 border-b border-gray-200">
                      <th className="p-2 border-r border-gray-200 text-center text-xxs font-mono text-gray-400 w-10">Row</th>
                      <th className="p-3 border-r border-gray-250 font-semibold text-gray-700">Transaction Date</th>
                      <th className="p-3 border-r border-gray-250 font-semibold text-gray-700">Merchant/Description</th>
                      <th className="p-3 border-r border-gray-250 font-semibold text-gray-700">Type</th>
                      <th className="p-3 border-r border-gray-250 font-semibold text-gray-700 text-right">Debit amount ($)</th>
                      <th className="p-3 font-semibold text-gray-700">Deduplication Hash (MD5)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {(MOCK_LEDGER_DATA[activeTab as keyof typeof MOCK_LEDGER_DATA] || []).map((row, idx) => (
                      <tr 
                        key={idx} 
                        className={`transition-colors ${
                          row.isDuplicate 
                            ? 'bg-red-50 hover:bg-red-100 bg-opacity-70 text-red-900 border-l-4 border-red-500' 
                            : 'hover:bg-slate-50 text-gray-700'
                        }`}
                      >
                        <td className="p-2 text-center font-mono text-xxs text-gray-400 bg-gray-50 border-r border-gray-200">{idx + 2}</td>
                        <td className="p-3 border-r border-gray-200 font-mono">{row.date}</td>
                        <td className="p-3 border-r border-gray-200 font-medium">
                          <div className="flex items-center justify-between">
                            <span>{row.merchant}</span>
                            {row.isDuplicate && (
                              <span className="bg-red-100 text-red-800 text-[9px] font-bold px-1.5 py-0.5 rounded-sm flex items-center gap-1">
                                <AlertTriangle className="w-2.5 h-2.5" /> Duplicate Skipped
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-3 border-r border-gray-200 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            row.type === 'Debit' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-850'
                          }`}>
                            {row.type}
                          </span>
                        </td>
                        <td className="p-3 border-r border-gray-200 text-right font-mono font-medium">
                          {row.type === 'Debit' ? formatCurrency(row.amount) : `-${formatCurrency(row.amount)}`}
                        </td>
                        <td className="p-3 font-mono text-[10px] text-gray-400">{row.hash}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      </div>
      
    </div>
  );
}
