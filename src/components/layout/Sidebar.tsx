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
  X,
  CreditCard
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
    { id: 'billing', label: 'Plans & Pricing', icon: CreditCard, badge: 'UPGRADE', badgeColor: 'bg-[#ffee00] text-black' },
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
            title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isSidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 font-mono text-xs">
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
              className={`flex w-full items-center rounded-md px-3 py-2.5 font-bold transition-all text-left border-2 cursor-pointer ${
                isActive
                  ? 'bg-[#ffee00] text-black border-black shadow-[3px_3px_0px_#000000] font-black'
                  : 'text-slate-200 border-transparent hover:border-black hover:bg-[#21262d] hover:text-white'
              } ${isSidebarCollapsed && !isMobile ? 'justify-center px-2' : 'justify-between'}`}
              title={item.label}
            >
              <div className="flex items-center space-x-3 truncate">
                <Icon className={`h-4 w-4 flex-shrink-0 ${isActive ? 'text-black' : 'text-slate-400'}`} />
                {(!isSidebarCollapsed || isMobile) && <span className="truncate">{item.label}</span>}
              </div>

              {(!isSidebarCollapsed || isMobile) && item.badge && (
                <span className={`brutal-badge text-[9px] ${item.badgeColor || 'bg-[#ffee00] text-black'}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Sidebar Footer */}
      {(!isSidebarCollapsed || isMobile) && (
        <div className="p-3 border-t-[3px] border-black bg-[#0d1117] flex-shrink-0 font-mono text-xs space-y-2">
          {/* AI Copilot Quick Launcher Button */}
          <button
            onClick={() => {
              openCopilotWithPrompt("Give me a comprehensive health audit of all connected databases and slow queries.");
              if (isMobile) setIsMobileNavOpen(false);
            }}
            className="w-full brutal-btn brutal-btn-yellow p-2 text-xs font-black min-h-[38px]"
          >
            <Sparkles className="h-3.5 w-3.5 mr-1.5 fill-black" />
            <span>AI COPILOT AGENT</span>
          </button>

          <div className="brutal-box p-2 bg-[#161b22] text-[10px] space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span>SYSTEM:</span>
              <span className="text-[#00ff66] font-black">99.98% HEALTH</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>VERSION:</span>
              <span className="text-[#00f0ff] font-bold">V2.8.4-PROD</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside 
        className={`hidden md:flex flex-col border-r-[3px] border-black bg-[#161b22] transition-all duration-150 z-20 select-none ${
          isSidebarCollapsed ? 'w-18' : 'w-64'
        }`}
      >
        {renderNavContent(false)}
      </aside>

      {/* Mobile Slide-Over Navigation Drawer */}
      {isMobileNavOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden animate-in fade-in duration-150">
          {/* Dark Backdrop Overlay */}
          <div 
            onClick={() => setIsMobileNavOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Drawer Content */}
          <div className="relative flex w-4/5 max-w-xs flex-1 flex-col bg-[#161b22] border-r-[3px] border-black shadow-[10px_0px_0px_#000000] z-10 animate-in slide-in-from-left duration-200">
            {renderNavContent(true)}
          </div>
        </div>
      )}
    </>
  );
};
