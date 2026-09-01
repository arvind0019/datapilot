import React, { useState } from 'react';
import { 
  Layers, 
  Terminal, 
  Send, 
  Copy, 
  Check, 
  Key, 
  MessageSquare, 
  GitBranch, 
  Boxes, 
  Cloud,
  BellRing,
  Plus,
  Zap,
  Clock,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { INTEGRATION_CARDS, API_ENDPOINTS_DOC } from '../../../data/mockData';
import { IntegrationCard, ApiEndpointDoc, AlertRule } from '../../../types';

export const IntegrationHubView: React.FC = () => {
  const { 
    addToast,
    alertRules,
    addAlertRule,
    toggleAlertStatus,
    deleteAlertRule,
    triggerTestAlert
  } = useApp();

  const [activeTab, setActiveTab] = useState<'marketplace' | 'alerts' | 'playground'>('marketplace');
  const [selectedEndpointIndex, setSelectedEndpointIndex] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState<'curl' | 'python' | 'node'>('curl');
  const [apiKey] = useState('dp_live_94f8a8123bc789e0214a6');
  const [isSendingRequest, setIsSendingRequest] = useState(false);
  const [liveResponse, setLiveResponse] = useState<any>(null);
  const [copiedText, setCopiedText] = useState(false);
  const [isNewAlertModalOpen, setIsNewAlertModalOpen] = useState(false);

  const [alertForm, setAlertForm] = useState({
    title: '',
    metric: 'query_latency' as AlertRule['metric'],
    condition: 'greater_than' as AlertRule['condition'],
    thresholdValue: '500ms',
    channel: 'slack' as AlertRule['channel'],
    destinationTarget: '#data-alerts',
    schedule: 'realtime' as AlertRule['schedule']
  });

  const endpoint: ApiEndpointDoc = API_ENDPOINTS_DOC[selectedEndpointIndex] || API_ENDPOINTS_DOC[0];

  const defaultSnippet = {
    curl: `curl -X GET "https://api.datapilot.io/v1/datasources" \\\n  -H "Authorization: Bearer dp_live_94f8a8123bc789e0214a6"`,
    python: `import requests\n\nres = requests.get(\n    "https://api.datapilot.io/v1/datasources",\n    headers={"Authorization": "Bearer dp_live_94f8a8123bc789e0214a6"}\n)\nprint(res.json())`,
    node: `const res = await fetch("https://api.datapilot.io/v1/datasources", {\n  headers: { Authorization: "Bearer dp_live_94f8a8123bc789e0214a6" }\n});\nconsole.log(await res.json());`
  };

  const currentSnippetObj = endpoint.snippet || defaultSnippet;
  const currentSnippet = currentSnippetObj[selectedLanguage] || currentSnippetObj.curl;

  const handleSendLiveRequest = () => {
    setIsSendingRequest(true);
    setLiveResponse(null);

    setTimeout(() => {
      setIsSendingRequest(false);
      setLiveResponse(endpoint.response || { status: 'success', latency_ms: 28 });
      addToast({
        type: 'success',
        title: '200 OK Response Received',
        message: `HTTP 200 from ${endpoint.path} in 28ms.`
      });
    }, 600);
  };

  const handleCopySnippet = (snippet: string) => {
    navigator.clipboard.writeText(snippet);
    setCopiedText(true);
    addToast({ type: 'success', title: 'Code snippet copied to clipboard!' });
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleCreateAlertSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!alertForm.title) return;

    addAlertRule({
      ...alertForm,
      status: 'active'
    });

    setIsNewAlertModalOpen(false);
    setAlertForm({
      title: '',
      metric: 'query_latency',
      condition: 'greater_than',
      thresholdValue: '500ms',
      channel: 'slack',
      destinationTarget: '#data-alerts',
      schedule: 'realtime'
    });
  };

  const getIntegrationIcon = (category: string) => {
    switch (category) {
      case 'Alerts': return MessageSquare;
      case 'CI/CD': return GitBranch;
      case 'Transforms': return Boxes;
      case 'Storage': return Cloud;
      default: return Layers;
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-150 font-mono text-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b-[3px] border-black pb-3">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-display text-xl sm:text-2xl font-black tracking-tight text-white uppercase">
              Integrations, Alerts & Developer APIs
            </h1>
            <span className="brutal-badge bg-[#00f0ff] text-black">
              AUTOMATION
            </span>
          </div>
          <p className="text-slate-400 text-xs mt-0.5">
            // Slack/Discord automated alerts, scheduled reports, and live OpenAPI request playground.
          </p>
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <div className="flex rounded bg-[#0d1117] p-1 border-2 border-black shadow-[3px_3px_0px_#000]">
            <button
              onClick={() => setActiveTab('marketplace')}
              className={`flex items-center space-x-1.5 rounded px-2.5 sm:px-3 py-1.5 text-xs font-black transition-all cursor-pointer min-h-[36px] ${
                activeTab === 'marketplace' ? 'bg-[#00f0ff] text-black shadow-[2px_2px_0px_#000]' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              <span>Connectors</span>
            </button>

            {/* 🌟 Feature 3: Automated Alerts Tab */}
            <button
              onClick={() => setActiveTab('alerts')}
              className={`flex items-center space-x-1.5 rounded px-2.5 sm:px-3 py-1.5 text-xs font-black transition-all cursor-pointer min-h-[36px] ${
                activeTab === 'alerts' ? 'bg-[#ffee00] text-black shadow-[2px_2px_0px_#000]' : 'text-slate-300 hover:text-white'
              }`}
            >
              <BellRing className="h-3.5 w-3.5" />
              <span>Slack & Cron Alerts</span>
              <span className="brutal-badge bg-black text-[#ffee00] text-[8px]">
                {alertRules.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('playground')}
              className={`flex items-center space-x-1.5 rounded px-2.5 sm:px-3 py-1.5 text-xs font-black transition-all cursor-pointer min-h-[36px] ${
                activeTab === 'playground' ? 'bg-[#00ff66] text-black shadow-[2px_2px_0px_#000]' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Terminal className="h-3.5 w-3.5" />
              <span>REST API</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tab 1: Marketplace */}
      {activeTab === 'marketplace' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {INTEGRATION_CARDS.map((card: IntegrationCard) => {
            const Icon = getIntegrationIcon(card.category);

            return (
              <div
                key={card.id}
                className="brutal-panel brutal-panel-hover p-4 sm:p-5 flex flex-col justify-between bg-[#161b22]"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#ffee00] text-black border-2 border-black shadow-[2px_2px_0px_#000]">
                      <Icon className="h-5 w-5" />
                    </div>

                    <span className={`brutal-badge ${
                      card.status === 'connected' ? 'bg-[#00ff66] text-black' : 'bg-slate-700 text-slate-300'
                    }`}>
                      {card.status}
                    </span>
                  </div>

                  <h3 className="font-display text-base font-black text-white uppercase">{card.name}</h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{card.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t-2 border-black flex items-center justify-between">
                  <span className="text-[10px] text-[#00f0ff] font-bold uppercase">{card.category}</span>
                  <button
                    onClick={() => addToast({ type: 'info', title: `Configuring ${card.name} integration.` })}
                    className={`brutal-btn px-3 py-1 text-xs font-black min-h-[32px] ${
                      card.status === 'connected' ? 'bg-[#21262d] text-slate-200' : 'brutal-btn-yellow'
                    }`}
                  >
                    {card.status === 'connected' ? 'MANAGE' : 'CONNECT'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 🌟 Tab 2: Automated Slack / Discord Alerts & Cron Digest */}
      {activeTab === 'alerts' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 brutal-panel p-4 bg-[#161b22]">
            <div>
              <h3 className="font-display text-sm font-black text-white uppercase">Automated Alert Triggers & Scheduled Cron Digests</h3>
              <p className="text-slate-400 text-xs mt-0.5">Configure anomaly triggers on query latency, database errors, or scheduled daily financial digests to Slack & Discord.</p>
            </div>

            <button
              onClick={() => setIsNewAlertModalOpen(true)}
              className="brutal-btn brutal-btn-yellow px-4 py-2 text-xs font-black min-h-[38px] self-start sm:self-auto"
            >
              <Plus className="h-4 w-4 mr-1.5" />
              <span>NEW ALERT RULE</span>
            </button>
          </div>

          <div className="space-y-3">
            {alertRules.map((rule) => (
              <div
                key={rule.id}
                className="brutal-panel p-4 sm:p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-[#161b22]"
              >
                <div className="space-y-2 flex-1 truncate">
                  <div className="flex items-center space-x-2">
                    <span className={`brutal-badge ${
                      rule.channel === 'slack' ? 'bg-[#ffee00] text-black' :
                      rule.channel === 'discord' ? 'bg-[#00f0ff] text-black' :
                      'bg-[#00ff66] text-black'
                    }`}>
                      {rule.channel.toUpperCase()}
                    </span>

                    <span className="text-white font-black text-sm truncate">{rule.title}</span>

                    <span className="brutal-badge bg-black text-white text-[8px]">
                      {rule.schedule.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="brutal-box p-2 bg-[#0d1117] text-[11px] text-slate-300 truncate">
                    Destination: <strong className="text-[#00f0ff]">{rule.destinationTarget}</strong> • Condition: <strong className="text-[#ffee00]">{rule.condition} {rule.thresholdValue}</strong>
                  </div>

                  {rule.lastPayloadSummary && (
                    <div className="text-[11px] text-slate-400 font-bold">
                      Last Trigger: <span className="text-[#00ff66]">{rule.lastPayloadSummary}</span>
                    </div>
                  )}
                </div>

                {/* Alert Controls */}
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <button
                    onClick={() => triggerTestAlert(rule.id)}
                    className="brutal-btn brutal-btn-yellow px-3 py-1.5 text-xs font-black min-h-[36px]"
                  >
                    <Zap className="h-3.5 w-3.5 mr-1 fill-black" />
                    <span>TEST WEBHOOK</span>
                  </button>

                  <button
                    onClick={() => toggleAlertStatus(rule.id)}
                    className={`brutal-btn px-3 py-1.5 text-xs font-black min-h-[36px] ${
                      rule.status === 'active' ? 'bg-[#00ff66] text-black' : 'bg-slate-700 text-slate-300'
                    }`}
                  >
                    {rule.status === 'active' ? 'ACTIVE' : 'PAUSED'}
                  </button>

                  <button
                    onClick={() => deleteAlertRule(rule.id)}
                    className="p-2 text-slate-400 hover:text-white"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: REST API Playground */}
      {activeTab === 'playground' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-4 brutal-panel p-4 space-y-3 bg-[#161b22]">
            <div className="flex items-center justify-between border-b-2 border-black pb-2">
              <h3 className="font-display text-sm font-black text-white uppercase">API ENDPOINTS</h3>
              <span className="brutal-badge bg-[#ffee00] text-black">
                V1 OPENAPI
              </span>
            </div>

            <div className="space-y-2">
              {API_ENDPOINTS_DOC.map((ep: ApiEndpointDoc, idx: number) => (
                <div
                  key={idx}
                  onClick={() => {
                    setSelectedEndpointIndex(idx);
                    setLiveResponse(null);
                  }}
                  className={`cursor-pointer rounded p-3 border-2 border-black transition-all ${
                    selectedEndpointIndex === idx
                      ? 'bg-[#00f0ff] text-black font-black shadow-[3px_3px_0px_#000]'
                      : 'bg-[#0d1117] text-white hover:bg-[#21262d]'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="brutal-badge bg-black text-white text-[8px]">{ep.method}</span>
                    <span className="font-bold truncate">{ep.path}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">{ep.summary || ep.description}</p>
                </div>
              ))}
            </div>

            <div className="brutal-box p-3 bg-[#0d1117] space-y-1 mt-3">
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase">
                <span className="flex items-center space-x-1">
                  <Key className="h-3 w-3 text-[#ffee00]" />
                  <span>API KEY</span>
                </span>
                <span className="text-[#00ff66]">ACTIVE</span>
              </div>
              <div className="truncate text-[#00f0ff] font-bold text-[11px]">{apiKey}</div>
            </div>
          </div>

          <div className="lg:col-span-8 brutal-panel p-5 space-y-4 bg-[#161b22]">
            <div className="flex items-center justify-between border-b-2 border-black pb-2">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="brutal-badge bg-[#ffee00] text-black">{endpoint.method}</span>
                  <span className="font-bold text-white text-sm">{endpoint.path}</span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{endpoint.summary || endpoint.description}</p>
              </div>

              <button
                onClick={handleSendLiveRequest}
                disabled={isSendingRequest}
                className="brutal-btn brutal-btn-green px-4 py-2 font-black"
              >
                <Send className="h-3.5 w-3.5 mr-1.5" />
                <span>{isSendingRequest ? 'SENDING...' : 'SEND REQUEST'}</span>
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex rounded bg-[#0d1117] p-1 border border-black">
                  {(['curl', 'python', 'node'] as const).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setSelectedLanguage(lang)}
                      className={`rounded px-2.5 py-1 uppercase text-[10px] font-bold ${
                        selectedLanguage === lang ? 'bg-[#00f0ff] text-black font-black' : 'text-slate-400'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => handleCopySnippet(currentSnippet)}
                  className="flex items-center space-x-1 text-slate-400 hover:text-white"
                >
                  {copiedText ? <Check className="h-3.5 w-3.5 text-[#00ff66]" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedText ? 'COPIED' : 'COPY'}</span>
                </button>
              </div>

              <pre className="brutal-box p-3 text-[#00f0ff] bg-[#0d1117] overflow-x-auto text-[11px] max-h-48 leading-relaxed">
                {currentSnippet}
              </pre>
            </div>

            <div className="space-y-2">
              <span className="text-slate-300 font-bold">// LIVE HTTP RESPONSE</span>
              <pre className="brutal-box p-3.5 text-[#00ff66] bg-[#0d1117] text-[11px] overflow-x-auto max-h-56">
                {JSON.stringify(liveResponse || endpoint.response, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* New Alert Rule Modal */}
      {isNewAlertModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-4">
          <div className="w-full max-w-md brutal-panel p-5 bg-[#161b22] border-[3px] border-black shadow-[10px_10px_0px_#000] space-y-4">
            <h3 className="font-display text-base font-black text-white uppercase">CREATE AUTOMATED ALERT RULE</h3>
            <form onSubmit={handleCreateAlertSubmit} className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-300 uppercase mb-1">Alert Title</label>
                <input
                  type="text"
                  required
                  value={alertForm.title}
                  onChange={(e) => setAlertForm({ ...alertForm, title: e.target.value })}
                  placeholder="e.g. Daily Revenue Slack Digest"
                  className="w-full brutal-box px-3 py-2 text-white bg-[#0d1117] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-300 uppercase mb-1">Metric</label>
                  <select
                    value={alertForm.metric}
                    onChange={(e) => setAlertForm({ ...alertForm, metric: e.target.value as any })}
                    className="w-full brutal-box px-2 py-1.5 text-white bg-[#0d1117]"
                  >
                    <option value="daily_mrr_digest">Daily MRR Digest</option>
                    <option value="query_latency">Query Latency Spike</option>
                    <option value="error_spike">API Error Count</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-300 uppercase mb-1">Channel</label>
                  <select
                    value={alertForm.channel}
                    onChange={(e) => setAlertForm({ ...alertForm, channel: e.target.value as any })}
                    className="w-full brutal-box px-2 py-1.5 text-white bg-[#0d1117]"
                  >
                    <option value="slack">Slack Channel</option>
                    <option value="discord">Discord Webhook</option>
                    <option value="email">Email Digest</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-300 uppercase mb-1">Destination Target (#channel / URL)</label>
                <input
                  type="text"
                  required
                  value={alertForm.destinationTarget}
                  onChange={(e) => setAlertForm({ ...alertForm, destinationTarget: e.target.value })}
                  placeholder="#finance-alerts"
                  className="w-full brutal-box px-3 py-2 text-white bg-[#0d1117] outline-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t-2 border-black">
                <button
                  type="button"
                  onClick={() => setIsNewAlertModalOpen(false)}
                  className="brutal-btn bg-[#21262d] text-white px-3 py-1.5"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="brutal-btn brutal-btn-yellow px-4 py-1.5 font-black"
                >
                  SAVE & ACTIVATE RULE
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
