import React, { useState } from 'react';
import { 
  BarChart3, 
  Share2, 
  Sparkles, 
  Sliders, 
  Trash2, 
  ArrowUpRight, 
  Plus
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { DashboardWidget, WidgetType } from '../../../types';

export const DashboardBuilderView: React.FC = () => {
  const { 
    dashboardWidgets, 
    isDashboardEditMode, 
    setIsDashboardEditMode, 
    addWidget, 
    removeWidget,
    addToast,
    openCopilotWithPrompt
  } = useApp();

  const [selectedWidget, setSelectedWidget] = useState<DashboardWidget | null>(dashboardWidgets[0] || null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [newWidgetTitle, setNewWidgetTitle] = useState('');
  const [newWidgetType, setNewWidgetType] = useState<WidgetType>('bar');
  const [newWidgetMetric, setNewWidgetMetric] = useState('revenue');

  const handleAddWidgetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWidgetTitle.trim()) return;

    addWidget({
      title: newWidgetTitle,
      type: newWidgetType,
      dataSourceId: 'ds-1',
      metric: newWidgetMetric,
      dimension: 'month',
      width: 'half',
      refreshIntervalSec: 60,
      data: [
        { label: 'Jan', value: 42000 },
        { label: 'Feb', value: 58000 },
        { label: 'Mar', value: 74000 },
        { label: 'Apr', value: 92000 }
      ]
    });

    setIsAddModalOpen(false);
    setNewWidgetTitle('');
    addToast({ type: 'success', title: 'Widget Added to Grid' });
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b-2 border-[#1c253b] pb-3">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-display text-2xl font-black tracking-tight text-white uppercase">
              Executive Analytics Dashboard
            </h1>
            <span className="rounded bg-emerald-400 text-black px-1.5 py-0.5 font-mono text-[10px] font-black border border-black shadow-[2px_2px_0px_#000]">
              {dashboardWidgets.length} WIDGETS
            </span>
          </div>
          <p className="text-xs font-mono text-slate-400 mt-1">
            // Real-time financial telemetry, MRR velocity, and user conversion funnels.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="brutal-btn bg-[#131b2e] text-slate-200 px-3.5 py-2 text-xs font-bold font-mono"
          >
            <Share2 className="h-4 w-4 mr-1.5 text-cyan-400" />
            <span>SHARE & EMBED</span>
          </button>

          <button
            onClick={() => setIsDashboardEditMode(!isDashboardEditMode)}
            className={`brutal-btn px-4 py-2 text-xs font-black tracking-tight ${
              isDashboardEditMode 
                ? 'bg-[#ffee00] text-black border-black shadow-[3px_3px_0px_#000]'
                : 'brutal-btn-primary'
            }`}
          >
            <Sliders className="h-4 w-4 mr-1.5" />
            <span>{isDashboardEditMode ? 'EXIT EDIT MODE' : 'EDIT DASHBOARD'}</span>
          </button>

          {isDashboardEditMode && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="brutal-btn bg-emerald-400 text-black border-black px-3.5 py-2 text-xs font-black"
            >
              <Plus className="h-4 w-4 mr-1" />
              <span>ADD WIDGET</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Grid + Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Widgets Canvas (8 or 12 cols depending on edit mode) */}
        <div className={`${isDashboardEditMode ? 'lg:col-span-8' : 'lg:col-span-12'} grid grid-cols-1 md:grid-cols-2 gap-4`}>
          {dashboardWidgets.map((widget) => {
            const isSelected = selectedWidget?.id === widget.id;

            return (
              <div
                key={widget.id}
                onClick={() => isDashboardEditMode && setSelectedWidget(widget)}
                className={`brutal-panel p-5 flex flex-col justify-between ${
                  widget.width === 'full' ? 'md:col-span-2' : 'md:col-span-1'
                } ${
                  isDashboardEditMode && isSelected 
                    ? 'border-[#06b6d4] bg-[#12192d] shadow-[5px_5px_0px_#000]' 
                    : ''
                }`}
              >
                <div>
                  <div className="flex items-center justify-between border-b border-[#1c253b] pb-2.5 mb-3">
                    <div className="flex items-center space-x-2">
                      <BarChart3 className="h-4 w-4 text-cyan-400" />
                      <h3 className="font-display text-sm font-black text-white uppercase">{widget.title}</h3>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="rounded bg-black px-1.5 py-0.2 font-mono text-[8px] font-bold text-cyan-400 uppercase border border-[#2a364f]">
                        {widget.type}
                      </span>
                      {isDashboardEditMode && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeWidget(widget.id);
                          }}
                          className="text-rose-400 hover:text-rose-300 p-1"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Widget Visualization Render */}
                  {widget.type === 'kpi' && (
                    <div className="neu-inset-well p-4 my-2 flex items-baseline justify-between">
                      <div>
                        <span className="font-display text-3xl font-black text-white">$142,850</span>
                        <div className="flex items-center space-x-1 text-emerald-400 text-xs font-mono font-bold mt-1">
                          <ArrowUpRight className="h-3.5 w-3.5" />
                          <span>+18.4% MOM GROWTH</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500">Auto-refresh 60s</span>
                    </div>
                  )}

                  {widget.type === 'area' && (
                    <div className="neu-inset-well p-4 my-2 h-44 flex items-end justify-between gap-3">
                      {(widget.data || []).map((d: any, idx: number) => (
                        <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                          <div 
                            className="w-full bg-[#06b6d4] border-2 border-black rounded-t shadow-[2px_2px_0px_#000] group-hover:bg-[#22d3ee] transition-all"
                            style={{ height: `${(d.value / 185000) * 100}%` }}
                          />
                          <span className="text-[9px] font-mono text-slate-400 mt-1 font-bold">{d.label}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {widget.type === 'donut' && (
                    <div className="neu-inset-well p-4 my-2 flex items-center justify-around">
                      <div className="h-24 w-24 rounded-full border-8 border-[#06b6d4] border-t-[#ffee00] border-r-emerald-400 border-l-[#a855f7] shadow-[2px_2px_0px_#000]" />
                      <div className="space-y-1 text-xs font-mono">
                        <div className="flex items-center space-x-2 text-slate-300">
                          <div className="h-2 w-2 rounded-full bg-[#06b6d4]" />
                          <span>Enterprise (48%)</span>
                        </div>
                        <div className="flex items-center space-x-2 text-slate-300">
                          <div className="h-2 w-2 rounded-full bg-[#ffee00]" />
                          <span>Growth (32%)</span>
                        </div>
                        <div className="flex items-center space-x-2 text-slate-300">
                          <div className="h-2 w-2 rounded-full bg-emerald-400" />
                          <span>Starter (20%)</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {widget.type === 'bar' && (
                    <div className="neu-inset-well p-4 my-2 h-44 flex items-end justify-between gap-2">
                      {(widget.data || []).map((d: any, idx: number) => (
                        <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                          <div 
                            className="w-full bg-[#ffee00] border-2 border-black rounded-t shadow-[2px_2px_0px_#000] group-hover:bg-[#fef08a] transition-all"
                            style={{ height: `${(d.value / 10000) * 100}%` }}
                          />
                          <span className="text-[9px] font-mono text-slate-400 mt-1 font-bold">{d.label}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {widget.type === 'funnel' && (
                    <div className="neu-inset-well p-3 my-2 space-y-2 text-xs font-mono">
                      {(widget.data || []).map((d: any, idx: number) => (
                        <div key={idx} className="space-y-1">
                          <div className="flex justify-between text-slate-300">
                            <span>{d.stage}</span>
                            <span className="text-[#ffee00] font-bold">{d.count.toLocaleString()} ({d.rate}%)</span>
                          </div>
                          <div className="h-2 bg-[#090d18] rounded border border-[#2a364f] p-0.2">
                            <div className="h-full bg-[#06b6d4] rounded-sm" style={{ width: `${d.rate}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-3 pt-2.5 border-t border-[#1c253b] flex items-center justify-between text-[10px] font-mono text-slate-500">
                  <span>METRIC: <strong className="text-slate-300">{widget.metric.toUpperCase()}</strong></span>
                  <span>DIM: <strong className="text-slate-300">{(widget.dimension || 'TIME').toUpperCase()}</strong></span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Inspector Panel in Edit Mode (4 cols) */}
        {isDashboardEditMode && (
          <div className="lg:col-span-4 brutal-panel p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#1c253b] pb-3">
              <h3 className="font-display text-sm font-black text-white uppercase flex items-center space-x-2">
                <Sliders className="h-4 w-4 text-[#ffee00]" />
                <span>Visual Inspector</span>
              </h3>
              <span className="rounded bg-black px-1.5 py-0.2 font-mono text-[9px] font-bold text-cyan-400 border border-[#2a364f]">
                CONFIG
              </span>
            </div>

            {selectedWidget ? (
              <div className="space-y-3.5 text-xs font-mono">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">WIDGET TITLE</label>
                  <input
                    type="text"
                    value={selectedWidget.title}
                    readOnly
                    className="w-full rounded-lg border-2 border-[#2a364f] bg-[#080c16] px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">CHART TYPE</label>
                  <div className="rounded-lg border-2 border-[#2a364f] bg-[#080c16] px-3 py-2 text-cyan-300 font-bold uppercase">
                    {selectedWidget.type} CHART
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">PRIMARY METRIC</label>
                  <div className="rounded-lg border-2 border-[#2a364f] bg-[#080c16] px-3 py-2 text-slate-200">
                    {selectedWidget.metric}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#1c253b]">
                  <button
                    onClick={() => openCopilotWithPrompt(`Suggest the best visualization chart and SQL aggregation query for metric: ${selectedWidget.metric}`)}
                    className="w-full brutal-btn bg-[#131b2e] text-slate-200 py-2 text-xs font-mono font-bold"
                  >
                    <Sparkles className="h-3.5 w-3.5 mr-1.5 text-[#ffee00]" />
                    <span>AI VISUAL OPTIMIZER</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="neu-inset-well p-6 text-center text-xs font-mono text-slate-500">
                Click any widget in the grid to customize its chart configuration.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Share Modal */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-100">
          <div className="w-full max-w-lg rounded-xl border-2 border-[#2a364f] bg-[#0c101c] p-6 shadow-[8px_8px_0px_#000000] space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b-2 border-[#1c253b] pb-3">
              <h3 className="font-display text-base font-black text-white uppercase flex items-center space-x-2">
                <Share2 className="h-4 w-4 text-cyan-400" />
                <span>Share & Embed Dashboard</span>
              </h3>
              <button onClick={() => setIsShareModalOpen(false)} className="text-slate-400 hover:text-white">
                [ESC]
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">PUBLIC READ-ONLY LINK</label>
                <div className="neu-inset-well p-2.5 text-cyan-300 truncate">
                  https://app.datapilot.io/dashboards/share/mesh-8942a-mrr
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">EMBED IFRAME CODE</label>
                <div className="neu-inset-well p-2.5 text-slate-300 text-[11px]">
                  &lt;iframe src="https://app.datapilot.io/embed/d-89" width="100%" height="600" /&gt;
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t-2 border-[#1c253b]">
              <button
                onClick={() => {
                  navigator.clipboard.writeText('https://app.datapilot.io/dashboards/share/mesh-8942a-mrr');
                  addToast({ type: 'success', title: 'Share link copied!' });
                  setIsShareModalOpen(false);
                }}
                className="brutal-btn brutal-btn-primary px-4 py-1.5 font-black"
              >
                COPY LINK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Widget Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-100">
          <div className="w-full max-w-md rounded-xl border-2 border-[#2a364f] bg-[#0c101c] p-6 shadow-[8px_8px_0px_#000000] space-y-4 font-mono text-xs">
            <h3 className="font-display text-base font-black text-white uppercase">ADD NEW WIDGET</h3>
            <form onSubmit={handleAddWidgetSubmit} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-slate-300 block mb-1">WIDGET TITLE</label>
                <input
                  type="text"
                  required
                  value={newWidgetTitle}
                  onChange={(e) => setNewWidgetTitle(e.target.value)}
                  placeholder="e.g. Daily Active Trials"
                  className="w-full rounded-lg border-2 border-[#2a364f] bg-[#080c16] px-3 py-2 text-white outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-300 block mb-1">CHART TYPE</label>
                <select
                  value={newWidgetType}
                  onChange={(e) => setNewWidgetType(e.target.value as WidgetType)}
                  className="w-full rounded-lg border-2 border-[#2a364f] bg-[#080c16] px-3 py-2 text-white outline-none"
                >
                  <option value="bar">Bar Chart</option>
                  <option value="area">Area Chart</option>
                  <option value="donut">Donut Chart</option>
                  <option value="kpi">KPI Metric Card</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="brutal-btn bg-[#131b2e] px-3 py-1.5 text-slate-300"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="brutal-btn brutal-btn-primary px-4 py-1.5 font-black"
                >
                  ADD WIDGET
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
