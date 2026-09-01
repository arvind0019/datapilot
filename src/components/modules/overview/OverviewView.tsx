import React from 'react';
import { 
  Database, 
  BarChart3, 
  Terminal, 
  AlertTriangle, 
  Rocket, 
  Activity, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Server, 
  Zap, 
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { WORKSPACE_ACTIVITY_LOGS, AI_PROACTIVE_INSIGHTS } from '../../../data/mockData';

export const OverviewView: React.FC = () => {
  const { 
    setCurrentSection, 
    openCopilotWithPrompt, 
    dataSources, 
    slowQueries, 
    debugErrors 
  } = useApp();

  const connectedSources = dataSources.filter(d => d.status === 'connected').length;
  const openErrors = debugErrors.filter(e => e.status === 'open').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-150 font-mono">
      {/* Top Header & Fast Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b-[3px] border-black pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-display text-2xl font-black tracking-tight text-white uppercase">
              Workspace Overview
            </h1>
            <span className="brutal-badge bg-[#00f0ff] text-black">
              MESH LIVE
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            // Telemetry diagnostics, database cluster health, and autonomous query optimization.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => openCopilotWithPrompt('Analyze entire workspace performance, slow queries, and schema reliability.')}
            className="brutal-btn brutal-btn-yellow px-4 py-2 text-xs font-black"
          >
            <Sparkles className="h-4 w-4 mr-1.5 fill-black" />
            <span>AI WORKSPACE AUDIT</span>
          </button>

          <button
            onClick={() => setCurrentSection('sql')}
            className="brutal-btn bg-white text-black px-4 py-2 text-xs font-black"
          >
            <Terminal className="h-4 w-4 mr-1.5" />
            <span>NEW SQL QUERY</span>
          </button>
        </div>
      </div>

      {/* AI Proactive Assistant Banner (Pure Neo-Brutalism Card) */}
      <div className="brutal-panel p-5 bg-[#ffee00] text-black border-[3px] border-black shadow-[6px_6px_0px_#000000] space-y-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded bg-black text-[#ffee00] border-2 border-black shadow-[3px_3px_0px_#000000]">
              <Sparkles className="h-6 w-6 fill-[#ffee00]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-display text-base font-black text-black uppercase tracking-tight">
                  DataPilot Autonomous Copilot Insights
                </h3>
                <span className="brutal-badge bg-[#ff007f] text-white">
                  3 ACTIONS READY
                </span>
              </div>
              <p className="text-xs text-black font-bold mt-1 max-w-3xl leading-relaxed">
                Identified <span className="bg-black text-[#ffee00] px-1 py-0.5 rounded font-black">3 SLOW QUERIES</span> scanning 4.28M rows sequentially, <span className="bg-black text-[#ff007f] px-1 py-0.5 rounded font-black">2 API RATE-LIMIT ERRORS</span> on Stripe, and MySQL staging replication lag (145ms).
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {AI_PROACTIVE_INSIGHTS.map((ins) => (
              <button
                key={ins.id}
                onClick={() => setCurrentSection(ins.targetSection)}
                className="brutal-btn bg-black text-white hover:bg-slate-900 px-3 py-1.5 text-xs font-black"
              >
                <span>{ins.actionLabel}</span>
                <ArrowRight className="h-3 w-3 ml-1 text-[#ffee00]" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Stat 1: Data Sources */}
        <div 
          onClick={() => setCurrentSection('sources')}
          className="brutal-panel brutal-panel-hover p-4 cursor-pointer bg-[#161b22]"
        >
          <div className="flex items-center justify-between text-slate-300 mb-2">
            <span className="text-[11px] font-black uppercase">SOURCES</span>
            <Database className="h-4 w-4 text-[#00f0ff]" />
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="font-display text-2xl font-black text-white">{connectedSources}/{dataSources.length}</span>
            <span className="text-[10px] text-[#00ff66] font-black">ONLINE</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1 truncate">Aurora, Snowflake, BQ</p>
        </div>

        {/* Stat 2: Dashboards */}
        <div 
          onClick={() => setCurrentSection('dashboards')}
          className="brutal-panel brutal-panel-hover p-4 cursor-pointer bg-[#161b22]"
        >
          <div className="flex items-center justify-between text-slate-300 mb-2">
            <span className="text-[11px] font-black uppercase">DASHBOARDS</span>
            <BarChart3 className="h-4 w-4 text-[#00ff66]" />
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="font-display text-2xl font-black text-white">18</span>
            <span className="text-[10px] text-[#00ff66] font-black">+3 WK</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1 truncate">8 widgets active</p>
        </div>

        {/* Stat 3: Daily Queries */}
        <div 
          onClick={() => setCurrentSection('sql')}
          className="brutal-panel brutal-panel-hover p-4 cursor-pointer bg-[#161b22]"
        >
          <div className="flex items-center justify-between text-slate-300 mb-2">
            <span className="text-[11px] font-black uppercase">DAILY QUERIES</span>
            <Terminal className="h-4 w-4 text-[#00f0ff]" />
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="font-display text-2xl font-black text-white">42.8k</span>
            <span className="text-[10px] text-[#00ff66] font-black">99.4%</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1 truncate">P50 18.2ms latency</p>
        </div>

        {/* Stat 4: Slow Queries */}
        <div 
          onClick={() => setCurrentSection('performance')}
          className="brutal-panel brutal-panel-hover p-4 cursor-pointer bg-[#161b22] border-[#ffee00]"
        >
          <div className="flex items-center justify-between text-slate-300 mb-2">
            <span className="text-[11px] font-black uppercase text-[#ffee00]">SLOW QUERIES</span>
            <Clock className="h-4 w-4 text-[#ffee00]" />
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="font-display text-2xl font-black text-[#ffee00]">{slowQueries.length}</span>
            <span className="text-[10px] text-[#ffee00] font-black">&gt;3.0s</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1 truncate">Indexes suggested</p>
        </div>

        {/* Stat 5: Deployments */}
        <div 
          onClick={() => setCurrentSection('deployments')}
          className="brutal-panel brutal-panel-hover p-4 cursor-pointer bg-[#161b22]"
        >
          <div className="flex items-center justify-between text-slate-300 mb-2">
            <span className="text-[11px] font-black uppercase">DEPLOY</span>
            <Rocket className="h-4 w-4 text-[#00ff66]" />
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="font-display text-2xl font-black text-[#00ff66]">LIVE</span>
            <span className="text-[10px] text-slate-400">v2.8.4</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1 truncate">14/14 tests pass</p>
        </div>

        {/* Stat 6: Mesh Health Score */}
        <div 
          onClick={() => setCurrentSection('performance')}
          className="brutal-panel brutal-panel-hover p-4 cursor-pointer bg-[#161b22]"
        >
          <div className="flex items-center justify-between text-slate-300 mb-2">
            <span className="text-[11px] font-black uppercase">MESH HEALTH</span>
            <Activity className="h-4 w-4 text-[#00f0ff]" />
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="font-display text-2xl font-black text-white">94/100</span>
            <span className="text-[10px] text-[#00ff66] font-black">OPTIMAL</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1 truncate">99.98% SLA</p>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Chart 1: Query Execution Latency & Distribution (8 cols) */}
        <div className="lg:col-span-8 brutal-panel p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-4 border-b-2 border-black pb-3">
              <div>
                <h3 className="font-display text-sm font-black text-white uppercase flex items-center space-x-2">
                  <span>Query Throughput & Tail Latency</span>
                  <span className="brutal-badge bg-[#00f0ff] text-black">
                    P95: 38.4MS
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Hourly query volume vs execution latency across Aurora, Snowflake, and BigQuery.
                </p>
              </div>

              <div className="flex items-center space-x-3 text-xs font-black">
                <div className="flex items-center space-x-1.5">
                  <div className="h-3 w-3 bg-[#00f0ff] border border-black" />
                  <span className="text-white">Throughput</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <div className="h-3 w-3 bg-[#ffee00] border border-black" />
                  <span className="text-white">P95 Latency</span>
                </div>
              </div>
            </div>

            {/* Brutalist Chart Box */}
            <div className="brutal-box p-4 relative h-60 w-full flex flex-col justify-end bg-[#0d1117]">
              <div className="relative h-full flex items-end justify-between gap-2.5 z-10 px-1">
                {[
                  { time: '00:00', vol: 35, lat: 22, queries: '1,420' },
                  { time: '03:00', vol: 20, lat: 18, queries: '890' },
                  { time: '06:00', vol: 45, lat: 28, queries: '2,840' },
                  { time: '09:00', vol: 85, lat: 48, queries: '8,920' },
                  { time: '12:00', vol: 95, lat: 56, queries: '11,400' },
                  { time: '15:00', vol: 78, lat: 42, queries: '8,120' },
                  { time: '18:00', vol: 62, lat: 34, queries: '5,300' },
                  { time: '21:00', vol: 40, lat: 24, queries: '2,400' },
                ].map((col, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center group relative h-full justify-end cursor-pointer">
                    {/* Tooltip */}
                    <div className="absolute -top-12 hidden group-hover:flex flex-col items-center bg-white border-2 border-black px-2.5 py-1 text-[10px] text-black shadow-[3px_3px_0px_#000] z-20 whitespace-nowrap pointer-events-none font-black">
                      <span>{col.queries} queries</span>
                      <span className="text-slate-600">P95: {col.lat}ms</span>
                    </div>

                    {/* Brutalist Bar */}
                    <div 
                      className="w-full max-w-[34px] rounded-t-sm bg-[#00f0ff] border-2 border-black shadow-[2px_2px_0px_#000000] group-hover:bg-[#ffee00] transition-all duration-100 relative"
                      style={{ height: `${col.vol}%` }}
                    >
                      <div 
                        className="absolute -top-2 left-1/2 -translate-x-1/2 h-3.5 w-3.5 rounded-full bg-[#ffee00] border-2 border-black"
                        style={{ bottom: `${col.lat * 1.4}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-black text-slate-400 mt-2">{col.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between border-t-2 border-black pt-3 text-xs text-slate-300">
            <span className="flex items-center space-x-1.5">
              <CheckCircle2 className="h-4 w-4 text-[#00ff66]" />
              <span>Query cache hit ratio: <strong className="text-white font-black">92.4%</strong></span>
            </span>
            <button 
              onClick={() => setCurrentSection('performance')}
              className="text-[#ffee00] hover:underline font-black flex items-center space-x-1 cursor-pointer"
            >
              <span>VIEW PERFORMANCE BREAKDOWN</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Database Health & Cluster Resources (4 cols) */}
        <div className="lg:col-span-4 brutal-panel p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-4 border-b-2 border-black pb-3">
              <h3 className="font-display text-sm font-black text-white uppercase flex items-center space-x-2">
                <Server className="h-4 w-4 text-[#00f0ff]" />
                <span>Cluster Resources</span>
              </h3>
              <span className="brutal-badge bg-[#00ff66] text-black">
                NORMAL
              </span>
            </div>

            {/* Gauges with Brutal Boxes */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-black">
                  <span className="text-white">AURORA PG V16.2 CPU</span>
                  <span className="text-[#00f0ff]">44.8%</span>
                </div>
                <div className="brutal-box h-4 w-full p-0.5 bg-black">
                  <div className="h-full bg-[#00f0ff] border border-black" style={{ width: '44.8%' }} />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>8 vCPU / 32GB RAM</span>
                  <span>18 conn</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-black">
                  <span className="text-white">SNOWFLAKE WH (MEDIUM)</span>
                  <span className="text-[#00ff66]">28.2%</span>
                </div>
                <div className="brutal-box h-4 w-full p-0.5 bg-black">
                  <div className="h-full bg-[#00ff66] border border-black" style={{ width: '28.2%' }} />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Auto-suspend 5m</span>
                  <span>2.4 credit/hr</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-black">
                  <span className="text-white">BIGQUERY BUFFER QUEUE</span>
                  <span className="text-[#ffee00]">72.6%</span>
                </div>
                <div className="brutal-box h-4 w-full p-0.5 bg-black">
                  <div className="h-full bg-[#ffee00] border border-black" style={{ width: '72.6%' }} />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>4.89 GB partitioned</span>
                  <span>120k evt/min</span>
                </div>
              </div>
            </div>
          </div>

          <div className="brutal-box p-3 text-xs bg-[#0d1117]">
            <div className="flex items-center space-x-2 text-[#ffee00]">
              <Zap className="h-4 w-4 fill-[#ffee00]" />
              <span className="font-black uppercase">Dynamic Auto-Scaling</span>
            </div>
            <p className="text-[11px] text-slate-300 mt-1 leading-tight">
              Read replica pool dynamically scales from 2 to 6 nodes during peak analytical query load.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Recent Workspace Activity + Critical Errors */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Critical Errors Widget (6 cols) */}
        <div className="lg:col-span-6 brutal-panel p-5 space-y-3">
          <div className="flex items-center justify-between border-b-2 border-black pb-3 mb-2">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-[#ff007f]" />
              <h3 className="font-display text-sm font-black text-white uppercase">Critical Errors Triage</h3>
            </div>
            <button
              onClick={() => setCurrentSection('debug')}
              className="text-xs text-[#00f0ff] hover:underline font-black flex items-center space-x-1"
            >
              <span>DEBUG CENTER ({openErrors} OPEN)</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {debugErrors.slice(0, 3).map((err) => (
              <div 
                key={err.id}
                onClick={() => setCurrentSection('debug')}
                className="cursor-pointer brutal-box p-3 hover:border-[#00f0ff] transition-all bg-[#0d1117]"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2">
                    <span className={`brutal-badge ${
                      err.severity === 'critical' ? 'bg-[#ff007f] text-white' :
                      err.severity === 'warning' ? 'bg-[#ffee00] text-black' :
                      'bg-[#00f0ff] text-black'
                    }`}>
                      {err.code}
                    </span>
                    <span className="text-[10px] text-slate-400 font-black">{err.source}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">{err.timestamp}</span>
                </div>
                <p className="text-xs text-white font-bold line-clamp-1">{err.message}</p>
                <div className="mt-2 flex items-center justify-between text-[11px] font-black text-[#00f0ff]">
                  <span className="flex items-center space-x-1">
                    <Sparkles className="h-3.5 w-3.5 text-[#ffee00] fill-[#ffee00]" />
                    <span>AI 1-click fix available</span>
                  </span>
                  <span className="text-slate-400 uppercase">{err.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Timeline (6 cols) */}
        <div className="lg:col-span-6 brutal-panel p-5 space-y-3">
          <div className="flex items-center justify-between border-b-2 border-black pb-3 mb-2">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-[#00f0ff]" />
              <h3 className="font-display text-sm font-black text-white uppercase">Automation & Team Feed</h3>
            </div>
            <span className="brutal-badge bg-white text-black">LIVE STREAM</span>
          </div>

          <div className="space-y-3">
            {WORKSPACE_ACTIVITY_LOGS.map((act) => (
              <div key={act.id} className="flex items-start space-x-3 text-xs">
                <div className={`mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded border-2 border-black shadow-[2px_2px_0px_#000] ${
                  act.type === 'deploy' ? 'bg-[#00ff66] text-black' :
                  act.type === 'ai' ? 'bg-[#ffee00] text-black' :
                  act.type === 'query' ? 'bg-[#00f0ff] text-black' :
                  'bg-white text-black'
                }`}>
                  {act.type === 'deploy' ? <Rocket className="h-3.5 w-3.5" /> :
                   act.type === 'ai' ? <Sparkles className="h-3.5 w-3.5 fill-black" /> :
                   act.type === 'query' ? <Terminal className="h-3.5 w-3.5" /> :
                   <Activity className="h-3.5 w-3.5" />}
                </div>
                <div className="flex-1">
                  <p className="text-slate-200">
                    <strong className="text-white font-black">{act.user}</strong> {act.action}
                  </p>
                  <span className="text-[10px] text-slate-400">{act.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
