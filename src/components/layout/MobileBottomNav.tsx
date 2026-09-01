import React from 'react';
import { 
  LayoutDashboard, 
  Database, 
  Terminal, 
  BarChart3, 
  Sparkles 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NavSection } from '../../types';

export const MobileBottomNav: React.FC = () => {
  const { 
    currentSection, 
    setCurrentSection, 
    isAICopilotOpen, 
    setIsAICopilotOpen 
  } = useApp();

  const navButtons: { id: NavSection; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'sources', label: 'Sources', icon: Database },
    { id: 'sql', label: 'SQL IDE', icon: Terminal },
    { id: 'dashboards', label: 'Charts', icon: BarChart3 },
  ];

  return (
    <nav className="flex md:hidden fixed bottom-0 left-0 right-0 z-30 h-16 border-t-[3px] border-black bg-[#161b22] px-2 py-1 items-center justify-around select-none shadow-[0px_-4px_0px_#000000]">
      {navButtons.map((item) => {
        const Icon = item.icon;
        const isActive = currentSection === item.id && !isAICopilotOpen;

        return (
          <button
            key={item.id}
            onClick={() => {
              setCurrentSection(item.id);
              setIsAICopilotOpen(false);
            }}
            className={`flex flex-col items-center justify-center flex-1 py-1 rounded transition-all cursor-pointer ${
              isActive 
                ? 'bg-[#ffee00] text-black border-2 border-black shadow-[2px_2px_0px_#000] font-black' 
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Icon className="h-4 w-4" />
            <span className="text-[10px] font-mono mt-0.5 tracking-tight uppercase font-bold">
              {item.label}
            </span>
          </button>
        );
      })}

      {/* 5th Button: Quick Copilot AI Drawer Trigger */}
      <button
        onClick={() => setIsAICopilotOpen(!isAICopilotOpen)}
        className={`flex flex-col items-center justify-center flex-1 py-1 rounded transition-all cursor-pointer ${
          isAICopilotOpen 
            ? 'bg-[#00f0ff] text-black border-2 border-black shadow-[2px_2px_0px_#000] font-black' 
            : 'text-[#00f0ff] hover:text-white'
        }`}
      >
        <Sparkles className="h-4 w-4 fill-current" />
        <span className="text-[10px] font-mono mt-0.5 tracking-tight uppercase font-bold">
          Copilot
        </span>
      </button>
    </nav>
  );
};
