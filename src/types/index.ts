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
}

export interface ModelingRelationship {
  id: string;
  fromTable: string;
  fromColumn: string;
  toTable: string;
  toColumn: string;
  type?: 'one-to-one' | 'one-to-many' | 'many-to-many';
  cardinality?: '1:1' | '1:N' | 'N:M';
}

export type WidgetType = 'area' | 'bar' | 'donut' | 'kpi' | 'funnel' | 'table';

export interface DashboardWidget {
  id: string;
  title: string;
  type: WidgetType;
  metric: string;
  value?: string;
  change?: string;
  timeRange?: string;
  sqlQuery?: string;
  chartData?: any;
  colSpan?: 1 | 2 | 3 | 4;
  width?: 'full' | 'half' | 'third';
  dataSourceId?: string;
  data?: any;
  dimension?: string;
  refreshIntervalSec?: number;
}

export interface SlowQueryLog {
  id: string;
  query: string;
  executionTimeMs: number;
  durationSec?: number;
  database: string;
  rowsScanned: number;
  rowsReturned: number;
  frequency: number | string;
  impactScore?: number;
  rootCause?: string;
  bottleneck?: string;
  possibleCause?: string;
  recommendedIndexSql?: string;
  indexRecommendation?: {
    ddl: string;
    targetTable: string;
    estimatedSpeedup: string;
  };
  executionPlan?: { operation: string; cost: number; durationMs: number; details: string }[];
  queryPlan?: { nodeType: string; cost: number; timeMs: number; detail: string }[];
}

export type ErrorSeverity = 'critical' | 'warning' | 'info';
export type ErrorSource = 'Database' | 'SQL Query' | 'REST API' | 'Deployments' | 'Access Control';
export type ErrorStatus = 'open' | 'investigating' | 'resolved';

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
  provider?: 'email' | 'google' | 'github' | 'supabase';
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

// 1. Automated Slack / Discord / Email Alert Rule
export interface AlertRule {
  id: string;
  title: string;
  metric: 'query_latency' | 'error_spike' | 'daily_mrr_digest' | 'replication_lag' | 'db_cpu_usage';
  condition: 'greater_than' | 'equals' | 'anomaly_spike' | 'scheduled_cron';
  thresholdValue: string;
  channel: 'slack' | 'discord' | 'email' | 'webhook';
  destinationTarget: string;
  schedule: 'realtime' | 'daily_9am' | 'hourly' | 'weekly_monday';
  status: 'active' | 'paused';
  lastTriggered?: string;
  lastPayloadSummary?: string;
}

// 2. No-Code Visual Query Builder
export interface VisualFilter {
  id: string;
  column: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'is_null';
  value: string;
}

export interface VisualAggregation {
  id: string;
  column: string;
  func: 'SUM' | 'COUNT' | 'AVG' | 'MIN' | 'MAX' | 'COUNT_DISTINCT';
  alias: string;
}

export interface VisualQueryState {
  selectedTable: string;
  selectedColumns: string[];
  filters: VisualFilter[];
  aggregations: VisualAggregation[];
  groupByColumn: string;
  orderByColumn: string;
  orderDirection: 'ASC' | 'DESC';
  limit: number;
}

// 3. Real-Time Multi-User Collaborator Presence
export interface CollaboratorPresence {
  id: string;
  name: string;
  email: string;
  avatar: string;
  color: string;
  activeLine: number;
  isTyping: boolean;
  status: 'online' | 'editing' | 'idle';
  lastAction: string;
}

export interface QueryComment {
  id: string;
  author: string;
  avatar: string;
  line: number;
  text: string;
  timestamp: string;
  resolved: boolean;
}

// 4. Gemini AI Live Configuration
export interface GeminiAIConfig {
  apiKey: string;
  model: 'gemini-2.0-flash' | 'gemini-1.5-pro' | 'gemini-1.5-flash';
  customInstructions?: string;
  isLiveConnected: boolean;
}

// 5. Supabase / Firebase Auth Session Types
export interface SupabaseAuthConfig {
  url: string;
  anonKey: string;
  isConfigured: boolean;
}

export interface AuthSession {
  user: UserAccount | null;
  isAuthenticated: boolean;
  token?: string;
}
