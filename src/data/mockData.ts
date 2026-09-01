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
  SchemaTable
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
    username: 'bq-sa-datapilot@iam.gserviceaccount.com',
    status: 'connected',
    latencyMs: 31,
    environment: 'production',
    lastTested: '1 hour ago',
    tablesCount: 56,
    sizeGb: 4890.2,
    ssl: true,
    poolSize: 40,
  },
  {
    id: 'ds-4',
    name: 'MySQL Staging Replica',
    type: 'MySQL',
    host: 'mysql-staging-read.internal.datapilot.io',
    port: 3306,
    database: 'app_stage_snapshot',
    username: 'dev_analyst',
    status: 'degraded',
    latencyMs: 145,
    environment: 'staging',
    lastTested: '5 minutes ago',
    tablesCount: 68,
    sizeGb: 88.4,
    ssl: true,
    poolSize: 15,
  },
  {
    id: 'ds-5',
    name: 'Amazon Redshift Finance Mart',
    type: 'Redshift',
    host: 'redshift-fin.c38.us-west-2.redshift.amazonaws.com',
    port: 5439,
    database: 'fin_rev_mrr',
    username: 'fin_etl_readonly',
    status: 'connected',
    latencyMs: 58,
    environment: 'production',
    lastTested: '3 hours ago',
    tablesCount: 39,
    sizeGb: 612.0,
    ssl: true,
    poolSize: 12,
  },
  {
    id: 'ds-6',
    name: 'Dev SQLite Local Cache',
    type: 'SQLite',
    host: '/var/data/sqlite/sandbox_fixtures.db',
    port: 0,
    database: 'sandbox_fixtures',
    username: 'local_dev',
    status: 'connected',
    latencyMs: 2,
    environment: 'development',
    lastTested: 'Just now',
    tablesCount: 16,
    sizeGb: 1.4,
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
      name: 'order_items',
      schema: 'public',
      rowCount: 11920400,
      description: 'Line item breakdown for individual product SKUs in each order',
      columns: [
        { name: 'id', type: 'bigint', isPrimary: true, nullable: false },
        { name: 'order_id', type: 'uuid', isForeign: true, foreignTable: 'orders', foreignColumn: 'id' },
        { name: 'product_id', type: 'uuid', isForeign: true, foreignTable: 'products', foreignColumn: 'id' },
        { name: 'quantity', type: 'integer', nullable: false },
        { name: 'unit_price', type: 'numeric(10,2)', nullable: false },
        { name: 'discount_amount', type: 'numeric(10,2)', nullable: false }
      ]
    },
    {
      name: 'products',
      schema: 'public',
      rowCount: 1420,
      description: 'Product catalog, feature tiers, and pricing options',
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
    },
    {
      name: 'user_events',
      schema: 'public',
      rowCount: 28490120,
      description: 'High-volume user interaction clickstream and telemetry logs',
      columns: [
        { name: 'event_id', type: 'bigint', isPrimary: true, nullable: false },
        { name: 'customer_id', type: 'uuid', isForeign: true, foreignTable: 'customers', foreignColumn: 'id' },
        { name: 'event_name', type: 'varchar(128)', nullable: false },
        { name: 'device_type', type: 'varchar(32)', nullable: true },
        { name: 'ip_address', type: 'inet', nullable: true },
        { name: 'occurred_at', type: 'timestamptz', nullable: false }
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
    avgDurationMs: 84
  },
  {
    id: 'q-2',
    title: 'Top 10 High-Value Enterprise Customers with Churn Risk',
    sql: `-- High-Value Accounts with Decreasing 30-Day Activity
SELECT 
  c.id AS customer_id,
  c.full_name,
  c.email,
  c.plan_tier,
  c.mrr_usd,
  COUNT(o.id) AS total_orders_l30d,
  COALESCE(SUM(o.total_amount), 0) AS total_spend_l30d,
  MAX(c.last_login_at) AS last_seen
FROM public.customers c
LEFT JOIN public.orders o 
  ON c.id = o.customer_id 
  AND o.created_at >= NOW() - INTERVAL '30 days'
WHERE c.plan_tier = 'Enterprise'
GROUP BY c.id, c.full_name, c.email, c.plan_tier, c.mrr_usd
ORDER BY c.mrr_usd DESC
LIMIT 10;`,
    description: 'Audits executive customer accounts on Enterprise tier for recent purchase frequency and engagement.',
    tags: ['Sales', 'Customer Success', 'Churn'],
    author: 'Marcus Vance (Data Engineer)',
    database: 'Production Primary Aurora',
    lastRun: '2 hours ago',
    avgDurationMs: 142
  }
];

export const INITIAL_QUERY_HISTORY: QueryHistoryItem[] = [
  {
    id: 'qh-1',
    sql: 'SELECT plan_tier, SUM(mrr_usd) FROM customers GROUP BY 1;',
    database: 'Production Primary Aurora',
    status: 'success',
    executionTimeMs: 42,
    rowCount: 4,
    timestamp: 'Just now'
  }
];

export const INITIAL_DBT_MODELS: DbtModel[] = [
  {
    id: 'm-1',
    name: 'stg_stripe_customers',
    materialization: 'view',
    schema: 'staging',
    description: 'Cleaned and deduplicated customer ingest from raw Stripe webhooks',
    tags: ['staging', 'finance', 'hourly'],
    upstream: ['raw_stripe.customers'],
    downstream: ['dim_customers', 'fct_mrr_movements'],
    tests: [
      { name: 'unique_customer_id', status: 'pass' },
      { name: 'not_null_email', status: 'pass' }
    ],
    lastRunStatus: 'success',
    lastRunTime: '24 mins ago (1.4s)',
    compiledSql: `WITH source AS (
  SELECT * FROM {{ source('raw_stripe', 'customers') }}
),
renamed AS (
  SELECT
    id AS customer_id,
    TRIM(LOWER(email)) AS email,
    metadata->>'plan' AS plan_tier,
    (balance / 100.0)::numeric(12,2) AS account_balance_usd,
    created AS created_at
  FROM source
  WHERE deleted IS NOT TRUE
)
SELECT * FROM renamed;`
  },
  {
    id: 'm-2',
    name: 'stg_orders',
    materialization: 'view',
    schema: 'staging',
    description: 'Raw transactional orders formatted with standard timestamps and ISO currencies',
    tags: ['staging', 'orders'],
    upstream: ['raw_postgres.orders'],
    downstream: ['fct_orders', 'mart_executive_kpis'],
    tests: [
      { name: 'unique_order_id', status: 'pass' },
      { name: 'positive_amount', status: 'pass' }
    ],
    lastRunStatus: 'success',
    lastRunTime: '24 mins ago (2.1s)',
    compiledSql: `SELECT
  id AS order_id,
  customer_id,
  status,
  total_amount,
  UPPER(currency) AS currency,
  created_at
FROM {{ source('raw_postgres', 'orders') }};`
  },
  {
    id: 'm-3',
    name: 'fct_orders',
    materialization: 'incremental',
    schema: 'marts',
    description: 'Core fact table for verified orders with discount allocations and margin',
    tags: ['marts', 'core', 'daily'],
    upstream: ['stg_orders', 'stg_order_items', 'dim_products'],
    downstream: ['mart_executive_kpis', 'mart_finance_mrr'],
    tests: [
      { name: 'unique_order_key', status: 'pass' },
      { name: 'valid_customer_fk', status: 'pass' },
      { name: 'amount_match_items', status: 'warn' }
    ],
    lastRunStatus: 'success',
    lastRunTime: '23 mins ago (8.9s)',
    compiledSql: `SELECT
  o.order_id,
  o.customer_id,
  o.status,
  o.total_amount,
  COUNT(oi.id) AS item_count,
  SUM(oi.quantity * p.base_price) AS catalog_value,
  o.created_at
FROM {{ ref('stg_orders') }} o
JOIN {{ ref('stg_order_items') }} oi ON o.order_id = oi.order_id
JOIN {{ ref('dim_products') }} p ON oi.product_id = p.product_id
GROUP BY 1, 2, 3, 4, 7;`
  },
  {
    id: 'm-4',
    name: 'dim_customers',
    materialization: 'table',
    schema: 'marts',
    description: 'Enriched customer dimensional table with LTV, retention score, and tier',
    tags: ['marts', 'core'],
    upstream: ['stg_stripe_customers', 'fct_orders'],
    downstream: ['mart_finance_mrr', 'mart_churn_prediction'],
    tests: [
      { name: 'unique_customer_id', status: 'pass' },
      { name: 'valid_email_format', status: 'pass' }
    ],
    lastRunStatus: 'success',
    lastRunTime: '22 mins ago (4.3s)',
    compiledSql: `SELECT 
  c.customer_id,
  c.email,
  c.plan_tier,
  COUNT(o.order_id) AS lifetime_orders,
  COALESCE(SUM(o.total_amount), 0) AS lifetime_value_usd,
  c.created_at
FROM {{ ref('stg_stripe_customers') }} c
LEFT JOIN {{ ref('fct_orders') }} o ON c.customer_id = o.customer_id
GROUP BY 1, 2, 3, 6;`
  },
  {
    id: 'm-5',
    name: 'mart_finance_mrr',
    materialization: 'table',
    schema: 'marts_finance',
    description: 'Executive revenue model calculating Net New MRR, Expansion, and Churn',
    tags: ['finance', 'executive', 'critical'],
    upstream: ['dim_customers', 'fct_orders'],
    downstream: ['dashboard_finance_overview'],
    tests: [
      { name: 'mrr_positive_assertion', status: 'pass' },
      { name: 'reconciliation_with_stripe', status: 'pass' }
    ],
    lastRunStatus: 'success',
    lastRunTime: '20 mins ago (5.6s)',
    compiledSql: `SELECT
  DATE_TRUNC('month', o.created_at) AS reporting_month,
  c.plan_tier,
  SUM(o.total_amount) AS billed_mrr_usd,
  COUNT(DISTINCT c.customer_id) AS active_subscribers
FROM {{ ref('fct_orders') }} o
JOIN {{ ref('dim_customers') }} c ON o.customer_id = c.customer_id
GROUP BY 1, 2;`
  }
];

export const INITIAL_MODELING_TABLES: ModelingTableNode[] = [
  {
    id: 'tbl-customers',
    name: 'customers',
    tableName: 'customers',
    schema: 'public',
    x: 40,
    y: 60,
    rowCount: 128450,
    dimensionsCount: 6,
    measuresCount: 2,
    description: 'Registered accounts, authentication details, and current subscription plan',
    owner: 'Elena Rostova',
    lastUpdated: '1 hour ago',
    dbtSource: 'stg_stripe_customers',
    columns: [
      { name: 'id', type: 'uuid', isPrimary: true },
      { name: 'email', type: 'varchar(255)' },
      { name: 'full_name', type: 'varchar(128)' },
      { name: 'plan_tier', type: 'varchar(32)' },
      { name: 'mrr_usd', type: 'numeric(12,2)' },
      { name: 'created_at', type: 'timestamptz' }
    ]
  },
  {
    id: 'tbl-orders',
    name: 'orders',
    tableName: 'orders',
    schema: 'public',
    x: 380,
    y: 40,
    rowCount: 4280192,
    dimensionsCount: 4,
    measuresCount: 3,
    description: 'Transactional purchase orders with payment gateway statuses',
    owner: 'Marcus Vance',
    lastUpdated: '2 hours ago',
    dbtSource: 'fct_orders',
    columns: [
      { name: 'id', type: 'uuid', isPrimary: true },
      { name: 'customer_id', type: 'uuid', isForeign: true, foreignTable: 'customers', foreignColumn: 'id' },
      { name: 'status', type: 'varchar(32)' },
      { name: 'total_amount', type: 'numeric(10,2)' },
      { name: 'currency', type: 'varchar(3)' },
      { name: 'created_at', type: 'timestamptz' }
    ]
  },
  {
    id: 'tbl-order-items',
    name: 'order_items',
    tableName: 'order_items',
    schema: 'public',
    x: 720,
    y: 80,
    rowCount: 11920400,
    dimensionsCount: 2,
    measuresCount: 4,
    description: 'Granular invoice line item breakdowns and applied coupon discounts',
    owner: 'Marcus Vance',
    lastUpdated: '3 hours ago',
    dbtSource: 'stg_order_items',
    columns: [
      { name: 'id', type: 'bigint', isPrimary: true },
      { name: 'order_id', type: 'uuid', isForeign: true, foreignTable: 'orders', foreignColumn: 'id' },
      { name: 'product_id', type: 'uuid', isForeign: true, foreignTable: 'products', foreignColumn: 'id' },
      { name: 'quantity', type: 'integer' },
      { name: 'unit_price', type: 'numeric(10,2)' },
      { name: 'discount_amount', type: 'numeric(10,2)' }
    ]
  },
  {
    id: 'tbl-products',
    name: 'products',
    tableName: 'products',
    schema: 'public',
    x: 720,
    y: 380,
    rowCount: 1420,
    dimensionsCount: 4,
    measuresCount: 1,
    description: 'SKU catalog definitions, software licenses, and add-on modules',
    owner: 'Sarah Chen',
    lastUpdated: '1 day ago',
    dbtSource: 'dim_products',
    columns: [
      { name: 'id', type: 'uuid', isPrimary: true },
      { name: 'sku', type: 'varchar(64)' },
      { name: 'name', type: 'varchar(255)' },
      { name: 'category', type: 'varchar(64)' },
      { name: 'base_price', type: 'numeric(10,2)' }
    ]
  },
  {
    id: 'tbl-subscriptions',
    name: 'subscriptions',
    tableName: 'subscriptions',
    schema: 'public',
    x: 40,
    y: 400,
    rowCount: 98400,
    dimensionsCount: 5,
    measuresCount: 2,
    description: 'Active recurring contracts, billing intervals, and cancellation telemetry',
    owner: 'Elena Rostova',
    lastUpdated: '4 hours ago',
    dbtSource: 'dim_subscriptions',
    columns: [
      { name: 'id', type: 'uuid', isPrimary: true },
      { name: 'customer_id', type: 'uuid', isForeign: true, foreignTable: 'customers', foreignColumn: 'id' },
      { name: 'billing_cycle', type: 'varchar(16)' },
      { name: 'status', type: 'varchar(32)' },
      { name: 'renewal_date', type: 'timestamptz' }
    ]
  }
];

export const INITIAL_MODELING_RELATIONSHIPS: ModelingRelationship[] = [
  {
    id: 'rel-1',
    fromTable: 'customers',
    fromColumn: 'id',
    toTable: 'orders',
    toColumn: 'customer_id',
    type: '1:N',
    cardinality: '1:N'
  },
  {
    id: 'rel-2',
    fromTable: 'orders',
    fromColumn: 'id',
    toTable: 'order_items',
    toColumn: 'order_id',
    type: '1:N',
    cardinality: '1:N'
  },
  {
    id: 'rel-3',
    fromTable: 'products',
    fromColumn: 'id',
    toTable: 'order_items',
    toColumn: 'product_id',
    type: '1:N',
    cardinality: '1:N'
  },
  {
    id: 'rel-4',
    fromTable: 'customers',
    fromColumn: 'id',
    toTable: 'subscriptions',
    toColumn: 'customer_id',
    type: '1:N',
    cardinality: '1:N'
  }
];

export const INITIAL_DASHBOARD_WIDGETS: DashboardWidget[] = [
  {
    id: 'w-kpi-mrr',
    title: 'Monthly Recurring Revenue (MRR)',
    type: 'kpi',
    metric: 'MRR (USD)',
    width: 'half',
    dimension: 'All Segments',
    dateRange: 'Current Month',
    granularity: 'monthly',
    gridSpan: { cols: 3, rows: 1 },
    colorScheme: 'cyan',
    kpiValue: '$482,910',
    kpiDelta: '+14.2% vs last month',
    kpiDeltaPositive: true,
    data: [
      { label: 'Oct', value: 380000 },
      { label: 'Nov', value: 412000 },
      { label: 'Dec', value: 435000 },
      { label: 'Jan', value: 461000 },
      { label: 'Feb', value: 482910 }
    ]
  },
  {
    id: 'w-chart-rev-trend',
    title: 'Annual ARR & Revenue Growth Velocity',
    type: 'area',
    width: 'full',
    metric: 'revenue',
    dimension: 'month',
    data: [
      { label: 'Mar', value: 28000 },
      { label: 'Apr', value: 31000 },
      { label: 'May', value: 34000 },
      { label: 'Jun', value: 37000 },
      { label: 'Jul', value: 40000 },
      { label: 'Aug', value: 43000 },
      { label: 'Sep', value: 46000 },
      { label: 'Oct', value: 49000 }
    ]
  },
  {
    id: 'w-chart-tier-dist',
    title: 'Customer Distribution by Plan Tier',
    type: 'donut',
    width: 'half',
    metric: 'accounts',
    data: [
      { name: 'Enterprise', value: 480 },
      { name: 'Growth Pro', value: 1420 },
      { name: 'Starter Team', value: 3840 }
    ]
  },
  {
    id: 'w-chart-query-traffic',
    title: 'Hourly Query Traffic vs Execution Latency',
    type: 'bar',
    width: 'half',
    metric: 'queries',
    data: [
      { label: '00:00', value: 1200 },
      { label: '04:00', value: 840 },
      { label: '08:00', value: 4800 },
      { label: '12:00', value: 9200 },
      { label: '16:00', value: 8100 },
      { label: '20:00', value: 3400 }
    ]
  },
  {
    id: 'w-chart-funnel',
    title: 'User Activation Funnel',
    type: 'funnel',
    width: 'full',
    metric: 'users',
    data: [
      { stage: 'Connected Data Source', count: 10000, rate: 100 },
      { stage: 'Executed First SQL Query', count: 8400, rate: 84 },
      { stage: 'Created dbt Model / Studio ERD', count: 6200, rate: 62 },
      { stage: 'Published Live Dashboard', count: 4900, rate: 49 }
    ]
  }
];

export const INITIAL_SLOW_QUERIES: SlowQueryLog[] = [
  {
    id: 'sq-1',
    query: `SELECT c.id, c.email, COUNT(o.id) as order_count, SUM(o.total_amount) as total_spent
FROM public.customers c
LEFT JOIN public.orders o ON c.id = o.customer_id
WHERE o.created_at >= '2026-01-01'
GROUP BY c.id, c.email
HAVING SUM(o.total_amount) > 5000
ORDER BY total_spent DESC;`,
    database: 'Production Primary Aurora (PostgreSQL)',
    executionTimeMs: 8420,
    durationSec: 8.42,
    rowsScanned: 4280192,
    rowsReturned: 320,
    frequency: '184 / hour',
    timestamp: '14 minutes ago',
    bottleneck: 'Sequential Table Scan on orders (4.28M rows) due to unindexed foreign key & date predicate',
    rootCause: 'Sequential Table Scan on orders (4.28M rows) without composite index',
    possibleCause: 'Missing composite index on orders(customer_id, created_at).',
    optimizationSuggestion: 'Create a composite index on (customer_id, created_at) with INCLUDE (total_amount).',
    recommendedIndexSql: `CREATE INDEX CONCURRENTLY idx_orders_cust_date_amt 
ON public.orders (customer_id, created_at) 
INCLUDE (total_amount);`,
    indexRecommendation: {
      ddl: `CREATE INDEX CONCURRENTLY idx_orders_cust_date_amt \nON public.orders (customer_id, created_at) \nINCLUDE (total_amount);`,
      targetTable: 'public.orders',
      estimatedSpeedup: '99.5% (8.4s → 38ms)'
    },
    optimizedSql: `SELECT c.id, c.email, COUNT(o.id) as order_count, SUM(o.total_amount) as total_spent FROM public.customers c;`,
    executionPlan: [
      { operation: 'Sort Node', cost: 184200, durationMs: 410, details: 'Sort Key: sum(o.total_amount) DESC (Memory: 38kB)' },
      { operation: 'HashAggregate', cost: 168000, durationMs: 980, details: 'Group Key: c.id, c.email (Buckets: 8192)' },
      { operation: 'Seq Scan on orders (Bottleneck)', cost: 118400, durationMs: 5120, details: 'Filtered 4,280,192 heap rows' }
    ]
  },
  {
    id: 'sq-2',
    query: `SELECT date_trunc('hour', occurred_at) as event_hour, event_name, COUNT(*) as volume
FROM public.user_events
WHERE occurred_at >= NOW() - INTERVAL '7 days'
GROUP BY 1, 2
ORDER BY 1 DESC;`,
    database: 'Google BigQuery Clickstream',
    executionTimeMs: 4910,
    durationSec: 4.91,
    rowsScanned: 28490120,
    rowsReturned: 168,
    frequency: '312 / hour',
    timestamp: '42 minutes ago',
    bottleneck: 'Full Partition Scan without day partition clustering pruning',
    rootCause: 'Full unpruned BigQuery partition scan',
    indexRecommendation: {
      ddl: `ALTER TABLE \`prj-telemetry-dw-prod.user_events\`\nSET OPTIONS (partition_expiration_days = 90);`,
      targetTable: 'public.user_events',
      estimatedSpeedup: '85% (4.9s → 740ms)'
    },
    executionPlan: [
      { operation: 'Stage 2: Re-partitioning Hash', cost: 74000, durationMs: 890, details: 'Shuffle exchange over network' },
      { operation: 'Stage 1: Scan user_events', cost: 62000, durationMs: 3800, details: 'Scanned 4.89 GB unclustered parquet slots' }
    ]
  }
];

export const INITIAL_DEBUG_ERRORS: DebugErrorItem[] = [
  {
    id: 'err-101',
    code: 'ERR_DB_DEADLOCK_DETECTED',
    message: 'deadlock detected: Process 48194 waits for ExclusiveLock on transaction 891244; Process 48201 waits for ShareLock on transaction 891238.',
    severity: 'critical',
    source: 'Database',
    timestamp: '12 minutes ago',
    status: 'open',
    environment: 'production',
    queryOrPayload: 'UPDATE public.subscriptions SET status = \'renewed\' WHERE customer_id = \'719a82e1\';',
    aiExplanation: {
      rootCause: 'Concurrent reverse locking between billing worker and checkout process.',
      plainEnglish: 'Two database connections tried to update the same customer and subscription records at the exact same moment in reverse order. PostgreSQL killed one process to prevent a permanent freeze.',
      resolutionSteps: [
        'Inspect background job queue in billing worker.',
        'Wrap operations in SELECT ... FOR UPDATE with explicit sorting.',
        'Enable 3-attempt exponential backoff retry for deadlock code 40P01.'
      ]
    },
    stackTrace: `PostgreSQL Server Error: 40P01: deadlock detected
  at Connection.parseE (pg-protocol/src/parser.ts:369:11)
  at SubscriptionRenewalJob.execute (src/jobs/renewals.ts:94:12)`
  },
  {
    id: 'err-102',
    code: 'ERR_API_RATE_LIMIT_EXCEEDED',
    message: 'HTTP 429: Too Many Requests from Stripe Reporting API endpoint /v1/reporting/report_runs. Rate limit bucket exhausted (100 req/sec).',
    severity: 'warning',
    source: 'API',
    timestamp: '1 hour ago',
    status: 'investigating',
    environment: 'production',
    queryOrPayload: 'POST https://api.stripe.com/v1/reporting/report_runs',
    aiExplanation: {
      rootCause: 'Batch ingest exceeded burst quota limit of 100 req/sec.',
      plainEnglish: 'Stripe rejected sync requests because our backfill worker sent too many requests at once. The sync entered backoff.',
      resolutionSteps: [
        'Throttle batch chunk concurrency from 100 to 25.',
        'Handle Retry-After header with automatic sleep.'
      ]
    },
    stackTrace: `AxiosError: Request failed with status code 429
  at StripeIngestionClient.fetchBatch (src/integrations/stripe.ts:204:22)`
  }
];

export const INITIAL_USER_ACCOUNTS: UserAccount[] = [
  {
    id: 'usr-1',
    name: 'Arvind Sharma',
    email: 'arvind@datapilot.io',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    role: 'Owner',
    teams: ['Platform Architects'],
    lastActive: 'Active right now',
    twoFactorEnabled: true,
    status: 'active'
  },
  {
    id: 'usr-2',
    name: 'Elena Rostova',
    email: 'elena.r@datapilot.io',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80',
    role: 'Admin',
    teams: ['Data Engineering'],
    lastActive: '6 mins ago',
    twoFactorEnabled: true,
    status: 'active'
  },
  {
    id: 'usr-3',
    name: 'Marcus Vance',
    email: 'marcus.v@datapilot.io',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    role: 'Developer',
    teams: ['dbt Core'],
    lastActive: '18 mins ago',
    twoFactorEnabled: true,
    status: 'active'
  },
  {
    id: 'usr-4',
    name: 'Sarah Chen',
    email: 'sarah.c@datapilot.io',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
    role: 'Analyst',
    teams: ['Product Analytics'],
    lastActive: '1 hour ago',
    twoFactorEnabled: true,
    status: 'active'
  }
];

export const INITIAL_PERMISSION_MATRIX: PermissionMatrixItem[] = [
  {
    id: 'perm-1',
    resource: 'Dashboards & Visualizations',
    allowedRoles: ['Owner', 'Admin', 'Developer', 'Analyst', 'Viewer'],
    actions: [
      { name: 'View Published Dashboards', Owner: true, Admin: true, Developer: true, Analyst: true, Viewer: true },
      { name: 'Create & Edit Dashboards', Owner: true, Admin: true, Developer: true, Analyst: true, Viewer: false },
      { name: 'Publish to Organization', Owner: true, Admin: true, Developer: true, Analyst: false, Viewer: false },
      { name: 'Delete Dashboards', Owner: true, Admin: true, Developer: false, Analyst: false, Viewer: false }
    ]
  },
  {
    id: 'perm-2',
    resource: 'Data Sources & Credentials',
    allowedRoles: ['Owner', 'Admin', 'Developer'],
    actions: [
      { name: 'Query Database Connectors', Owner: true, Admin: true, Developer: true, Analyst: true, Viewer: false },
      { name: 'Create New Connection', Owner: true, Admin: true, Developer: true, Analyst: false, Viewer: false }
    ]
  },
  {
    id: 'perm-3',
    resource: 'SQL IDE & Workspace',
    allowedRoles: ['Owner', 'Admin', 'Developer', 'Analyst'],
    actions: [
      { name: 'Run Read-Only Queries (SELECT)', Owner: true, Admin: true, Developer: true, Analyst: true, Viewer: false },
      { name: 'Save Shared Team Queries', Owner: true, Admin: true, Developer: true, Analyst: true, Viewer: false }
    ]
  },
  {
    id: 'perm-4',
    resource: 'Data Modeling & dbt DAG',
    allowedRoles: ['Owner', 'Admin', 'Developer'],
    actions: [
      { name: 'View ERD & Lineage Graphs', Owner: true, Admin: true, Developer: true, Analyst: true, Viewer: true },
      { name: 'Edit Model Definitions & Relationships', Owner: true, Admin: true, Developer: true, Analyst: false, Viewer: false }
    ]
  },
  {
    id: 'perm-5',
    resource: 'Deployments & Production Releases',
    allowedRoles: ['Owner', 'Admin'],
    actions: [
      { name: 'View Deployment Logs & History', Owner: true, Admin: true, Developer: true, Analyst: true, Viewer: false },
      { name: 'Trigger Deploy to Production', Owner: true, Admin: true, Developer: false, Analyst: false, Viewer: false }
    ]
  }
];

export const INITIAL_DEPLOYMENTS: DeploymentRecord[] = [
  {
    id: 'dep-204',
    version: 'v2.8.4-prod',
    environment: 'production',
    status: 'success',
    branch: 'main',
    commitHash: 'e984f1b',
    commitMessage: 'feat(finance): add mart_finance_mrr incremental model and Stripe retry policy',
    author: 'Elena Rostova',
    authorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80',
    timestamp: '45 minutes ago',
    durationSec: 48,
    logs: [
      '[08:02:10] [BUILD] Initializing dbt compilation engine for target: production',
      '[08:02:14] [DBT] Found 5 models, 14 tests, 3 sources in 0.42s',
      '[08:02:18] [DBT] Running 1 of 5: staging.stg_stripe_customers [OK in 1.4s]',
      '[08:02:22] [DBT] Running 2 of 5: staging.stg_orders [OK in 2.1s]',
      '[08:02:28] [DBT] Running 3 of 5: marts.dim_customers [OK in 4.3s]',
      '[08:02:35] [DBT] Running 4 of 5: marts.fct_orders [OK in 8.9s]',
      '[08:02:44] [DBT] Running 5 of 5: marts_finance.mart_finance_mrr [OK in 5.6s]',
      '[08:02:50] [TEST] Running test suite: 14/14 passed with 0 warnings',
      '[08:02:54] [DEPLOY] Schema migrations synchronized successfully. Production active.'
    ]
  }
];

export const INITIAL_INTEGRATIONS: IntegrationCard[] = [
  {
    id: 'int-slack',
    name: 'Slack Alerts & Copilot',
    category: 'Alerts',
    description: 'Post automated query failure alerts, slow query warnings, and daily executive MRR briefs into Slack channels.',
    icon: 'slack',
    status: 'connected',
    lastSync: '2 minutes ago',
    webhookUrl: 'https://hooks.slack.com/services/T0192/B0482/x94821...',
    eventsCount: 1420,
    config: {
      channel: '#data-ops-alerts'
    }
  },
  {
    id: 'int-github',
    name: 'GitHub CI/CD Sync',
    category: 'CI/CD',
    description: 'Bi-directional repository sync for SQL files, dbt models, pull request lineage checks, and automated staging test preview.',
    icon: 'github',
    status: 'connected',
    lastSync: '18 minutes ago',
    eventsCount: 384,
    config: {
      repository: 'datapilot-org/analytics-mesh'
    }
  },
  {
    id: 'int-dbt-cloud',
    name: 'dbt Cloud Orchestration',
    category: 'Transforms',
    description: 'Trigger production dbt Cloud jobs on demand, monitor run artifacts, and pull semantic layer metrics into dashboards.',
    icon: 'dbt',
    status: 'connected',
    lastSync: '20 minutes ago',
    eventsCount: 92,
    config: {
      accountId: '94812'
    }
  },
  {
    id: 'int-s3',
    name: 'AWS S3 Data Lake Ingest',
    category: 'Storage',
    description: 'Stream continuous Parquet / JSON telemetry dumps from S3 buckets into Snowflake and PostgreSQL tables.',
    icon: 'aws',
    status: 'connected',
    lastSync: '1 hour ago',
    eventsCount: 89400,
    config: {
      bucket: 's3://datapilot-lakehouse-prod-east/'
    }
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
          latency_ms: 18,
          status: 'connected'
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
