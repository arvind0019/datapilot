import React, { useState } from 'react';
import { 
  Boxes, 
  Download, 
  Sparkles, 
  Link as LinkIcon, 
  Key, 
  Table 
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { ModelingTableNode, TableColumn } from '../../../types';

export const DataModelingView: React.FC = () => {
  const { 
    modelingTables, 
    modelingRelationships, 
    selectedTableNode, 
    setSelectedTableNode,
    addToast,
    openCopilotWithPrompt
  } = useApp();

  const [filterQuery, setFilterQuery] = useState('');

  const filteredNodes: ModelingTableNode[] = modelingTables.filter((n: ModelingTableNode) => 
    (n.tableName || n.name).toLowerCase().includes(filterQuery.toLowerCase()) ||
    n.schema.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const handleExportSchemaYml = () => {
    const yml = `version: 2
models:
${modelingTables.map((n: ModelingTableNode) => `  - name: ${n.tableName || n.name}
    description: "${n.description}"
    columns:
${n.columns.map((c: TableColumn) => `      - name: ${c.name}
        description: "${c.isPrimary ? 'Primary key' : c.isForeign ? 'Foreign key' : 'Attribute'}"
        ${c.isPrimary ? 'tests:\n          - unique\n          - not_null' : ''}`).join('\n')}`).join('\n')}`;

    const blob = new Blob([yml], { type: 'text/yaml;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `schema.yml`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast({ type: 'success', title: 'schema.yml Exported', message: 'Ready for dbt repo commit.' });
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b-2 border-[#1c253b] pb-3">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-display text-2xl font-black tracking-tight text-white uppercase">
              Semantic Data Modeling Studio
            </h1>
            <span className="rounded bg-[#06b6d4] text-black px-1.5 py-0.5 font-mono text-[10px] font-black border border-black shadow-[2px_2px_0px_#000]">
              ERD & SEMANTICS
            </span>
          </div>
          <p className="text-xs font-mono text-slate-400 mt-1">
            // Entity relationships, dimensional metrics, and dbt schema generation.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => openCopilotWithPrompt('Analyze schema relationships and suggest missing foreign keys or normalized dimensional models.')}
            className="brutal-btn bg-[#131b2e] text-slate-200 px-3.5 py-2 text-xs font-bold font-mono"
          >
            <Sparkles className="h-4 w-4 mr-1.5 text-[#ffee00]" />
            <span>AI ERD AUDIT</span>
          </button>

          <button
            onClick={handleExportSchemaYml}
            className="brutal-btn brutal-btn-primary px-4 py-2 text-xs font-black"
          >
            <Download className="h-4 w-4 mr-1.5" />
            <span>EXPORT SCHEMA.YML</span>
          </button>
        </div>
      </div>

      {/* Main Studio Canvas & Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Canvas Area (8 cols) */}
        <div className="lg:col-span-8 brutal-panel p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#1c253b] pb-3">
            <div className="flex items-center space-x-3">
              <span className="font-mono text-xs font-bold text-white uppercase flex items-center space-x-1.5">
                <Boxes className="h-4 w-4 text-cyan-400" />
                <span>ACTIVE ERD ENTITIES ({filteredNodes.length})</span>
              </span>
              <span className="text-slate-500 font-mono text-xs">
                • {modelingRelationships.length} Foreign Relationships
              </span>
            </div>

            {/* Quick Filter */}
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Filter tables..."
              className="neu-inset-well px-3 py-1 text-xs text-white font-mono placeholder-slate-500 outline-none w-44"
            />
          </div>

          {/* Canvas Entities Grid with Dot Mesh */}
          <div className="bg-dots-mesh neu-inset-well p-6 min-h-[460px] grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredNodes.map((node: ModelingTableNode) => {
              const isSelected = selectedTableNode?.id === node.id;
              const tableName = node.tableName || node.name;
              const rows = node.rowCount || (node.name === 'customers' ? 128450 : node.name === 'orders' ? 4280192 : 11920400);

              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedTableNode(node)}
                  className={`cursor-pointer rounded-xl border-2 p-4 transition-all ${
                    isSelected
                      ? 'border-[#06b6d4] bg-[#121a2d] shadow-[5px_5px_0px_#000000] scale-[1.02]'
                      : 'border-[#2a364f] bg-[#0c101c] shadow-[3px_3px_0px_#000000] hover:border-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-[#1c253b] pb-2 mb-2">
                    <div className="flex items-center space-x-2">
                      <Table className="h-4 w-4 text-cyan-400" />
                      <span className="font-mono text-xs font-black text-white">{node.schema}.{tableName}</span>
                    </div>
                    <span className="rounded bg-[#162035] text-cyan-300 px-1.5 py-0.2 font-mono text-[9px] font-bold border border-[#2a364f]">
                      {rows.toLocaleString()} ROWS
                    </span>
                  </div>

                  <p className="text-[11px] font-mono text-slate-400 mb-3 line-clamp-1">{node.description}</p>

                  <div className="space-y-1.5">
                    {node.columns.slice(0, 4).map((col: TableColumn, idx: number) => (
                      <div key={idx} className="flex items-center justify-between text-xs font-mono">
                        <div className="flex items-center space-x-1.5 truncate">
                          {col.isPrimary ? (
                            <Key className="h-3 w-3 text-[#ffee00]" />
                          ) : col.isForeign ? (
                            <LinkIcon className="h-3 w-3 text-cyan-400" />
                          ) : (
                            <div className="h-1.5 w-1.5 rounded-full bg-slate-600" />
                          )}
                          <span className={col.isPrimary ? 'text-[#ffee00] font-bold' : col.isForeign ? 'text-cyan-300 font-bold' : 'text-slate-300'}>
                            {col.name}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500">{col.type}</span>
                      </div>
                    ))}
                    {node.columns.length > 4 && (
                      <div className="text-[10px] font-mono text-cyan-400 font-bold pt-1">
                        + {node.columns.length - 4} more columns...
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Model Inspector Sidebar (4 cols) */}
        <div className="lg:col-span-4 brutal-panel p-5 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#1c253b] pb-3 mb-4">
              <h3 className="font-display text-sm font-black text-white uppercase flex items-center space-x-2">
                <Boxes className="h-4 w-4 text-[#ffee00]" />
                <span>Entity Inspector</span>
              </h3>
              {selectedTableNode && (
                <span className="rounded bg-black px-1.5 py-0.2 font-mono text-[9px] font-bold text-cyan-400 border border-[#2a364f]">
                  SELECTED
                </span>
              )}
            </div>

            {selectedTableNode ? (
              <div className="space-y-4 text-xs font-mono">
                <div className="neu-inset-well p-3.5 space-y-2">
                  <div className="text-[10px] text-slate-500 uppercase font-bold">TABLE DETAILS</div>
                  <div className="text-sm font-black text-white">{selectedTableNode.schema}.{selectedTableNode.tableName || selectedTableNode.name}</div>
                  <p className="text-slate-300 text-xs font-sans leading-relaxed">{selectedTableNode.description}</p>
                  <div className="flex items-center space-x-2 pt-2 border-t border-[#1c253b] text-[11px] text-slate-400">
                    <span>Rows: <strong className="text-white">{(selectedTableNode.rowCount || 128450).toLocaleString()}</strong></span>
                    <span>•</span>
                    <span>Columns: <strong className="text-white">{selectedTableNode.columns.length}</strong></span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">// COLUMNS & CONSTRAINTS</div>
                  <div className="neu-inset-well p-3 space-y-1.5 max-h-56 overflow-y-auto">
                    {selectedTableNode.columns.map((c: TableColumn, i: number) => (
                      <div key={i} className="flex items-center justify-between text-[11px] py-0.5 border-b border-[#151e33] last:border-0">
                        <span className={c.isPrimary ? 'text-[#ffee00] font-bold' : c.isForeign ? 'text-cyan-300 font-bold' : 'text-slate-300'}>
                          {c.name}
                        </span>
                        <div className="flex items-center space-x-1.5">
                          <span className="text-slate-500 text-[10px]">{c.type}</span>
                          {c.isPrimary && <span className="bg-[#ffee00] text-black px-1 rounded text-[8px] font-black">PK</span>}
                          {c.isForeign && <span className="bg-cyan-400 text-black px-1 rounded text-[8px] font-black">FK</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">// JOIN RELATIONSHIPS</div>
                  <div className="neu-inset-well p-3 space-y-1.5">
                    {modelingRelationships
                      .filter(r => r.fromTable === (selectedTableNode.tableName || selectedTableNode.name) || r.toTable === (selectedTableNode.tableName || selectedTableNode.name))
                      .map((r) => (
                        <div key={r.id} className="text-[11px] text-slate-300 flex items-center justify-between">
                          <span>{r.fromTable}.{r.fromColumn} → {r.toTable}.{r.toColumn}</span>
                          <span className="rounded bg-[#1a253f] px-1 py-0.2 text-[9px] font-bold text-cyan-300 border border-[#2a364f]">
                            {r.cardinality || r.type}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="neu-inset-well p-8 text-center font-mono text-xs text-slate-500">
                Click any table entity on the canvas to inspect fields, keys, and metrics.
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-[#1c253b]">
            <button
              onClick={() => openCopilotWithPrompt(`Generate dbt metrics specification YAML for ${selectedTableNode?.tableName || selectedTableNode?.name || 'customers'}`)}
              className="w-full brutal-btn bg-[#131b2e] text-slate-200 py-2 text-xs font-mono font-bold"
            >
              <Sparkles className="h-3.5 w-3.5 mr-1.5 text-[#ffee00]" />
              <span>GENERATE DBT METRICS</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
