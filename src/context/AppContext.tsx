import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  NavSection, 
  Environment, 
  DataSource, 
  QueryResult, 
  SavedQuery, 
  QueryHistoryItem, 
  DbtModel, 
  ModelingTableNode, 
  ModelingRelationship, 
  DashboardWidget, 
  SlowQueryLog, 
  DebugErrorItem, 
  UserAccount, 
  PermissionMatrixItem, 
  DeploymentRecord, 
  IntegrationCard, 
  ToastMessage,
  UserRole,
  ThemeMode,
  DensityMode,
  ViewportDevice,
  AlertRule,
  CollaboratorPresence,
  QueryComment,
  GeminiAIConfig,
  VisualQueryState
} from '../types';
import { 
  INITIAL_DATA_SOURCES, 
  INITIAL_SAVED_QUERIES, 
  INITIAL_QUERY_HISTORY, 
  INITIAL_DBT_MODELS, 
  INITIAL_MODELING_TABLES, 
  INITIAL_MODELING_RELATIONSHIPS, 
  INITIAL_DASHBOARD_WIDGETS, 
  INITIAL_SLOW_QUERIES, 
  INITIAL_DEBUG_ERRORS, 
  INITIAL_USER_ACCOUNTS, 
  INITIAL_PERMISSION_MATRIX, 
  INITIAL_DEPLOYMENTS, 
  INITIAL_INTEGRATIONS,
  INITIAL_ALERT_RULES,
  INITIAL_COLLABORATORS,
  INITIAL_QUERY_COMMENTS
} from '../data/mockData';

interface AppContextType {
  // Navigation & Workspace
  currentSection: NavSection;
  setCurrentSection: (section: NavSection) => void;
  environment: Environment;
  setEnvironment: (env: Environment) => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (collapsed: boolean) => void;
  isMobileNavOpen: boolean;
  setIsMobileNavOpen: (open: boolean) => void;

  // Search & Dialogs
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  isAICopilotOpen: boolean;
  setIsAICopilotOpen: (open: boolean) => void;
  copilotInitialPrompt: string;
  setCopilotInitialPrompt: (prompt: string) => void;
  openCopilotWithPrompt: (prompt: string) => void;

  // Toasts
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;

  // UI Customization
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  density: DensityMode;
  setDensity: (density: DensityMode) => void;
  previewDevice: ViewportDevice;
  setPreviewDevice: (device: ViewportDevice) => void;

  // Data Sources
  dataSources: DataSource[];
  selectedDataSourceId: string;
  setSelectedDataSourceId: (id: string) => void;
  testConnection: (id: string) => Promise<{ success: boolean; message: string; latencyMs: number; status: 'connected' | 'failed' | 'degraded' }>;
  addDataSource: (ds: Omit<DataSource, 'id' | 'lastTested' | 'tablesCount' | 'sizeGb'>) => void;
  updateDataSource: (id: string, ds: Partial<DataSource>) => void;

  // SQL & dbt
  activeSql: string;
  setActiveSql: (sql: string) => void;
  isQueryRunning: boolean;
  activeQueryResult: QueryResult | null;
  executeQuery: (sqlText?: string) => Promise<void>;
  savedQueries: SavedQuery[];
  saveCurrentQuery: (title: string, description: string, tags: string[]) => void;
  queryHistory: QueryHistoryItem[];
  dbtModels: DbtModel[];
  selectedModel: DbtModel | null;
  setSelectedModel: (model: DbtModel | null) => void;
  runDbtModel: (id: string) => Promise<void>;

  // Data Modeling Studio
  modelingTables: ModelingTableNode[];
  modelingNodes: ModelingTableNode[];
  modelingRelationships: ModelingRelationship[];
  selectedTableNode: ModelingTableNode | null;
  setSelectedTableNode: (node: ModelingTableNode | null) => void;
  addModelingTable: (table: Omit<ModelingTableNode, 'id' | 'lastUpdated'>) => void;
  addModelingRelationship: (rel: Omit<ModelingRelationship, 'id'>) => void;

  // Dashboard Builder
  dashboardWidgets: DashboardWidget[];
  isDashboardEditMode: boolean;
  setIsDashboardEditMode: (edit: boolean) => void;
  selectedWidgetId: string | null;
  setSelectedWidgetId: (id: string | null) => void;
  addWidget: (widget: Omit<DashboardWidget, 'id'>) => void;
  addDashboardWidget: (widget: Omit<DashboardWidget, 'id'>) => void;
  updateDashboardWidget: (id: string, updates: Partial<DashboardWidget>) => void;
  deleteDashboardWidget: (id: string) => void;
  removeWidget: (id: string) => void;

  // Performance Center
  slowQueries: SlowQueryLog[];
  selectedSlowQuery: SlowQueryLog | null;
  setSelectedSlowQuery: (query: SlowQueryLog | null) => void;
  applyIndexOptimization: (queryId: string) => void;

  // Debug Center
  debugErrors: DebugErrorItem[];
  selectedError: DebugErrorItem | null;
  setSelectedError: (error: DebugErrorItem | null) => void;
  updateErrorStatus: (id: string, status: DebugErrorItem['status']) => void;

  // Access Control
  users: UserAccount[];
  userAccounts: UserAccount[];
  updateUserRole: (userId: string, newRole: UserRole) => void;
  inviteUser: (name: string, email: string, role: UserRole, teams: string[]) => void;
  permissionMatrix: PermissionMatrixItem[];
  togglePermission: (idOrResourceIdx: any, actionIdxOrRole?: any, role?: UserRole) => void;

  // Deployment Center
  deployments: DeploymentRecord[];
  activeStreamingDeployment: DeploymentRecord | null;
  triggerDeployment: (targetEnv: Environment, branch?: string, notes?: string) => Promise<void>;
  rollbackDeployment: (depId: string) => Promise<void>;
  triggerRollback: (targetVersion: string) => Promise<void>;

  // Integrations
  integrations: IntegrationCard[];
  updateIntegrationStatus: (id: string, status: IntegrationCard['status'], config?: Record<string, string>) => void;

  // 🌟 5 ADVANCED NEXT-LEVEL FEATURES:
  // 1. Google Gemini AI Config & Live Runner
  geminiConfig: GeminiAIConfig;
  setGeminiConfig: (config: GeminiAIConfig) => void;
  generateGeminiSQL: (prompt: string) => Promise<string>;

  // 2. Automated Slack / Discord Alerts & Cron Digest
  alertRules: AlertRule[];
  addAlertRule: (rule: Omit<AlertRule, 'id'>) => void;
  toggleAlertStatus: (id: string) => void;
  deleteAlertRule: (id: string) => void;
  triggerTestAlert: (id: string) => void;

  // 3. Real-Time Multi-User Collaboration & Comments
  collaborators: CollaboratorPresence[];
  queryComments: QueryComment[];
  addQueryComment: (line: number, text: string) => void;
  resolveQueryComment: (id: string) => void;

  // 4. No-Code Visual Query Builder State & Compiler
  visualQueryState: VisualQueryState;
  setVisualQueryState: React.Dispatch<React.SetStateAction<VisualQueryState>>;
  compileVisualQueryToSql: () => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentSection, setCurrentSection] = useState<NavSection>('overview');
  const [environment, setEnvironment] = useState<Environment>('production');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState<boolean>(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [isAICopilotOpen, setIsAICopilotOpen] = useState<boolean>(false);
  const [copilotInitialPrompt, setCopilotInitialPrompt] = useState<string>('');

  // UI
  const [theme, setTheme] = useState<ThemeMode>('obsidian');
  const [density, setDensity] = useState<DensityMode>('comfortable');
  const [previewDevice, setPreviewDevice] = useState<ViewportDevice>('desktop');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Data Sources
  const [dataSources, setDataSources] = useState<DataSource[]>(INITIAL_DATA_SOURCES);
  const [selectedDataSourceId, setSelectedDataSourceId] = useState<string>('ds-1');

  // SQL & dbt
  const [activeSql, setActiveSql] = useState<string>(INITIAL_SAVED_QUERIES[0].sql);
  const [isQueryRunning, setIsQueryRunning] = useState<boolean>(false);
  const [activeQueryResult, setActiveQueryResult] = useState<QueryResult | null>({
    columns: ['cohort', 'plan_tier', 'active_subscribers', 'total_mrr_usd', 'arpu_usd'],
    types: ['varchar', 'varchar', 'int8', 'numeric', 'numeric'],
    rows: [
      { cohort: '2026-Feb', plan_tier: 'Enterprise', active_subscribers: 142, total_mrr_usd: 198400.00, arpu_usd: 1397.18 },
      { cohort: '2026-Feb', plan_tier: 'Growth Pro', active_subscribers: 384, total_mrr_usd: 142000.00, arpu_usd: 369.79 },
      { cohort: '2026-Feb', plan_tier: 'Starter Team', active_subscribers: 890, total_mrr_usd: 62300.00, arpu_usd: 70.00 }
    ],
    executionTimeMs: 42,
    rowCount: 3,
    bytesScanned: '1.8 MB',
    query: INITIAL_SAVED_QUERIES[0].sql,
    timestamp: 'Just now'
  });
  const [savedQueries, setSavedQueries] = useState<SavedQuery[]>(INITIAL_SAVED_QUERIES);
  const [queryHistory, setQueryHistory] = useState<QueryHistoryItem[]>(INITIAL_QUERY_HISTORY);
  const [dbtModels, setDbtModels] = useState<DbtModel[]>(INITIAL_DBT_MODELS);
  const [selectedModel, setSelectedModel] = useState<DbtModel | null>(INITIAL_DBT_MODELS[0]);

  // Modeling Studio
  const [modelingTables, setModelingTables] = useState<ModelingTableNode[]>(INITIAL_MODELING_TABLES);
  const [modelingRelationships, setModelingRelationships] = useState<ModelingRelationship[]>(INITIAL_MODELING_RELATIONSHIPS);
  const [selectedTableNode, setSelectedTableNode] = useState<ModelingTableNode | null>(INITIAL_MODELING_TABLES[0]);

  // Dashboard Builder
  const [dashboardWidgets, setDashboardWidgets] = useState<DashboardWidget[]>(INITIAL_DASHBOARD_WIDGETS);
  const [isDashboardEditMode, setIsDashboardEditMode] = useState<boolean>(false);
  const [selectedWidgetId, setSelectedWidgetId] = useState<string | null>(null);

  // Performance Center
  const [slowQueries, setSlowQueries] = useState<SlowQueryLog[]>(INITIAL_SLOW_QUERIES);
  const [selectedSlowQuery, setSelectedSlowQuery] = useState<SlowQueryLog | null>(null);

  // Debug Center
  const [debugErrors, setDebugErrors] = useState<DebugErrorItem[]>(INITIAL_DEBUG_ERRORS);
  const [selectedError, setSelectedError] = useState<DebugErrorItem | null>(null);

  // Access Control
  const [users, setUsers] = useState<UserAccount[]>(INITIAL_USER_ACCOUNTS);
  const [permissionMatrix, setPermissionMatrix] = useState<PermissionMatrixItem[]>(INITIAL_PERMISSION_MATRIX);

  // Deployment Center
  const [deployments, setDeployments] = useState<DeploymentRecord[]>(INITIAL_DEPLOYMENTS);
  const [activeStreamingDeployment, setActiveStreamingDeployment] = useState<DeploymentRecord | null>(null);

  // Integrations
  const [integrations, setIntegrations] = useState<IntegrationCard[]>(INITIAL_INTEGRATIONS);

  // 🌟 1. Gemini AI State
  const [geminiConfig, setGeminiConfig] = useState<GeminiAIConfig>({
    apiKey: '',
    model: 'gemini-2.0-flash',
    isLiveConnected: false
  });

  // 🌟 2. Automated Alert Rules
  const [alertRules, setAlertRules] = useState<AlertRule[]>(INITIAL_ALERT_RULES);

  // 🌟 3. Real-Time Collaborators & Comments
  const [collaborators] = useState<CollaboratorPresence[]>(INITIAL_COLLABORATORS);
  const [queryComments, setQueryComments] = useState<QueryComment[]>(INITIAL_QUERY_COMMENTS);

  // 🌟 4. No-Code Visual Query Builder State
  const [visualQueryState, setVisualQueryState] = useState<VisualQueryState>({
    selectedTable: 'customers',
    selectedColumns: ['plan_tier', 'country_code', 'mrr_usd'],
    filters: [
      { id: 'f-1', column: 'created_at', operator: 'greater_than', value: '2025-01-01' }
    ],
    aggregations: [
      { id: 'a-1', column: 'mrr_usd', func: 'SUM', alias: 'total_mrr_usd' },
      { id: 'a-2', column: 'id', func: 'COUNT', alias: 'total_customers' }
    ],
    groupByColumn: 'plan_tier',
    orderByColumn: 'total_mrr_usd',
    orderDirection: 'DESC',
    limit: 25
  });

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsCommandPaletteOpen(false);
        setIsMobileNavOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = 't-' + Math.random().toString(36).substring(2, 9);
    const newToast = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      removeToast(id);
    }, toast.duration || 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const openCopilotWithPrompt = (prompt: string) => {
    setCopilotInitialPrompt(prompt);
    setIsAICopilotOpen(true);
    setIsMobileNavOpen(false);
  };

  const testConnection = async (id: string) => {
    const ds = dataSources.find((d) => d.id === id);
    if (!ds) return { success: false, message: 'Source not found', latencyMs: 0, status: 'failed' as const };

    await new Promise((r) => setTimeout(r, 600));

    if (ds.type === 'REST API') {
      const updated = dataSources.map((d) =>
        d.id === id ? { ...d, status: 'failed' as const, lastTested: 'Just now' } : d
      );
      setDataSources(updated);
      addToast({
        type: 'error',
        title: 'Connection Test Failed (HTTP 429)',
        message: 'Stripe Reporting API rate limit exceeded. Verify access token and quota.'
      });
      return { success: false, message: 'HTTP 429: Rate limit exceeded', latencyMs: 0, status: 'failed' as const };
    }

    const latency = Math.floor(Math.random() * 25) + 14;
    const updated = dataSources.map((d) =>
      d.id === id ? { ...d, status: 'connected' as const, latencyMs: latency, lastTested: 'Just now' } : d
    );
    setDataSources(updated);
    addToast({
      type: 'success',
      title: 'Connection Successful',
      message: `${ds.name} is healthy with ${latency}ms latency.`
    });
    return { success: true, message: `Successfully connected in ${latency}ms.`, latencyMs: latency, status: 'connected' as const };
  };

  const addDataSource = (ds: Omit<DataSource, 'id' | 'lastTested' | 'tablesCount' | 'sizeGb'>) => {
    const newDs: DataSource = {
      ...ds,
      id: 'ds-' + Date.now(),
      lastTested: 'Just now',
      tablesCount: 24,
      sizeGb: 12.5
    };
    setDataSources((prev) => [newDs, ...prev]);
    addToast({
      type: 'success',
      title: 'Data Source Added',
      message: `Database ${ds.name} configured successfully.`
    });
  };

  const updateDataSource = (id: string, updates: Partial<DataSource>) => {
    setDataSources((prev) => prev.map((d) => (d.id === id ? { ...d, ...updates } : d)));
  };

  const executeQuery = async (sqlText?: string) => {
    const queryToRun = sqlText || activeSql;
    setIsQueryRunning(true);
    await new Promise((r) => setTimeout(r, 500));
    setIsQueryRunning(false);

    const execTime = Math.floor(Math.random() * 50) + 18;

    const mockResult: QueryResult = {
      columns: ['metric_segment', 'plan_tier', 'records_evaluated', 'total_amount_usd', 'conversion_rate'],
      types: ['varchar', 'varchar', 'int8', 'numeric', 'numeric'],
      rows: [
        { metric_segment: 'North America Enterprise', plan_tier: 'Enterprise', records_evaluated: 4820, total_amount_usd: 394200.00, conversion_rate: 0.88 },
        { metric_segment: 'EMEA Enterprise', plan_tier: 'Enterprise', records_evaluated: 2940, total_amount_usd: 248100.00, conversion_rate: 0.84 },
        { metric_segment: 'APAC Growth', plan_tier: 'Growth Pro', records_evaluated: 7120, total_amount_usd: 184500.00, conversion_rate: 0.76 },
        { metric_segment: 'LATAM Starter', plan_tier: 'Starter Team', records_evaluated: 12400, total_amount_usd: 86900.00, conversion_rate: 0.62 }
      ],
      executionTimeMs: execTime,
      rowCount: 4,
      bytesScanned: '2.8 MB',
      query: queryToRun,
      timestamp: 'Just now'
    };

    setActiveQueryResult(mockResult);
    setQueryHistory((prev) => [
      {
        id: 'qh-' + Date.now(),
        sql: queryToRun,
        database: dataSources.find((d) => d.id === selectedDataSourceId)?.name || 'Production Primary Aurora',
        status: 'success',
        executionTimeMs: execTime,
        rowCount: 4,
        timestamp: 'Just now'
      },
      ...prev
    ]);

    addToast({
      type: 'success',
      title: 'Query Executed Successfully',
      message: `Returned 4 rows in ${execTime}ms (${mockResult.bytesScanned} scanned).`
    });
  };

  const saveCurrentQuery = (title: string, description: string, tags: string[]) => {
    const newQuery: SavedQuery = {
      id: 'q-' + Date.now(),
      title,
      sql: activeSql,
      description,
      tags,
      author: 'Arvind Sharma (Owner)',
      database: dataSources.find((d) => d.id === selectedDataSourceId)?.name || 'Production Primary Aurora',
      lastRun: 'Just now',
      avgDurationMs: 45
    };
    setSavedQueries((prev) => [newQuery, ...prev]);
    addToast({
      type: 'success',
      title: 'Query Saved to Library',
      message: `"${title}" is now available to your analytics team.`
    });
  };

  const runDbtModel = async (id: string) => {
    const model = dbtModels.find((m) => m.id === id);
    if (!model) return;

    setDbtModels((prev) =>
      prev.map((m) => (m.id === id ? { ...m, lastRunStatus: 'building' } : m))
    );

    addToast({
      type: 'info',
      title: 'dbt Compilation Started',
      message: `Building model ${model.name}...`
    });

    await new Promise((r) => setTimeout(r, 1000));

    setDbtModels((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, lastRunStatus: 'success', lastRunTime: 'Just now (1.8s)' } : m
      )
    );

    addToast({
      type: 'success',
      title: 'dbt Model Build Succeeded',
      message: `Model ${model.name} refreshed.`
    });
  };

  const addModelingTable = (table: Omit<ModelingTableNode, 'id' | 'lastUpdated'>) => {
    const newTable: ModelingTableNode = {
      ...table,
      id: 'tbl-' + Date.now(),
      lastUpdated: 'Just now'
    };
    setModelingTables((prev) => [...prev, newTable]);
    setSelectedTableNode(newTable);
  };

  const addModelingRelationship = (rel: Omit<ModelingRelationship, 'id'>) => {
    const newRel: ModelingRelationship = {
      ...rel,
      id: 'rel-' + Date.now()
    };
    setModelingRelationships((prev) => [...prev, newRel]);
  };

  const addDashboardWidget = (widget: Omit<DashboardWidget, 'id'>) => {
    const newWidget: DashboardWidget = {
      ...widget,
      id: 'w-' + Date.now()
    };
    setDashboardWidgets((prev) => [...prev, newWidget]);
    setSelectedWidgetId(newWidget.id);
  };

  const updateDashboardWidget = (id: string, updates: Partial<DashboardWidget>) => {
    setDashboardWidgets((prev) =>
      prev.map((w) => (w.id === id ? { ...w, ...updates } : w))
    );
  };

  const deleteDashboardWidget = (id: string) => {
    setDashboardWidgets((prev) => prev.filter((w) => w.id !== id));
    if (selectedWidgetId === id) setSelectedWidgetId(null);
  };

  const applyIndexOptimization = (queryId: string) => {
    setSlowQueries((prev) => prev.filter((q) => q.id !== queryId));
    if (selectedSlowQuery?.id === queryId) setSelectedSlowQuery(null);
    addToast({
      type: 'success',
      title: 'Index Applied Successfully',
      message: 'PostgreSQL index created concurrently. Expected query latency drop from 8.4s to ~38ms.'
    });
  };

  const updateErrorStatus = (id: string, status: DebugErrorItem['status']) => {
    setDebugErrors((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status } : e))
    );
  };

  const updateUserRole = (userId: string, newRole: UserRole) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
  };

  const inviteUser = (name: string, email: string, role: UserRole, teams: string[]) => {
    const newUser: UserAccount = {
      id: 'usr-' + Date.now(),
      name,
      email,
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      role,
      teams,
      lastActive: 'Invited just now',
      twoFactorEnabled: false,
      status: 'invited'
    };
    setUsers((prev) => [...prev, newUser]);
  };

  const togglePermission = (idOrResourceIdx: any, actionIdxOrRole?: any, role?: UserRole) => {
    setPermissionMatrix((prev) => {
      const cloned = JSON.parse(JSON.stringify(prev));
      if (typeof idOrResourceIdx === 'number' && typeof actionIdxOrRole === 'number' && role) {
        const currentVal = cloned[idOrResourceIdx].actions[actionIdxOrRole][role];
        cloned[idOrResourceIdx].actions[actionIdxOrRole][role] = !currentVal;
      } else if (typeof idOrResourceIdx === 'string') {
        const item = cloned.find((p: any) => p.id === idOrResourceIdx);
        if (item) {
          const targetRole = actionIdxOrRole as UserRole;
          if (item.allowedRoles?.includes(targetRole)) {
            item.allowedRoles = item.allowedRoles.filter((r: any) => r !== targetRole);
          } else {
            item.allowedRoles = [...(item.allowedRoles || []), targetRole];
          }
        }
      }
      return cloned;
    });
    addToast({
      type: 'info',
      title: 'Permission Policy Updated',
      message: 'Updated RBAC privilege grant.'
    });
  };

  const triggerDeployment = async (targetEnv: Environment, branch: string = 'main', notes?: string) => {
    const newDep: DeploymentRecord = {
      id: 'dep-' + Date.now(),
      version: `v2.8.${deployments.length + 3}-${targetEnv.slice(0, 4)}`,
      environment: targetEnv,
      status: 'in_progress',
      branch,
      commitHash: Math.random().toString(16).substring(2, 9),
      commitMessage: notes || `chore(release): automated pipeline sync from ${branch}`,
      author: 'Arvind Sharma',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      timestamp: 'Just now',
      durationSec: 0,
      logs: [
        `[${new Date().toLocaleTimeString()}] [INIT] Starting deployment pipeline for ${targetEnv}`,
        `[${new Date().toLocaleTimeString()}] [GIT] Checking out branch: ${branch}`,
        `[${new Date().toLocaleTimeString()}] [DBT] Compiling semantic models and test suites...`
      ]
    };

    setActiveStreamingDeployment(newDep);
    setDeployments((prev) => [newDep, ...prev]);

    setTimeout(() => {
      setDeployments((prev) =>
        prev.map((d) =>
          d.id === newDep.id
            ? {
                ...d,
                status: 'success',
                durationSec: 36,
                logs: [
                  ...d.logs,
                  `[${new Date().toLocaleTimeString()}] [DEPLOY] Successfully deployed version ${d.version} to ${targetEnv}. Release LIVE.`
                ]
              }
            : d
        )
      );
      setActiveStreamingDeployment(null);
    }, 2000);
  };

  const rollbackDeployment = async (depId: string) => {
    const dep = deployments.find((d) => d.id === depId);
    await triggerRollback(dep?.version || 'v2.8.3');
  };

  const triggerRollback = async (targetVersion: string) => {
    addToast({
      type: 'warning',
      title: 'Rollback Triggered',
      message: `Rolling back environment to stable release ${targetVersion}...`
    });

    await new Promise((r) => setTimeout(r, 1000));

    const rollbackDep: DeploymentRecord = {
      id: 'dep-' + Date.now(),
      version: targetVersion + '-restored',
      environment: 'production',
      status: 'success',
      branch: 'main',
      commitHash: 'rollback-99',
      commitMessage: `rollback to ${targetVersion} via DataPilot Deployment Center`,
      author: 'Arvind Sharma',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      timestamp: 'Just now',
      durationSec: 24,
      logs: [
        `[${new Date().toLocaleTimeString()}] [ROLLBACK] Reverting active production schema to ${targetVersion}`,
        `[${new Date().toLocaleTimeString()}] [SUCCESS] Environment stable.`
      ]
    };

    setDeployments((prev) => [rollbackDep, ...prev]);

    addToast({
      type: 'success',
      title: 'Rollback Complete',
      message: `Production restored to ${targetVersion}.`
    });
  };

  const updateIntegrationStatus = (id: string, status: IntegrationCard['status'], config?: Record<string, string>) => {
    setIntegrations((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status, config: config ? { ...i.config, ...config } : i.config } : i))
    );
  };

  // 🌟 1. Real Gemini AI Text-to-SQL Generator
  const generateGeminiSQL = async (prompt: string): Promise<string> => {
    if (!prompt.trim()) return '';

    // If real Gemini API key is configured
    if (geminiConfig.apiKey && geminiConfig.apiKey.startsWith('AIza')) {
      try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${geminiConfig.model}:generateContent?key=${geminiConfig.apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `You are an expert PostgreSQL & Snowflake SQL generator for DataPilot. 
Database Schemas available:
- public.customers (id, email, full_name, plan_tier, mrr_usd, country_code, created_at, last_login_at)
- public.orders (id, customer_id, status, total_amount, currency, payment_method, created_at)
- public.products (id, sku, name, category, base_price, is_active)
- public.subscriptions (id, customer_id, billing_cycle, status, current_period_start, current_period_end)

Generate only valid, clean, optimized SQL query without any Markdown formatting or backticks for this user request: "${prompt}"`
                  }
                ]
              }
            ]
          })
        });

        const data = await res.json();
        const generatedSql = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (generatedSql) {
          return generatedSql.replace(/```sql|```/gi, '').trim();
        }
      } catch (e) {
        console.warn('Gemini live API call failed, using intelligent fallback:', e);
      }
    }

    // Intelligent Built-in Fallback logic
    const lower = prompt.toLowerCase();
    if (lower.includes('churn') || lower.includes('inactive')) {
      return `-- Gemini AI Generated: High Value Inactive Churn Risk
SELECT 
  c.id,
  c.full_name,
  c.email,
  c.plan_tier,
  c.mrr_usd,
  c.last_login_at
FROM public.customers c
WHERE c.last_login_at < NOW() - INTERVAL '30 days'
  AND c.plan_tier IN ('Enterprise', 'Growth Pro')
ORDER BY c.mrr_usd DESC
LIMIT 50;`;
    }

    if (lower.includes('product') || lower.includes('category')) {
      return `-- Gemini AI Generated: Top Product Categories by Inventory & Value
SELECT 
  category,
  COUNT(1) AS active_products_count,
  ROUND(AVG(base_price), 2) AS average_unit_price,
  ROUND(SUM(base_price), 2) AS total_inventory_value
FROM public.products
WHERE is_active = TRUE
GROUP BY 1
ORDER BY total_inventory_value DESC;`;
    }

    return `-- Gemini AI Generated: Monthly Revenue & Cohort Retention
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
ORDER BY signup_month DESC, total_mrr_usd DESC;`;
  };

  // 🌟 2. Automated Alerts Handlers
  const addAlertRule = (rule: Omit<AlertRule, 'id'>) => {
    const newRule: AlertRule = {
      ...rule,
      id: 'alert-' + Date.now(),
      lastTriggered: 'Just created'
    };
    setAlertRules((prev) => [newRule, ...prev]);
    addToast({
      type: 'success',
      title: 'Alert Rule Created',
      message: `Trigger set for ${rule.metric} to ${rule.destinationTarget}.`
    });
  };

  const toggleAlertStatus = (id: string) => {
    setAlertRules((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: a.status === 'active' ? 'paused' : 'active' } : a))
    );
    addToast({ type: 'info', title: 'Alert Status Updated' });
  };

  const deleteAlertRule = (id: string) => {
    setAlertRules((prev) => prev.filter((a) => a.id !== id));
    addToast({ type: 'info', title: 'Alert Rule Deleted' });
  };

  const triggerTestAlert = (id: string) => {
    const rule = alertRules.find((a) => a.id === id);
    if (!rule) return;

    addToast({
      type: 'success',
      title: `⚡ Webhook Sent to ${rule.channel.toUpperCase()}`,
      message: `Delivered test notification payload to ${rule.destinationTarget}.`
    });
  };

  // 🌟 3. Real-Time Collaborator Comments Handlers
  const addQueryComment = (line: number, text: string) => {
    const newComment: QueryComment = {
      id: 'com-' + Date.now(),
      author: 'Arvind Sharma (You)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      line,
      text,
      timestamp: 'Just now',
      resolved: false
    };
    setQueryComments((prev) => [...prev, newComment]);
    addToast({
      type: 'success',
      title: 'Comment Added to Query',
      message: `Thread opened on Line ${line}.`
    });
  };

  const resolveQueryComment = (id: string) => {
    setQueryComments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, resolved: !c.resolved } : c))
    );
    addToast({ type: 'info', title: 'Comment Thread Status Updated' });
  };

  // 🌟 4. No-Code Visual Query Compiler
  const compileVisualQueryToSql = (): string => {
    const { selectedTable, selectedColumns, filters, aggregations, groupByColumn, orderByColumn, orderDirection, limit } = visualQueryState;

    const selectItems: string[] = [];
    if (groupByColumn) selectItems.push(groupByColumn);
    
    selectedColumns.forEach((c) => {
      if (c !== groupByColumn && !aggregations.some((a) => a.column === c)) {
        selectItems.push(c);
      }
    });

    aggregations.forEach((agg) => {
      if (agg.func === 'COUNT_DISTINCT') {
        selectItems.push(`COUNT(DISTINCT ${agg.column}) AS ${agg.alias || 'distinct_' + agg.column}`);
      } else {
        selectItems.push(`${agg.func}(${agg.column}) AS ${agg.alias || agg.func.toLowerCase() + '_' + agg.column}`);
      }
    });

    let sql = `SELECT \n  ${selectItems.join(',\n  ')}\nFROM public.${selectedTable}`;

    if (filters.length > 0) {
      const whereClauses = filters.map((f) => {
        if (f.operator === 'equals') return `${f.column} = '${f.value}'`;
        if (f.operator === 'not_equals') return `${f.column} != '${f.value}'`;
        if (f.operator === 'greater_than') return `${f.column} >= '${f.value}'`;
        if (f.operator === 'less_than') return `${f.column} <= '${f.value}'`;
        if (f.operator === 'contains') return `${f.column} ILIKE '%${f.value}%'`;
        if (f.operator === 'is_null') return `${f.column} IS NULL`;
        return `${f.column} = '${f.value}'`;
      });
      sql += `\nWHERE ${whereClauses.join(' AND ')}`;
    }

    if (groupByColumn) {
      sql += `\nGROUP BY 1`;
    }

    if (orderByColumn) {
      sql += `\nORDER BY ${orderByColumn} ${orderDirection}`;
    }

    if (limit) {
      sql += `\nLIMIT ${limit};`;
    }

    return sql;
  };

  return (
    <AppContext.Provider
      value={{
        currentSection,
        setCurrentSection,
        environment,
        setEnvironment,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        isMobileNavOpen,
        setIsMobileNavOpen,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        isAICopilotOpen,
        setIsAICopilotOpen,
        copilotInitialPrompt,
        setCopilotInitialPrompt,
        openCopilotWithPrompt,
        toasts,
        addToast,
        removeToast,
        theme,
        setTheme,
        density,
        setDensity,
        previewDevice,
        setPreviewDevice,
        dataSources,
        selectedDataSourceId,
        setSelectedDataSourceId,
        testConnection,
        addDataSource,
        updateDataSource,
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
        modelingTables,
        modelingNodes: modelingTables,
        modelingRelationships,
        selectedTableNode,
        setSelectedTableNode,
        addModelingTable,
        addModelingRelationship,
        dashboardWidgets,
        isDashboardEditMode,
        setIsDashboardEditMode,
        selectedWidgetId,
        setSelectedWidgetId,
        addWidget: addDashboardWidget,
        addDashboardWidget,
        updateDashboardWidget,
        deleteDashboardWidget,
        removeWidget: deleteDashboardWidget,
        slowQueries,
        selectedSlowQuery,
        setSelectedSlowQuery,
        applyIndexOptimization,
        debugErrors,
        selectedError,
        setSelectedError,
        updateErrorStatus,
        users,
        userAccounts: users,
        updateUserRole,
        inviteUser,
        permissionMatrix,
        togglePermission,
        deployments,
        activeStreamingDeployment,
        triggerDeployment,
        rollbackDeployment,
        triggerRollback,
        integrations,
        updateIntegrationStatus,
        geminiConfig,
        setGeminiConfig,
        generateGeminiSQL,
        alertRules,
        addAlertRule,
        toggleAlertStatus,
        deleteAlertRule,
        triggerTestAlert,
        collaborators,
        queryComments,
        addQueryComment,
        resolveQueryComment,
        visualQueryState,
        setVisualQueryState,
        compileVisualQueryToSql
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
