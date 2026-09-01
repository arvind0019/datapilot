# DataPilot — Unified Data Analytics, SQL & BI Platform

> **An all-in-one developer-first Data Analytics, SQL IDE, dbt Workspace, BI Dashboard, Query Profiler, Incident Debugger, and CI/CD Deployment Mesh designed in Pure Neo-Brutalism.**

---

## ⚡ Overview

DataPilot unites the fragmented modern data stack into a single autonomous interface:

$$\text{Connect} \longrightarrow \text{Model} \longrightarrow \text{Query} \longrightarrow \text{Visualize} \longrightarrow \text{Optimize} \longrightarrow \text{Deploy} \longrightarrow \text{Monitor}$$

Instead of switching between 7 separate tools (DBeaver, Tableau, dbt, Sentry, Datadog, GitHub Actions, AWS Console), **DataPilot provides one unified developer mesh**.

---

## 🎨 Design Philosophy: Pure Neo-Brutalism

- **Solid 2.5px–3px Black Outlines**: High-contrast, industrial framing across all cards, modals, and tables.
- **Hard 100% Unblurred Offset Drop Shadows**: Crisp `4px 4px 0px #000000` tactile depth.
- **High-Voltage Developer Pop Accents**: Electric Yellow (`#ffee00`), Cyan (`#00f0ff`), Neon Green (`#00ff66`), Hot Pink (`#ff007f`), and Chalk White (`#ffffff`).
- **Tactile Button Physics**: Hover lift (`-2px, -2px` with deeper `5px` shadow) and click depression (`+2px, +2px` to `1px` shadow).
- **Sticker Badges & Monospace Coordinates**: Clean `JetBrains Mono` and `Outfit` typography.

---

## 🚀 Key Modules & Capabilities

1. **Overview Workspace**: Real-time telemetry, 6 KPI cards, 24h query throughput & latency bar chart, cluster resource gauges (Aurora PostgreSQL, Snowflake, BigQuery), and proactive AI insights.
2. **Data Sources Manager**: Connect PostgreSQL, Snowflake, BigQuery, MySQL, and REST APIs. Live latency testing and schema explorer drawer (84 tables & column types).
3. **SQL & dbt IDE**: High-performance SQL code editor with autocomplete, visual EXPLAIN execution plan tree analyzer, and interactive dbt DAG Lineage graph (`raw_data → staging → marts`).
4. **Semantic Data Modeling Studio**: Relational ERD entity canvas (`customers`, `orders`, `order_items`, `products`, `subscriptions`), table entity inspector, and 1-click `schema.yml` download.
5. **Interactive Dashboard Builder**: Financial & operational BI dashboards (Area, Donut, Bar, Funnel, KPI), drag-and-drop Edit Mode with visual inspector, and Share & Embed modal with public URLs & `<iframe>` embed codes.
6. **Performance Center**: P50 / P95 latency profiler, unindexed query detection (8.42s scan), execution plan cost breakdown, and **1-Click AI Index Optimization** (`CREATE INDEX CONCURRENTLY` reducing latency to 38ms).
7. **Debug Incident Center**: Centralized database deadlocks, query timeouts, and API rate-limit triage. Includes technical stack traces with **Plain-English AI Translations** and actionable remediation steps.
8. **Role-Based Access Control (RBAC)**: 5-role (Owner, Admin, Developer, Analyst, Viewer) permission matrix with interactive privilege toggles, workspace directory, and invite modal.
9. **CI/CD Deployment Center**: Release version history (`v2.8.4-prod`), automated pipeline runner, streaming terminal logs (`[DEPLOY] Release LIVE`), and 1-click rollback.
10. **Integrations & REST API Playground**: Marketplace connectors (Slack, GitHub, dbt Cloud, AWS S3), OpenAPI v1 documentation, multi-language code snippets (cURL, Python, Node.js), and live HTTP 200 OK request runner.
11. **Global Command Palette (`Ctrl + K`)**: Fuzzy keyword search across all tables, saved queries, dashboards, and platform actions.
12. **Persistent Autonomous AI Copilot Drawer**: Context-aware assistant that writes SQL queries, diagnoses slow dashboards, and executes 1-click workspace remedies.

---

## 🛠️ Tech Stack

- **Framework**: React 19, TypeScript
- **Bundler**: Vite
- **Styling**: Tailwind CSS v4 + Pure Neo-Brutalist design tokens
- **Icons**: Lucide React
- **Typography**: Google Fonts (`Outfit`, `Plus Jakarta Sans`, `JetBrains Mono`)

---

## 💻 Getting Started Locally

```bash
# Clone the repository
git clone https://github.com/arvind0019/datapilot.git

# Navigate into project directory
cd datapilot

# Install dependencies
npm install

# Start local dev server
npm run dev

# Build production bundle
npm run build
```

---

## 🌐 1-Click Deployment

Deploy to **Vercel** or **Netlify**:

```bash
# Production build command
npm run build

# Output directory
dist
```

*SPA rewrite configurations (`vercel.json` and `public/_redirects`) are pre-configured.*

---

## 📄 License

MIT License © 2026 DataPilot
