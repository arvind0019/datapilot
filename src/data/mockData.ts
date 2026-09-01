// Append to mockData.ts
import { 
  DataSource, 
  DbtModel, 
  DashboardWidget, 
  SlowQueryLog, 
  DebugErrorItem, 
  UserAccount, 
  PermissionMatrixItem, 
  DeploymentRecord, 
  IntegrationCard, 
  ApiEndpointDoc, 
  SavedQuery, 
  QueryHistoryItem,
  ModelingTableNode,
  ModelingRelationship,
  SchemaTable,
  AlertRule,
  CollaboratorPresence,
  QueryComment,
  GeminiAIConfig
} from '../types';

export const INITIAL_DATA_SOURCES: DataSource[] = [
  {
    id: 'ds-1',
    name: 'Production Primary Aurora',
    type: 'PostgreSQL',
    host: 'db-prod-cluster.c7z9x.us-east-1.rds.amazonaws.com',
    port: 5432,
    database: 'analytics_production',
    username: 'datapilot_read_replica',
    status: 'connected',
    latencyMs: 18,
    environment: 'production',
    lastTested: '2 minutes ago',
    tablesCount: 84,
    sizeGb: 342.6,
    ssl: true,
    poolSize: 25,
  },
  {
    id: 'ds-2',
    name: 'Snowflake Enterprise Lakehouse',
    type: 'Snowflake',
    host: 'xy94812.us-east-2.aws.snowflakecomputing.com',
    port: 443,
    database: 'CORE_DATA_MART',
    username: 'ANALYTICS_SERVICE_USER',
    status: 'connected',
    latencyMs: 42,
    environment: 'production',
    lastTested: '14 minutes ago',
    tablesCount: 142,
    sizeGb: 1850.0,
    ssl: true,
    poolSize: 10,
  },
  {
    id: 'ds-3',
    name: 'Google BigQuery Clickstream',
    type: 'BigQuery',
    host: 'bigquery.googleapis.com',
    port: 443,
    database: 'prj-telemetry-dw-prod.user_events',
    username: 'sa-datapilot-reader@prj-telemetry.iam.gserviceaccount.com',
    status: 'connected',
    latencyMs: 56,
    environment: 'production',
    lastTested: '1 hour ago',
    tablesCount: 38,
    sizeGb: 9420.0,
    ssl: true,
    poolSize: 15,
  },
  {
    id: 'ds-4',
    name: 'Neon Serverless Postgres',
    type: 'PostgreSQL',
    host: 'ep-cool-fog-8921.us-east-2.aws.neon.tech',
    port: 5432,
    database: 'neondb_analytics',
    username: 'neondb_owner',
    status: 'connected',
    latencyMs: 24,
    environment: 'production',
    lastTested: '3 minutes ago',
    tablesCount: 28,
    sizeGb: 48.2,
    ssl: true,
    poolSize: 20,
  },
  {
    id: 'ds-5',
    name: 'Staging MySQL RDS Cluster',
    type: 'MySQL',
    host: 'mysql-staging-read.us-east-1.rds.amazonaws.com',
    port: 3306,
    database: 'app_staging_core',
    username: 'staging_analyst',
    status: 'degraded',
    latencyMs: 145,
    environment: 'staging',
    lastTested: '5 minutes ago',
    tablesCount: 62,
    sizeGb: 88.4,
    ssl: true,
    poolSize: 10,
  },
  {
    id: 'ds-6',
    name: 'Local Embedded SQLite',
    type: 'SQLite',
    host: 'localhost',
    port: 0,
    database: 'local_cache_store.db',
    username: 'local_dev',
    status: 'connected',
    latencyMs: 1,
    environment: 'development',
    lastTested: 'Just now',
    tablesCount: 12,
    sizeGb: 0.4,
    ssl: false,
    poolSize: 5,
  },
  {
    id: 'ds-7',
    name: 'Stripe & Billing Ingest API',
    type: 'REST API',
    host: 'api.stripe.com/v1/reporting',
    port: 443,
    database: 'stripe_sync_feed',
    username: 'rk_live_893x...',
    status: 'failed',
    latencyMs: 0,
    environment: 'production',
    lastTested: '12 minutes ago',
    tablesCount: 8,
    sizeGb: 14.8,
    ssl: true,
    poolSize: 5,
  }
];

export const MOCK_SCHEMA_TABLES: Record<string, SchemaTable[]> = {
  'ds-1': [
    {
      name: 'customers',
      schema: 'public',
      rowCount: 128450,
      description: 'Core registered customer profiles and subscription tier data',
      columns: [
        { name: 'id', type: 'uuid', isPrimary: true, nullable: false },
        { name: 'email', type: 'varchar(255)', nullable: false },
        { name: 'full_name', type: 'varchar(128)', nullable: true },
        { name: 'plan_tier', type: 'varchar(32)', nullable: false },
        { name: 'mrr_usd', type: 'numeric(12,2)', nullable: false },
        { name: 'country_code', type: 'varchar(2)', nullable: true },
        { name: 'created_at', type: 'timestamptz', nullable: false },
        { name: 'last_login_at', type: 'timestamptz', nullable: true }
      ]
    },
    {
      name: 'orders',
      schema: 'public',
      rowCount: 4280192,
      description: 'Transaction ledger for invoice checkouts and recurring charges',
      columns: [
        { name: 'id', type: 'uuid', isPrimary: true, nullable: false },
        { name: 'customer_id', type: 'uuid', isForeign: true, foreignTable: 'customers', foreignColumn: 'id' },
        { name: 'status', type: 'varchar(32)', nullable: false },
        { name: 'total_amount', type: 'numeric(10,2)', nullable: false },
        { name: 'currency', type: 'varchar(3)', nullable: false },
        { name: 'payment_method', type: 'varchar(50)', nullable: true },
        { name: 'created_at', type: 'timestamptz', nullable: false }
      ]
    },
    {
      name: 'products',
      schema: 'public',
      rowCount: 3820,
      description: 'Product catalog with SKU identifiers, unit prices, and inventory stocks',
      columns: [
        { name: 'id', type: 'uuid', isPrimary: true, nullable: false },
        { name: 'sku', type: 'varchar(64)', nullable: false },
        { name: 'name', type: 'varchar(255)', nullable: false },
        { name: 'category', type: 'varchar(64)', nullable: false },
        { name: 'base_price', type: 'numeric(10,2)', nullable: false },
        { name: 'is_active', type: 'boolean', nullable: false }
      ]
    },
    {
      name: 'subscriptions',
      schema: 'public',
      rowCount: 98400,
      description: 'Active recurring billing contracts, renewal dates, and churn flags',
      columns: [
        { name: 'id', type: 'uuid', isPrimary: true, nullable: false },
        { name: 'customer_id', type: 'uuid', isForeign: true, foreignTable: 'customers', foreignColumn: 'id' },
        { name: 'billing_cycle', type: 'varchar(16)', nullable: false },
        { name: 'status', type: 'varchar(32)', nullable: false },
        { name: 'current_period_start', type: 'timestamptz', nullable: false },
        { name: 'current_period_end', type: 'timestamptz', nullable: false },
        { name: 'churn_reason', type: 'text', nullable: true }
      ]
    }
  ]
};

export const INITIAL_SAVED_QUERIES: SavedQuery[] = [
  {
    id: 'q-1',
    title: 'Monthly Recurring Revenue (MRR) by Cohort',
    sql: `-- Monthly MRR Breakdown with Active Customers & Growth Rate
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
ORDER BY signup_month DESC, total_mrr_usd DESC;`,
    description: 'Calculates active subscriber counts, MRR, and ARPU partitioned by acquisition month and pricing tier.',
    tags: ['Finance', 'MRR', 'Cohorts'],
    author: 'Elena Rostova (Lead Analyst)',
    database: 'Production Primary Aurora',
    lastRun: '10 minutes ago',
    avgDurationMs: 42
  },
  {
    id: 'q-2',
    title: 'High-Value Customer Churn Risk Scoring',
    sql: `-- Identify Top 50 Enterprise Accounts with zero logins in 30 days
SELECT 
  c.id,
  c.full_name,
  c.email,
  c.plan_tier,
  c.mrr_usd,
  c.last_login_at,
  s.status AS subscription_status,
  s.current_period_end
FROM public.customers c
JOIN public.subscriptions s ON c.id = s.customer_id
WHERE c.plan_tier = 'Enterprise'
  AND c.last_login_at < NOW() - INTERVAL '30 days'
  AND s.status = 'active'
ORDER BY c.mrr_usd DESC
LIMIT 50;`,
    description: 'Surfaces accounts contributing high MRR who have not logged into the workspace for 30+ days.',
    tags: ['CustomerSuccess', 'Churn', 'Enterprise'],
    author: 'Marcus Vance (DBA)',
    database: 'Production Primary Aurora',
    lastRun: '1 hour ago',
    avgDurationMs: 65
  }
];

export const INITIAL_QUERY_HISTORY: QueryHistoryItem[] = [
  {
    id: 'qh-1',
    sql: 'SELECT plan_tier, COUNT(1) FROM customers GROUP BY 1;',
    database: 'Production Primary Aurora',
    status: 'success',
    executionTimeMs: 18,
    rowCount: 3,
    timestamp: '2 mins ago'
  },
  {
    id: 'qh-2',
    sql: 'EXPLAIN ANALYZE SELECT * FROM orders WHERE total_amount > 1000;',
    database: 'Production Primary Aurora',
    status: 'success',
    executionTimeMs: 42,
    rowCount: 1420,
    timestamp: '14 mins ago'
  }
];

export const INITIAL_DBT_MODELS: DbtModel[] = [
  {
    id: 'model-1',
    name: 'dim_customers',
    materialization: 'table',
    schema: 'analytics_marts',
    description: 'Dimensional table storing unified customer attributes, lifetime revenue, and tier history.',
    tags: ['core', 'daily', 'dimension'],
    upstream: ['stg_stripe_customers', 'stg_auth_users'],
    downstream: ['mart_finance_mrr', 'fct_orders_daily'],
    tests: [
      { name: 'unique_customer_id', status: 'pass' },
      { name: 'not_null_customer_email', status: 'pass' }
    ],
    lastRunStatus: 'success',
    lastRunTime: '18 minutes ago',
    compiledSql: `WITH raw_customers AS (
  SELECT * FROM {{ ref('stg_stripe_customers') }}
)
SELECT 
  id AS customer_id,
  email,
  plan_tier,
  mrr_usd,
  created_at
FROM raw_customers;`
  },
  {
    id: 'model-2',
    name: 'mart_finance_mrr',
    materialization: 'incremental',
    schema: 'analytics_marts',
    description: 'Aggregated Monthly Recurring Revenue metrics by subscription tier and geography.',
    tags: ['finance', 'executive', 'hourly'],
    upstream: ['dim_customers', 'fct_subscriptions'],
    downstream: ['executive_revenue_dashboard'],
    tests: [
      { name: 'not_null_cohort_month', status: 'pass' },
      { name: 'positive_mrr_total', status: 'pass' }
    ],
    lastRunStatus: 'success',
    lastRunTime: '22 minutes ago',
    compiledSql: `SELECT 
  DATE_TRUNC('month', created_at) AS mrr_month,
  plan_tier,
  SUM(mrr_usd) AS total_mrr
FROM {{ ref('dim_customers') }}
GROUP BY 1, 2;`
  }
];

export const INITIAL_MODELING_TABLES: ModelingTableNode[] = [
  {
    id: 'node-cust',
    name: 'customers',
    tableName: 'customers',
    schema: 'public',
    x: 80,
    y: 80,
    rowCount: 128450,
    columns: [
      { name: 'id', type: 'uuid', isPrimary: true },
      { name: 'email', type: 'varchar(255)' },
      { name: 'plan_tier', type: 'varchar(32)' },
      { name: 'mrr_usd', type: 'numeric(12,2)' }
    ],
    dimensionsCount: 8,
    measuresCount: 4,
    description: 'Core registered customer profiles and subscription tier data',
    owner: 'Elena Rostova',
    lastUpdated: 'Today, 10:20'
  },
  {
    id: 'node-ord',
    name: 'orders',
    tableName: 'orders',
    schema: 'public',
    x: 420,
    y: 80,
    rowCount: 4280192,
    columns: [
      { name: 'id', type: 'uuid', isPrimary: true },
      { name: 'customer_id', type: 'uuid', isForeign: true, foreignTable: 'customers', foreignColumn: 'id' },
      { name: 'total_amount', type: 'numeric(10,2)' },
      { name: 'status', type: 'varchar(32)' }
    ],
    dimensionsCount: 6,
    measuresCount: 5,
    description: 'Transaction ledger for invoice checkouts and recurring charges',
    owner: 'Marcus Vance',
    lastUpdated: 'Today, 09:15'
  }
];

export const INITIAL_MODELING_RELATIONSHIPS: ModelingRelationship[] = [
  {
    id: 'rel-1',
    fromTable: 'customers',
    fromColumn: 'id',
    toTable: 'orders',
    toColumn: 'customer_id',
    type: 'one-to-many',
    cardinality: '1:N'
  }
];

export const INITIAL_DASHBOARD_WIDGETS: DashboardWidget[] = [
  {
    id: 'w-1',
    title: 'Monthly Recurring Revenue (MRR)',
    type: 'kpi',
    metric: '$402,700',
    value: '$402.7K',
    change: '+14.8% vs last month',
    timeRange: 'Trailing 30 Days'
  },
  {
    id: 'w-2',
    title: 'Annual Run-Rate (ARR)',
    type: 'kpi',
    metric: '$4,832,400',
    value: '$4.83M',
    change: '+22.4% YoY Growth',
    timeRange: 'Current Fiscal Q1'
  },
  {
    id: 'w-3',
    title: 'Active Paying Subscribers',
    type: 'kpi',
    metric: '1,416',
    value: '1,416',
    change: '+86 net new this month',
    timeRange: 'Live Real-Time'
  },
  {
    id: 'w-4',
    title: 'MRR Growth Trend (Last 12 Months)',
    type: 'area',
    metric: 'MRR USD',
    timeRange: '2025-Feb to 2026-Feb'
  },
  {
    id: 'w-5',
    title: 'Revenue Distribution by Plan Tier',
    type: 'donut',
    metric: 'Plan Split',
    timeRange: 'Enterprise 49% • Growth 35% • Starter 16%'
  }
];

export const INITIAL_SLOW_QUERIES: SlowQueryLog[] = [
  {
    id: 'sq-1',
    query: `SELECT c.id, c.email, SUM(o.total_amount) AS ltv
FROM public.customers c
JOIN public.orders o ON c.id = o.customer_id
WHERE o.created_at >= '2025-01-01'
GROUP BY 1, 2
ORDER BY ltv DESC;`,
    executionTimeMs: 8420,
    durationSec: 8.42,
    database: 'Production Primary Aurora',
    rowsScanned: 4280192,
    rowsReturned: 320,
    frequency: '120 / hr',
    rootCause: 'Sequential Table Scan on unindexed orders(customer_id, created_at)',
    bottleneck: 'Sequential Scan',
    recommendedIndexSql: `CREATE INDEX CONCURRENTLY idx_orders_cust_date_amt 
ON public.orders (customer_id, created_at) 
INCLUDE (total_amount);`,
    indexRecommendation: {
      ddl: `CREATE INDEX CONCURRENTLY idx_orders_cust_date_amt 
ON public.orders (customer_id, created_at) 
INCLUDE (total_amount);`,
      targetTable: 'public.orders',
      estimatedSpeedup: '99.5% latency reduction (8.4s -> 38ms)'
    },
    executionPlan: [
      { operation: 'Seq Scan on orders', cost: 18420.0, durationMs: 7800, details: 'Scanned 4.28M rows sequentially' },
      { operation: 'Hash Join (orders.customer_id = customers.id)', cost: 2480.0, durationMs: 420, details: 'Memory hash table overflow' }
    ]
  },
  {
    id: 'sq-2',
    query: `SELECT user_id, COUNT(1) FROM user_events WHERE occurred_at >= NOW() - INTERVAL '7 days' GROUP BY 1;`,
    executionTimeMs: 4190,
    durationSec: 4.19,
    database: 'Google BigQuery Clickstream',
    rowsScanned: 28490120,
    rowsReturned: 840,
    frequency: '45 / hr',
    rootCause: 'Full partition scan across 28M clickstream records',
    recommendedIndexSql: `ALTER TABLE public.user_events CLUSTER BY (user_id);`,
    indexRecommendation: {
      ddl: `ALTER TABLE public.user_events CLUSTER BY (user_id);`,
      targetTable: 'public.user_events',
      estimatedSpeedup: '92% latency reduction (4.1s -> 180ms)'
    },
    executionPlan: [
      { operation: 'BigQuery Partition Scan', cost: 9800.0, durationMs: 3800, details: 'Full telemetry scan' }
    ]
  }
];

export const INITIAL_DEBUG_ERRORS: DebugErrorItem[] = [
  {
    id: 'err-1',
    code: 'ERR_DB_DEADLOCK_DETECTED',
    message: 'PostgreSQL Process 29402 and Process 29408 deadlocked while locking relation "subscriptions".',
    severity: 'critical',
    source: 'Database',
    timestamp: '8 mins ago',
    status: 'open',
    queryOrPayload: 'UPDATE public.subscriptions SET status = \'renewed\' WHERE customer_id = $1;',
    environment: 'production',
    aiExplanation: {
      rootCause: 'Concurrent billing webhook worker and nightly renewal cron locked subscriptions in reverse key order.',
      plainEnglish: 'Two background jobs tried to update the exact same subscription record at the exact millisecond in opposite order, causing a database deadlock lockup.',
      resolutionSteps: [
        'Enforce consistent ORDER BY id locking in transaction blocks.',
        'Implement retry wrapper with randomized exponential backoff (100ms..800ms).',
        'Lower statement_timeout to 4000ms to fail-fast.'
      ]
    },
    stackTrace: `ERROR: deadlock detected
DETAIL: Process 29402 waits for ExclusiveLock on tuple (48,12) of relation "subscriptions"; blocked by process 29408.
Process 29408 waits for ShareLock on transaction 89201; blocked by process 29402.
HINT: See server log for query details.
CONTEXT: while updating tuple in relation "subscriptions"`
  },
  {
    id: 'err-2',
    code: 'ERR_API_RATE_LIMIT_429',
    message: 'Stripe Reporting API burst rate limit exceeded: HTTP 429 Too Many Requests.',
    severity: 'warning',
    source: 'REST API',
    timestamp: '24 mins ago',
    status: 'open',
    queryOrPayload: 'GET https://api.stripe.com/v1/reporting/report_runs',
    environment: 'production',
    aiExplanation: {
      rootCause: 'Hourly sync worker spawned 12 parallel threads instead of sequential batching.',
      plainEnglish: 'The sync script sent over 100 requests per second to Stripe, exceeding Stripe\'s API burst limit quota.',
      resolutionSteps: [
        'Cap worker concurrency to maximum 4 threads.',
        'Respect HTTP Retry-After header.',
        'Enable local Redis cache for reporting summaries.'
      ]
    },
    stackTrace: `HTTP/2 429 Too Many Requests
date: Mon, 01 Sep 2026 03:36:12 GMT
content-type: application/json
stripe-error-type: rate_limit_error
message: "Too many requests hit the API too quickly."`
  }
];

export const INITIAL_USER_ACCOUNTS: UserAccount[] = [
  {
    id: 'usr-1',
    name: 'Arvind Sharma',
    email: 'arvind@company.com',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    role: 'Owner',
    teams: ['Core Leadership', 'Engineering'],
    lastActive: 'Active now',
    twoFactorEnabled: true,
    status: 'active'
  },
  {
    id: 'usr-2',
    name: 'Elena Rostova',
    email: 'elena@company.com',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    role: 'Admin',
    teams: ['Data Analytics', 'BI'],
    lastActive: '12 mins ago',
    twoFactorEnabled: true,
    status: 'active'
  },
  {
    id: 'usr-3',
    name: 'Marcus Vance',
    email: 'marcus@company.com',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    role: 'Developer',
    teams: ['Data Engineering', 'DevOps'],
    lastActive: '1 hour ago',
    twoFactorEnabled: true,
    status: 'active'
  }
];

export const INITIAL_PERMISSION_MATRIX: PermissionMatrixItem[] = [
  {
    id: 'perm-1',
    resource: 'Data Sources (Read & Write)',
    allowedRoles: ['Owner', 'Admin', 'Developer'],
    actions: [
      { name: 'Full Connection Management', Owner: true, Admin: true, Developer: true, Analyst: false, Viewer: false }
    ]
  },
  {
    id: 'perm-2',
    resource: 'Production SQL Query Execution',
    allowedRoles: ['Owner', 'Admin', 'Developer', 'Analyst'],
    actions: [
      { name: 'Ad-Hoc Query Running', Owner: true, Admin: true, Developer: true, Analyst: true, Viewer: false }
    ]
  },
  {
    id: 'perm-3',
    resource: 'dbt Schema & CI/CD Deployment',
    allowedRoles: ['Owner', 'Admin', 'Developer'],
    actions: [
      { name: 'Trigger Production Releases', Owner: true, Admin: true, Developer: true, Analyst: false, Viewer: false }
    ]
  },
  {
    id: 'perm-4',
    resource: 'BI Dashboard Creation & Sharing',
    allowedRoles: ['Owner', 'Admin', 'Developer', 'Analyst', 'Viewer'],
    actions: [
      { name: 'View & Edit Analytics Cards', Owner: true, Admin: true, Developer: true, Analyst: true, Viewer: true }
    ]
  }
];

export const INITIAL_DEPLOYMENTS: DeploymentRecord[] = [
  {
    id: 'dep-1',
    version: 'v2.8.4-prod',
    environment: 'production',
    status: 'success',
    branch: 'main',
    commitHash: '8f9214a',
    commitMessage: 'feat(marts): add customer retention cohort metrics and dbt schema assertions',
    author: 'Elena Rostova',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    timestamp: '45 mins ago',
    durationSec: 38,
    logs: [
      '[10:02:14] [INIT] Connecting to Production Primary Aurora mesh...',
      '[10:02:18] [DBT] Compiling 14 semantic models with 100% test assertions passed.',
      '[10:02:42] [DEPLOY] Version v2.8.4 deployed successfully. Release is LIVE.'
    ]
  }
];

export const INITIAL_INTEGRATIONS: IntegrationCard[] = [
  {
    id: 'int-slack',
    name: 'Slack Alerts & Digest',
    category: 'Alerts',
    description: 'Post daily revenue charts, anomaly alerts, and query performance notifications to Slack channels.',
    icon: 'slack',
    status: 'connected',
    lastSync: '4 mins ago',
    webhookUrl: 'https://hooks.slack.com/services/T00/B00/X94821',
    eventsCount: 1420,
    config: { channel: '#data-alerts' }
  },
  {
    id: 'int-discord',
    name: 'Discord Webhook Bot',
    category: 'Alerts',
    description: 'Broadcast database latency alerts and incident updates to developer Discord channels.',
    icon: 'discord',
    status: 'connected',
    lastSync: '12 mins ago',
    webhookUrl: 'https://discord.com/api/webhooks/984/X94',
    eventsCount: 380,
    config: { channel: '#dev-alerts' }
  },
  {
    id: 'int-github',
    name: 'GitHub CI/CD Sync',
    category: 'CI/CD',
    description: 'Bi-directional repository sync for SQL files, dbt models, and pull request lineage checks.',
    icon: 'github',
    status: 'connected',
    lastSync: '18 minutes ago',
    eventsCount: 384,
    config: { repository: 'arvind0019/datapilot' }
  }
];

export const INTEGRATION_CARDS = INITIAL_INTEGRATIONS;

export const API_ENDPOINTS_DOC: ApiEndpointDoc[] = [
  {
    method: 'GET',
    path: '/v1/datasources',
    summary: 'List All Connected Data Sources',
    description: 'Returns health status, active connection latency, table count, and configuration metadata for all configured databases.',
    snippet: {
      curl: `curl -X GET "https://api.datapilot.io/v1/datasources" \\\n  -H "Authorization: Bearer dp_live_94f8a8123bc789e0214a6"`,
      python: `import requests\n\nres = requests.get(\n    "https://api.datapilot.io/v1/datasources",\n    headers={"Authorization": "Bearer dp_live_94f8a8123bc789e0214a6"}\n)\nprint(res.json())`,
      node: `const res = await fetch("https://api.datapilot.io/v1/datasources", {\n  headers: { Authorization: "Bearer dp_live_94f8a8123bc789e0214a6" }\n});\nconsole.log(await res.json());`
    },
    response: {
      status: 'success',
      data: [
        {
          id: 'ds-1',
          name: 'Production Primary Aurora',
          type: 'PostgreSQL',
          status: 'connected',
          latency_ms: 18
        }
      ]
    }
  },
  {
    method: 'POST',
    path: '/v1/queries/execute',
    summary: 'Execute Ad-Hoc SQL Query',
    description: 'Executes a parameterized SQL query against any connected data source and returns tabular results with execution metrics.',
    snippet: {
      curl: `curl -X POST "https://api.datapilot.io/v1/queries/execute" \\\n  -H "Authorization: Bearer dp_live_94f8a8123bc789e0214a6" \\\n  -H "Content-Type: application/json" \\\n  -d '{"datasource_id": "ds-1", "sql": "SELECT plan_tier, SUM(mrr_usd) FROM customers GROUP BY 1;"}'`,
      python: `import requests\n\nres = requests.post(\n    "https://api.datapilot.io/v1/queries/execute",\n    headers={"Authorization": "Bearer dp_live_94f8a8123bc789e0214a6"},\n    json={"datasource_id": "ds-1", "sql": "SELECT plan_tier, SUM(mrr_usd) FROM customers GROUP BY 1;"}\n)\nprint(res.json())`,
      node: `const res = await fetch("https://api.datapilot.io/v1/queries/execute", {\n  method: "POST",\n  headers: { "Content-Type": "application/json", Authorization: "Bearer dp_live_94f8a8123bc789e0214a6" },\n  body: JSON.stringify({ datasource_id: "ds-1", sql: "SELECT plan_tier, SUM(mrr_usd) FROM customers GROUP BY 1;" })\n});\nconsole.log(await res.json());`
    },
    response: {
      execution_time_ms: 42,
      row_count: 4,
      bytes_scanned: '2.4 MB',
      columns: ['plan_tier', 'sum'],
      rows: [
        { plan_tier: 'Enterprise', sum: 218400.00 },
        { plan_tier: 'Growth Pro', sum: 194200.00 }
      ]
    }
  }
];

export const WORKSPACE_ACTIVITY_LOGS = [
  { id: 'act-1', user: 'Elena Rostova', action: 'deployed version v2.8.4 to Production', time: '45 mins ago', type: 'deploy' },
  { id: 'act-2', user: 'DataPilot Copilot', action: 'detected 3 slow queries and generated index recommendations', time: '1 hour ago', type: 'ai' },
  { id: 'act-3', user: 'Marcus Vance', action: 'executed query "Monthly MRR Breakdown" on Aurora Postgres', time: '2 hours ago', type: 'query' },
  { id: 'act-4', user: 'Sarah Chen', action: 'created dashboard widget "Annual ARR & Growth Velocity"', time: '3 hours ago', type: 'dashboard' }
];

export const AI_PROACTIVE_INSIGHTS = [
  {
    id: 'ai-ins-1',
    severity: 'warning',
    title: '3 Slow Queries Detected in Production',
    description: 'Query `orders` aggregation scans 4.28M rows sequentially for 320 output rows. Creating composite index `idx_orders_cust_date_amt` will reduce latency from 8.4s to 42ms.',
    actionLabel: 'Analyze & Apply Index',
    targetSection: 'performance' as const
  },
  {
    id: 'ai-ins-2',
    severity: 'critical',
    title: '2 Dashboard / Sync Errors Require Attention',
    description: 'Stripe webhook reporting API encountered HTTP 429 rate limiting, and 1 deadlock was intercepted on subscription renewals.',
    actionLabel: 'Open Debug Center',
    targetSection: 'debug' as const
  },
  {
    id: 'ai-ins-3',
    severity: 'info',
    title: 'Staging MySQL Replica Latency Degraded (145ms)',
    description: 'Read replica replication lag increased by 80ms due to heavy background backfill. Consider scaling staging memory pool.',
    actionLabel: 'Inspect Connection',
    targetSection: 'sources' as const
  }
];

// ============================================================================
// 🌟 NEW INITIAL DATASETS FOR 5 MAJOR ADVANCED CAPABILITIES
// ============================================================================

// 1. Initial Automated Alert Rules
export const INITIAL_ALERT_RULES: AlertRule[] = [
  {
    id: 'alert-1',
    title: 'Daily Morning Executive Revenue Digest',
    metric: 'daily_mrr_digest',
    condition: 'scheduled_cron',
    thresholdValue: '09:00 UTC',
    channel: 'slack',
    destinationTarget: '#finance-executive-feed',
    schedule: 'daily_9am',
    status: 'active',
    lastTriggered: 'Today at 09:00 UTC',
    lastPayloadSummary: '📊 MRR: $402.7K (+14.8%) | Active Subscribers: 1,416 (+86)'
  },
  {
    id: 'alert-2',
    title: 'Postgres P95 Latency Spike Anomaly (>500ms)',
    metric: 'query_latency',
    condition: 'greater_than',
    thresholdValue: '500ms',
    channel: 'slack',
    destinationTarget: '#data-incidents-alerts',
    schedule: 'realtime',
    status: 'active',
    lastTriggered: '34 mins ago',
    lastPayloadSummary: '⚠️ Aurora Postgres P95 latency spiked to 8,420ms (unindexed query #sq-1)'
  },
  {
    id: 'alert-3',
    title: 'Stripe Rate-Limit & Webhook Failure Trigger',
    metric: 'error_spike',
    condition: 'equals',
    thresholdValue: 'HTTP 429',
    channel: 'discord',
    destinationTarget: '#dev-sync-alerts',
    schedule: 'realtime',
    status: 'active',
    lastTriggered: '12 mins ago',
    lastPayloadSummary: '🛑 Stripe Ingestion Worker received HTTP 429 Too Many Requests'
  }
];

// 2. Initial Real-Time Collaborator Presence (Google Docs Style)
export const INITIAL_COLLABORATORS: CollaboratorPresence[] = [
  {
    id: 'collab-1',
    name: 'Marcus Vance',
    email: 'marcus@company.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    color: '#ffee00',
    activeLine: 4,
    isTyping: true,
    status: 'editing',
    lastAction: 'Editing CTE monthly_cohorts filters'
  },
  {
    id: 'collab-2',
    name: 'Sarah Chen',
    email: 'sarah@company.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    color: '#00f0ff',
    activeLine: 8,
    isTyping: false,
    status: 'online',
    lastAction: 'Reviewing query aggregation metrics'
  }
];

// 3. Initial Query Comments
export const INITIAL_QUERY_COMMENTS: QueryComment[] = [
  {
    id: 'com-1',
    author: 'Marcus Vance',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    line: 4,
    text: 'Let\'s make sure we add `WHERE created_at >= NOW() - INTERVAL \'12 months\'` to keep the buffer cache warm.',
    timestamp: '15 mins ago',
    resolved: false
  },
  {
    id: 'com-2',
    author: 'Sarah Chen',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    line: 8,
    text: 'Great query! This is now connected to the executive financial dashboard.',
    timestamp: '1 hour ago',
    resolved: true
  }
];
