import React, { useState } from 'react';
import { AppConfig, CardProfile } from '../types';
import { Plus, Trash2, Key, FolderOpen, Mail, ShieldAlert, FileSpreadsheet, CreditCard, Landmark, Sparkles, Building, Coins, Globe, Compass, Star, Check, Search, X } from 'lucide-react';

// Bank icon/logo representations for visual registry distinction
const getBankLogoDetails = (bankName: string) => {
  const name = bankName.toUpperCase();
  if (name.includes('HDFC')) {
    return {
      bg: 'bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800 text-white border-blue-800 shadow-blue-500/10',
      text: 'HDFC',
      fullName: 'HDFC Bank',
      chipColor: 'from-amber-200 via-yellow-400 to-amber-500',
      icon: Landmark,
      badgeColor: 'bg-blue-100/90 text-blue-800 border-blue-200',
      activeBorder: 'border-blue-300 hover:border-blue-400',
      activeBg: 'bg-blue-50/40 hover:bg-blue-50/60'
    };
  }
  if (name.includes('ICICI')) {
    return {
      bg: 'bg-gradient-to-br from-orange-600 via-amber-600 to-rose-700 text-white border-orange-700 shadow-orange-500/10',
      text: 'ICICI',
      fullName: 'ICICI Bank',
      chipColor: 'from-yellow-200 via-yellow-450 to-amber-400',
      icon: Compass,
      badgeColor: 'bg-orange-100/90 text-orange-850 border-orange-200',
      activeBorder: 'border-orange-300 hover:border-orange-400',
      activeBg: 'bg-orange-50/40 hover:bg-orange-50/60'
    };
  }
  if (name.includes('SBI')) {
    return {
      bg: 'bg-gradient-to-br from-cyan-600 via-teal-600 to-blue-700 text-white border-cyan-700 shadow-cyan-500/10',
      text: 'SBI',
      fullName: 'SBI Card',
      chipColor: 'from-amber-200 via-yellow-400 to-amber-500',
      icon: Coins,
      badgeColor: 'bg-cyan-100/90 text-cyan-800 border-cyan-200',
      activeBorder: 'border-cyan-300 hover:border-cyan-400',
      activeBg: 'bg-cyan-50/40 hover:bg-cyan-50/60'
    };
  }
  if (name.includes('AMEX') || name.includes('AMERICAN')) {
    return {
      bg: 'bg-gradient-to-br from-slate-900 via-slate-800 to-zinc-950 text-white border-slate-950 shadow-slate-950/20',
      text: 'AMEX',
      fullName: 'American Express',
      chipColor: 'from-slate-200 via-zinc-400 to-slate-400',
      icon: Sparkles,
      badgeColor: 'bg-zinc-850 text-zinc-100 border-zinc-700',
      activeBorder: 'border-slate-400 hover:border-slate-500',
      activeBg: 'bg-slate-100/30 hover:bg-slate-100/50'
    };
  }
  if (name.includes('AXIS')) {
    return {
      bg: 'bg-gradient-to-br from-rose-950 via-rose-900 to-purple-950 text-white border-rose-950 shadow-rose-950/10',
      text: 'AXIS',
      fullName: 'Axis Bank',
      chipColor: 'from-amber-200 via-yellow-400 to-amber-500',
      icon: Building,
      badgeColor: 'bg-rose-100/90 text-rose-800 border-rose-200',
      activeBorder: 'border-rose-300 hover:border-rose-400',
      activeBg: 'bg-rose-50/30 hover:bg-rose-50/50'
    };
  }
  return {
    bg: 'bg-gradient-to-br from-slate-700 via-slate-600 to-slate-800 text-white border-slate-800 shadow-slate-500/10',
    text: name.slice(0, 4),
    fullName: name,
    chipColor: 'from-yellow-200 via-yellow-450 to-amber-400',
    icon: CreditCard,
    badgeColor: 'bg-slate-100 text-slate-850 border-slate-200',
    activeBorder: 'border-slate-350 hover:border-slate-400',
    activeBg: 'bg-slate-50/45 hover:bg-slate-50/60'
  };
};

const getCardTierInfo = (bankName: string) => {
  const name = bankName.toUpperCase();
  if (name.includes('HDFC')) {
    return {
      tierName: 'Infinia Metal',
      style: 'bg-slate-900 text-amber-400 border-amber-400/30 font-bold',
      accent: 'Infinite'
    };
  }
  if (name.includes('ICICI')) {
    return {
      tierName: 'Rubyx Premium',
      style: 'bg-sky-950 text-sky-300 border-sky-400/20 font-bold',
      accent: 'Rubyx'
    };
  }
  if (name.includes('SBI')) {
    return {
      tierName: 'SBI Elite',
      style: 'bg-emerald-950 text-emerald-300 border-emerald-400/20 font-bold',
      accent: 'Elite'
    };
  }
  if (name.includes('AMEX') || name.includes('AMERICAN')) {
    return {
      tierName: 'Centurion Black',
      style: 'bg-zinc-950 text-zinc-100 border-zinc-800 font-extrabold tracking-wider uppercase text-[8px]',
      accent: 'Platinum'
    };
  }
  if (name.includes('AXIS')) {
    return {
      tierName: 'Magnus Wealth',
      style: 'bg-rose-950 text-amber-200 border-rose-900 font-bold',
      accent: 'Magnus'
    };
  }
  return {
    tierName: 'Classic Edition',
    style: 'bg-slate-150 text-slate-700 border-slate-300/40 font-semibold',
    accent: 'Standard'
  };
};

function BankLogo({ bankName }: { bankName: string }) {
  const details = getBankLogoDetails(bankName);
  const IconComponent = details.icon;
  return (
    <div className={`w-14 h-9 rounded-md flex flex-col justify-between p-1.5 select-none relative overflow-hidden shadow-sm border ${details.bg} transition-transform duration-300 hover:scale-105 group`}>
      {/* Dynamic diagonal card shine overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/20 pointer-events-none group-hover:left-full transition-all duration-700" />
      
      {/* Sparkles / holographic micro patterns */}
      <div className="absolute top-0 right-0 w-6 h-6 bg-radial from-white/10 to-transparent pointer-events-none animate-pulse" />

      <div className="flex justify-between items-start">
        {/* Monogram / Brand text */}
        <span className="font-sans font-black tracking-tighter text-[9px] leading-none uppercase drop-shadow-[0_1px_1px_rgba(0,0,0,0.4)]">
          {details.text}
        </span>
        {/* Micro card chip with shiny gold physical grooves */}
        <div className={`w-3.5 h-2.5 rounded-sm bg-gradient-to-br ${details.chipColor} border border-amber-300/30 shadow-[inset_0_0.5px_1px_rgba(255,255,255,0.4)] relative overflow-hidden`}>
          <div className="absolute inset-x-0 top-1/2 h-0.5 bg-amber-600/30" />
          <div className="absolute inset-y-0 left-1/2 w-0.5 bg-amber-600/30" />
        </div>
      </div>
      
      <div className="flex items-end justify-between">
        {/* Contactless symbol indicators */}
        <span className="text-[5.5px] text-white/70 tracking-tight font-mono">SECURE</span>
        {/* Dynamic lucide icon for bank identification */}
        <IconComponent className="w-3.5 h-3.5 text-white/95 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)] shrink-0" />
      </div>
    </div>
  );
}

function CardNetworkTag({ bankName, cardNumber }: { bankName: string; cardNumber: string }) {
  const bank = bankName.toUpperCase();
  if (bank.includes('AMEX') || bank.includes('AMERICAN')) {
    return (
      <span className="inline-flex items-center gap-1 font-sans text-[8px] font-bold px-1.5 py-0.5 rounded-xs bg-blue-600 text-white border border-blue-500 shadow-xxs">
        AMEX
      </span>
    );
  }
  const lastNum = parseInt(cardNumber) || 0;
  if (lastNum % 3 === 0) {
    return (
      <span className="inline-flex items-center gap-1 font-serif text-[8.5px] italic font-black px-1.5 py-0.5 rounded-sm bg-gradient-to-r from-blue-700 via-purple-600 to-orange-500 text-white border border-slate-200">
        RuPay
      </span>
    );
  } else if (lastNum % 2 === 0) {
    return (
      <span className="inline-flex items-center gap-0.5 font-sans text-[8.5px] font-extrabold italic px-1.5 py-0.5 rounded bg-blue-900 text-yellow-300 tracking-tight leading-none">
        VISA
      </span>
    );
  } else {
    return (
      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-50 border border-orange-200">
        <span className="flex -space-x-1 items-center shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 opacity-80" />
        </span>
        <span className="font-sans text-[8px] font-bold text-gray-700 tracking-tighter">MC</span>
      </span>
    );
  }
}

interface ConfigurationPanelProps {
  config: AppConfig;
  onUpdateConfig: (newConfig: AppConfig) => void;
}

export default function ConfigurationPanel({ config, onUpdateConfig }: ConfigurationPanelProps) {
  const [newBank, setNewBank] = useState('HDFC');
  const [newCardNum, setNewCardNum] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Inline editing states for quick actions without scrolling down or up the form
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [editBankName, setEditBankName] = useState('');
  const [editCardNumber, setEditCardNumber] = useState('');
  const [editPassword, setEditPassword] = useState('');

  // Local simulated API connection testing states
  const [testingCardId, setTestingCardId] = useState<string | null>(null);
  const [testSuccessState, setTestSuccessState] = useState<'testing' | 'success' | 'error' | null>(null);

  const [cardFilter, setCardFilter] = useState('');

  const [masterFolder, setMasterFolder] = useState(config.masterFolder);
  const [gmailSearchQuery, setGmailSearchQuery] = useState(config.gmailSearchQuery);
  const [processedLabel, setProcessedLabel] = useState(config.processedLabel);
  const [scanPeriodMonths, setScanPeriodMonths] = useState(config.scanPeriodMonths);
  const [targetLedgerName, setTargetLedgerName] = useState(config.targetLedgerName);

  const handleSaveEditedCard = (id: string) => {
    if (!/^\d{4}$/.test(editCardNumber)) {
      alert('Card number must be exactly 4 digits representing account signature (e.g. 6171).');
      return;
    }
    
    const updatedCards = config.cards.map(c => {
      if (c.id === id) {
        return {
          ...c,
          bankName: editBankName.toUpperCase(),
          cardNumber: editCardNumber,
          password: editPassword || undefined
        };
      }
      return c;
    });
    
    onUpdateConfig({
      ...config,
      cards: updatedCards
    });
    setEditingCardId(null);
  };

  const handleApplyGlobalSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateConfig({
      ...config,
      masterFolder,
      gmailSearchQuery,
      processedLabel,
      scanPeriodMonths: Number(scanPeriodMonths),
      targetLedgerName,
    });
  };

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{4}$/.test(newCardNum)) {
      alert('Card number must be exactly 4 digits representing account signature (e.g. 6171).');
      return;
    }
    if (config.cards.some(c => c.cardNumber === newCardNum)) {
      alert('A card with these last 4 digits already exists in the registry.');
      return;
    }

    const newCard: CardProfile = {
      id: Math.random().toString(36).substr(2, 9),
      bankName: newBank.toUpperCase(),
      cardNumber: newCardNum,
      password: newPassword || undefined,
      isActive: true
    };

    const updatedCards = [...config.cards, newCard];
    onUpdateConfig({
      ...config,
      cards: updatedCards
    });

    setNewCardNum('');
    setNewPassword('');
  };

  const handleDeleteCard = (id: string) => {
    const updatedCards = config.cards.filter(c => c.id !== id);
    onUpdateConfig({
      ...config,
      cards: updatedCards
    });
  };

  const handleToggleCardActive = (id: string) => {
    const updatedCards = config.cards.map(c => 
      c.id === id ? { ...c, isActive: !c.isActive } : c
    );
    onUpdateConfig({
      ...config,
      cards: updatedCards
    });
  };

  const filteredCards = config.cards.filter(card => {
    const query = cardFilter.toLowerCase().trim();
    if (!query) return true;
    return (
      card.bankName.toLowerCase().includes(query) ||
      card.cardNumber.includes(query) ||
      getBankLogoDetails(card.bankName).fullName.toLowerCase().includes(query)
    );
  });

  return (
    <div id="config-panel-container" className="space-y-6">
      {/* CARD REGISTRY CONTAINER */}
      <div id="card-registry-card" className="bg-white rounded-xl border border-gray-100 shadow-xs p-6 space-y-6">
        <div id="registry-header-container" className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-sans font-semibold text-gray-800 text-base leading-tight">Bank &amp; Credit Card Registry</h3>
              <p className="font-sans text-xs text-gray-500 mt-1">Configure active card profiles and decryption statement password mapping keys.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto sm:min-w-[280px]">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                id="card-search-input"
                type="text"
                placeholder="Filter cards by bank/digits..."
                value={cardFilter}
                onChange={(e) => setCardFilter(e.target.value)}
                className="w-full bg-slate-50 hover:bg-slate-100/50 border border-gray-200 hover:border-gray-300 focus:bg-white rounded-lg pl-8 pr-8 py-1.5 font-sans text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-hidden text-gray-700 placeholder-gray-400 transition-all font-medium"
              />
              {cardFilter && (
                <button
                  onClick={() => setCardFilter('')}
                  type="button"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5 rounded cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
            <span className="bg-blue-100 text-blue-700 font-mono text-xs font-semibold px-2.5 py-1 rounded-full shrink-0">
              {filteredCards.length} of {config.cards.length}
            </span>
          </div>
        </div>

        {/* Existing Card Profiles Grid */}
        <div id="reg-cards-grid" className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCards.map((card) => {
            const details = getBankLogoDetails(card.bankName);
            const tierInfo = getCardTierInfo(card.bankName);
            const WatermarkIcon = details.icon;
            return (
              <div 
                key={card.id} 
                id={`card-item-${card.id}`}
                className={`p-4 rounded-xl border transition-all duration-350 ease-[cubic-bezier(0.25,1,0.5,1)] relative overflow-hidden hover:-translate-y-1.5 hover:scale-[1.03] active:scale-[0.98] cursor-pointer shadow-sm group ${
                  card.isActive 
                    ? `${details.activeBg} ${details.activeBorder} hover:shadow-[0_20px_35px_-6px_rgba(0,0,0,0.08),_0_10px_20px_-10px_rgba(0,0,0,0.04)] hover:shadow-slate-300/45 pl-6` 
                    : 'bg-gray-50/70 border-gray-150 opacity-60 hover:opacity-100 hover:bg-white hover:border-gray-300 hover:shadow-[0_15px_25px_-5px_rgba(0,0,0,0.06),_0_8px_15px_-8px_rgba(0,0,0,0.04)] hover:shadow-gray-200/50 pl-6'
                }`}
              >
                {/* Visual left colored bank stripe accent */}
                {card.isActive && (
                  <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${details.bg.split(' ')[0]}`} />
                )}

                {/* Decorative background watermark emblem of the bank */}
                <WatermarkIcon className={`absolute -right-4 -bottom-4 w-24 h-24 pointer-events-none transform rotate-12 transition-all duration-500 group-hover:rotate-6 group-hover:scale-105 ${
                  card.isActive ? 'text-slate-900/[0.04]' : 'text-slate-900/[0.02]'
                }`} />

                {/* --- HOVER QUICK ACTIONS HUD OVERLAY --- */}
                {editingCardId !== card.id && testingCardId !== card.id && (
                  <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-[6px] flex flex-col items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-350 ease-out z-20">
                    <div className="text-[10px] font-sans font-medium text-slate-300/80 tracking-wider uppercase transform -translate-y-1 group-hover:translate-y-0 transition-all duration-350 delay-75">
                      Quick Profile Actions
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingCardId(card.id);
                          setEditBankName(card.bankName);
                          setEditCardNumber(card.cardNumber);
                          setEditPassword(card.password || '');
                        }}
                        className="px-3.5 py-1.5 bg-slate-800/90 hover:bg-slate-750 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-slate-700/60 shadow-md hover:scale-105 active:scale-95 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 delay-75 cursor-pointer"
                      >
                        <Key className="w-3.5 h-3.5 text-amber-400" />
                        Edit Profile
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setTestingCardId(card.id);
                          setTestSuccessState('testing');
                          setTimeout(() => {
                            setTestSuccessState(Math.random() > 0.15 ? 'success' : 'error');
                          }, 1200);
                        }}
                        className="px-3.5 py-1.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-md border border-indigo-500/50 hover:scale-105 active:scale-95 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 delay-100 cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                        Test Connection
                      </button>
                    </div>
                  </div>
                )}

                {/* --- INLINE EDIT OVERLAY (WITHOUT SCROLLING) --- */}
                {editingCardId === card.id && (
                  <div 
                    className="absolute inset-0 bg-slate-900 text-white z-30 p-3 flex flex-col justify-between"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-center pb-1 border-b border-white/10">
                        <span className="font-sans font-semibold text-xs text-slate-200">Edit Card Profile</span>
                        <button 
                          type="button" 
                          onClick={() => setEditingCardId(null)}
                          className="text-white/60 hover:text-white text-xxs font-semibold"
                        >
                          Cancel
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[8.5px] font-semibold text-white/50 mb-0.5 uppercase">Bank</label>
                          <select 
                            value={editBankName}
                            onChange={(e) => setEditBankName(e.target.value)}
                            className="w-full rounded bg-slate-800 text-white text-[11px] px-2 py-0.5 focus:outline-hidden border border-slate-700"
                          >
                            <option value="HDFC">HDFC Bank</option>
                            <option value="ICICI">ICICI Bank</option>
                            <option value="SBI">SBI Card</option>
                            <option value="AMEX">American Express</option>
                            <option value="AXIS">Axis Bank</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[8.5px] font-semibold text-white/50 mb-0.5 uppercase">Last 4 Digits</label>
                          <input 
                            type="text" 
                            maxLength={4}
                            value={editCardNumber}
                            onChange={(e) => setEditCardNumber(e.target.value.replace(/\D/g, ''))}
                            className="w-full rounded bg-slate-800 text-white text-[11px] px-2 py-0.5 focus:outline-hidden border border-slate-700 font-mono"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[8.5px] font-semibold text-white/50 mb-0.5 uppercase">Statement Password (Optional)</label>
                        <input 
                          type="text" 
                          value={editPassword}
                          placeholder="Decryption Key/PIN"
                          onChange={(e) => setEditPassword(e.target.value)}
                          className="w-full rounded bg-slate-800 text-white text-[11px] px-2 py-0.5 placeholder:text-white/30 focus:outline-hidden border border-slate-700 font-mono"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-1 border-t border-white/10 mt-1">
                      <button
                        type="button"
                        onClick={() => handleSaveEditedCard(card.id)}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[10px] px-3 py-1 rounded shadow-xs"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                )}

                {/* --- SIMULATED CONNECTION TEST OVERLAY --- */}
                {testingCardId === card.id && (
                  <div 
                    className="absolute inset-0 bg-slate-900 text-white z-30 p-4 flex flex-col justify-between items-center text-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {testSuccessState === 'testing' && (
                      <div className="my-auto space-y-2 flex flex-col items-center">
                        <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                        <p className="font-mono text-[10px] text-indigo-400 animate-pulse">Running G-Suite handshakes...</p>
                        <p className="text-[9px] text-white/60">Testing OCR parser and PDF password mappings</p>
                      </div>
                    )}
                    
                    {testSuccessState === 'success' && (
                      <div className="my-auto space-y-1.5 flex flex-col items-center">
                        <div className="w-6 h-6 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center text-emerald-400">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                        <p className="font-mono text-[10px] text-emerald-400 font-bold">Verification Active!</p>
                        <p className="text-[9px] text-white/60 max-w-[210px] leading-tight">Decryption logic &amp; Gmail search query indexes checked &amp; ready.</p>
                      </div>
                    )}

                    {testSuccessState === 'error' && (
                      <div className="my-auto space-y-1.5 flex flex-col items-center">
                        <div className="w-6 h-6 bg-rose-500/10 border border-rose-500/30 rounded-full flex items-center justify-center text-rose-450">
                          <ShieldAlert className="w-3.5 h-3.5" />
                        </div>
                        <p className="font-mono text-[10px] text-rose-400 font-bold">Stale Auth Handshake</p>
                        <p className="text-[9px] text-white/60 max-w-[210px] leading-tight">Folder mapping expired. Reset configurations or re-authenticate Google Drive.</p>
                      </div>
                    )}

                    {testSuccessState !== 'testing' && (
                      <button
                        type="button"
                        onClick={() => {
                          setTestingCardId(null);
                          setTestSuccessState(null);
                        }}
                        className="mt-auto bg-slate-800 hover:bg-slate-700 text-white/80 hover:text-white border border-slate-700 font-semibold text-[10px] px-3 py-0.5 rounded transition-colors"
                      >
                        Dismiss
                      </button>
                    )}
                  </div>
                )}

                <div className="flex justify-between items-start gap-3 relative z-10">
                  <div className="flex items-start gap-3.5 min-w-0 flex-1">
                    {/* Bank card logo placeholder */}
                    <div className="shrink-0 pt-0.5">
                      <BankLogo bankName={card.bankName} />
                    </div>
                    <div className="space-y-1.5 min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`font-mono text-[9px] font-bold px-1.5 py-0.5 rounded border inline-flex items-center gap-1 ${details.badgeColor}`}>
                          {React.createElement(details.icon, { className: "w-3 h-3 shrink-0" })}
                          {details.fullName}
                        </span>
                        
                        {/* Elite brand card privilege tier tierInfo badge */}
                        <span className={`font-sans text-[8.5px] px-1.5 py-0.5 rounded-md border shadow-xxs inline-flex items-center gap-1 ${tierInfo.style}`}>
                          <span className="w-1 h-1 rounded-full bg-amber-400 animate-ping shrink-0" />
                          {tierInfo.tierName}
                        </span>

                        {/* Interactive network tag (VISA, MasterCard, RuPay, AMEX) */}
                        <CardNetworkTag bankName={card.bankName} cardNumber={card.cardNumber} />

                        <span className="font-mono text-xs font-semibold text-gray-700 tracking-wider bg-slate-100/50 px-1.5 py-0.5 rounded border border-gray-250/20">
                          •••• {card.cardNumber}
                        </span>
                      </div>
                      {card.password ? (
                        <div className="flex items-center gap-1.5 font-mono text-[10px] text-amber-700 mt-2 bg-amber-50 px-2 py-0.5 rounded w-fit max-w-full border border-amber-100">
                          <Key className="w-3 h-3 shrink-0" />
                          <span className="truncate">Decryption: {card.password}</span>
                        </div>
                      ) : (
                        <span className="text-xxs text-gray-400 block mt-2">Unprotected statement parsing</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      id={`toggle-card-${card.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleCardActive(card.id);
                      }}
                      className={`px-2 py-1 rounded text-[10px] font-bold transition-colors ${
                        card.isActive 
                          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200' 
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300 border border-transparent'
                      }`}
                    >
                      {card.isActive ? 'Active' : 'Disabled'}
                    </button>
                    <button
                      id={`delete-card-${card.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCard(card.id);
                      }}
                      className="p-1 px-1.5 text-gray-400 hover:text-red-500 rounded hover:bg-gray-100 transition-colors"
                      title="Remove Profile"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {config.cards.length === 0 && (
            <div id="no-cards-notice" className="col-span-2 text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-gray-500 text-xs">
              No custom card accounts registered. Please register a card profile to populate.
            </div>
          )}

          {config.cards.length > 0 && filteredCards.length === 0 && (
            <div id="no-cards-match-notice" className="col-span-2 flex flex-col items-center justify-center text-center py-10 px-4 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-gray-500 text-xs">
              <Search className="w-6 h-6 text-slate-300 mb-2" />
              <p className="font-sans text-xs font-semibold text-gray-600">No profile matches search</p>
              <p className="font-sans text-[11px] text-gray-400 mt-1">Try searching for another bank name or specific 4-digit signature.</p>
            </div>
          )}
        </div>

        {/* Add Card Form */}
        <form id="add-card-profile-form" onSubmit={handleAddCard} className="bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-4">
          <h4 className="font-sans font-medium text-xs text-slate-700 flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Statement Card Target
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xxs font-semibold text-gray-500 mb-1">Bank Name</label>
              <select 
                id="select-add-bank"
                value={newBank} 
                onChange={(e) => setNewBank(e.target.value)}
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-700 focus:border-blue-500 focus:outline-hidden"
              >
                <option value="HDFC">HDFC Bank</option>
                <option value="ICICI">ICICI Bank</option>
                <option value="SBI">SBI Card</option>
                <option value="AMEX">American Express</option>
                <option value="AXIS">Axis Bank</option>
              </select>
            </div>
            <div>
              <label className="block text-xxs font-semibold text-gray-500 mb-1">Last 4 Digits</label>
              <input 
                id="input-card-last4"
                type="text" 
                maxLength={4}
                required 
                placeholder="4991"
                value={newCardNum}
                onChange={(e) => setNewCardNum(e.target.value.replace(/\D/g, ''))}
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-700 placeholder-gray-450 focus:border-blue-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xxs font-semibold text-gray-500 mb-1">Decryption Password (Optional)</label>
              <input 
                id="input-card-password"
                type="text" 
                placeholder="Password used to open PDF"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-700 placeholder-gray-400 focus:border-blue-500 focus:outline-hidden"
              />
            </div>
          </div>
          <div className="flex justify-end pt-1">
            <button
              id="submit-add-card-btn"
              type="submit"
              className="bg-slate-800 hover:bg-slate-900 text-white font-sans text-xs font-medium px-4 py-1.5 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Save Card Profile
            </button>
          </div>
        </form>
      </div>

      {/* PIPELINE CONFIGURATIONS CARD */}
      <div id="pipeline-config-card" className="bg-white rounded-xl border border-gray-100 shadow-xs p-6 space-y-4">
        <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
            <FolderOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-sans font-semibold text-gray-800 text-base leading-tight">Automation Variables &amp; Globals</h3>
            <p className="font-sans text-xs text-gray-500 mt-1">Tune target Drive paths, Gmail query scopes, and automation search criteria.</p>
          </div>
        </div>

        <form id="global-config-form" onSubmit={handleApplyGlobalSettings} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xxs font-semibold text-gray-800 mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
                <FolderOpen className="w-3.5 h-3.5 text-gray-400" /> Google Drive Master Folder
              </label>
              <input 
                id="input-master-folder"
                type="text"
                required
                value={masterFolder}
                onChange={(e) => setMasterFolder(e.target.value)}
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-xs text-gray-700 focus:border-blue-500 focus:outline-hidden"
              />
              <span className="text-xxs text-gray-400 mt-1 block">Root directory where the master folders folder will be created.</span>
            </div>

            <div>
              <label className="block text-xxs font-semibold text-gray-800 mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
                <FileSpreadsheet className="w-3.5 h-3.5 text-gray-400" /> Expense Ledger Spreadsheet Name
              </label>
              <input 
                id="input-ledger-name"
                type="text"
                required
                value={targetLedgerName}
                onChange={(e) => setTargetLedgerName(e.target.value)}
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-xs text-gray-700 focus:border-blue-500 focus:outline-hidden"
              />
              <span className="text-xxs text-gray-400 mt-1 block">Filename of the centralized Google Sheet constructed to host ledger logs.</span>
            </div>

            <div>
              <label className="block text-xxs font-semibold text-gray-800 mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-gray-400" /> Gmail Search Query Filter
              </label>
              <input 
                id="input-gmail-filter"
                type="text"
                required
                value={gmailSearchQuery}
                onChange={(e) => setGmailSearchQuery(e.target.value)}
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-xs text-gray-700 font-mono focus:border-blue-500 focus:outline-hidden"
              />
              <span className="text-xxs text-gray-400 mt-1 block">Gmail query mapping strings for standard filtration rules.</span>
            </div>

            <div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xxs font-semibold text-gray-800 mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-gray-400" /> Gmail Ingestion Tag
                  </label>
                  <input 
                    id="input-tracking-label"
                    type="text"
                    required
                    value={processedLabel}
                    onChange={(e) => setProcessedLabel(e.target.value)}
                    className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-xs text-gray-700 focus:border-blue-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xxs font-semibold text-gray-800 mb-1.5 uppercase tracking-wider">
                    Scan Timeline (Months)
                  </label>
                  <input 
                    id="input-scan-period"
                    type="number"
                    min={1}
                    max={36}
                    required
                    value={scanPeriodMonths}
                    onChange={(e) => setScanPeriodMonths(Number(e.target.value))}
                    className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-xs text-gray-700 focus:border-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>
              <span className="text-xxs text-gray-400 mt-1 block">Custom thread tag checking criteria for scan period offsets.</span>
            </div>
          </div>

          <div className="flex justify-end pt-2 border-t border-gray-50">
            <button
              id="apply-global-settings-btn"
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-sans text-xs font-semibold px-5 py-2 rounded-md shadow-xs transition-colors cursor-pointer"
            >
              Apply Configurations
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
