import { PricingPlan, BillingInvoice } from '../types';

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'Free',
    name: 'Starter Developer',
    monthlyPrice: 0,
    annualPrice: 0,
    description: 'Perfect for individual developers and solo hackers exploring SQL and database schemas.',
    features: [
      '1 Connected Database Source',
      '5 Saved SQL Queries',
      '1 Basic Operational Dashboard',
      'Standard Multi-Engine IDE',
      'Community Discord Support',
      'Standard Query History (24h)'
    ]
  },
  {
    id: 'Pro',
    name: 'Growth Pro',
    monthlyPrice: 29,
    annualPrice: 23, // $276/yr (20% OFF)
    description: 'For growing data teams, analysts, and fast-moving startups that require AI query generation and automated indexing.',
    badge: 'MOST POPULAR',
    isPopular: true,
    features: [
      'Unlimited Database Connections',
      'Google Gemini 2.0 AI SQL Copilot',
      'No-Code Drag & Drop Visual Builder',
      '1-Click Slow Query Index Optimizer',
      'Interactive dbt DAG Lineage Viewer',
      'Executive BI Dashboard Sharing',
      'CSV & JSON Data Export Engine',
      'Standard Support (24h SLA)'
    ]
  },
  {
    id: 'Enterprise',
    name: 'Enterprise Team',
    monthlyPrice: 199,
    annualPrice: 159, // $1,908/yr (20% OFF)
    description: 'For enterprise organizations needing custom VPC self-hosting, team RBAC, audit security, and automated Slack digests.',
    features: [
      'Everything in Growth Pro',
      'Unlimited Team Seats & Invites',
      'Advanced RBAC Permissions Matrix',
      'Automated Slack / Discord Cron Digests',
      'Audit Security Logs & Compliance',
      'Custom Domain & Single Sign-On (SAML/Okta)',
      'Dedicated VPC Self-Hosted Package',
      '24/7 Dedicated Slack SLA & White-Glove Onboarding'
    ]
  }
];

export const INITIAL_INVOICES: BillingInvoice[] = [
  {
    id: 'inv-1',
    invoiceNumber: 'DP-INV-2026-089',
    date: 'Aug 01, 2026',
    amount: '$29.00',
    status: 'Paid',
    planName: 'Growth Pro (Monthly)'
  },
  {
    id: 'inv-2',
    invoiceNumber: 'DP-INV-2026-074',
    date: 'Jul 01, 2026',
    amount: '$29.00',
    status: 'Paid',
    planName: 'Growth Pro (Monthly)'
  },
  {
    id: 'inv-3',
    invoiceNumber: 'DP-INV-2026-058',
    date: 'Jun 01, 2026',
    amount: '$29.00',
    status: 'Paid',
    planName: 'Growth Pro (Monthly)'
  }
];

export const INITIAL_USAGE_METRICS = {
  aiTokensUsed: 1420,
  aiTokensLimit: 10000,
  connectedDatabases: 6,
  databaseLimit: 999,
  teamMembers: 3,
  teamLimit: 10,
  dailyAlertsDispatched: 18,
  alertsLimit: 500
};
