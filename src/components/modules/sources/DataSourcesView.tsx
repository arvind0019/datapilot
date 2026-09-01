import React, { useState } from 'react';
import { 
  Database, 
  Plus, 
  RefreshCw, 
  Lock, 
  Table, 
  Terminal, 
  X
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { DatabaseType, Environment, DataSource } from '../../../types';
import { MOCK_SCHEMA_TABLES } from '../../../data/mockData';

export const DataSourcesView: React.FC = () => {
  const { 
    dataSources, 
    testConnection, 
    addDataSource, 
    setCurrentSection, 
    setActiveSql, 
    addToast 
  } = useApp();

  const [testingId, setTestingId] = useState<string | null>(null);
  const [selectedSchemaSource, setSelectedSchemaSource] = useState<DataSource | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedTableForPreview, setSelectedTableForPreview] = useState<string>('customers');

  const [formData, setFormData] = useState({
    name: '',
    type: 'PostgreSQL' as DatabaseType,
    host: '',
    port: 5432,
    database: '',
    username: '',
    password: '',
    environment: 'production' as Environment,
    ssl: true,
    poolSize: 20
  });

  const handleTest = async (id: string) => {
    setTestingId(id);
    await testConnection(id);
    setTestingId(null);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.database) {
      addToast({ type: 'error', title: 'Missing required fields' });
      return;
    }

    addDataSource({
      name: formData.name,
      type: formData.type,
      host: formData.host || 'db-cluster.internal.datapilot.io',
      port: Number(formData.port),
      database: formData.database,
      username: formData.username || 'datapilot_read',
      status: 'connected',
      latencyMs: 24,
      environment: formData.environment,
      ssl: formData.ssl,
      poolSize: Number(formData.poolSize)
    });

    setIsAddModalOpen(false);
    setFormData({
      name: '',
      type: 'PostgreSQL',
      host: '',
      port: 5432,
      database: '',
      username: '',
      password: '',
      environment: 'production',
      ssl: true,
      poolSize: 20
    });
  };

  const currentTables = selectedSchemaSource ? (MOCK_SCHEMA_TABLES[selectedSchemaSource.id] || MOCK_SCHEMA_TABLES['ds-1']) : [];

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-display text-2xl font-black tracking-tight text-white uppercase">
              Data Sources & Connectors
            </h1>
            <span className="rounded bg-emerald-400 text-black px-1.5 py-0.5 font-mono text-[10px] font-black border border-black shadow-[2px_2px_0px_#000]">
              {dataSources.length} ENGINES
            </span>
          </div>
          <p className="text-xs font-mono text-slate-400 mt-1">
            // Operational databases, columnar data warehouses, and streaming ingest connectors.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="brutal-btn brutal-btn-primary px-4 py-2 text-xs font-black tracking-tight"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          <span>CONNECT NEW DATABASE</span>
        </button>
      </div>

      {/* Sources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dataSources.map((ds) => {
          const isTesting = testingId === ds.id;

          return (
            <div
              key={ds.id}
              className="brutal-panel brutal-panel-hover p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="rounded bg-[#12192a] px-2 py-0.5 font-mono text-[11px] font-black text-cyan-300 border border-[#2a364f] shadow-[1.5px_1.5px_0px_#000]">
                    {ds.type}
                  </span>
                  
                  <div className="flex items-center space-x-1.5">
                    <span className="rounded bg-black px-1.5 py-0.2 font-mono text-[9px] font-bold text-slate-300 uppercase border border-[#2a364f]">
                      {ds.environment}
                    </span>

                    <span className={`rounded px-2 py-0.5 font-mono text-[9px] font-black uppercase border border-black shadow-[1.5px_1.5px_0px_#000] ${
                      ds.status === 'connected' ? 'bg-emerald-400 text-black' :
                      ds.status === 'degraded' ? 'bg-[#ffee00] text-black' :
                      'bg-rose-500 text-black'
                    }`}>
                      {ds.status}
                    </span>
                  </div>
                </div>

                <h3 className="font-display text-base font-black text-white uppercase tracking-tight">
                  {ds.name}
                </h3>
                <p className="font-mono text-xs text-cyan-300 mt-1 truncate">
                  {ds.database}
                </p>

                {/* Connection Specs inside Neumorphic Well */}
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs neu-inset-well p-3">
                  <div>
                    <span className="text-[9px] text-slate-500 font-mono uppercase block">HOST</span>
                    <span className="font-mono text-slate-300 truncate block text-[11px]" title={ds.host}>
                      {ds.host.split('.')[0]}...
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 font-mono uppercase block">PORT / SSL</span>
                    <span className="font-mono text-slate-300 text-[11px]">
                      {ds.port || 'DEFAULT'} {ds.ssl ? '• SSL' : ''}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 font-mono uppercase block">LATENCY</span>
                    <span className="font-mono text-emerald-400 text-[11px] font-black">
                      {ds.latencyMs > 0 ? `${ds.latencyMs} MS` : 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 font-mono uppercase block">STORAGE</span>
                    <span className="font-mono text-slate-300 text-[11px]">
                      {ds.tablesCount} TBL • {ds.sizeGb} GB
                    </span>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between text-[10px] font-mono text-slate-500">
                  <span className="flex items-center space-x-1">
                    <Lock className="h-3 w-3" />
                    <span>AUTH: <strong className="text-slate-400">••••••••</strong></span>
                  </span>
                  <span>Tested {ds.lastTested}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-3 border-t border-[#1c253b] flex items-center justify-between gap-2.5">
                <button
                  onClick={() => handleTest(ds.id)}
                  disabled={isTesting}
                  className="flex-1 brutal-btn bg-[#131b2e] hover:bg-[#1a253f] text-slate-200 py-1.5 text-xs font-bold font-mono disabled:opacity-50"
                >
                  <RefreshCw className={`h-3 w-3 mr-1.5 ${isTesting ? 'animate-spin text-cyan-400' : 'text-slate-400'}`} />
                  <span>{isTesting ? 'TESTING...' : 'TEST CONNECTION'}</span>
                </button>

                <button
                  onClick={() => setSelectedSchemaSource(ds)}
                  className="brutal-btn bg-[#06b6d4]/15 hover:bg-[#06b6d4]/25 text-cyan-300 border-[#06b6d4]/50 py-1.5 px-3 text-xs font-mono font-bold"
                >
                  <Table className="h-3 w-3 mr-1" />
                  <span>SCHEMA</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Schema Browser Drawer */}
      {selectedSchemaSource && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="h-full w-full max-w-3xl border-l-2 border-[#2a364f] bg-[#0c101c] p-6 shadow-[12px_0px_0px_#000000] overflow-y-auto flex flex-col justify-between animate-in slide-in-from-right duration-200">
            <div>
              <div className="flex items-center justify-between border-b-2 border-[#1c253b] pb-4">
                <div className="flex items-center space-x-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#06b6d4] text-black border border-black shadow-[2px_2px_0px_#000]">
                    <Database className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-base font-black text-white uppercase">
                      {selectedSchemaSource.name}
                    </h3>
                    <p className="text-xs text-slate-400 font-mono">
                      Database: <span className="text-cyan-300 font-bold">{selectedSchemaSource.database}</span> • {currentTables.length} Tables
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedSchemaSource(null)}
                  className="rounded-md bg-[#131b2e] border border-[#2a364f] p-1.5 text-slate-300 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Table Selector Tabs */}
              <div className="mt-4 flex flex-wrap gap-1.5 border-b border-[#1c253b] pb-3">
                {currentTables.map((t) => (
                  <button
                    key={t.name}
                    onClick={() => setSelectedTableForPreview(t.name)}
                    className={`flex items-center space-x-1.5 rounded-lg px-3 py-1.5 text-xs font-mono transition-all ${
                      selectedTableForPreview === t.name
                        ? 'bg-[#06b6d4] text-black font-black border border-black shadow-[2px_2px_0px_#000]'
                        : 'bg-[#12192a] text-slate-400 border border-[#2a364f] hover:text-white'
                    }`}
                  >
                    <Table className="h-3 w-3" />
                    <span>{t.name}</span>
                    <span className="text-[10px]">({t.rowCount.toLocaleString()})</span>
                  </button>
                ))}
              </div>

              {/* Table Columns */}
              {(() => {
                const table = currentTables.find(t => t.name === selectedTableForPreview) || currentTables[0];
                if (!table) return null;

                return (
                  <div className="mt-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-mono text-sm font-black text-white uppercase">public.{table.name}</h4>
                        <p className="text-xs text-slate-400 mt-0.5">{table.description}</p>
                      </div>

                      <button
                        onClick={() => {
                          setActiveSql(`SELECT * FROM public.${table.name} LIMIT 25;`);
                          setCurrentSection('sql');
                        }}
                        className="brutal-btn brutal-btn-primary px-3 py-1.5 text-xs font-mono font-bold"
                      >
                        <Terminal className="h-3.5 w-3.5 mr-1" />
                        <span>QUERY TABLE IN SQL IDE</span>
                      </button>
                    </div>

                    <div className="overflow-x-auto rounded-xl border-2 border-[#2a364f] bg-[#080c16] shadow-[4px_4px_0px_#000]">
                      <table className="w-full text-left text-xs font-mono">
                        <thead className="border-b-2 border-[#1c253b] bg-[#0c101c] text-[10px] uppercase text-slate-400 font-black">
                          <tr>
                            <th className="px-4 py-2.5">COLUMN NAME</th>
                            <th className="px-4 py-2.5">DATA TYPE</th>
                            <th className="px-4 py-2.5">KEY ATTRIBUTES</th>
                            <th className="px-4 py-2.5">NULLABLE</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#1c253b] text-slate-300">
                          {table.columns.map((col, idx) => (
                            <tr key={idx} className="hover:bg-[#12192a]">
                              <td className="px-4 py-2.5 font-bold text-white">{col.name}</td>
                              <td className="px-4 py-2.5 text-cyan-400">{col.type}</td>
                              <td className="px-4 py-2.5">
                                {col.isPrimary && (
                                  <span className="rounded bg-[#ffee00] text-black px-1.5 py-0.5 text-[9px] font-black border border-black shadow-[1.5px_1.5px_0px_#000]">
                                    PRIMARY KEY (PK)
                                  </span>
                                )}
                                {col.isForeign && (
                                  <span className="rounded bg-[#06b6d4] text-black px-1.5 py-0.5 text-[9px] font-black border border-black shadow-[1.5px_1.5px_0px_#000]">
                                    FK → {col.foreignTable}({col.foreignColumn})
                                  </span>
                                )}
                                {!col.isPrimary && !col.isForeign && (
                                  <span className="text-slate-600">—</span>
                                )}
                              </td>
                              <td className="px-4 py-2.5 text-slate-500 font-bold">
                                {col.nullable ? 'YES' : 'NO'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })()}
            </div>

            <div className="border-t-2 border-[#1c253b] pt-4 mt-6 flex items-center justify-between text-xs font-mono text-slate-400">
              <span>Synchronized via Antigravity Mesh Crawler</span>
              <button
                onClick={() => setSelectedSchemaSource(null)}
                className="brutal-btn bg-[#131b2e] text-slate-200 px-4 py-1.5"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Database Connection Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-100">
          <div className="w-full max-w-lg rounded-xl border-2 border-[#2a364f] bg-[#0c101c] p-6 shadow-[8px_8px_0px_#000000]">
            <div className="flex items-center justify-between border-b-2 border-[#1c253b] pb-3">
              <h3 className="font-display text-base font-black text-white uppercase flex items-center space-x-2">
                <Database className="h-4 w-4 text-cyan-400" />
                <span>Connect New Data Source</span>
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white font-mono">
                [ESC]
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="mt-4 space-y-3.5 text-xs font-mono">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-300 uppercase block mb-1">DATABASE TYPE</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as DatabaseType })}
                    className="w-full rounded-lg border-2 border-[#2a364f] bg-[#080c16] px-3 py-2 text-white outline-none"
                  >
                    <option value="PostgreSQL">PostgreSQL</option>
                    <option value="MySQL">MySQL</option>
                    <option value="BigQuery">Google BigQuery</option>
                    <option value="Snowflake">Snowflake</option>
                    <option value="Redshift">Amazon Redshift</option>
                    <option value="SQLite">SQLite File</option>
                    <option value="REST API">REST API Feed</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-300 uppercase block mb-1">ENVIRONMENT</label>
                  <select
                    value={formData.environment}
                    onChange={(e) => setFormData({ ...formData, environment: e.target.value as Environment })}
                    className="w-full rounded-lg border-2 border-[#2a364f] bg-[#080c16] px-3 py-2 text-white outline-none"
                  >
                    <option value="production">Production</option>
                    <option value="staging">Staging</option>
                    <option value="development">Development</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-300 uppercase block mb-1">DISPLAY NAME</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Analytics Read Replica"
                  className="w-full rounded-lg border-2 border-[#2a364f] bg-[#080c16] px-3 py-2 text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="text-[10px] font-bold text-slate-300 uppercase block mb-1">HOST ENDPOINT</label>
                  <input
                    type="text"
                    value={formData.host}
                    onChange={(e) => setFormData({ ...formData, host: e.target.value })}
                    placeholder="db.internal.example.com"
                    className="w-full rounded-lg border-2 border-[#2a364f] bg-[#080c16] px-3 py-2 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-300 uppercase block mb-1">PORT</label>
                  <input
                    type="number"
                    value={formData.port}
                    onChange={(e) => setFormData({ ...formData, port: Number(e.target.value) })}
                    className="w-full rounded-lg border-2 border-[#2a364f] bg-[#080c16] px-3 py-2 text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-300 uppercase block mb-1">DATABASE NAME</label>
                <input
                  type="text"
                  required
                  value={formData.database}
                  onChange={(e) => setFormData({ ...formData, database: e.target.value })}
                  placeholder="analytics_prod"
                  className="w-full rounded-lg border-2 border-[#2a364f] bg-[#080c16] px-3 py-2 text-white outline-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-2.5 pt-3 border-t-2 border-[#1c253b]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="brutal-btn bg-[#131b2e] px-4 py-1.5 text-slate-300"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="brutal-btn brutal-btn-primary px-5 py-1.5 text-xs font-black"
                >
                  SAVE & CONNECT
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
