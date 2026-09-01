import React, { useState } from 'react';
import { 
  Bug, 
  Sparkles, 
  CheckCircle2, 
  X, 
  Filter
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { DebugErrorItem } from '../../../types';

export const DebugCenterView: React.FC = () => {
  const { 
    debugErrors, 
    updateErrorStatus, 
    addToast, 
    openCopilotWithPrompt 
  } = useApp();

  const [selectedIncident, setSelectedIncident] = useState<DebugErrorItem | null>(null);
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredErrors = debugErrors.filter((err) => {
    if (severityFilter !== 'all' && err.severity !== severityFilter) return false;
    if (statusFilter !== 'all' && err.status !== statusFilter) return false;
    return true;
  });

  const handleMarkResolved = (id: string) => {
    updateErrorStatus(id, 'resolved');
    setSelectedIncident(null);
    addToast({
      type: 'success',
      title: 'Incident Resolved',
      message: 'Status updated to resolved across workspace telemetry.'
    });
  };

  const getRootCauseText = (err: DebugErrorItem): string => {
    if (typeof err.aiExplanation === 'object' && err.aiExplanation?.rootCause) {
      return err.aiExplanation.rootCause;
    }
    if (typeof err.aiExplanation === 'string') {
      return err.aiExplanation.slice(0, 80);
    }
    return err.possibleCause || 'Unindexed scan or resource conflict';
  };

  const getPlainEnglishText = (err: DebugErrorItem): string => {
    if (typeof err.aiExplanation === 'object' && err.aiExplanation?.plainEnglish) {
      return err.aiExplanation.plainEnglish;
    }
    if (typeof err.aiExplanation === 'string') {
      return err.aiExplanation;
    }
    return err.possibleCause || 'Automated diagnosis analyzed trace.';
  };

  const getResolutionSteps = (err: DebugErrorItem): string[] => {
    if (typeof err.aiExplanation === 'object' && Array.isArray(err.aiExplanation?.resolutionSteps)) {
      return err.aiExplanation.resolutionSteps;
    }
    if (Array.isArray(err.stepsToResolve)) {
      return err.stepsToResolve;
    }
    return [
      'Inspect background job queue & connection pooling.',
      'Wrap operations in transactional safety block.',
      'Enable retry policy with exponential backoff.'
    ];
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b-2 border-[#1c253b] pb-3">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-display text-2xl font-black tracking-tight text-white uppercase">
              Centralized Debug & Incident Center
            </h1>
            <span className="rounded bg-rose-500 text-black px-1.5 py-0.5 font-mono text-[10px] font-black border border-black shadow-[2px_2px_0px_#000]">
              {debugErrors.filter(e => e.status === 'open').length} ACTIVE INCIDENTS
            </span>
          </div>
          <p className="text-xs font-mono text-slate-400 mt-1">
            // Aggregated database exceptions, rate limit triggers, and AI automated root-cause triage.
          </p>
        </div>

        <button
          onClick={() => openCopilotWithPrompt('Run full workspace root-cause analysis on all open critical incidents.')}
          className="brutal-btn brutal-btn-primary px-4 py-2 text-xs font-black"
        >
          <Sparkles className="h-4 w-4 mr-1.5" />
          <span>AI INCIDENT TRIAGE</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 brutal-panel p-3">
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <div className="flex items-center space-x-1.5 text-slate-400 font-bold mr-2">
            <Filter className="h-3.5 w-3.5" />
            <span>FILTER BY:</span>
          </div>

          <div className="flex rounded-md bg-[#080c16] p-1 border border-[#2a364f]">
            {['all', 'critical', 'warning', 'info'].map((sev) => (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                className={`rounded px-2.5 py-1 uppercase text-[10px] font-bold transition-all ${
                  severityFilter === sev
                    ? 'bg-[#06b6d4] text-black font-black shadow-[1.5px_1.5px_0px_#000]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>

          <div className="flex rounded-md bg-[#080c16] p-1 border border-[#2a364f]">
            {['all', 'open', 'investigating', 'resolved'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`rounded px-2.5 py-1 uppercase text-[10px] font-bold transition-all ${
                  statusFilter === st
                    ? 'bg-[#ffee00] text-black font-black shadow-[1.5px_1.5px_0px_#000]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <span className="text-xs font-mono text-slate-500">
          Showing {filteredErrors.length} of {debugErrors.length} items
        </span>
      </div>

      {/* Incidents List */}
      <div className="space-y-3">
        {filteredErrors.map((item) => (
          <div
            key={item.id}
            className="brutal-panel brutal-panel-hover p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 font-mono text-xs"
          >
            <div className="space-y-2 flex-1 truncate">
              <div className="flex items-center space-x-2.5">
                <span className={`rounded px-2 py-0.5 font-mono text-[9px] font-black uppercase border border-black shadow-[1.5px_1.5px_0px_#000] ${
                  item.severity === 'critical' ? 'bg-rose-500 text-black' :
                  item.severity === 'warning' ? 'bg-[#ffee00] text-black' :
                  'bg-cyan-400 text-black'
                }`}>
                  {item.code}
                </span>

                <span className="rounded bg-[#12192a] px-2 py-0.5 text-cyan-300 font-bold border border-[#2a364f]">
                  {item.source}
                </span>

                <span className="text-slate-400">{item.timestamp}</span>

                <span className="ml-auto rounded bg-black px-2 py-0.5 text-[10px] font-bold uppercase text-slate-300 border border-[#2a364f]">
                  STATUS: {item.status}
                </span>
              </div>

              <h3 className="font-display text-base font-black text-white">{item.message}</h3>

              <div className="neu-inset-well p-2.5 text-slate-400 text-[11px] truncate">
                {item.stackTrace.split('\n')[0]}
              </div>

              <div className="flex items-center space-x-2 text-cyan-300 text-[11px] font-bold">
                <Sparkles className="h-3.5 w-3.5 text-[#ffee00]" />
                <span>AI Root Cause: {getRootCauseText(item)}</span>
              </div>
            </div>

            <div className="flex items-center space-x-2 flex-shrink-0">
              <button
                onClick={() => setSelectedIncident(item)}
                className="brutal-btn brutal-btn-primary px-4 py-2 font-black"
              >
                <Bug className="h-3.5 w-3.5 mr-1.5" />
                <span>EXPLAIN WITH AI</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Incident Deep-Dive Modal / Drawer */}
      {selectedIncident && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="h-full w-full max-w-2xl border-l-2 border-[#2a364f] bg-[#0c101c] p-6 shadow-[12px_0px_0px_#000000] overflow-y-auto flex flex-col justify-between font-mono text-xs animate-in slide-in-from-right duration-200">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b-2 border-[#1c253b] pb-4">
                <div className="flex items-center space-x-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-500 text-black border border-black shadow-[2px_2px_0px_#000]">
                    <Bug className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-base font-black text-white uppercase">
                      Incident Analysis: {selectedIncident.code}
                    </h3>
                    <p className="text-xs text-slate-400">
                      Source: <strong className="text-cyan-300">{selectedIncident.source}</strong> • Severity: <strong className="text-rose-400 uppercase">{selectedIncident.severity}</strong>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedIncident(null)}
                  className="rounded-md bg-[#131b2e] border border-[#2a364f] p-1.5 text-slate-300 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Stack Trace */}
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">// TECHNICAL STACK TRACE</span>
                <pre className="neu-inset-well p-3 text-rose-300 overflow-x-auto text-[11px] leading-relaxed max-h-40">
                  {selectedIncident.stackTrace}
                </pre>
              </div>

              {/* AI Plain English Translation */}
              <div className="rounded-xl border-2 border-[#06b6d4] bg-[#0d1626] p-4 shadow-[4px_4px_0px_#000] space-y-3">
                <div className="flex items-center space-x-2 text-cyan-300 font-bold">
                  <Sparkles className="h-4 w-4 text-[#ffee00]" />
                  <span>DATAPILOT AI PLAIN-ENGLISH TRANSLATION</span>
                </div>

                <p className="text-slate-200 text-xs font-sans leading-relaxed">
                  {getPlainEnglishText(selectedIncident)}
                </p>

                <div className="space-y-1.5 pt-2 border-t border-[#1c253b]">
                  <span className="text-[10px] font-bold text-[#ffee00] uppercase block">// RECOMMENDED RESOLUTION STEPS:</span>
                  {getResolutionSteps(selectedIncident).map((step: string, idx: number) => (
                    <div key={idx} className="flex items-start space-x-2 text-slate-300 text-[11px]">
                      <span className="h-4 w-4 rounded bg-black border border-[#2a364f] flex items-center justify-center text-[9px] font-black text-cyan-300">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t-2 border-[#1c253b] flex items-center justify-end space-x-3">
              <button
                onClick={() => setSelectedIncident(null)}
                className="brutal-btn bg-[#131b2e] px-4 py-2 text-slate-300"
              >
                CLOSE
              </button>

              <button
                onClick={() => handleMarkResolved(selectedIncident.id)}
                className="brutal-btn bg-emerald-400 text-black px-5 py-2 font-black border border-black shadow-[3px_3px_0px_#000]"
              >
                <CheckCircle2 className="h-4 w-4 mr-1.5" />
                <span>MARK INCIDENT RESOLVED</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
