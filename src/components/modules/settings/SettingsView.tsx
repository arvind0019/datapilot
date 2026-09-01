import React from 'react';
import { 
  Sliders, 
  Moon, 
  Smartphone, 
  Laptop, 
  Monitor, 
  Tablet, 
  Sparkles, 
  Check, 
  Shield, 
  Zap, 
  Layers 
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { ThemeMode, DensityMode, ViewportDevice } from '../../../types';

export const SettingsView: React.FC = () => {
  const { 
    theme, 
    setTheme, 
    density, 
    setDensity, 
    previewDevice, 
    setPreviewDevice, 
    addToast 
  } = useApp();

  const themes: { id: ThemeMode; label: string; desc: string; colors: string[] }[] = [
    {
      id: 'obsidian',
      label: 'Obsidian Minimalist Neo-Brutalist (Default)',
      desc: 'Matte dark slate, solid black offset drop shadows, electric cyan & yellow accents.',
      colors: ['#090c15', '#101626', '#06b6d4', '#ffee00']
    },
    {
      id: 'cyber',
      label: 'Cyber Slate Pro',
      desc: 'High-contrast monochrome engineering layout with emerald status lights.',
      colors: ['#0b0f19', '#162032', '#10b981', '#ffffff']
    },
    {
      id: 'midnight',
      label: 'Deep Midnight Velvet',
      desc: 'Rich deep midnight blue with tactile debossed neumorphic wells.',
      colors: ['#060814', '#0d1326', '#38bdf8', '#818cf8']
    },
    {
      id: 'high-contrast',
      label: 'High-Contrast Neo-Brutalist Black',
      desc: '100% pitch-black contrast with thick 2.5px borders and tactile button bevels.',
      colors: ['#000000', '#111111', '#ffee00', '#ff007f']
    }
  ];

  const devices: { id: ViewportDevice; label: string; width: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'desktop', label: 'Desktop 4K / Widescreen', width: '100% Fluid', icon: Monitor },
    { id: 'laptop', label: 'Laptop Display', width: '1366px', icon: Laptop },
    { id: 'tablet', label: 'iPad / Tablet View', width: '768px', icon: Tablet },
    { id: 'mobile', label: 'Mobile Device', width: '375px', icon: Smartphone }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-150 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b-2 border-[#1c253b] pb-3">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-display text-2xl font-black tracking-tight text-white uppercase">
              UI/UX Customization & Engine Settings
            </h1>
            <span className="rounded bg-[#ffee00] text-black px-1.5 py-0.5 text-[10px] font-black border border-black shadow-[2px_2px_0px_#000]">
              DESIGN SYSTEM
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            // Minimalist typography, Neo-Brutalist offset shadows, and tactile Neumorphic wells.
          </p>
        </div>
      </div>

      {/* Theme Presets Grid */}
      <div className="brutal-panel p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-[#1c253b] pb-3">
          <div className="flex items-center space-x-2">
            <Moon className="h-4 w-4 text-cyan-400" />
            <h3 className="font-display text-sm font-black text-white uppercase">Design Aesthetic & Theme Palette</h3>
          </div>
          <span className="text-xs text-cyan-300 font-bold uppercase">{theme} ACTIVE</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {themes.map((t) => {
            const isSelected = theme === t.id;

            return (
              <div
                key={t.id}
                onClick={() => {
                  setTheme(t.id);
                  addToast({ type: 'success', title: `Theme switched to ${t.label}` });
                }}
                className={`cursor-pointer rounded-xl border-2 p-4 transition-all ${
                  isSelected
                    ? 'border-[#06b6d4] bg-[#121a2d] shadow-[5px_5px_0px_#000000]'
                    : 'border-[#2a364f] bg-[#0c101c] shadow-[3px_3px_0px_#000000] hover:border-slate-400'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="font-bold text-white text-xs">{t.label}</div>
                  {isSelected && (
                    <span className="rounded bg-[#06b6d4] text-black px-1.5 py-0.2 text-[9px] font-black border border-black">
                      ACTIVE
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-slate-400 font-sans mb-3">{t.desc}</p>

                {/* Color Swatches with Hard Shadows */}
                <div className="flex items-center space-x-2">
                  {t.colors.map((c, idx) => (
                    <div
                      key={idx}
                      className="h-6 w-6 rounded border-2 border-black shadow-[1.5px_1.5px_0px_#000]"
                      style={{ backgroundColor: c }}
                      title={c}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Information Density Switcher */}
      <div className="brutal-panel p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-[#1c253b] pb-3">
          <div className="flex items-center space-x-2">
            <Sliders className="h-4 w-4 text-[#ffee00]" />
            <h3 className="font-display text-sm font-black text-white uppercase">Information Density Mode</h3>
          </div>
          <span className="text-xs text-slate-400 uppercase">MODE: {density}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            onClick={() => setDensity('compact')}
            className={`cursor-pointer rounded-xl border-2 p-4 transition-all ${
              density === 'compact'
                ? 'border-[#06b6d4] bg-[#121a2d] shadow-[4px_4px_0px_#000]'
                : 'border-[#2a364f] bg-[#0c101c] hover:border-slate-400'
            }`}
          >
            <div className="font-bold text-white text-xs mb-1">Ultra-Dense Developer Mode</div>
            <p className="text-[11px] text-slate-400 font-sans">
              High data-density layout with 10px table paddings, compact graphs, and monospace metrics.
            </p>
          </div>

          <div
            onClick={() => setDensity('comfortable')}
            className={`cursor-pointer rounded-xl border-2 p-4 transition-all ${
              density === 'comfortable'
                ? 'border-[#06b6d4] bg-[#121a2d] shadow-[4px_4px_0px_#000]'
                : 'border-[#2a364f] bg-[#0c101c] hover:border-slate-400'
            }`}
          >
            <div className="font-bold text-white text-xs mb-1">Comfortable Business Analyst Mode</div>
            <p className="text-[11px] text-slate-400 font-sans">
              Generous breathing room, 16px table margins, and enlarged chart tooltips.
            </p>
          </div>
        </div>
      </div>

      {/* Multi-Device Viewport Previewer */}
      <div className="brutal-panel p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-[#1c253b] pb-3">
          <div className="flex items-center space-x-2">
            <Monitor className="h-4 w-4 text-emerald-400" />
            <h3 className="font-display text-sm font-black text-white uppercase">Multi-Device Viewport Testing</h3>
          </div>
          <span className="text-xs text-slate-400">Selected: {previewDevice.toUpperCase()}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {devices.map((d) => {
            const Icon = d.icon;
            const isSelected = previewDevice === d.id;

            return (
              <button
                key={d.id}
                onClick={() => {
                  setPreviewDevice(d.id);
                  addToast({ type: 'info', title: `Viewport set to ${d.label}` });
                }}
                className={`brutal-panel p-4 text-left transition-all ${
                  isSelected ? 'border-[#06b6d4] bg-[#141e33] shadow-[4px_4px_0px_#000]' : 'hover:border-slate-400'
                }`}
              >
                <Icon className={`h-5 w-5 mb-2 ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`} />
                <div className="font-bold text-white text-xs">{d.label}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{d.width}</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
