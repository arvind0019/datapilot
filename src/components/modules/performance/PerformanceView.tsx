import React, { useState } from 'react';
import { 
  Gauge, 
  Sparkles, 
  Clock, 
  Copy, 
  Check, 
  X
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { SlowQueryLog } from '../../../types';

export const PerformanceView: React.FC = () => {
  const { 
    slowQueries, 
    applyIndexOptimization, 
    addToast, 
    openCopilotWithPrompt 
  } = useApp();

  const [selectedSlowQuery, setSelectedSlowQuery] = useState<SlowQueryLog | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleApplyIndex = (queryId: string) => {
    applyIndexOptimization(queryId);
    setSelectedSlowQuery(null);
  };

  const handleCopyDdl = (ddl: string, id: string) => {
    navigator.clipboard.writeText(ddl);
    setCopiedId(id);
    addToast({ type: 'success', title: 'DDL Copied to Clipboard' });
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b-2 border-[#1c253b] pb-3">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-display text-2xl font-black tracking-tight text-white uppercase">
              Performance & Query Profiler
            </h1>
            <span className="rounded bg-[#ffee00] text-black px-1.5 py-0.5 font-mono text-[10px] font-black border border-black shadow-[2px_2px_0px_#000]">
              {slowQueries.length} SLOW DETECTED
            </span>
          </div>
          <p className="text-xs font-mono text-slate-400 mt-1">
            // Automated latency analysis, sequential scan bottlenecks, and covering index generation.
          </p>
        </div>

        <button
          onClick={() => openCopilotWithPrompt('Perform automated database index audit and optimize slow queries.')}
          className="brutal-btn brutal-btn-primary px-4 py-2 text-xs font-black"
        >
          <Sparkles className="h-4 w-4 mr-1.5" />
          <span>AI INDEX AUDIT</span>
        </button>
      </div>

      {/* Latency Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5">
        <div className="brutal-panel p-4">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">AVG P50 LATENCY</span>
          <div className="font-display text-2xl font-black text-emerald-400 mt-1">18.2 MS</div>
          <span className="text-[10px] font-mono text-slate-500">Across 42.8k queries</span>
        </div>

        <div className="brutal-panel p-4">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">TAIL P95 LATENCY</span>
          <div className="font-display text-2xl font-black text-[#ffee00] mt-1">142.8 MS</div>
          <span className="text-[10px] font-mono text-slate-500">Peak hour 12:00 UTC</span>
        </div>

        <div className="brutal-panel p-4">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">ROWS SCANNED / RETURNED</span>
          <div className="font-display text-2xl font-black text-white mt-1">13,375 : 1</div>
          <span className="text-[10px] font-mono text-rose-400 font-bold">Unindexed scans</span>
        </div>

        <div className="brutal-panel p-4">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">QUERY CACHE HIT RATE</span>
          <div className="font-display text-2xl font-black text-cyan-300 mt-1">92.4%</div>
          <span className="text-[10px] font-mono text-emerald-400 font-bold">Optimal state</span>
        </div>
      </div>

      {/* Slow Queries Table */}
      <div className="brutal-panel p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-[#1c253b] pb-3">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-[#ffee00]" />
            <h3 className="font-display text-sm font-black text-white uppercase">Slowest Production Queries</h3>
          </div>
          <span className="text-[10px] font-mono text-slate-500 font-bold">THRESHOLD: &gt; 3,000MS</span>
        </div>

        <div className="space-y-3">
          {slowQueries.map((sq: SlowQueryLog) => {
            const latencyStr = sq.durationSec ? `${sq.durationSec}S` : `${(sq.executionTimeMs / 1000).toFixed(2)}S`;
            const rootCauseStr = sq.rootCause || sq.bottleneck || sq.possibleCause || 'Sequential table scan';

            return (
              <div
                key={sq.id}
                className="rounded-xl border-2 border-[#2a364f] bg-[#0c101c] p-4 shadow-[3.5px_3.5px_0px_#000000] hover:border-cyan-400 transition-all flex flex-col md:flex-row md:items-center md:justify-between gap-4 font-mono text-xs"
              >
                <div className="space-y-2 flex-1 truncate">
                  <div className="flex items-center space-x-2">
                    <span className="rounded bg-[#ffee00] text-black px-1.5 py-0.2 font-mono text-[9px] font-black border border-black shadow-[1.5px_1.5px_0px_#000]">
                      {latencyStr} LATENCY
                    </span>
                    <span className="text-slate-400 font-bold">{sq.database}</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-slate-400">{typeof sq.frequency === 'number' ? `${sq.frequency} / hr` : sq.frequency}</span>
                  </div>

                  <div className="neu-inset-well p-2.5 text-slate-200 truncate">
                    {sq.query}
                  </div>

                  <div className="flex items-center space-x-3 text-[11px] text-slate-500">
                    <span>Rows Scanned: <strong className="text-rose-400">{sq.rowsScanned.toLocaleString()}</strong></span>
                    <span>•</span>
                    <span>Rows Returned: <strong className="text-white">{sq.rowsReturned.toLocaleString()}</strong></span>
                    <span>•</span>
                    <span>Root Cause: <strong className="text-slate-300">{rootCauseStr}</strong></span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 flex-shrink-0">
                  <button
                    onClick={() => setSelectedSlowQuery(sq)}
                    className="brutal-btn brutal-btn-primary px-3.5 py-2 text-xs font-black"
                  >
                    <Gauge className="h-3.5 w-3.5 mr-1" />
                    <span>ANALYZE PERFORMANCE</span>
                  </button>
                </div>
              </div>
            );
          })}

          {slowQueries.length === 0 && (
            <div className="neu-inset-well p-10 text-center font-mono text-xs text-emerald-400">
              ✓ All database queries are fully indexed and running in sub-50ms!
            </div>
          )}
        </div>
      </div>

      {/* Deep-Dive Drawer for Selected Slow Query */}
      {selectedSlowQuery && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="h-full w-full max-w-2xl border-l-2 border-[#2a364f] bg-[#0c101c] p-6 shadow-[12px_0px_0px_#000000] overflow-y-auto flex flex-col justify-between font-mono text-xs animate-in slide-in-from-right duration-200">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b-2 border-[#1c253b] pb-4">
                <div className="flex items-center space-x-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#ffee00] text-black border border-black shadow-[2px_2px_0px_#000]">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-base font-black text-white uppercase">
                      Query Bottleneck Deep-Dive
                    </h3>
                    <p className="text-xs text-slate-400">
                      Duration: <strong className="text-[#ffee00]">{selectedSlowQuery.durationSec || (selectedSlowQuery.executionTimeMs / 1000).toFixed(2)}s</strong> • Database: <strong className="text-cyan-300">{selectedSlowQuery.database}</strong>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedSlowQuery(null)}
                  className="rounded-md bg-[#131b2e] border border-[#2a364f] p-1.5 text-slate-300 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Slow SQL code */}
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">// SLOW PRODUCTION QUERY</span>
                <pre className="neu-inset-well p-3 text-slate-200 overflow-x-auto text-[11px] leading-relaxed">
                  {selectedSlowQuery.query}
                </pre>
              </div>

              {/* Execution Plan Stages */}
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">// EXECUTION PLAN BOTTLENECK STAGES</span>
                <div className="space-y-2">
                  {(selectedSlowQuery.executionPlan || selectedSlowQuery.queryPlan || []).map((stage: any, i: number) => (
                    <div key={i} className="neu-inset-well p-3 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-white">{stage.operation || stage.nodeType}</div>
                        <div className="text-[10px] text-slate-400">{stage.details || stage.detail}</div>
                      </div>
                      <div className="text-right">
                        <span className="text-[#ffee00] font-bold">{stage.cost} cost</span>
                        <div className="text-[10px] text-slate-500">{stage.durationMs || stage.timeMs}ms</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Index Solution */}
              {(() => {
                const rec = selectedSlowQuery.indexRecommendation || {
                  ddl: selectedSlowQuery.recommendedIndexSql || 'CREATE INDEX idx_auto ON table(id);',
                  targetTable: 'public.orders',
                  estimatedSpeedup: '95% latency reduction'
                };

                return (
                  <div className="rounded-xl border-2 border-[#06b6d4] bg-[#0d1626] p-4 shadow-[4px_4px_0px_#000] space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1.5 text-cyan-300 font-bold">
                        <Sparkles className="h-4 w-4 text-[#ffee00]" />
                        <span>AI RECOMMENDED INDEX DDL</span>
                      </div>
                      <button
                        onClick={() => handleCopyDdl(rec.ddl, selectedSlowQuery.id)}
                        className="flex items-center space-x-1 text-slate-300 hover:text-white text-[11px]"
                      >
                        {copiedId === selectedSlowQuery.id ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                        <span>{copiedId === selectedSlowQuery.id ? 'COPIED' : 'COPY DDL'}</span>
                      </button>
                    </div>

                    <pre className="neu-inset-well p-3 text-cyan-300 text-[11px] overflow-x-auto">
                      {rec.ddl}
                    </pre>

                    <div className="flex items-center justify-between text-[11px] text-slate-300 pt-1">
                      <span>Target Table: <strong className="text-white">{rec.targetTable}</strong></span>
                      <span className="text-emerald-400 font-bold">Expected Speedup: {rec.estimatedSpeedup}</span>
                    </div>
                  </div>
                );
              })()}
            </div>

            <div className="pt-4 border-t-2 border-[#1c253b] flex items-center justify-end space-x-3">
              <button
                onClick={() => setSelectedSlowQuery(null)}
                className="brutal-btn bg-[#131b2e] px-4 py-2 text-slate-300"
              >
                CANCEL
              </button>

              <button
                onClick={() => handleApplyIndex(selectedSlowQuery.id)}
                className="brutal-btn brutal-btn-primary px-5 py-2 font-black"
              >
                APPLY INDEX OPTIMIZATION (1-CLICK)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
