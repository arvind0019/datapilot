import React, { useState } from 'react';
import { 
  Rocket, 
  RotateCcw, 
  Sparkles, 
  Terminal, 
  Clock, 
  X, 
  Play
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { Environment } from '../../../types';

export const DeploymentCenterView: React.FC = () => {
  const { 
    deployments, 
    triggerDeployment, 
    rollbackDeployment, 
    addToast, 
    openCopilotWithPrompt 
  } = useApp();

  const [selectedEnv, setSelectedEnv] = useState<Environment>('production');
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [deployNotes, setDeployNotes] = useState('');
  const [isDeploying, setIsDeploying] = useState(false);
  const [streamingTerminalLogs, setStreamingTerminalLogs] = useState<string[]>([]);

  const handleStartDeployment = () => {
    setIsDeploying(true);
    setStreamingTerminalLogs([
      '[09:20:01] Initializing Antigravity CI/CD build runner...',
      '[09:20:02] Fetching git commit main@8a4f912...',
      '[09:20:04] Compiling 5 semantic dbt models with target: production...',
      '[09:20:06] Executing dbt test suite (14 assertions)...',
      '[09:20:08] ✓ All 14 schema assertions passed.',
      '[09:20:09] Applying PostgreSQL migration: idx_orders_cust_date_amt...',
      '[09:20:11] Promoting blue-green deployment target to LIVE...',
      '[09:20:12] ✓ Deployment v2.8.6-prod successfully promoted.'
    ]);

    setTimeout(() => {
      triggerDeployment(selectedEnv, 'Manual production release', deployNotes || 'Optimized query latency and updated dbt mart models.');
      setIsDeploying(false);
      setIsDeployModalOpen(false);
      setDeployNotes('');
      addToast({
        type: 'success',
        title: 'Deployment Successful',
        message: `Version v2.8.6 is now LIVE on ${selectedEnv}.`
      });
    }, 2500);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b-2 border-[#1c253b] pb-3">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-display text-2xl font-black tracking-tight text-white uppercase">
              Deployment & Release Pipeline
            </h1>
            <span className="rounded bg-emerald-400 text-black px-1.5 py-0.5 font-mono text-[10px] font-black border border-black shadow-[2px_2px_0px_#000]">
              CI/CD AUTOMATION
            </span>
          </div>
          <p className="text-xs font-mono text-slate-400 mt-1">
            // Automated dbt test validation, blue-green releases, and live terminal streaming.
          </p>
        </div>

        <button
          onClick={() => setIsDeployModalOpen(true)}
          className="brutal-btn brutal-btn-primary px-4 py-2 text-xs font-black"
        >
          <Rocket className="h-4 w-4 mr-1.5" />
          <span>DEPLOY TO ENVIRONMENT</span>
        </button>
      </div>

      {/* Deployment History Table + Live Streaming Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Release Records (7 cols) */}
        <div className="lg:col-span-7 brutal-panel p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#1c253b] pb-3">
            <h3 className="font-display text-sm font-black text-white uppercase">RELEASE HISTORY LOGS</h3>
            <span className="text-xs font-mono text-slate-400">Environment: <strong className="text-emerald-400">PRODUCTION</strong></span>
          </div>

          <div className="space-y-3">
            {deployments.map((dep) => (
              <div
                key={dep.id}
                className="neu-inset-well p-4 space-y-2.5 font-mono text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="rounded bg-[#06b6d4] text-black px-1.5 py-0.2 font-black border border-black">
                      {dep.version}
                    </span>
                    <span className="font-bold text-white uppercase">{dep.environment}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="rounded bg-emerald-400 text-black px-1.5 py-0.2 text-[9px] font-black border border-black">
                      SUCCESS
                    </span>
                    <span className="text-slate-500 text-[10px]">{dep.timestamp}</span>
                  </div>
                </div>

                <p className="text-slate-200 text-xs font-sans">{dep.commitMessage}</p>

                <div className="flex items-center justify-between pt-2 border-t border-[#1c253b] text-[11px] text-slate-400">
                  <span>Author: <strong className="text-white">{dep.author}</strong> ({dep.commitHash})</span>
                  <button
                    onClick={() => rollbackDeployment(dep.id)}
                    className="flex items-center space-x-1 text-cyan-400 hover:text-cyan-300 font-bold"
                  >
                    <RotateCcw className="h-3 w-3" />
                    <span>ROLLBACK TO THIS</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Terminal Build Logs Viewer (5 cols) */}
        <div className="lg:col-span-5 brutal-panel p-5 flex flex-col justify-between space-y-3 font-mono">
          <div>
            <div className="flex items-center justify-between border-b border-[#1c253b] pb-3 mb-3">
              <div className="flex items-center space-x-2 text-white font-bold text-xs">
                <Terminal className="h-4 w-4 text-cyan-400" />
                <span>STREAMING TERMINAL LOGS</span>
              </div>
              <span className="flex items-center space-x-1 text-[10px] text-emerald-400 font-bold">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#10b981]" />
                <span>ONLINE</span>
              </span>
            </div>

            <div className="neu-inset-well p-4 text-xs text-slate-300 space-y-1.5 min-h-[320px] max-h-[380px] overflow-y-auto">
              <div className="text-slate-500">// DATAPILOT DEPLOYMENT DAEMON v2.8.4</div>
              <div className="text-emerald-400 font-bold">[READY] Listening for webhook release triggers...</div>
              {deployments[0]?.logs.map((log, i) => (
                <div key={i} className="leading-relaxed">
                  {log.includes('PASSED') || log.includes('SUCCESS') ? (
                    <span className="text-emerald-400 font-bold">{log}</span>
                  ) : log.includes('WARN') ? (
                    <span className="text-[#ffee00] font-bold">{log}</span>
                  ) : (
                    <span>{log}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-[#1c253b] flex items-center justify-between text-xs text-slate-400">
            <span>Branch: <strong className="text-white">main</strong></span>
            <button
              onClick={() => openCopilotWithPrompt('Audit automated deployment pipeline and test coverage rules.')}
              className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center space-x-1"
            >
              <Sparkles className="h-3 w-3 text-[#ffee00]" />
              <span>AI CI/CD AUDIT</span>
            </button>
          </div>
        </div>
      </div>

      {/* Deployment Modal */}
      {isDeployModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-100 font-mono text-xs">
          <div className="w-full max-w-lg rounded-xl border-2 border-[#2a364f] bg-[#0c101c] p-6 shadow-[8px_8px_0px_#000000] space-y-4">
            <div className="flex items-center justify-between border-b-2 border-[#1c253b] pb-3">
              <h3 className="font-display text-base font-black text-white uppercase flex items-center space-x-2">
                <Rocket className="h-4 w-4 text-cyan-400" />
                <span>Deploy to Environment</span>
              </h3>
              <button onClick={() => setIsDeployModalOpen(false)} className="text-slate-400 hover:text-white">
                [ESC]
              </button>
            </div>

            {isDeploying ? (
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-cyan-300 font-bold">
                  <Play className="h-4 w-4 animate-spin text-[#ffee00]" />
                  <span>COMPILING DBT & MIGRATING PRODUCTION SCHEMA...</span>
                </div>
                <div className="neu-inset-well p-3 text-[11px] space-y-1 text-slate-300 max-h-48 overflow-y-auto">
                  {streamingTerminalLogs.map((log, idx) => (
                    <div key={idx}>{log}</div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-300 block mb-1">TARGET ENVIRONMENT</label>
                  <select
                    value={selectedEnv}
                    onChange={(e) => setSelectedEnv(e.target.value as Environment)}
                    className="w-full rounded-lg border-2 border-[#2a364f] bg-[#080c16] px-3 py-2 text-white outline-none"
                  >
                    <option value="production">Production (Live Traffic)</option>
                    <option value="staging">Staging (Pre-release)</option>
                    <option value="development">Development Sandbox</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-300 block mb-1">RELEASE CHANGELOG / NOTES</label>
                  <textarea
                    value={deployNotes}
                    onChange={(e) => setDeployNotes(e.target.value)}
                    placeholder="e.g. Added index on orders and updated monthly finance dbt mart..."
                    rows={3}
                    className="w-full rounded-lg border-2 border-[#2a364f] bg-[#080c16] px-3 py-2 text-white outline-none font-sans"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-3 border-t-2 border-[#1c253b]">
                  <button
                    onClick={() => setIsDeployModalOpen(false)}
                    className="brutal-btn bg-[#131b2e] px-3 py-1.5 text-slate-300"
                  >
                    CANCEL
                  </button>
                  <button
                    onClick={handleStartDeployment}
                    className="brutal-btn brutal-btn-primary px-5 py-1.5 font-black"
                  >
                    START DEPLOYMENT
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
