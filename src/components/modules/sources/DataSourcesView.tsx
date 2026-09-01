import React, { useState } from 'react';
import { 
  Database, 
  Plus, 
  RefreshCw, 
  Table, 
  Terminal, 
  X
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { DatabaseType, Environment, DataSource, SchemaTable, TableColumn } from '../../../types';
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
      username: formData.username || 'admin',
      status: 'connected',
      latencyMs: 22,
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

  const tableList: SchemaTable[] = (selectedSchemaSource && MOCK_SCHEMA_TABLES[selectedSchemaSource.id]) 
    ? MOCK_SCHEMA_TABLES[selectedSchemaSource.id] 
    : MOCK_SCHEMA_TABLES['ds-1'] || [];

  const currentSchemaTable: SchemaTable = tableList.find((t: SchemaTable) => t.name === selectedTableForPreview) || tableList[0] || {
    name: 'customers',
    schema: 'public',
    rowCount: 128450,
    columns: []
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-150 font-mono text-xs">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b-[3px] border-black pb-3">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-display text-xl sm:text-2xl font-black tracking-tight text-white uppercase">
              Data Sources & Catalogs
            </h1>
            <span className="brutal-badge bg-[#00f0ff] text-black">
              {dataSources.length} SOURCES
            </span>
          </div>
          <p className="text-slate-400 text-xs mt-0.5">
            // Heterogeneous connection pool manager, schema auto-discovery, and latency health checks.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="brutal-btn brutal-btn-yellow px-4 py-2 text-xs font-black min-h-[40px] self-start sm:self-auto"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          <span>CONNECT NEW DATABASE</span>
        </button>
      </div>

      {/* Grid of Data Source Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dataSources.map((ds) => {
          const isTesting = testingId === ds.id;

          return (
            <div
              key={ds.id}
              className="brutal-panel brutal-panel-hover p-4 sm:p-5 flex flex-col justify-between space-y-4 bg-[#161b22]"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded border-2 border-black bg-[#ffee00] text-black shadow-[2px_2px_0px_#000]">
                      <Database className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-display text-sm font-black text-white">{ds.name}</h3>
                      <p className="text-[10px] text-slate-400">{ds.type} • {ds.database}</p>
                    </div>
                  </div>

                  <span className={`brutal-badge ${
                    ds.status === 'connected' ? 'bg-[#00ff66] text-black' :
                    ds.status === 'degraded' ? 'bg-[#ffee00] text-black' :
                    'bg-[#ff007f] text-white'
                  }`}>
                    {ds.status}
                  </span>
                </div>

                {/* Host & Port info box */}
                <div className="brutal-box p-2.5 bg-[#0d1117] space-y-1 my-3 text-[11px]">
                  <div className="flex justify-between text-slate-400">
                    <span>Host:</span>
                    <span className="text-white truncate max-w-[170px]">{ds.host}:{ds.port}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Latency:</span>
                    <span className={`font-black ${ds.latencyMs < 30 ? 'text-[#00ff66]' : 'text-[#ffee00]'}`}>
                      {ds.latencyMs > 0 ? `${ds.latencyMs}ms` : 'Offline'}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Catalog:</span>
                    <span className="text-[#00f0ff] font-bold">{ds.tablesCount} tables ({ds.sizeGb} GB)</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t-2 border-black flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedSchemaSource(ds)}
                  className="brutal-btn bg-[#21262d] text-white px-3 py-1.5 text-xs font-black min-h-[36px] flex-1"
                >
                  <Table className="h-3.5 w-3.5 mr-1" />
                  <span>SCHEMA</span>
                </button>

                <button
                  onClick={() => handleTest(ds.id)}
                  disabled={isTesting}
                  className="brutal-btn brutal-btn-yellow px-3 py-1.5 text-xs font-black min-h-[36px] flex-1"
                >
                  <RefreshCw className={`h-3.5 w-3.5 mr-1 ${isTesting ? 'animate-spin' : ''}`} />
                  <span>{isTesting ? 'TESTING...' : 'TEST'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Schema Explorer Drawer */}
      {selectedSchemaSource && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="h-full w-full sm:max-w-2xl border-l-[3px] border-black bg-[#161b22] p-4 sm:p-6 shadow-[12px_0px_0px_#000000] overflow-y-auto flex flex-col justify-between font-mono text-xs animate-in slide-in-from-right duration-200">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b-2 border-black pb-3">
                <div>
                  <h3 className="font-display text-base font-black text-white uppercase">
                    {selectedSchemaSource.name} Schema Explorer
                  </h3>
                  <p className="text-xs text-slate-400">
                    {selectedSchemaSource.type} • {selectedSchemaSource.tablesCount} Tables Indexed
                  </p>
                </div>

                <button
                  onClick={() => setSelectedSchemaSource(null)}
                  className="brutal-badge bg-white text-black cursor-pointer p-1.5"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Table Selector Pills */}
              <div className="flex items-center space-x-1.5 overflow-x-auto pb-2 scrollbar-none">
                {tableList.map((tbl: SchemaTable) => (
                  <button
                    key={tbl.name}
                    onClick={() => setSelectedTableForPreview(tbl.name)}
                    className={`rounded px-2.5 py-1 text-xs font-black border-2 border-black whitespace-nowrap min-h-[32px] cursor-pointer ${
                      selectedTableForPreview === tbl.name
                        ? 'bg-[#ffee00] text-black shadow-[2px_2px_0px_#000]'
                        : 'bg-[#0d1117] text-white hover:bg-[#21262d]'
                    }`}
                  >
                    {tbl.schema}.{tbl.name} ({tbl.rowCount.toLocaleString()})
                  </button>
                ))}
              </div>

              {/* Selected Table Columns Details */}
              <div className="brutal-box p-3 bg-[#0d1117] space-y-2">
                <div className="flex items-center justify-between border-b border-black pb-2">
                  <span className="font-black text-white uppercase text-xs">
                    TABLE: {currentSchemaTable.schema}.{currentSchemaTable.name}
                  </span>
                  <span className="brutal-badge bg-[#00ff66] text-black">
                    {currentSchemaTable.rowCount.toLocaleString()} ROWS
                  </span>
                </div>

                <div className="overflow-x-auto rounded border border-black bg-[#161b22]">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-[#21262d] text-white text-[10px] uppercase font-black border-b border-black">
                      <tr>
                        <th className="px-3 py-1.5">COLUMN</th>
                        <th className="px-3 py-1.5">TYPE</th>
                        <th className="px-3 py-1.5">KEY</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black text-slate-200">
                      {currentSchemaTable.columns.map((c: TableColumn, i: number) => (
                        <tr key={i}>
                          <td className="px-3 py-1.5 font-bold text-white">{c.name}</td>
                          <td className="px-3 py-1.5 text-slate-400">{c.type}</td>
                          <td className="px-3 py-1.5">
                            {c.isPrimary && <span className="brutal-badge bg-[#ffee00] text-black text-[8px]">PK</span>}
                            {c.isForeign && <span className="brutal-badge bg-[#00f0ff] text-black text-[8px]">FK</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t-2 border-black flex items-center justify-between gap-2">
              <button
                onClick={() => {
                  setActiveSql(`SELECT * FROM ${currentSchemaTable.schema}.${currentSchemaTable.name} LIMIT 50;`);
                  setCurrentSection('sql');
                }}
                className="brutal-btn brutal-btn-yellow px-4 py-2 font-black text-xs flex-1"
              >
                <Terminal className="h-3.5 w-3.5 mr-1" />
                <span>QUERY TABLE IN SQL IDE</span>
              </button>

              <button
                onClick={() => setSelectedSchemaSource(null)}
                className="brutal-btn bg-white text-black px-4 py-2 font-black text-xs"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Connect Database Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-4">
          <div className="w-full max-w-lg brutal-panel p-5 bg-[#161b22] border-[3px] border-black shadow-[10px_10px_0px_#000] space-y-4">
            <div className="flex items-center justify-between border-b-2 border-black pb-2">
              <h3 className="font-display text-base font-black text-white uppercase">CONNECT DATA SOURCE</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="brutal-badge bg-white text-black cursor-pointer"
              >
                ESC
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-300 uppercase mb-1">Source Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Analytics Data Warehouse"
                    className="w-full brutal-box px-2.5 py-1.5 text-white bg-[#0d1117] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-300 uppercase mb-1">Engine Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as DatabaseType })}
                    className="w-full brutal-box px-2.5 py-1.5 text-white bg-[#0d1117] outline-none"
                  >
                    <option value="PostgreSQL">PostgreSQL</option>
                    <option value="Snowflake">Snowflake</option>
                    <option value="BigQuery">Google BigQuery</option>
                    <option value="MySQL">MySQL</option>
                    <option value="REST API">REST API Endpoint</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-300 uppercase mb-1">Host Endpoint</label>
                  <input
                    type="text"
                    value={formData.host}
                    onChange={(e) => setFormData({ ...formData, host: e.target.value })}
                    placeholder="db.us-east-1.rds.amazonaws.com"
                    className="w-full brutal-box px-2.5 py-1.5 text-white bg-[#0d1117] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-300 uppercase mb-1">Database Name</label>
                  <input
                    type="text"
                    required
                    value={formData.database}
                    onChange={(e) => setFormData({ ...formData, database: e.target.value })}
                    placeholder="production_dw"
                    className="w-full brutal-box px-2.5 py-1.5 text-white bg-[#0d1117] outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t-2 border-black">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="brutal-btn bg-[#21262d] text-white px-3 py-1.5"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="brutal-btn brutal-btn-yellow px-4 py-1.5 font-black"
                >
                  SAVE & TEST CONNECTION
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
