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
  ViewportDevice
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
  INITIAL_INTEGRATIONS 
} from '../data/mockData';

interface AppContextType {
  // Navigation & Workspace
  currentSection: NavSection;
  setCurrentSection: (section: NavSection) => void;
  environment: Environment;
  setEnvironment: (env: Environment) => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (collapsed: boolean) => void;

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
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentSection, setCurrentSection] = useState<NavSection>('overview');
  const [environment, setEnvironment] = useState<Environment>('production');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
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

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsCommandPaletteOpen(false);
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

  return (
    <AppContext.Provider
      value={{
        currentSection,
        setCurrentSection,
        environment,
        setEnvironment,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
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
        updateIntegrationStatus
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
