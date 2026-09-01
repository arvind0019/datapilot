import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  Sparkles, 
  Check, 
  ChevronDown, 
  Zap,
  Menu,
  User,
  LogOut,
  Shield,
  Key,
  Users
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
    setIsAICopilotOpen,
    setIsMobileNavOpen,
    currentUser,
    setIsAuthModalOpen,
    logout
  } = useApp();

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isEnvDropdownOpen, setIsEnvDropdownOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const sectionTitles: Record<string, string> = {
    overview: 'OVERVIEW',
    sources: 'SOURCES',
    sql: 'SQL_IDE',
    modeling: 'MODELS',
    dashboards: 'DASHBOARDS',
    performance: 'PERF_CENTER',
    debug: 'DEBUG',
    access: 'ACCESS',
    deployments: 'DEPLOY',
    integrations: 'APIS',
    settings: 'SETTINGS'
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
      title: 'v2.8.4 deployed successfully to Production',
      time: '45m ago',
      unread: false,
      type: 'success',
      section: 'deployments' as const
    }
  ];

  const environments: { id: Environment; label: string; badgeColor: string }[] = [
    { id: 'production', label: 'PRODUCTION', badgeColor: 'bg-[#ff007f] text-white' },
    { id: 'staging', label: 'STAGING', badgeColor: 'bg-[#ffee00] text-black' },
    { id: 'development', label: 'DEV LOCAL', badgeColor: 'bg-[#00ff66] text-black' }
  ];

  const currentEnvObj = environments.find((e) => e.id === environment) || environments[0];

  return (
    <header className="sticky top-0 z-30 flex h-14 sm:h-16 w-full items-center justify-between border-b-[3px] border-black bg-[#161b22] px-3 sm:px-4 md:px-6 shadow-[0px_4px_0px_#000000]">
      {/* Left: Mobile Hamburger + Breadcrumb */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        <button
          onClick={() => setIsMobileNavOpen(true)}
          className="flex md:hidden h-9 w-9 items-center justify-center rounded-md bg-[#ffee00] text-black border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
          title="Open Navigation"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex items-center space-x-1.5 font-mono text-xs">
          <span className="font-black text-white hidden sm:inline uppercase">DATAPILOT</span>
          <span className="text-slate-500 hidden sm:inline">/</span>
          <span className="brutal-badge bg-[#ffee00] text-black font-black text-[10px] sm:text-xs">
            {sectionTitles[currentSection] || currentSection.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Middle: Command Search Trigger */}
      <button
        onClick={() => setIsCommandPaletteOpen(true)}
        className="hidden md:flex items-center space-x-2 rounded-md border-2 border-black bg-[#0d1117] px-3 py-1.5 font-mono text-xs text-slate-400 shadow-[2px_2px_0px_#000] hover:border-[#ffee00] hover:text-white transition-all cursor-pointer min-w-[240px] lg:min-w-[300px] justify-between"
      >
        <div className="flex items-center space-x-2">
          <Search className="h-3.5 w-3.5 text-[#00f0ff]" />
          <span>Search databases, queries, dbt...</span>
        </div>
        <kbd className="rounded border border-black bg-[#21262d] px-1.5 py-0.5 text-[10px] font-black text-white shadow-[1px_1px_0px_#000]">
          Ctrl+K
        </kbd>
      </button>

      {/* Right Side: Actions, Environment, User Profile */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Mobile Search Button */}
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="flex md:hidden h-8 w-8 items-center justify-center rounded bg-[#0d1117] text-white border-2 border-black shadow-[2px_2px_0px_#000]"
          title="Search"
        >
          <Search className="h-4 w-4 text-[#00f0ff]" />
        </button>

        {/* Environment Badge & Switcher */}
        <div className="relative">
          <button
            onClick={() => setIsEnvDropdownOpen(!isEnvDropdownOpen)}
            className={`flex items-center space-x-1.5 rounded-md px-2 sm:px-2.5 py-1 text-[10px] sm:text-xs font-black uppercase border-2 border-black shadow-[2px_2px_0px_#000] transition-all cursor-pointer ${currentEnvObj.badgeColor}`}
          >
            <span className="truncate max-w-[80px] sm:max-w-none">{currentEnvObj.label}</span>
            <ChevronDown className="h-3 w-3" />
          </button>

          {isEnvDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-md border-[2.5px] border-black bg-[#161b22] p-1.5 shadow-[6px_6px_0px_#000000] z-50 animate-in fade-in duration-100 font-mono">
              <div className="border-b border-black px-2 py-1 text-[9px] font-black text-slate-400 uppercase">
                Switch Environment
              </div>
              {environments.map((env) => (
                <button
                  key={env.id}
                  onClick={() => {
                    setEnvironment(env.id);
                    setIsEnvDropdownOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded px-2.5 py-2 text-xs font-bold transition-all cursor-pointer min-h-[38px] ${
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

        {/* Live Query Queue Pill (Desktop only) */}
        <div className="hidden lg:flex items-center space-x-2 brutal-badge bg-[#21262d] text-white">
          <Zap className="h-3 w-3 text-[#ffee00] fill-[#ffee00]" />
          <span>Q: 0 idle</span>
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="relative flex h-8 sm:h-9 w-8 sm:w-9 items-center justify-center rounded-md bg-white text-black border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
            title="Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-[#ff007f] border border-black" />
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-md border-[2.5px] border-black bg-[#161b22] p-3 shadow-[6px_6px_0px_#000000] z-50 animate-in fade-in duration-100 font-mono">
              <div className="flex items-center justify-between border-b-2 border-black px-1 pb-2">
                <span className="text-xs font-black text-white">// NOTIFICATIONS</span>
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
                      <div className="flex items-center space-x-1.5 truncate">
                        <div className={`h-2 w-2 rounded-full flex-shrink-0 ${
                          n.type === 'error' ? 'bg-[#ff007f]' :
                          n.type === 'warning' ? 'bg-[#ffee00]' : 'bg-[#00ff66]'
                        }`} />
                        <span className="text-xs font-bold text-slate-100 truncate">{n.title}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 flex-shrink-0 ml-1">{n.time}</span>
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
              ? 'bg-[#ffee00] text-black shadow-[3px_3px_0px_#000]'
              : 'bg-[#00f0ff] text-black shadow-[2px_2px_0px_#000] sm:shadow-[3px_3px_0px_#000]'
          } px-2.5 sm:px-3.5 py-1.5 text-xs font-black min-h-[36px]`}
        >
          <Sparkles className="h-3.5 w-3.5 sm:mr-1.5 fill-black" />
          <span className="hidden sm:inline">COPILOT AI</span>
        </button>

        {/* Interactive User Profile & Auth Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center space-x-2 pl-2 border-l-2 border-black cursor-pointer group"
          >
            <img
              src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
              alt={currentUser.name}
              className="h-8 w-8 rounded object-cover border-2 border-black shadow-[2px_2px_0px_#000] group-hover:border-[#ffee00]"
            />
            <div className="text-left font-mono hidden xl:block">
              <p className="text-xs font-black text-white leading-tight truncate max-w-[90px]">{currentUser.name}</p>
              <p className="text-[9px] text-[#ffee00] uppercase font-black">{currentUser.role}</p>
            </div>
            <ChevronDown className="h-3 w-3 text-slate-400 hidden xl:block" />
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-md border-[2.5px] border-black bg-[#161b22] p-3 shadow-[8px_8px_0px_#000000] z-50 animate-in fade-in duration-100 font-mono text-xs">
              <div className="border-b-2 border-black pb-2 mb-2">
                <div className="font-black text-white text-sm">{currentUser.name}</div>
                <div className="text-[10px] text-slate-400 truncate">{currentUser.email}</div>
                <div className="mt-1 flex items-center space-x-1">
                  <span className="brutal-badge bg-[#ffee00] text-black text-[8px]">{currentUser.role}</span>
                  <span className="brutal-badge bg-[#00ff66] text-black text-[8px]">ACTIVE</span>
                </div>
              </div>

              <div className="space-y-1">
                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    setIsAuthModalOpen(true);
                  }}
                  className="w-full flex items-center space-x-2 rounded p-2 text-slate-200 hover:bg-[#21262d] font-bold text-left cursor-pointer"
                >
                  <Users className="h-4 w-4 text-[#00f0ff]" />
                  <span>Switch Team Persona</span>
                </button>

                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    setCurrentSection('access');
                  }}
                  className="w-full flex items-center space-x-2 rounded p-2 text-slate-200 hover:bg-[#21262d] font-bold text-left cursor-pointer"
                >
                  <Shield className="h-4 w-4 text-[#ffee00]" />
                  <span>RBAC & Permissions</span>
                </button>

                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    setIsAuthModalOpen(true);
                  }}
                  className="w-full flex items-center space-x-2 rounded p-2 text-slate-200 hover:bg-[#21262d] font-bold text-left cursor-pointer"
                >
                  <Key className="h-4 w-4 text-[#ff007f]" />
                  <span>Supabase Cloud Auth</span>
                </button>

                <div className="border-t border-black pt-1 mt-1">
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center space-x-2 rounded p-2 text-[#ff007f] hover:bg-[#21262d] font-black text-left cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
