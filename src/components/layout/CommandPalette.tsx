import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Terminal, 
  Database, 
  Boxes, 
  BarChart3, 
  Gauge, 
  Bug, 
  Rocket, 
  Sparkles, 
  ArrowRight,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface SearchResultItem {
  id: string;
  category: 'Actions' | 'Data Sources' | 'Models & Tables' | 'Queries' | 'Dashboards' | 'Errors';
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
}

export const CommandPalette: React.FC = () => {
  const { 
    isCommandPaletteOpen, 
    setIsCommandPaletteOpen,
    setCurrentSection,
    openCopilotWithPrompt,
    dataSources,
    dbtModels,
    savedQueries,
    debugErrors,
    dashboardWidgets
  } = useApp();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const allItems: SearchResultItem[] = [
    {
      id: 'act-ai-diag',
      category: 'Actions',
      title: 'Run AI Workspace Diagnostics',
      subtitle: 'Analyze all 7 sources, queries, and errors',
      icon: Sparkles,
      action: () => {
        openCopilotWithPrompt('Perform full workspace health check and find performance bottlenecks.');
        setIsCommandPaletteOpen(false);
      }
    },
    {
      id: 'act-new-query',
      category: 'Actions',
      title: 'Open SQL IDE & New Query',
      subtitle: 'Launch interactive SQL editor',
      icon: Terminal,
      action: () => {
        setCurrentSection('sql');
        setIsCommandPaletteOpen(false);
      }
    },
    {
      id: 'act-deploy-prod',
      category: 'Actions',
      title: 'Trigger Staging / Prod Deployment',
      subtitle: 'Compile dbt models and release schema',
      icon: Rocket,
      action: () => {
        setCurrentSection('deployments');
        setIsCommandPaletteOpen(false);
      }
    },
    {
      id: 'act-perf-check',
      category: 'Actions',
      title: 'Inspect 3 Slowest Production Queries',
      subtitle: 'Open Performance Center deep-dive',
      icon: Gauge,
      action: () => {
        setCurrentSection('performance');
        setIsCommandPaletteOpen(false);
      }
    },
    ...dataSources.map((ds) => ({
      id: `ds-${ds.id}`,
      category: 'Data Sources' as const,
      title: ds.name,
      subtitle: `${ds.type} • ${ds.tablesCount} tables • ${ds.latencyMs}ms latency`,
      icon: Database,
      action: () => {
        setCurrentSection('sources');
        setIsCommandPaletteOpen(false);
      }
    })),
    ...dbtModels.map((m) => ({
      id: `model-${m.id}`,
      category: 'Models & Tables' as const,
      title: m.name,
      subtitle: `${m.schema} • ${m.materialization} model • ${m.tests.length} tests`,
      icon: Boxes,
      action: () => {
        setCurrentSection('sql');
        setIsCommandPaletteOpen(false);
      }
    })),
    ...savedQueries.map((q) => ({
      id: `query-${q.id}`,
      category: 'Queries' as const,
      title: q.title,
      subtitle: `By ${q.author} • ${q.avgDurationMs}ms`,
      icon: Terminal,
      action: () => {
        setCurrentSection('sql');
        setIsCommandPaletteOpen(false);
      }
    })),
    ...dashboardWidgets.map((w) => ({
      id: `dash-${w.id}`,
      category: 'Dashboards' as const,
      title: w.title,
      subtitle: `${w.type.toUpperCase()} chart • ${w.metric}`,
      icon: BarChart3,
      action: () => {
        setCurrentSection('dashboards');
        setIsCommandPaletteOpen(false);
      }
    })),
    ...debugErrors.map((err) => ({
      id: `err-${err.id}`,
      category: 'Errors' as const,
      title: `${err.code}: ${err.message.slice(0, 45)}...`,
      subtitle: `${err.source} • ${err.severity} severity`,
      icon: Bug,
      action: () => {
        setCurrentSection('debug');
        setIsCommandPaletteOpen(false);
      }
    }))
  ];

  const filteredItems = allItems.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 10);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filteredItems.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % (filteredItems.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        filteredItems[selectedIndex].action();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/80 backdrop-blur-sm pt-[5vh] sm:pt-[12vh] animate-in fade-in duration-100 p-3 sm:p-4 font-mono text-xs">
      <div 
        className="w-full max-w-2xl overflow-hidden rounded-md border-[3px] border-black bg-[#161b22] shadow-[8px_8px_0px_#000000] sm:shadow-[10px_10px_0px_#000000]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-3 border-b-[3px] border-black bg-[#0d1117]">
          <div className="brutal-box flex items-center px-3 py-2 bg-[#161b22]">
            <Search className="h-4 w-4 text-[#00f0ff] mr-2 sm:mr-3 flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Search tables, models, queries, actions..."
              className="w-full bg-transparent font-mono text-xs text-white placeholder-slate-400 outline-none font-bold"
            />
            <button 
              onClick={() => setIsCommandPaletteOpen(false)}
              className="cursor-pointer brutal-badge bg-white text-black text-[9px] flex items-center sm:hidden"
            >
              <X className="h-3 w-3" />
            </button>
            <kbd 
              onClick={() => setIsCommandPaletteOpen(false)}
              className="cursor-pointer brutal-badge bg-white text-black text-[9px] hidden sm:inline"
            >
              ESC
            </kbd>
          </div>
        </div>

        {/* Results List */}
        <div className="max-h-80 sm:max-h-96 overflow-y-auto p-2 space-y-1.5 bg-[#161b22]">
          {filteredItems.length === 0 ? (
            <div className="py-8 sm:py-12 text-center font-mono text-xs text-slate-400 font-bold">
              // NO MATCHING ENTITIES FOR "{query}"
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;

              return (
                <div
                  key={item.id}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex cursor-pointer items-center justify-between rounded px-2.5 sm:px-3 py-2 transition-all min-h-[44px] ${
                    isSelected
                      ? 'bg-[#ffee00] text-black border-2 border-black shadow-[3px_3px_0px_#000000] sm:shadow-[4px_4px_0px_#000000] translate-x-[-1px]'
                      : 'text-slate-200 hover:bg-[#21262d] border border-transparent'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 sm:space-x-3 truncate">
                    <div className={`flex h-8 w-8 items-center justify-center rounded border-2 border-black shadow-[2px_2px_0px_#000] flex-shrink-0 ${
                      isSelected ? 'bg-black text-[#ffee00]' : 'bg-[#21262d] text-white'
                    }`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="truncate">
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs font-black truncate ${isSelected ? 'text-black' : 'text-white'}`}>{item.title}</span>
                        <span className={`brutal-badge text-[8px] ${isSelected ? 'bg-black text-white' : 'bg-white text-black'}`}>
                          {item.category}
                        </span>
                      </div>
                      <p className={`text-[10px] truncate ${isSelected ? 'text-black font-bold' : 'text-slate-400'}`}>{item.subtitle}</p>
                    </div>
                  </div>
                  <ArrowRight className={`h-4 w-4 flex-shrink-0 ml-2 ${isSelected ? 'text-black' : 'text-slate-500'}`} />
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="flex items-center justify-between border-t-[3px] border-black bg-[#0d1117] px-3 sm:px-4 py-2 text-[10px] text-slate-300 font-bold">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <span><kbd className="bg-white text-black px-1.5 py-0.5 border border-black font-black">↑↓</kbd> NAV</span>
            <span><kbd className="bg-white text-black px-1.5 py-0.5 border border-black font-black">↵</kbd> EXEC</span>
          </div>
          <span className="text-[#ffee00] hidden sm:inline">DATAPILOT COMMAND MESH</span>
        </div>
      </div>
    </div>
  );
};
