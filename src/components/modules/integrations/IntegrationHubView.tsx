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
  Cloud 
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { INTEGRATION_CARDS, API_ENDPOINTS_DOC } from '../../../data/mockData';
import { IntegrationCard, ApiEndpointDoc } from '../../../types';

export const IntegrationHubView: React.FC = () => {
  const { addToast } = useApp();

  const [activeTab, setActiveTab] = useState<'marketplace' | 'playground'>('marketplace');
  const [selectedEndpointIndex, setSelectedEndpointIndex] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState<'curl' | 'python' | 'node'>('curl');
  const [apiKey] = useState('dp_live_94f8a8123bc789e0214a6');
  const [isSendingRequest, setIsSendingRequest] = useState(false);
  const [liveResponse, setLiveResponse] = useState<any>(null);
  const [copiedText, setCopiedText] = useState(false);

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
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b-2 border-[#1c253b] pb-3">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-display text-2xl font-black tracking-tight text-white uppercase">
              Integrations & Developer API Hub
            </h1>
            <span className="rounded bg-[#06b6d4] text-black px-1.5 py-0.5 font-mono text-[10px] font-black border border-black shadow-[2px_2px_0px_#000]">
              REST & WEBHOOKS
            </span>
          </div>
          <p className="text-xs font-mono text-slate-400 mt-1">
            // Third-party webhook sync, developer REST API playground, and auth tokens.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex rounded-lg bg-[#080c16] p-1 border-2 border-[#2a364f] shadow-[3px_3px_0px_#000] font-mono">
            <button
              onClick={() => setActiveTab('marketplace')}
              className={`flex items-center space-x-1.5 rounded px-3 py-1.5 text-xs font-bold transition-all ${
                activeTab === 'marketplace' ? 'bg-[#06b6d4] text-black font-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              <span>Marketplace ({INTEGRATION_CARDS.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('playground')}
              className={`flex items-center space-x-1.5 rounded px-3 py-1.5 text-xs font-bold transition-all ${
                activeTab === 'playground' ? 'bg-[#06b6d4] text-black font-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Terminal className="h-3.5 w-3.5" />
              <span>REST API & Playground</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tab: Marketplace */}
      {activeTab === 'marketplace' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {INTEGRATION_CARDS.map((card: IntegrationCard) => {
            const Icon = getIntegrationIcon(card.category);

            return (
              <div
                key={card.id}
                className="brutal-panel brutal-panel-hover p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#152037] text-cyan-400 border border-[#2a364f] shadow-[2px_2px_0px_#000]">
                      <Icon className="h-5 w-5" />
                    </div>

                    <span className={`rounded px-2 py-0.5 font-mono text-[9px] font-black uppercase border border-black shadow-[1.5px_1.5px_0px_#000] ${
                      card.status === 'connected' ? 'bg-emerald-400 text-black' : 'bg-slate-700 text-slate-300'
                    }`}>
                      {card.status}
                    </span>
                  </div>

                  <h3 className="font-display text-base font-black text-white uppercase">{card.name}</h3>
                  <p className="text-xs font-mono text-slate-400 mt-1 line-clamp-2">{card.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#1c253b] flex items-center justify-between">
                  <span className="text-[10px] font-mono text-cyan-300 font-bold uppercase">{card.category}</span>
                  <button
                    onClick={() => addToast({ type: 'info', title: `Configuring ${card.name} integration.` })}
                    className={`brutal-btn px-3 py-1 text-xs font-mono font-bold ${
                      card.status === 'connected' ? 'bg-[#131b2e] text-slate-200' : 'brutal-btn-primary'
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

      {/* Tab: REST API & Playground */}
      {activeTab === 'playground' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 font-mono text-xs">
          {/* Endpoints Sidebar (4 cols) */}
          <div className="lg:col-span-4 brutal-panel p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-[#1c253b] pb-3">
              <h3 className="font-display text-sm font-black text-white uppercase">API ENDPOINTS</h3>
              <span className="rounded bg-[#ffee00] text-black px-1.5 py-0.2 font-mono text-[9px] font-black border border-black">
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
                  className={`cursor-pointer rounded-lg border-2 p-3 transition-all ${
                    selectedEndpointIndex === idx
                      ? 'border-[#06b6d4] bg-[#141e33] shadow-[3.5px_3.5px_0px_#000]'
                      : 'border-[#2a364f] bg-[#0c101c] hover:border-slate-500'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className={`rounded px-1.5 py-0.2 text-[9px] font-black uppercase border border-black ${
                      ep.method === 'GET' ? 'bg-emerald-400 text-black' : 'bg-[#06b6d4] text-black'
                    }`}>
                      {ep.method}
                    </span>
                    <span className="font-bold text-white truncate">{ep.path}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{ep.summary || ep.description}</p>
                </div>
              ))}
            </div>

            {/* API Key Box */}
            <div className="neu-inset-well p-3 space-y-1.5 pt-3 border-t border-[#1c253b]">
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase">
                <span className="flex items-center space-x-1">
                  <Key className="h-3 w-3 text-[#ffee00]" />
                  <span>BEARER API KEY</span>
                </span>
                <span className="text-emerald-400">ACTIVE</span>
              </div>
              <div className="truncate text-cyan-300 text-[11px] font-bold">{apiKey}</div>
            </div>
          </div>

          {/* Interactive Playground (8 cols) */}
          <div className="lg:col-span-8 brutal-panel p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#1c253b] pb-3">
              <div>
                <div className="flex items-center space-x-2">
                  <span className={`rounded px-2 py-0.5 text-xs font-black border border-black ${
                    endpoint.method === 'GET' ? 'bg-emerald-400 text-black' : 'bg-[#06b6d4] text-black'
                  }`}>
                    {endpoint.method}
                  </span>
                  <span className="font-bold text-white text-sm">{endpoint.path}</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">{endpoint.summary || endpoint.description}</p>
              </div>

              <button
                onClick={handleSendLiveRequest}
                disabled={isSendingRequest}
                className="brutal-btn brutal-btn-emerald px-4 py-2 font-black"
              >
                <Send className="h-3.5 w-3.5 mr-1.5" />
                <span>{isSendingRequest ? 'SENDING...' : 'SEND REQUEST'}</span>
              </button>
            </div>

            {/* Code Snippet Tabs */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex rounded bg-[#080c16] p-1 border border-[#2a364f]">
                  {(['curl', 'python', 'node'] as const).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setSelectedLanguage(lang)}
                      className={`rounded px-2.5 py-1 uppercase text-[10px] font-bold ${
                        selectedLanguage === lang ? 'bg-[#06b6d4] text-black font-black' : 'text-slate-400'
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
                  {copiedText ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedText ? 'COPIED' : 'COPY'}</span>
                </button>
              </div>

              <pre className="neu-inset-well p-3 text-cyan-300 text-[11px] overflow-x-auto max-h-48 leading-relaxed">
                {currentSnippet}
              </pre>
            </div>

            {/* Response Output Box */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-300">// LIVE HTTP RESPONSE</span>
                {liveResponse && (
                  <span className="rounded bg-emerald-400 text-black px-1.5 py-0.2 text-[9px] font-black border border-black">
                    HTTP 200 OK • 28MS
                  </span>
                )}
              </div>

              <pre className="neu-inset-well p-3.5 text-emerald-300 text-[11px] overflow-x-auto max-h-56">
                {JSON.stringify(liveResponse || endpoint.response, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
