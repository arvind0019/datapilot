import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  Sparkles, 
  Check, 
  ChevronDown, 
  Zap 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Environment } from '../../types';

export const Header: React.FC = () => {
  const { 
    currentSection, 
    setCurrentSection,
    environment, 
    setEnvironment,
    setIsCommandPaletteOpen,
    isAICopilotOpen,
    setIsAICopilotOpen
  } = useApp();

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isEnvDropdownOpen, setIsEnvDropdownOpen] = useState(false);

  const sectionTitles: Record<string, string> = {
    overview: 'OVERVIEW_WORKSPACE',
    sources: 'DATA_SOURCES',
    sql: 'SQL_DBT_IDE',
    modeling: 'MODELING_STUDIO',
    dashboards: 'DASHBOARDS',
    performance: 'PERFORMANCE_CENTER',
    debug: 'DEBUG_CENTER',
    access: 'ACCESS_CONTROL',
    deployments: 'DEPLOYMENTS_CICD',
    integrations: 'INTEGRATION_HUB',
    settings: 'SETTINGS_CUSTOMIZATION'
  };

  const notificationItems = [
    {
      id: 'n-1',
      title: 'Slow query detected in Aurora Postgres',
      time: '12m ago',
      unread: true,
      type: 'warning',
      section: 'performance' as const
    },
    {
      id: 'n-2',
      title: 'Stripe Reporting API rate limit hit (429)',
      time: '34m ago',
      unread: true,
      type: 'error',
      section: 'debug' as const
    },
    {
      id: 'n-3',
      title: 'Deployment v2.8.4 successfully released',
      time: '45m ago',
      unread: false,
      type: 'success',
      section: 'deployments' as const
    }
  ];

  const environments: { id: Environment; label: string; badgeColor: string }[] = [
    { id: 'production', label: 'Production', badgeColor: 'bg-[#00ff66] text-black' },
    { id: 'staging', label: 'Staging', badgeColor: 'bg-[#ffee00] text-black' },
    { id: 'development', label: 'Development', badgeColor: 'bg-[#00f0ff] text-black' }
  ];

  return (
    <header className="relative z-10 flex h-16 w-full items-center justify-between border-b-[3px] border-black bg-[#161b22] px-6 select-none">
      {/* Breadcrumbs & Title */}
      <div className="flex items-center space-x-2.5">
        <div className="flex items-center space-x-2 text-xs font-mono">
          <span 
            className="font-black text-slate-300 hover:text-white cursor-pointer px-1 py-0.5 rounded border border-transparent hover:border-black"
            onClick={() => setCurrentSection('overview')}
          >
            DATAPILOT
          </span>
          <span className="text-black font-black text-sm">/</span>
          <span className="brutal-badge bg-[#ffee00] text-black text-[11px]">
            {sectionTitles[currentSection] || currentSection}
          </span>
        </div>
      </div>

      {/* Center Search Input Trigger */}
      <div className="flex-1 max-w-md mx-6">
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="group flex w-full items-center justify-between brutal-box px-3.5 py-1.5 text-xs text-slate-300 hover:text-white bg-[#0d1117] cursor-pointer"
        >
          <div className="flex items-center space-x-2">
            <Search className="h-3.5 w-3.5 text-[#00f0ff]" />
            <span className="font-mono text-[11px] font-bold">Search tables, models, queries, errors...</span>
          </div>
          <kbd className="brutal-badge bg-white text-black text-[9px]">
            Ctrl + K
          </kbd>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-3">
        {/* Environment Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsEnvDropdownOpen(!isEnvDropdownOpen)}
            className="flex items-center space-x-2 rounded-md bg-white text-black px-3 py-1.5 text-xs font-black border-2 border-black shadow-[3px_3px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
          >
            <div className={`h-2.5 w-2.5 rounded-full border border-black ${
              environment === 'production' ? 'bg-[#00ff66]' :
              environment === 'staging' ? 'bg-[#ffee00]' : 'bg-[#00f0ff]'
            }`} />
            <span className="uppercase font-mono">{environment}</span>
            <ChevronDown className="h-3.5 w-3.5" />
          </button>

          {isEnvDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-md border-[2.5px] border-black bg-[#161b22] p-1.5 shadow-[6px_6px_0px_#000000] z-50 animate-in fade-in duration-100 font-mono">
              <div className="px-2 py-1 text-[9px] font-black uppercase text-slate-400 tracking-wider">
                // SWITCH ENVIRONMENT
              </div>
              {environments.map((env) => (
                <button
                  key={env.id}
                  onClick={() => {
                    setEnvironment(env.id);
                    setIsEnvDropdownOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded px-2.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                    environment === env.id
                      ? 'bg-[#ffee00] text-black border border-black shadow-[2px_2px_0px_#000]'
                      : 'text-slate-200 hover:bg-[#21262d]'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <div className={`h-2 w-2 rounded-full ${env.badgeColor.split(' ')[0]}`} />
                    <span>{env.label}</span>
                  </div>
                  {environment === env.id && <Check className="h-3.5 w-3.5 text-black" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Live Query Queue Pill */}
        <div className="hidden lg:flex items-center space-x-2 brutal-badge bg-[#21262d] text-white">
          <Zap className="h-3 w-3 text-[#ffee00] fill-[#ffee00]" />
          <span>Q: 0 idle • 42.8k/day</span>
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="relative flex h-8 w-8 items-center justify-center rounded-md bg-white text-black border-2 border-black shadow-[2.5px_2.5px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
            title="Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1.5 -right-1.5 h-3 w-3 rounded-full bg-[#ff007f] border border-black" />
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-md border-[2.5px] border-black bg-[#161b22] p-3 shadow-[6px_6px_0px_#000000] z-50 animate-in fade-in duration-100">
              <div className="flex items-center justify-between border-b-2 border-black px-1 pb-2">
                <span className="text-xs font-black text-white font-mono">// NOTIFICATIONS</span>
                <span className="brutal-badge bg-[#ff007f] text-white">
                  2 UNREAD
                </span>
              </div>
              <div className="py-2 space-y-1.5">
                {notificationItems.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      setCurrentSection(n.section);
                      setIsNotificationsOpen(false);
                    }}
                    className="flex cursor-pointer flex-col rounded p-2 hover:bg-[#21262d] border border-transparent hover:border-black transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1.5">
                        <div className={`h-2 w-2 rounded-full ${
                          n.type === 'error' ? 'bg-[#ff007f]' :
                          n.type === 'warning' ? 'bg-[#ffee00]' : 'bg-[#00ff66]'
                        }`} />
                        <span className="text-xs font-bold text-slate-100">{n.title}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">{n.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Global AI Assistant Trigger */}
        <button
          onClick={() => setIsAICopilotOpen(!isAICopilotOpen)}
          className={`brutal-btn ${
            isAICopilotOpen
              ? 'bg-[#ffee00] text-black shadow-[4px_4px_0px_#000]'
              : 'bg-[#00f0ff] text-black shadow-[3px_3px_0px_#000]'
          } px-3.5 py-1.5 text-xs font-black`}
        >
          <Sparkles className="h-3.5 w-3.5 mr-1.5 fill-black" />
          <span className="hidden sm:inline">COPILOT AI</span>
        </button>

        {/* User Profile Sticker */}
        <div className="flex items-center space-x-2 pl-2 border-l-2 border-black">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
            alt="Arvind"
            className="h-8 w-8 rounded object-cover border-2 border-black shadow-[2px_2px_0px_#000]"
          />
          <div className="hidden xl:block text-left font-mono">
            <p className="text-xs font-black text-white leading-tight">Arvind S.</p>
            <p className="text-[9px] text-[#ffee00] uppercase font-black">OWNER</p>
          </div>
        </div>
      </div>
    </header>
  );
};
