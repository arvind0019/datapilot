export type NavSection = 
  | 'overview' 
  | 'sources' 
  | 'sql' 
  | 'modeling' 
  | 'dashboards' 
  | 'performance' 
  | 'debug' 
  | 'access' 
  | 'deployments' 
  | 'integrations' 
  | 'settings';

export type Environment = 'production' | 'staging' | 'development';

export type ConnectionStatus = 'connected' | 'syncing' | 'degraded' | 'failed' | 'untested';
export type DatabaseType = 'PostgreSQL' | 'MySQL' | 'BigQuery' | 'Snowflake' | 'Redshift' | 'SQLite' | 'REST API';

export type ThemeMode = 'obsidian' | 'cyber' | 'midnight' | 'contrast' | 'high-contrast';
export type DensityMode = 'compact' | 'comfortable';
export type ViewportDevice = 'desktop' | 'laptop' | 'tablet' | 'mobile';

export interface DataSource {
  id: string;
  name: string;
  type: DatabaseType;
  host: string;
  port: number;
  database: string;
  username: string;
  status: ConnectionStatus;
  latencyMs: number;
  environment: Environment;
  lastTested: string;
  tablesCount: number;
  sizeGb: number;
  ssl: boolean;
  poolSize: number;
}

export interface TableColumn {
  name: string;
  type: string;
  isPrimary?: boolean;
  isForeign?: boolean;
  nullable?: boolean;
  foreignTable?: string;
  foreignColumn?: string;
}

export interface SchemaTable {
  name: string;
  schema: string;
  rowCount: number;
  columns: TableColumn[];
  description?: string;
}

export interface QueryResult {
  columns: string[];
  types: string[];
  rows: Record<string, any>[];
  executionTimeMs: number;
  rowCount: number;
  bytesScanned: string;
  query: string;
  timestamp: string;
}

export interface SavedQuery {
  id: string;
  title: string;
  sql: string;
  description: string;
  tags: string[];
  author: string;
  database: string;
  lastRun: string;
  avgDurationMs: number;
}

export interface QueryHistoryItem {
  id: string;
  sql: string;
  database: string;
  status: 'success' | 'error' | 'running';
  executionTimeMs: number;
  rowCount: number;
  timestamp: string;
  errorMessage?: string;
}

export interface DbtModel {
  id: string;
  name: string;
  materialization: 'table' | 'view' | 'incremental' | 'ephemeral';
  schema: string;
  description: string;
  tags: string[];
  upstream: string[];
  downstream: string[];
  tests: { name: string; status: 'pass' | 'fail' | 'warn' }[];
  lastRunStatus: 'success' | 'failed' | 'building';
  lastRunTime: string;
  compiledSql: string;
}

export interface ModelingTableNode {
  id: string;
  name: string;
  tableName?: string;
  schema: string;
  x: number;
  y: number;
  rowCount?: number;
  columns: TableColumn[];
  dimensionsCount: number;
  measuresCount: number;
  description: string;
  owner: string;
  lastUpdated: string;
  dbtSource?: string;
}

export interface ModelingRelationship {
  id: string;
  fromTable: string;
  fromColumn: string;
  toTable: string;
  toColumn: string;
  type: '1:1' | '1:N' | 'N:M';
  cardinality?: '1:1' | '1:N' | 'N:M';
}

export type WidgetType = 'bar' | 'line' | 'area' | 'donut' | 'kpi' | 'table' | 'funnel' | 'heatmap';

export interface DashboardWidget {
  id: string;
  title: string;
  type: WidgetType;
  metric: string;
  dimension?: string;
  dateRange?: string;
  granularity?: 'hourly' | 'daily' | 'weekly' | 'monthly';
  gridSpan?: { cols: number; rows: number };
  colorScheme?: string;
  data: any[];
  width?: 'half' | 'full';
  dataSourceId?: string;
  refreshIntervalSec?: number;
  kpiValue?: string;
  kpiDelta?: string;
  kpiDeltaPositive?: boolean;
}

export interface SlowQueryLog {
  id: string;
  query: string;
  database: string;
  executionTimeMs: number;
  durationSec?: number;
  rowsScanned: number;
  rowsReturned: number;
  frequency: number | string;
  timestamp: string;
  bottleneck: string;
  rootCause?: string;
  possibleCause?: string;
  optimizationSuggestion?: string;
  recommendedIndexSql?: string;
  indexRecommendation?: {
    ddl: string;
    targetTable: string;
    estimatedSpeedup: string;
  };
  optimizedSql?: string;
  executionPlan?: {
    operation: string;
    details: string;
    cost: number | string;
    durationMs: number;
  }[];
  queryPlan?: {
    nodeType: string;
    cost: number;
    rows: number;
    timeMs: number;
    detail: string;
  }[];
}

export type ErrorSeverity = 'critical' | 'warning' | 'info';
export type ErrorSource = 'SQL' | 'Database' | 'Dashboard' | 'API' | 'Deployments' | 'Permissions';
export type ErrorStatus = 'open' | 'investigating' | 'resolved' | 'ignored';

export interface DebugErrorItem {
  id: string;
  code: string;
  message: string;
  severity: ErrorSeverity;
  source: ErrorSource;
  timestamp: string;
  status: ErrorStatus;
  queryOrPayload: string;
  environment: Environment;
  possibleCause?: string;
  suggestedFix?: string;
  aiExplanation: any;
  stepsToResolve?: string[];
  stackTrace: string;
}

export type UserRole = 'Owner' | 'Admin' | 'Developer' | 'Analyst' | 'Viewer';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  avatarUrl?: string;
  role: UserRole;
  teams: string[];
  lastActive: string;
  twoFactorEnabled: boolean;
  status: 'active' | 'invited' | 'suspended';
}

export interface PermissionMatrixItem {
  id?: string;
  resource: string;
  allowedRoles?: UserRole[];
  actions: {
    name: string;
    Owner: boolean;
    Admin: boolean;
    Developer: boolean;
    Analyst: boolean;
    Viewer: boolean;
  }[];
}

export interface DeploymentRecord {
  id: string;
  version: string;
  environment: Environment;
  status: 'success' | 'in_progress' | 'failed' | 'rolled_back';
  branch: string;
  commitHash: string;
  commitMessage: string;
  author: string;
  authorAvatar: string;
  timestamp: string;
  durationSec: number;
  logs: string[];
}

export interface IntegrationCard {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: string;
  status: 'connected' | 'available' | 'action_required';
  lastSync?: string;
  webhookUrl?: string;
  eventsCount?: number;
  config: Record<string, string>;
}

export interface ApiEndpointDoc {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  title?: string;
  summary?: string;
  description?: string;
  params?: { name: string; type: string; required: boolean; description: string }[];
  requestBodyExample?: string;
  snippet?: { curl: string; python: string; node: string };
  response?: any;
  responseExample?: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}
