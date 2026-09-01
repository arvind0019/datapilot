import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Sparkles, 
  Send, 
  Copy, 
  Check, 
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  codeSnippet?: string;
  actions?: { label: string; actionType: string; payload?: any }[];
  timestamp: string;
}

export const AICopilotDrawer: React.FC = () => {
  const { 
    isAICopilotOpen, 
    setIsAICopilotOpen, 
    copilotInitialPrompt,
    setCopilotInitialPrompt,
    currentSection,
    setCurrentSection,
    setActiveSql,
    applyIndexOptimization,
    addToast
  } = useApp();

  const [input, setInput] = useState('');
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init-1',
      sender: 'assistant',
      text: `Hello Arvind! I am **DataPilot Copilot**, your autonomous analytics & data engineering agent.
- **7 Sources** indexed (6 connected, 1 failed REST API)
- **3 Slow Queries** in PostgreSQL & BigQuery
- **2 Error Incidents** in Debug Center

How can I optimize your mesh pipeline today?`,
      timestamp: 'Just now',
      actions: [
        { label: '⚡ Diagnose Slow Dashboard (8.4s)', actionType: 'diag_slow' },
        { label: '🔌 Fix Stripe Webhook Error (429)', actionType: 'fix_stripe' },
        { label: '📊 Generate Sales MRR SQL Query', actionType: 'gen_sales_sql' }
      ]
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (copilotInitialPrompt) {
      handleSendPrompt(copilotInitialPrompt);
      setCopilotInitialPrompt('');
    }
  }, [copilotInitialPrompt]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isAICopilotOpen) return null;

  const handleSendPrompt = (promptText: string) => {
    if (!promptText.trim()) return;

    const userMsg: ChatMessage = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      text: promptText,
      timestamp: 'Just now'
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    setTimeout(() => {
      let reply: ChatMessage;
      const lower = promptText.toLowerCase();

      if (lower.includes('why is my dashboard slow') || lower.includes('slow query') || lower.includes('slowest')) {
        reply = {
          id: 'ai-' + Date.now(),
          sender: 'assistant',
          text: `**DIAGNOSTIC REPORT: Revenue Overview Dashboard load time: 8.42s.**

Sequential scan bottleneck on **4.28M rows** of \`public.orders\`. Foreign key \`customer_id\` and date filter \`created_at\` are unindexed.

**1-Click Remedy:**
Create a composite covering index on \`orders(customer_id, created_at) INCLUDE (total_amount)\`. This cuts latency from **8,420ms to ~38ms** (99.5% reduction).`,
          codeSnippet: `CREATE INDEX CONCURRENTLY idx_orders_cust_date_amt 
ON public.orders (customer_id, created_at) 
INCLUDE (total_amount);`,
          actions: [
            { label: 'Apply Index Optimization (1-Click)', actionType: 'apply_index', payload: 'sq-1' },
            { label: 'Open in Performance Center', actionType: 'nav_perf' }
          ],
          timestamp: 'Just now'
        };
      } else if (lower.includes('database') || lower.includes('connect') || lower.includes('stripe')) {
        reply = {
          id: 'ai-' + Date.now(),
          sender: 'assistant',
          text: `**INSPECTION: Stripe & Billing Ingest API Connection Failed (HTTP 429)**

- Endpoint: \`https://api.stripe.com/v1/reporting\`
- Root Cause: Ingestion worker exceeded burst quota of 100 req/sec during batch backfill.
- Credentials: Safely encrypted in Secrets Vault.

**Action:**
Throttle batch concurrency to 25 req/sec with automatic \`Retry-After\` header handling.`,
          actions: [
            { label: 'Open Data Sources Manager', actionType: 'nav_sources' },
            { label: 'View Incident in Debug Center', actionType: 'nav_debug' }
          ],
          timestamp: 'Just now'
        };
      } else if (lower.includes('sales') || lower.includes('revenue') || lower.includes('create dashboard') || lower.includes('natural language')) {
        reply = {
          id: 'ai-' + Date.now(),
          sender: 'assistant',
          text: `Here is the optimized **Monthly Recurring Revenue (MRR) by Cohort** SQL query with windowed retention:`,
          codeSnippet: `WITH monthly_cohorts AS (
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
ORDER BY signup_month DESC, total_mrr_usd DESC;`,
          actions: [
            { label: 'Load & Run in SQL IDE', actionType: 'load_sql' },
            { label: 'Open Dashboard Studio', actionType: 'nav_dash' }
          ],
          timestamp: 'Just now'
        };
      } else {
        reply = {
          id: 'ai-' + Date.now(),
          sender: 'assistant',
          text: `Context analyzed for **${currentSection.toUpperCase()}**:
- Health: 99.98% operational uptime
- Semantic dbt models: 14/14 test assertions green
- Active Production release: v2.8.4-prod Live

Ask me to generate a complex query, debug an exception trace, or optimize table indexes.`,
          actions: [
            { label: 'Explain Active SQL Plan', actionType: 'load_sql' },
            { label: 'Run Performance Benchmark', actionType: 'nav_perf' }
          ],
          timestamp: 'Just now'
        };
      }

      setMessages((prev) => [...prev, reply]);
    }, 400);
  };

  const handleAction = (actionType: string, payload?: any) => {
    if (actionType === 'diag_slow') {
      handleSendPrompt('Why is my dashboard slow?');
    } else if (actionType === 'fix_stripe') {
      handleSendPrompt('My Stripe database isn\'t connecting, why?');
    } else if (actionType === 'gen_sales_sql') {
      handleSendPrompt('Generate sales and MRR cohort query');
    } else if (actionType === 'apply_index') {
      applyIndexOptimization(payload || 'sq-1');
      addToast({
        type: 'success',
        title: 'Index Created on PostgreSQL',
        message: 'Covering index idx_orders_cust_date_amt applied.'
      });
    } else if (actionType === 'nav_perf') {
      setCurrentSection('performance');
      setIsAICopilotOpen(false);
    } else if (actionType === 'nav_sources') {
      setCurrentSection('sources');
      setIsAICopilotOpen(false);
    } else if (actionType === 'nav_debug') {
      setCurrentSection('debug');
      setIsAICopilotOpen(false);
    } else if (actionType === 'nav_dash') {
      setCurrentSection('dashboards');
      setIsAICopilotOpen(false);
    } else if (actionType === 'load_sql') {
      setCurrentSection('sql');
      setActiveSql(`WITH monthly_cohorts AS (
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
      setIsAICopilotOpen(false);
      addToast({
        type: 'info',
        title: 'SQL Loaded into Editor',
        message: 'Press Ctrl+Enter to execute.'
      });
    }
  };

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-40 flex w-full max-w-lg flex-col border-l-[3px] border-black bg-[#161b22] shadow-[12px_0px_0px_#000000] animate-in slide-in-from-right duration-150 font-mono text-xs">
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b-[3px] border-black px-5 bg-[#0d1117]">
        <div className="flex items-center space-x-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-[#ffee00] text-black border-2 border-black shadow-[2px_2px_0px_#000]">
            <Sparkles className="h-4 w-4 fill-black" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-display text-sm font-black text-white uppercase">DataPilot Copilot</span>
              <span className="brutal-badge bg-[#00f0ff] text-black text-[8px]">
                WORKSPACE AI
              </span>
            </div>
            <p className="text-[10px] text-slate-400">Context: <strong className="text-[#ffee00] uppercase">{currentSection}</strong></p>
          </div>
        </div>

        <button
          onClick={() => setIsAICopilotOpen(false)}
          className="rounded bg-white text-black border-2 border-black p-1.5 shadow-[2px_2px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-[9px] font-black uppercase text-slate-400">
                {msg.sender === 'user' ? 'YOU' : 'DATAPILOT_AI'}
              </span>
              <span className="text-[9px] text-slate-500">{msg.timestamp}</span>
            </div>

            <div
              className={`rounded p-3.5 leading-relaxed max-w-[95%] border-[2.5px] border-black shadow-[4px_4px_0px_#000] ${
                msg.sender === 'user'
                  ? 'bg-[#00f0ff] text-black font-bold'
                  : 'bg-[#21262d] text-white'
              }`}
            >
              <div className="whitespace-pre-wrap font-sans">{msg.text}</div>

              {/* Code snippet block */}
              {msg.codeSnippet && (
                <div className="mt-3 relative brutal-box p-3 font-mono text-[11px] text-[#00f0ff] bg-[#0d1117]">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-black text-[10px] text-slate-400">
                    <span className="font-black text-[#ffee00]">// SQL_REMEDY.SQL</span>
                    <button
                      onClick={() => handleCopyCode(msg.codeSnippet!, msg.id)}
                      className="brutal-badge bg-white text-black cursor-pointer"
                    >
                      {copiedCodeId === msg.id ? (
                        <>
                          <Check className="h-3 w-3 mr-1 text-[#00ff66]" />
                          <span>COPIED</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3 mr-1" />
                          <span>COPY</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="overflow-x-auto">{msg.codeSnippet}</pre>
                </div>
              )}

              {/* Action Buttons */}
              {msg.actions && msg.actions.length > 0 && (
                <div className="mt-3 pt-2.5 border-t border-black flex flex-wrap gap-1.5">
                  {msg.actions.map((act, i) => (
                    <button
                      key={i}
                      onClick={() => handleAction(act.actionType, act.payload)}
                      className="brutal-btn bg-white text-black hover:bg-[#ffee00] px-2.5 py-1 text-[10px] font-black"
                    >
                      <span>{act.label}</span>
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts */}
      <div className="border-t-[3px] border-black bg-[#0d1117] px-4 py-2.5">
        <div className="text-[9px] font-black text-[#ffee00] uppercase tracking-wider mb-1.5">
          // QUICK PROMPTS
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => handleSendPrompt('Why is my dashboard slow?')}
            className="brutal-btn bg-[#21262d] text-white hover:bg-[#ffee00] hover:text-black px-2 py-1 text-[10px]"
          >
            ⚡ Why is dashboard slow?
          </button>
          <button
            onClick={() => handleSendPrompt('My database isn\'t connecting.')}
            className="brutal-btn bg-[#21262d] text-white hover:bg-[#ffee00] hover:text-black px-2 py-1 text-[10px]"
          >
            🔌 Inspect DB connection
          </button>
          <button
            onClick={() => handleSendPrompt('Show monthly revenue for the last 12 months.')}
            className="brutal-btn bg-[#21262d] text-white hover:bg-[#ffee00] hover:text-black px-2 py-1 text-[10px]"
          >
            📊 Monthly revenue SQL
          </button>
        </div>
      </div>

      {/* Chat Input Bar */}
      <div className="border-t-[3px] border-black bg-[#0d1117] p-3.5">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendPrompt(input);
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Copilot anything about your data..."
            className="w-full brutal-box px-3 py-2 text-xs text-white placeholder-slate-500 outline-none bg-[#0d1117]"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="brutal-btn brutal-btn-yellow px-4 py-2 text-xs font-black disabled:opacity-40"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
