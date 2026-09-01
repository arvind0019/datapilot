import React from 'react';
import { 
  LayoutDashboard, 
  Database, 
  Terminal, 
  Boxes, 
  BarChart3, 
  Gauge, 
  Bug, 
  ShieldCheck, 
  Rocket, 
  Layers, 
  Sliders, 
  ChevronLeft, 
  ChevronRight,
  Sparkles,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NavSection } from '../../types';

interface NavItem {
  id: NavSection;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeColor?: string;
}

export const Sidebar: React.FC = () => {
  const { 
    currentSection, 
    setCurrentSection, 
    isSidebarCollapsed, 
    setIsSidebarCollapsed,
    isMobileNavOpen,
    setIsMobileNavOpen,
    openCopilotWithPrompt,
    slowQueries,
    debugErrors,
    dataSources,
    dbtModels
  } = useApp();

  const openErrorsCount = debugErrors.filter(e => e.status === 'open').length;
  const slowQueriesCount = slowQueries.length;
  const connectedSourcesCount = dataSources.filter(d => d.status === 'connected').length;

  const navItems: NavItem[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'sources', label: 'Data Sources', icon: Database, badge: `${connectedSourcesCount}/${dataSources.length}`, badgeColor: 'bg-[#00f0ff] text-black' },
    { id: 'sql', label: 'SQL & dbt IDE', icon: Terminal, badge: `${dbtModels.length}`, badgeColor: 'bg-[#ffee00] text-black' },
    { id: 'modeling', label: 'Data Models', icon: Boxes },
    { id: 'dashboards', label: 'Dashboards', icon: BarChart3, badge: '8', badgeColor: 'bg-white text-black' },
    { 
      id: 'performance', 
      label: 'Performance', 
      icon: Gauge, 
      badge: slowQueriesCount > 0 ? `${slowQueriesCount} SLOW` : undefined, 
      badgeColor: 'bg-[#ffee00] text-black' 
    },
    { 
      id: 'debug', 
      label: 'Debug Center', 
      icon: Bug, 
      badge: openErrorsCount > 0 ? `${openErrorsCount} ERR` : undefined, 
      badgeColor: 'bg-[#ff007f] text-white' 
    },
    { id: 'access', label: 'Access Control', icon: ShieldCheck },
    { id: 'deployments', label: 'Deployments', icon: Rocket, badge: 'LIVE', badgeColor: 'bg-[#00ff66] text-black' },
    { id: 'integrations', label: 'Integrations', icon: Layers, badge: '6', badgeColor: 'bg-white text-black' },
    { id: 'settings', label: 'Settings & UI', icon: Sliders },
  ];

  const renderNavContent = (isMobile: boolean = false) => (
    <div className="flex flex-col h-full bg-[#161b22]">
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between border-b-[3px] border-black px-4 bg-[#0d1117] flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[#ffee00] text-black border-2 border-black shadow-[3px_3px_0px_#000000]">
            <svg className="h-5 w-5 fill-black" viewBox="0 0 24 24">
              <polygon points="12 2 2 7 12 12 22 7 12 2" />
              <polyline points="2 17 12 22 22 17" />
              <polyline points="2 12 12 17 22 12" />
            </svg>
          </div>
          {(!isSidebarCollapsed || isMobile) && (
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-display text-base font-black tracking-tight text-white">DATAPILOT</span>
                <span className="brutal-badge bg-[#00f0ff] text-black">
                  PRO
                </span>
              </div>
              <p className="text-[10px] font-mono font-bold text-[#ffee00] uppercase tracking-wider">// Analytics Mesh</p>
            </div>
          )}
        </div>

        {isMobile ? (
          <button
            onClick={() => setIsMobileNavOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded bg-white text-black border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        ) : (
          <button 
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="flex h-7 w-7 items-center justify-center rounded bg-white text-black border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer font-black"
            title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isSidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        )}
      </div>

      {/* Workspace Switcher */}
      {(!isSidebarCollapsed || isMobile) && (
        <div className="border-b-[3px] border-black p-3 bg-[#0d1117] flex-shrink-0">
          <div className="brutal-box px-3 py-2 text-xs flex items-center justify-between bg-[#21262d]">
            <div className="flex items-center space-x-2 truncate">
              <div className="h-2.5 w-2.5 rounded-full bg-[#00ff66] border border-black" />
              <span className="font-black text-white font-mono truncate text-[11px]">ACME_CORE_DW</span>
            </div>
            <span className="brutal-badge bg-[#ffee00] text-black">
              PROD
            </span>
          </div>
        </div>
      )}

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-2.5 py-3 space-y-1.5">
        <div className="px-2 pb-1 text-[9px] font-mono font-black uppercase tracking-widest text-slate-400">
          {(!isSidebarCollapsed || isMobile) ? '// PLATFORM WORKSPACES' : '///'}
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentSection === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                setCurrentSection(item.id);
                if (isMobile) setIsMobileNavOpen(false);
              }}
              className={`group flex w-full items-center rounded-md px-3 py-2.5 text-xs font-black transition-all duration-100 cursor-pointer min-h-[44px] ${
                isActive 
                  ? 'bg-[#ffee00] text-black border-2 border-black shadow-[4px_4px_0px_#000000] translate-x-[-1px] translate-y-[-1px]' 
                  : 'text-slate-200 hover:bg-[#21262d] hover:text-white border-2 border-transparent hover:border-black hover:shadow-[3px_3px_0px_#000000]'
              } ${isSidebarCollapsed && !isMobile ? 'justify-center px-1.5' : 'justify-between'}`}
              title={isSidebarCollapsed && !isMobile ? item.label : undefined}
            >
              <div className="flex items-center space-x-2.5 truncate">
                <Icon className={`h-4 w-4 flex-shrink-0 ${isActive ? 'text-black' : 'text-slate-400 group-hover:text-white'}`} />
                {(!isSidebarCollapsed || isMobile) && <span className="truncate uppercase font-mono tracking-tight">{item.label}</span>}
              </div>

              {(!isSidebarCollapsed || isMobile) && item.badge && (
                <span className={`ml-auto brutal-badge ${item.badgeColor || 'bg-white text-black'}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* AI Copilot Brutalist Card */}
      <div className="p-3 border-t-[3px] border-black bg-[#0d1117] flex-shrink-0">
        {(!isSidebarCollapsed || isMobile) ? (
          <div className="brutal-panel p-3 bg-[#ffee00] text-black border-2 border-black shadow-[4px_4px_0px_#000] space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1 text-xs font-black text-black">
                <Sparkles className="h-4 w-4 fill-black" />
                <span>COPILOT AI</span>
              </div>
              <span className="brutal-badge bg-black text-white">
                ONLINE
              </span>
            </div>
            <p className="text-[10px] font-mono font-bold text-black leading-tight">
              3 slow queries • 2 sync errors
            </p>
            <button
              onClick={() => {
                openCopilotWithPrompt('Perform a full workspace diagnostic check and highlight optimization opportunities.');
                if (isMobile) setIsMobileNavOpen(false);
              }}
              className="w-full brutal-btn bg-black text-white hover:bg-slate-900 py-2 text-[11px] font-black min-h-[40px]"
            >
              AUDIT MESH
            </button>
          </div>
        ) : (
          <button
            onClick={() => openCopilotWithPrompt('Perform a full workspace diagnostic check.')}
            className="flex h-10 w-10 mx-auto items-center justify-center rounded bg-[#ffee00] text-black border-2 border-black shadow-[3px_3px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none cursor-pointer"
            title="Open DataPilot Copilot"
          >
            <Sparkles className="h-5 w-5 fill-black" />
          </button>
        )}
      </div>

      {/* Bottom Status */}
      {(!isSidebarCollapsed || isMobile) && (
        <div className="border-t-[3px] border-black px-3.5 py-2 text-[10px] font-mono font-black flex items-center justify-between bg-black text-white flex-shrink-0">
          <div className="flex items-center space-x-1.5">
            <div className="h-2 w-2 rounded-full bg-[#00ff66]" />
            <span>99.98% HEALTH</span>
          </div>
          <span className="text-[#ffee00]">V2.8.4</span>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* 1. Desktop Fixed Sidebar (Hidden on mobile < md) */}
      <aside 
        className={`hidden md:flex relative z-20 flex-col border-r-[3px] border-black bg-[#161b22] transition-all duration-150 ease-out select-none ${
          isSidebarCollapsed ? 'w-[76px]' : 'w-64'
        }`}
      >
        {renderNavContent(false)}
      </aside>

      {/* 2. Mobile Drawer Overlay (Slide over when isMobileNavOpen is true) */}
      {isMobileNavOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div 
            className="w-72 max-w-[85vw] h-full border-r-[3px] border-black shadow-[10px_0px_0px_#000] animate-in slide-in-from-left duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {renderNavContent(true)}
          </div>
          <div 
            className="flex-1 h-full"
            onClick={() => setIsMobileNavOpen(false)}
          />
        </div>
      )}
    </>
  );
};
