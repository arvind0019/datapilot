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
    <div className="space-y-4 animate-in fade-in duration-150 font-mono text-xs">
      {/* Top Workspace Tabs Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b-[3px] border-black pb-3">
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <div className="flex rounded bg-[#0d1117] p-1 border-2 border-black shadow-[3px_3px_0px_#000] flex-shrink-0">
            <button
              onClick={() => setActiveTab('editor')}
              className={`flex items-center space-x-1.5 rounded px-2.5 sm:px-3 py-1.5 text-xs font-black transition-all cursor-pointer min-h-[36px] ${
                activeTab === 'editor' ? 'bg-[#ffee00] text-black shadow-[2px_2px_0px_#000]' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Terminal className="h-3.5 w-3.5" />
              <span>SQL IDE</span>
            </button>
            <button
              onClick={() => setActiveTab('dbt')}
              className={`flex items-center space-x-1.5 rounded px-2.5 sm:px-3 py-1.5 text-xs font-black transition-all cursor-pointer min-h-[36px] ${
                activeTab === 'dbt' ? 'bg-[#00f0ff] text-black shadow-[2px_2px_0px_#000]' : 'text-slate-300 hover:text-white'
              }`}
            >
              <GitFork className="h-3.5 w-3.5" />
              <span>dbt DAG</span>
              <span className="brutal-badge bg-black text-white text-[8px]">
                {dbtModels.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`flex items-center space-x-1.5 rounded px-2.5 sm:px-3 py-1.5 text-xs font-black transition-all cursor-pointer min-h-[36px] ${
                activeTab === 'saved' ? 'bg-white text-black shadow-[2px_2px_0px_#000]' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Save className="h-3.5 w-3.5" />
              <span>Saved</span>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center space-x-1.5 rounded px-2.5 sm:px-3 py-1.5 text-xs font-black transition-all cursor-pointer min-h-[36px] ${
                activeTab === 'history' ? 'bg-[#00ff66] text-black shadow-[2px_2px_0px_#000]' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Clock className="h-3.5 w-3.5" />
              <span>History</span>
            </button>
          </div>
        </div>

        {/* Database Selector */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          <Database className="h-4 w-4 text-[#00f0ff]" />
          <select
            value={selectedDataSourceId}
            onChange={(e) => setSelectedDataSourceId(e.target.value)}
            className="rounded bg-[#0d1117] text-white border-2 border-black px-2.5 py-1.5 text-xs font-black shadow-[2px_2px_0px_#000] outline-none cursor-pointer max-w-[200px] sm:max-w-xs truncate"
          >
            {dataSources.map((ds) => (
              <option key={ds.id} value={ds.id}>
                {ds.name} ({ds.type})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tab 1: SQL IDE */}
      {activeTab === 'editor' && (
        <div className="space-y-4">
          {/* AI Prompt Input Bar */}
          <div className="brutal-panel p-3 bg-[#ffee00] text-black border-2 border-black shadow-[4px_4px_0px_#000]">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="flex items-center space-x-1.5 text-black font-black flex-shrink-0">
                <Sparkles className="h-4 w-4 fill-black" />
                <span className="text-xs uppercase">AI Prompt to SQL:</span>
              </div>
              <input
                type="text"
                value={nlPrompt}
                onChange={(e) => setNlPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleNlGenerate()}
                placeholder="e.g. 'Show monthly revenue by tier for the last 12 months'"
                className="flex-1 rounded border-2 border-black bg-white px-3 py-1.5 text-xs text-black placeholder-slate-600 outline-none font-bold min-h-[36px]"
              />
              <button
                onClick={handleNlGenerate}
                className="brutal-btn bg-black text-white hover:bg-slate-900 px-3 py-1.5 text-xs font-black min-h-[36px]"
              >
                GENERATE SQL
              </button>
            </div>
          </div>

          {/* SQL Editor Area */}
          <div className="brutal-panel p-4 space-y-3 bg-[#161b22]">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-black pb-2">
              <div className="flex items-center space-x-2">
                <span className="text-white font-black text-xs uppercase">// QUERY_SCRATCHPAD.SQL</span>
                <span className="brutal-badge bg-[#00ff66] text-black">
                  READY
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  onClick={handleFormatSql}
                  className="brutal-btn bg-[#21262d] text-slate-200 px-2.5 py-1 text-[11px] min-h-[32px]"
                >
                  FORMAT
                </button>
                <button
                  onClick={() => setIsExplainModalOpen(true)}
                  className="brutal-btn bg-[#00f0ff] text-black px-2.5 py-1 text-[11px] font-black min-h-[32px]"
                >
                  EXPLAIN PLAN
                </button>
                <button
                  onClick={() => setIsSaveModalOpen(true)}
                  className="brutal-btn bg-white text-black px-2.5 py-1 text-[11px] font-black min-h-[32px]"
                >
                  <Save className="h-3 w-3 mr-1" />
                  <span>SAVE</span>
                </button>
                <button
                  onClick={() => executeQuery()}
                  disabled={isQueryRunning}
                  className="brutal-btn brutal-btn-green px-4 py-1 text-xs font-black min-h-[32px]"
                >
                  <Play className="h-3.5 w-3.5 mr-1 fill-black" />
                  <span>{isQueryRunning ? 'RUNNING...' : 'RUN QUERY'}</span>
                </button>
              </div>
            </div>

            {/* Monospace Text Area */}
            <div className="relative">
              <textarea
                value={activeSql}
                onChange={(e) => setActiveSql(e.target.value)}
                rows={9}
                className="w-full brutal-box p-3 font-mono text-xs text-[#00f0ff] bg-[#0d1117] leading-relaxed outline-none resize-y"
                placeholder="-- Enter your SQL query here..."
                spellCheck={false}
              />
            </div>
          </div>

          {/* Results Table View */}
          {activeQueryResult && (
            <div className="brutal-panel p-4 space-y-3 bg-[#161b22]">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-black pb-2">
                <div className="flex items-center space-x-2">
                  <TableIcon className="h-4 w-4 text-[#00ff66]" />
                  <span className="text-white font-black text-xs uppercase">QUERY RESULTS ({activeQueryResult.rowCount} ROWS)</span>
                  <span className="brutal-badge bg-[#ffee00] text-black">
                    {activeQueryResult.executionTimeMs}MS
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-[10px] text-slate-400 font-bold hidden sm:inline">Scanned: {activeQueryResult.bytesScanned}</span>
                  <button
                    onClick={handleExportCsv}
                    className="brutal-btn bg-white text-black px-3 py-1 text-xs font-black min-h-[32px]"
                  >
                    <Download className="h-3.5 w-3.5 mr-1" />
                    <span>CSV EXPORT</span>
                  </button>
                </div>
              </div>

              {/* Horizontal Scrollable Table */}
              <div className="overflow-x-auto rounded border-2 border-black shadow-[3px_3px_0px_#000] bg-[#0d1117]">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="border-b-2 border-black bg-[#21262d] text-white uppercase text-[10px] font-black">
                    <tr>
                      {activeQueryResult.columns.map((col, idx) => (
                        <th key={idx} className="px-3 sm:px-4 py-2 border-r border-black last:border-0 whitespace-nowrap">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black text-slate-200">
                    {activeQueryResult.rows.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-[#161b22]">
                        {activeQueryResult.columns.map((col, cIdx) => (
                          <td key={cIdx} className="px-3 sm:px-4 py-2 border-r border-black last:border-0 whitespace-nowrap text-white">
                            {typeof row[col] === 'number' ? row[col].toLocaleString() : String(row[col])}
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

      {/* Tab 2: dbt & Lineage DAG */}
      {activeTab === 'dbt' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Models List (4 cols) */}
          <div className="lg:col-span-4 brutal-panel p-4 space-y-3 bg-[#161b22]">
            <div className="flex items-center justify-between border-b-2 border-black pb-2">
              <span className="text-white font-black text-xs uppercase">// DBT MODELS</span>
              <span className="brutal-badge bg-[#ffee00] text-black">
                14/14 PASS
              </span>
            </div>

            <div className="space-y-2">
              {dbtModels.map((m) => (
                <div
                  key={m.id}
                  onClick={() => setSelectedModel(m)}
                  className={`cursor-pointer rounded p-3 border-2 border-black transition-all ${
                    selectedModel?.id === m.id
                      ? 'bg-[#00f0ff] text-black font-black shadow-[3px_3px_0px_#000]'
                      : 'bg-[#0d1117] text-white hover:bg-[#21262d]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold truncate text-xs">{m.name}</span>
                    <span className="brutal-badge bg-black text-white text-[8px]">
                      {m.materialization}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>{m.schema}</span>
                    <span className="text-[#00ff66] font-bold">✓ {m.tests.length} tests</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* DAG Canvas View (8 cols) */}
          <div className="lg:col-span-8 brutal-panel p-5 space-y-4 bg-[#161b22]">
            <div className="flex items-center justify-between border-b-2 border-black pb-2">
              <div>
                <h3 className="text-sm font-black text-white uppercase">Interactive Data Lineage DAG</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Click any node in the pipeline to trace lineage dependencies.</p>
              </div>
              <button
                onClick={() => selectedModel && runDbtModel(selectedModel.id)}
                className="brutal-btn brutal-btn-yellow px-3 py-1.5 text-xs font-black"
              >
                BUILD DBT MODEL
              </button>
            </div>

            {/* Interactive DAG Flow Grid */}
            <div className="brutal-box p-4 bg-[#0d1117] space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center">
                {/* Source Node */}
                <div
                  onClick={() => setSelectedDagNode('raw_stripe')}
                  className={`p-3 rounded border-2 border-black cursor-pointer w-full sm:w-44 ${
                    selectedDagNode === 'raw_stripe' ? 'bg-[#ffee00] text-black shadow-[3px_3px_0px_#000]' : 'bg-[#161b22] text-white'
                  }`}
                >
                  <div className="text-[10px] font-bold uppercase text-slate-400">SOURCE</div>
                  <div className="font-black text-xs">raw_stripe_charges</div>
                </div>

                <ArrowRight className="h-4 w-4 text-[#00f0ff] hidden sm:inline" />

                {/* Staging Node */}
                <div
                  onClick={() => setSelectedDagNode('stg_stripe')}
                  className={`p-3 rounded border-2 border-black cursor-pointer w-full sm:w-44 ${
                    selectedDagNode === 'stg_stripe' ? 'bg-[#00f0ff] text-black shadow-[3px_3px_0px_#000]' : 'bg-[#161b22] text-white'
                  }`}
                >
                  <div className="text-[10px] font-bold uppercase text-slate-400">STAGING</div>
                  <div className="font-black text-xs">stg_stripe_customers</div>
                </div>

                <ArrowRight className="h-4 w-4 text-[#00f0ff] hidden sm:inline" />

                {/* Mart Node */}
                <div
                  onClick={() => setSelectedDagNode('mart_finance_mrr')}
                  className={`p-3 rounded border-2 border-black cursor-pointer w-full sm:w-44 ${
                    selectedDagNode === 'mart_finance_mrr' ? 'bg-[#00ff66] text-black shadow-[3px_3px_0px_#000]' : 'bg-[#161b22] text-white'
                  }`}
                >
                  <div className="text-[10px] font-bold uppercase text-slate-400">MART TABLE</div>
                  <div className="font-black text-xs">mart_finance_mrr</div>
                </div>
              </div>
            </div>

            {/* Compiled SQL View */}
            {selectedModel && (
              <div className="space-y-2">
                <span className="text-white font-black text-xs uppercase">// COMPILED DBT SQL: {selectedModel.name}.sql</span>
                <pre className="brutal-box p-3 text-[#00f0ff] overflow-x-auto text-[11px] bg-[#0d1117] leading-relaxed max-h-48">
                  {selectedModel.compiledSql}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Saved Queries */}
      {activeTab === 'saved' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedQueries.map((q) => (
            <div key={q.id} className="brutal-panel p-4 space-y-3 bg-[#161b22] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-black text-sm">{q.title}</span>
                  <span className="brutal-badge bg-white text-black text-[9px]">{q.avgDurationMs}ms</span>
                </div>
                <p className="text-slate-400 text-xs line-clamp-2">{q.description}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {q.tags.map((t, i) => (
                    <span key={i} className="brutal-badge bg-[#21262d] text-white text-[8px]">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t-2 border-black flex items-center justify-between">
                <span className="text-[10px] text-slate-400">{q.author}</span>
                <button
                  onClick={() => {
                    setActiveSql(q.sql);
                    setActiveTab('editor');
                    addToast({ type: 'info', title: `Loaded "${q.title}" into SQL IDE.` });
                  }}
                  className="brutal-btn brutal-btn-yellow px-3 py-1 text-xs font-black min-h-[32px]"
                >
                  LOAD QUERY
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 4: Query History */}
      {activeTab === 'history' && (
        <div className="brutal-panel p-4 space-y-3 bg-[#161b22]">
          <div className="flex items-center justify-between border-b-2 border-black pb-2">
            <span className="text-white font-black text-xs uppercase">// RECENT QUERY EXECUTION LOGS</span>
            <span className="text-slate-400 text-[10px]">Total: {queryHistory.length}</span>
          </div>

          <div className="space-y-2">
            {queryHistory.map((h) => (
              <div key={h.id} className="brutal-box p-3 bg-[#0d1117] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="truncate flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="brutal-badge bg-[#00ff66] text-black text-[8px]">SUCCESS</span>
                    <span className="text-slate-400 text-[10px]">{h.database}</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-400 text-[10px]">{h.executionTimeMs}ms</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-400 text-[10px]">{h.timestamp}</span>
                  </div>
                  <pre className="text-white text-[11px] truncate">{h.sql}</pre>
                </div>

                <button
                  onClick={() => {
                    setActiveSql(h.sql);
                    setActiveTab('editor');
                  }}
                  className="brutal-btn bg-white text-black px-2.5 py-1 text-[10px] font-black self-start sm:self-center"
                >
                  RERUN
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Explain Plan Modal */}
      {isExplainModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 sm:p-4">
          <div className="w-full max-w-xl brutal-panel p-5 bg-[#161b22] border-[3px] border-black shadow-[10px_10px_0px_#000] space-y-4">
            <div className="flex items-center justify-between border-b-2 border-black pb-2">
              <div className="flex items-center space-x-2">
                <span className="font-display text-base font-black text-white uppercase">EXPLAIN (ANALYZE, BUFFERS) Plan</span>
                <span className="brutal-badge bg-[#00ff66] text-black">42MS</span>
              </div>
              <button
                onClick={() => setIsExplainModalOpen(false)}
                className="brutal-badge bg-white text-black cursor-pointer"
              >
                CLOSE
              </button>
            </div>

            <div className="space-y-2">
              <div className="brutal-box p-3 bg-[#0d1117] space-y-1.5">
                <div className="text-[#ffee00] font-black text-xs">&gt; Aggregate (cost=42.80..42.85 rows=3 width=48)</div>
                <div className="text-slate-300 text-[11px] pl-4">&gt; Sort (sort method: quicksort memory: 28kB)</div>
                <div className="text-slate-300 text-[11px] pl-8">&gt; HashAggregate (batches: 1 memory: 32kB)</div>
                <div className="text-[#00f0ff] text-[11px] pl-12 font-black">&gt; Index Scan using idx_cust_created on public.customers (cost=0.28..38.12)</div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setIsExplainModalOpen(false)}
                className="brutal-btn brutal-btn-yellow px-4 py-1.5 font-black"
              >
                DONE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Save Query Modal */}
      {isSaveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 sm:p-4">
          <div className="w-full max-w-md brutal-panel p-5 bg-[#161b22] border-[3px] border-black shadow-[10px_10px_0px_#000] space-y-4">
            <h3 className="font-display text-base font-black text-white uppercase">SAVE QUERY TO TEAM LIBRARY</h3>
            <input
              type="text"
              value={saveTitle}
              onChange={(e) => setSaveTitle(e.target.value)}
              placeholder="Query title (e.g. 'MRR Cohort Retention Analysis')..."
              className="w-full brutal-box px-3 py-2 text-white bg-[#0d1117] outline-none"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsSaveModalOpen(false)}
                className="brutal-btn bg-[#21262d] text-white px-3 py-1.5"
              >
                CANCEL
              </button>
              <button
                onClick={() => {
                  if (saveTitle.trim()) {
                    saveCurrentQuery(saveTitle, 'Saved analytical query', ['production', 'analytics']);
                    setIsSaveModalOpen(false);
                    setSaveTitle('');
                  }
                }}
                className="brutal-btn brutal-btn-yellow px-4 py-1.5 font-black"
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
