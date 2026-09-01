import React, { useState } from 'react';
import { 
  Terminal, 
  Play, 
  Sparkles, 
  Save, 
  Download, 
  Boxes, 
  Database, 
  Clock, 
  GitFork, 
  ArrowRight,
  Table as TableIcon
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';

export const SqlWorkspaceView: React.FC = () => {
  const { 
    activeSql, 
    setActiveSql, 
    isQueryRunning, 
    activeQueryResult, 
    executeQuery, 
    savedQueries, 
    saveCurrentQuery, 
    queryHistory, 
    dbtModels, 
    selectedModel, 
    setSelectedModel, 
    runDbtModel, 
    dataSources, 
    selectedDataSourceId, 
    setSelectedDataSourceId, 
    openCopilotWithPrompt, 
    addToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'editor' | 'dbt' | 'history' | 'saved'>('editor');
  const [isExplainModalOpen, setIsExplainModalOpen] = useState(false);
  const [saveTitle, setSaveTitle] = useState('');
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [nlPrompt, setNlPrompt] = useState('');
  const [selectedDagNode, setSelectedDagNode] = useState<string>('mart_finance_mrr');

  const selectedDs = dataSources.find((d) => d.id === selectedDataSourceId) || dataSources[0];

  const handleFormatSql = () => {
    const formatted = activeSql
      .replace(/\s+/g, ' ')
      .replace(/\b(SELECT|FROM|WHERE|GROUP BY|ORDER BY|HAVING|JOIN|LEFT JOIN|WITH|LIMIT)\b/gi, '\n$1')
      .trim();
    setActiveSql(formatted);
    addToast({ type: 'info', title: 'SQL Formatted' });
  };

  const handleNlGenerate = () => {
    if (!nlPrompt.trim()) return;
    
    if (nlPrompt.toLowerCase().includes('revenue') || nlPrompt.toLowerCase().includes('monthly')) {
      setActiveSql(`-- AI Generated: Monthly Revenue & Growth Cohorts
WITH monthly_cohorts AS (
  SELECT 
    DATE_TRUNC('month', created_at) AS signup_month,
    customer_id,
    plan_tier,
    mrr_usd
  FROM public.customers
  WHERE created_at >= NOW() - INTERVAL '12 months'
)
SELECT 
  TO_CHAR(signup_month, 'YYYY-Mon') AS cohort,
  plan_tier,
  COUNT(DISTINCT customer_id) AS active_subscribers,
  ROUND(SUM(mrr_usd), 2) AS total_mrr_usd,
  ROUND(AVG(mrr_usd), 2) AS arpu_usd
FROM monthly_cohorts
GROUP BY 1, 2
ORDER BY signup_month DESC, total_mrr_usd DESC;`);
    } else {
      setActiveSql(`-- AI Generated Query from Prompt: "${nlPrompt}"
SELECT 
  category, 
  COUNT(1) as total_items, 
  ROUND(AVG(base_price), 2) as avg_price_usd
FROM public.products
GROUP BY 1
ORDER BY total_items DESC;`);
    }

    addToast({
      type: 'success',
      title: 'AI SQL Generated',
      message: 'Generated SQL based on natural language prompt.'
    });
    setNlPrompt('');
  };

  const handleExportCsv = () => {
    if (!activeQueryResult) return;
    const header = activeQueryResult.columns.join(',');
    const rows = activeQueryResult.rows.map((r) => activeQueryResult.columns.map((c) => r[c]).join(','));
    const csvContent = [header, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `datapilot_query_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast({ type: 'success', title: 'Export Downloaded', message: 'CSV export complete.' });
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* Top Workspace Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b-2 border-[#1c253b] pb-3">
        <div className="flex items-center space-x-3">
          <div className="flex rounded-lg bg-[#080c16] p-1 border-2 border-[#2a364f] shadow-[3px_3px_0px_#000] font-mono">
            <button
              onClick={() => setActiveTab('editor')}
              className={`flex items-center space-x-1.5 rounded px-3 py-1.5 text-xs font-bold transition-all ${
                activeTab === 'editor' ? 'bg-[#06b6d4] text-black font-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Terminal className="h-3.5 w-3.5" />
              <span>SQL IDE</span>
            </button>
            <button
              onClick={() => setActiveTab('dbt')}
              className={`flex items-center space-x-1.5 rounded px-3 py-1.5 text-xs font-bold transition-all ${
                activeTab === 'dbt' ? 'bg-[#06b6d4] text-black font-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              <GitFork className="h-3.5 w-3.5" />
              <span>dbt & Lineage DAG</span>
              <span className="rounded bg-black px-1.5 py-0.2 text-[9px] font-black text-cyan-300">
                {dbtModels.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`flex items-center space-x-1.5 rounded px-3 py-1.5 text-xs font-bold transition-all ${
                activeTab === 'saved' ? 'bg-[#06b6d4] text-black font-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Save className="h-3.5 w-3.5" />
              <span>Saved Queries</span>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center space-x-1.5 rounded px-3 py-1.5 text-xs font-bold transition-all ${
                activeTab === 'history' ? 'bg-[#06b6d4] text-black font-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Clock className="h-3.5 w-3.5" />
              <span>History</span>
            </button>
          </div>

          {/* Database Target Selector */}
          <div className="flex items-center space-x-2 neu-inset-well px-3 py-1.5 text-xs font-mono">
            <Database className="h-3.5 w-3.5 text-cyan-400" />
            <select
              value={selectedDataSourceId}
              onChange={(e) => setSelectedDataSourceId(e.target.value)}
              className="bg-transparent text-white font-bold outline-none cursor-pointer"
            >
              {dataSources.map((ds) => (
                <option key={ds.id} value={ds.id} className="bg-[#0c101c] text-white">
                  {ds.name} ({ds.type})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* AI Natural Language to SQL Bar */}
        <div className="flex items-center space-x-2 flex-1 max-w-md">
          <div className="relative flex-1 neu-inset-well flex items-center px-2 py-0.5">
            <Sparkles className="h-3.5 w-3.5 text-[#ffee00] mr-2" />
            <input
              type="text"
              value={nlPrompt}
              onChange={(e) => setNlPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleNlGenerate()}
              placeholder="Ask AI: 'Show monthly revenue by cohort'..."
              className="w-full bg-transparent py-1 font-mono text-xs text-white placeholder-slate-500 outline-none"
            />
          </div>
          <button
            onClick={handleNlGenerate}
            disabled={!nlPrompt.trim()}
            className="brutal-btn brutal-btn-primary px-3 py-1.5 text-xs font-black"
          >
            GENERATE
          </button>
        </div>
      </div>

      {/* Main Tab: SQL Editor */}
      {activeTab === 'editor' && (
        <div className="grid grid-cols-1 gap-4">
          <div className="brutal-panel p-4 flex flex-col justify-between space-y-3">
            {/* Editor Action Controls */}
            <div className="flex items-center justify-between border-b border-[#1c253b] pb-3">
              <div className="flex items-center space-x-2 font-mono text-xs font-bold text-slate-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981]" />
                <span>QUERY_SCRATCHPAD.SQL</span>
                <span className="text-slate-500">({selectedDs.type})</span>
              </div>

              <div className="flex items-center space-x-2 font-mono">
                <button
                  onClick={handleFormatSql}
                  className="brutal-btn bg-[#131b2e] text-slate-300 hover:text-white px-2.5 py-1 text-xs"
                >
                  FORMAT SQL
                </button>
                <button
                  onClick={() => setIsExplainModalOpen(true)}
                  className="brutal-btn bg-[#131b2e] text-cyan-300 hover:text-white px-2.5 py-1 text-xs"
                >
                  EXPLAIN PLAN
                </button>
                <button
                  onClick={() => {
                    setSaveTitle('Custom Analytics Query');
                    setIsSaveModalOpen(true);
                  }}
                  className="brutal-btn bg-[#131b2e] text-slate-300 hover:text-white px-2.5 py-1 text-xs"
                >
                  SAVE
                </button>
                <button
                  onClick={() => executeQuery()}
                  disabled={isQueryRunning}
                  className="brutal-btn brutal-btn-emerald px-4 py-1 text-xs font-black"
                >
                  <Play className={`h-3.5 w-3.5 fill-black mr-1 ${isQueryRunning ? 'animate-spin' : ''}`} />
                  <span>{isQueryRunning ? 'RUNNING...' : 'RUN QUERY'}</span>
                </button>
              </div>
            </div>

            {/* SQL Text Area with Neumorphic Inset Well */}
            <div className="neu-inset-well p-3.5 font-mono text-xs text-cyan-200 flex min-h-[220px]">
              <div className="select-none pr-3 border-r border-[#1c253b] text-slate-600 text-right font-mono space-y-1">
                {activeSql.split('\n').map((_, i) => (
                  <div key={i}>{i + 1}</div>
                ))}
              </div>
              <textarea
                value={activeSql}
                onChange={(e) => setActiveSql(e.target.value)}
                onKeyDown={(e) => {
                  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                    e.preventDefault();
                    executeQuery();
                  }
                }}
                className="w-full resize-y bg-transparent pl-3 font-mono text-xs text-slate-100 placeholder-slate-600 focus:outline-none leading-relaxed"
                rows={10}
                spellCheck={false}
              />
            </div>

            {/* AI Optimization Bar */}
            <div className="flex items-center justify-between neu-inset-well p-2.5 text-xs font-mono">
              <div className="flex items-center space-x-2 text-cyan-300">
                <Sparkles className="h-3.5 w-3.5 text-[#ffee00]" />
                <span className="font-bold">DATAPILOT AI OPTIMIZER:</span>
                <span className="text-slate-400 text-[11px]">Ready to optimize CTEs or index scans.</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => openCopilotWithPrompt(`Optimize this SQL query for high performance:\n\n${activeSql}`)}
                  className="brutal-btn bg-[#ffee00] text-black px-2.5 py-1 text-[10px] font-black"
                >
                  ⚡ OPTIMIZE SQL
                </button>
                <button
                  onClick={() => openCopilotWithPrompt(`Explain this SQL step by step in plain language:\n\n${activeSql}`)}
                  className="brutal-btn bg-[#131b2e] text-slate-300 px-2.5 py-1 text-[10px]"
                >
                  💡 EXPLAIN LOGIC
                </button>
              </div>
            </div>
          </div>

          {/* Results Table */}
          {activeQueryResult && (
            <div className="brutal-panel p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-[#1c253b] pb-3">
                <div className="flex items-center space-x-3 text-xs font-mono">
                  <span className="font-black text-white uppercase flex items-center space-x-1.5">
                    <TableIcon className="h-4 w-4 text-emerald-400" />
                    <span>QUERY RESULTS</span>
                  </span>
                  <span className="rounded bg-emerald-400 text-black px-1.5 py-0.2 font-bold border border-black shadow-[1.5px_1.5px_0px_#000]">
                    {activeQueryResult.rowCount} ROWS IN {activeQueryResult.executionTimeMs}MS
                  </span>
                  <span className="text-slate-400">
                    Scanned: {activeQueryResult.bytesScanned}
                  </span>
                </div>

                <button
                  onClick={handleExportCsv}
                  className="brutal-btn bg-[#131b2e] text-slate-200 px-3 py-1 text-xs font-mono font-bold"
                >
                  <Download className="h-3 w-3 mr-1" />
                  <span>EXPORT CSV</span>
                </button>
              </div>

              {/* Data Table */}
              <div className="overflow-x-auto rounded-lg border-2 border-[#2a364f] bg-[#080c16] shadow-[4px_4px_0px_#000]">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="border-b-2 border-[#1c253b] bg-[#0c101c] text-[10px] uppercase text-slate-400 font-black">
                    <tr>
                      <th className="px-3 py-2 w-10 text-slate-600">#</th>
                      {activeQueryResult.columns.map((col, idx) => (
                        <th key={idx} className="px-4 py-2 text-slate-300">
                          {col} ({activeQueryResult.types[idx] || 'text'})
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1c253b] text-slate-200">
                    {activeQueryResult.rows.map((row, rowIdx) => (
                      <tr key={rowIdx} className="hover:bg-[#12192a]">
                        <td className="px-3 py-2.5 text-slate-600 text-[10px]">{rowIdx + 1}</td>
                        {activeQueryResult.columns.map((col, cIdx) => (
                          <td key={cIdx} className="px-4 py-2.5 whitespace-nowrap">
                            {typeof row[col] === 'number' ? (
                              <span className="text-[#ffee00] font-bold">{row[col].toLocaleString()}</span>
                            ) : (
                              <span>{String(row[col])}</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab: dbt & Lineage DAG */}
      {activeTab === 'dbt' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Models List (4 cols) */}
          <div className="lg:col-span-4 brutal-panel p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-[#1c253b] pb-3">
              <h3 className="font-display text-sm font-black text-white uppercase flex items-center space-x-2">
                <Boxes className="h-4 w-4 text-cyan-400" />
                <span>dbt Project Models</span>
              </h3>
              <span className="rounded bg-[#ffee00] text-black px-1.5 py-0.2 font-mono text-[9px] font-black border border-black">
                CORE V1.8
              </span>
            </div>

            <div className="space-y-2">
              {dbtModels.map((model) => {
                const isSelected = selectedModel?.id === model.id;

                return (
                  <div
                    key={model.id}
                    onClick={() => {
                      setSelectedModel(model);
                      setSelectedDagNode(model.name);
                    }}
                    className={`cursor-pointer rounded-lg border-2 p-3 transition-all ${
                      isSelected
                        ? 'border-[#06b6d4] bg-[#141e33] shadow-[3.5px_3.5px_0px_#000] translate-x-[-1px]'
                        : 'border-[#2a364f] bg-[#0c1220] hover:border-slate-500'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-xs font-bold text-white truncate">
                        {model.name}
                      </span>
                      <span className="rounded bg-black px-1.5 py-0.2 font-mono text-[8px] font-black text-cyan-400 uppercase border border-[#2a364f]">
                        {model.materialization}
                      </span>
                    </div>

                    <p className="text-[11px] font-mono text-slate-400 line-clamp-1">{model.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Lineage Graph (8 cols) */}
          <div className="lg:col-span-8 brutal-panel p-5 space-y-4">
            {selectedModel && (
              <>
                <div className="flex items-center justify-between border-b border-[#1c253b] pb-3">
                  <div>
                    <h3 className="font-mono text-base font-black text-white">{selectedModel.name}.sql</h3>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">{selectedModel.description}</p>
                  </div>

                  <button
                    onClick={() => runDbtModel(selectedModel.id)}
                    className="brutal-btn brutal-btn-primary px-4 py-2 text-xs font-black"
                  >
                    <Play className="h-3.5 w-3.5 mr-1" />
                    <span>RUN DBT MODEL</span>
                  </button>
                </div>

                {/* Lineage DAG */}
                <div className="neu-inset-well p-4">
                  <div className="flex items-center justify-between mb-3 text-xs font-mono font-bold text-slate-300">
                    <span>// INTERACTIVE LINEAGE GRAPH (DAG)</span>
                    <span className="text-cyan-400">UPSTREAM → DOWNSTREAM</span>
                  </div>

                  <div className="relative h-44 w-full flex items-center justify-around px-4 overflow-x-auto">
                    {[
                      { id: 'raw_stripe', type: 'SOURCE', name: 'raw_stripe' },
                      { id: 'stg_stripe_customers', type: 'VIEW', name: 'stg_stripe_cust' },
                      { id: 'dim_customers', type: 'TABLE', name: 'dim_customers' },
                      { id: 'mart_finance_mrr', type: 'MART', name: 'mart_finance_mrr' }
                    ].map((node, i) => (
                      <React.Fragment key={node.id}>
                        <div 
                          onClick={() => setSelectedDagNode(node.id)}
                          className={`cursor-pointer rounded-lg border-2 p-3 text-center min-w-[120px] transition-all font-mono ${
                            selectedDagNode === node.id 
                              ? 'border-[#06b6d4] bg-[#ffee00] text-black shadow-[4px_4px_0px_#000] font-black scale-105' 
                              : 'border-[#2a364f] bg-[#0c1220] text-white shadow-[2.5px_2.5px_0px_#000]'
                          }`}
                        >
                          <span className="text-[8px] block opacity-70">{node.type}</span>
                          <span className="text-xs font-bold">{node.name}</span>
                        </div>
                        {i < 3 && <ArrowRight className="h-4 w-4 text-cyan-400 flex-shrink-0" />}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                {/* Compiled SQL View */}
                <div>
                  <span className="text-xs font-mono font-bold text-slate-300 block mb-2">// COMPILED DBT SQL:</span>
                  <pre className="neu-inset-well p-3 font-mono text-xs text-cyan-300 overflow-x-auto max-h-56">
                    {selectedModel.compiledSql}
                  </pre>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Tab: Saved Queries */}
      {activeTab === 'saved' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {savedQueries.map((q) => (
            <div
              key={q.id}
              className="brutal-panel brutal-panel-hover p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex flex-wrap gap-1">
                    {q.tags.map((t, i) => (
                      <span key={i} className="rounded bg-black text-slate-300 px-1.5 py-0.5 font-mono text-[9px] border border-[#2a364f]">
                        {t}
                      </span>
                    ))}
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono font-bold">{q.avgDurationMs}ms</span>
                </div>

                <h3 className="font-display text-sm font-black text-white uppercase">{q.title}</h3>
                <p className="text-xs font-mono text-slate-400 mt-1 line-clamp-2">{q.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#1c253b] flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-500">{q.database}</span>
                <button
                  onClick={() => {
                    setActiveSql(q.sql);
                    setActiveTab('editor');
                    addToast({ type: 'info', title: `Loaded "${q.title}"` });
                  }}
                  className="brutal-btn brutal-btn-primary px-3 py-1 text-xs font-black font-mono"
                >
                  OPEN & RUN
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: History */}
      {activeTab === 'history' && (
        <div className="brutal-panel p-5 space-y-3">
          <h3 className="font-display text-sm font-black text-white uppercase">// QUERY EXECUTION HISTORY</h3>
          <div className="space-y-2">
            {queryHistory.map((item) => (
              <div
                key={item.id}
                className="neu-inset-well p-3 flex items-center justify-between text-xs font-mono"
              >
                <div className="truncate pr-4">
                  <p className="text-slate-200 truncate font-bold">{item.sql}</p>
                  <span className="text-[10px] text-slate-500">{item.database} • {item.timestamp}</span>
                </div>

                <div className="flex items-center space-x-4 flex-shrink-0">
                  <span className="text-[#ffee00] font-bold">{item.executionTimeMs}ms</span>
                  <button
                    onClick={() => {
                      setActiveSql(item.sql);
                      setActiveTab('editor');
                    }}
                    className="brutal-btn bg-[#131b2e] px-2.5 py-1 text-[11px] text-cyan-300"
                  >
                    RESTORE
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Explain Plan Modal */}
      {isExplainModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-100">
          <div className="w-full max-w-2xl rounded-xl border-2 border-[#2a364f] bg-[#0c101c] p-6 shadow-[8px_8px_0px_#000000] space-y-4">
            <div className="flex items-center justify-between border-b-2 border-[#1c253b] pb-3">
              <h3 className="font-display text-base font-black text-white uppercase flex items-center space-x-2">
                <Terminal className="h-4 w-4 text-cyan-400" />
                <span>EXPLAIN ANALYZE Execution Tree</span>
              </h3>
              <button onClick={() => setIsExplainModalOpen(false)} className="text-slate-400 hover:text-white font-mono">
                [ESC]
              </button>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="neu-inset-well p-3 text-cyan-300 font-bold">
                ↳ Sort (Sort Key: total_mrr_usd DESC) [Cost: 184.20 • 42ms]
              </div>
              <div className="neu-inset-well p-3 ml-4 text-emerald-300 font-bold">
                ↳ HashAggregate (Group Key: signup_month, plan_tier) [Cost: 142.10 • 18ms]
              </div>
              <div className="neu-inset-well p-3 ml-8 text-[#ffee00] font-bold">
                ↳ Index Scan using idx_cust_created_at on customers [Cost: 12.40 • 4ms]
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t-2 border-[#1c253b]">
              <button
                onClick={() => setIsExplainModalOpen(false)}
                className="brutal-btn brutal-btn-primary px-4 py-1.5 text-xs font-black"
              >
                CLOSE PLAN
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Save Query Modal */}
      {isSaveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-100">
          <div className="w-full max-w-md rounded-xl border-2 border-[#2a364f] bg-[#0c101c] p-6 shadow-[8px_8px_0px_#000000] space-y-4">
            <h3 className="font-display text-base font-black text-white uppercase">SAVE QUERY TO MESH LIBRARY</h3>
            <div>
              <label className="text-xs font-mono text-slate-300 block mb-1">TITLE</label>
              <input
                type="text"
                value={saveTitle}
                onChange={(e) => setSaveTitle(e.target.value)}
                className="w-full rounded-lg border-2 border-[#2a364f] bg-[#080c16] px-3 py-2 text-xs text-white font-mono outline-none"
              />
            </div>
            <div className="flex justify-end space-x-2 pt-3">
              <button onClick={() => setIsSaveModalOpen(false)} className="brutal-btn bg-[#131b2e] px-3 py-1.5 text-xs text-slate-300">
                CANCEL
              </button>
              <button
                onClick={() => {
                  saveCurrentQuery(saveTitle || 'Untitled Query', 'Saved via SQL IDE', ['Custom', 'Analytics']);
                  setIsSaveModalOpen(false);
                }}
                className="brutal-btn brutal-btn-primary px-4 py-1.5 text-xs font-black"
              >
                SAVE QUERY
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
