import React, { useState } from 'react';
import { 
  CreditCard, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Download, 
  Zap, 
  Building2, 
  ArrowRight,
  Receipt,
  Layers,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { PRICING_PLANS, INITIAL_INVOICES, INITIAL_USAGE_METRICS } from '../../../data/pricingData';
import { PricingPlan, BillingCycle, BillingInvoice } from '../../../types';
import { PaymentCheckoutModal } from '../../billing/PaymentCheckoutModal';

export const PricingBillingView: React.FC = () => {
  const { currentUser, updateUserRole, addToast } = useApp();

  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState<PricingPlan | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [invoices, setInvoices] = useState<BillingInvoice[]>(INITIAL_INVOICES);
  const [currentPlanTier, setCurrentPlanTier] = useState<'Free' | 'Pro' | 'Enterprise'>(
    currentUser.planTier || 'Free'
  );

  const handleOpenCheckout = (plan: PricingPlan) => {
    if (plan.id === currentPlanTier) {
      addToast({
        type: 'info',
        title: 'Active Subscription',
        message: `You are currently on the ${plan.name} plan.`
      });
      return;
    }
    setSelectedPlanForCheckout(plan);
    setIsCheckoutOpen(true);
  };

  const handleCheckoutSuccess = (planId: string) => {
    const newTier = planId as 'Free' | 'Pro' | 'Enterprise';
    setCurrentPlanTier(newTier);

    const newInvoice: BillingInvoice = {
      id: 'inv-' + Date.now(),
      invoiceNumber: `DP-INV-2026-${Math.floor(Math.random() * 800) + 100}`,
      date: 'Today',
      amount: newTier === 'Pro' ? (billingCycle === 'annual' ? '$276.00' : '$29.00') : '$199.00',
      status: 'Paid',
      planName: `${newTier} Tier (${billingCycle === 'annual' ? 'Annual' : 'Monthly'})`
    };

    setInvoices((prev) => [newInvoice, ...prev]);
  };

  const handleDownloadInvoice = (inv: BillingInvoice) => {
    addToast({
      type: 'success',
      title: 'Invoice PDF Downloaded',
      message: `Downloaded receipt for ${inv.invoiceNumber} (${inv.amount}).`
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150 font-mono text-xs">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b-[3px] border-black pb-3">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-display text-xl sm:text-2xl font-black tracking-tight text-white uppercase">
              Plans, Pricing & Billing Engine
            </h1>
            <span className={`brutal-badge ${
              currentPlanTier === 'Pro' ? 'bg-[#00ff66] text-black' :
              currentPlanTier === 'Enterprise' ? 'bg-[#ffee00] text-black' :
              'bg-[#00f0ff] text-black'
            }`}>
              CURRENT: {currentPlanTier.toUpperCase()}
            </span>
          </div>
          <p className="text-slate-400 text-xs mt-0.5">
            // Scale your analytics infrastructure with flexible B2B SaaS monthly & annual plans.
          </p>
        </div>

        {/* Billing Cycle Switcher */}
        <div className="flex items-center space-x-2 bg-[#0d1117] p-1 rounded border-2 border-black shadow-[3px_3px_0px_#000] self-start sm:self-auto">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-3 py-1.5 rounded font-black text-xs transition-all cursor-pointer ${
              billingCycle === 'monthly' ? 'bg-[#ffee00] text-black shadow-[2px_2px_0px_#000]' : 'text-slate-400'
            }`}
          >
            MONTHLY
          </button>
          <button
            onClick={() => setBillingCycle('annual')}
            className={`px-3 py-1.5 rounded font-black text-xs transition-all cursor-pointer flex items-center space-x-1 ${
              billingCycle === 'annual' ? 'bg-[#00ff66] text-black shadow-[2px_2px_0px_#000]' : 'text-slate-400'
            }`}
          >
            <span>ANNUAL</span>
            <span className="brutal-badge bg-black text-[#00ff66] text-[8px]">SAVE 20%</span>
          </button>
        </div>
      </div>

      {/* 3 Pricing Tier Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {PRICING_PLANS.map((plan) => {
          const isCurrent = currentPlanTier === plan.id;
          const displayPrice = billingCycle === 'annual' ? plan.annualPrice : plan.monthlyPrice;

          return (
            <div
              key={plan.id}
              className={`brutal-panel p-5 sm:p-6 flex flex-col justify-between relative transition-all ${
                plan.isPopular 
                  ? 'bg-[#161b22] border-[3px] border-[#ffee00] shadow-[8px_8px_0px_#ffee00]' 
                  : 'bg-[#161b22] border-[3px] border-black shadow-[6px_6px_0px_#000]'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3.5 right-4 brutal-badge bg-[#ffee00] text-black font-black text-[9px] shadow-[2px_2px_0px_#000]">
                  {plan.badge}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="font-display text-lg font-black text-white uppercase">{plan.name}</h3>
                  <p className="text-slate-400 text-xs mt-1 min-h-[32px]">{plan.description}</p>
                </div>

                <div className="brutal-box p-3 bg-[#0d1117] flex items-baseline space-x-1">
                  <span className="font-display text-3xl sm:text-4xl font-black text-white">${displayPrice}</span>
                  <span className="text-slate-400 text-xs font-bold">/ month</span>
                  {billingCycle === 'annual' && plan.monthlyPrice > 0 && (
                    <span className="text-[10px] text-[#00ff66] font-bold block ml-2">billed annually</span>
                  )}
                </div>

                {/* Features List */}
                <div className="space-y-2 pt-2 border-t-2 border-black">
                  <span className="text-[10px] text-slate-400 font-black uppercase">// INCLUDED CAPABILITIES</span>
                  <ul className="space-y-1.5">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start space-x-2 text-slate-200">
                        <Check className="h-4 w-4 text-[#00ff66] flex-shrink-0 mt-0.5" />
                        <span className="leading-tight text-xs font-sans">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-5 mt-4 border-t-2 border-black">
                <button
                  onClick={() => handleOpenCheckout(plan)}
                  disabled={isCurrent}
                  className={`w-full brutal-btn py-2.5 text-xs font-black min-h-[42px] ${
                    isCurrent 
                      ? 'bg-[#21262d] text-slate-400 border-dashed cursor-default'
                      : plan.isPopular
                      ? 'brutal-btn-yellow'
                      : 'bg-white text-black hover:bg-slate-100'
                  }`}
                >
                  {isCurrent ? 'ACTIVE CURRENT PLAN' : `UPGRADE TO ${plan.name.toUpperCase()}`}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Quota & Resource Usage Meters */}
      <div className="brutal-panel p-5 bg-[#161b22] space-y-4">
        <div className="flex items-center justify-between border-b-2 border-black pb-2">
          <div className="flex items-center space-x-2">
            <Zap className="h-4 w-4 text-[#ffee00]" />
            <h3 className="font-display text-sm font-black text-white uppercase">RESOURCE USAGE & QUOTAS</h3>
          </div>
          <span className="text-[10px] text-slate-400 font-bold">Billing Cycle: Aug 1 - Sep 1, 2026</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="brutal-box p-3 bg-[#0d1117] space-y-1.5">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-400">Google Gemini AI Queries</span>
              <span className="text-[#ffee00] font-bold">{INITIAL_USAGE_METRICS.aiTokensUsed} / {INITIAL_USAGE_METRICS.aiTokensLimit}</span>
            </div>
            <div className="w-full bg-black rounded-full h-2 border border-black overflow-hidden">
              <div className="bg-[#ffee00] h-full" style={{ width: `${(INITIAL_USAGE_METRICS.aiTokensUsed / INITIAL_USAGE_METRICS.aiTokensLimit) * 100}%` }} />
            </div>
          </div>

          <div className="brutal-box p-3 bg-[#0d1117] space-y-1.5">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-400">Connected Databases</span>
              <span className="text-[#00f0ff] font-bold">{INITIAL_USAGE_METRICS.connectedDatabases} Sources</span>
            </div>
            <div className="w-full bg-black rounded-full h-2 border border-black overflow-hidden">
              <div className="bg-[#00f0ff] h-full" style={{ width: '40%' }} />
            </div>
          </div>

          <div className="brutal-box p-3 bg-[#0d1117] space-y-1.5">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-400">Slack Anomaly Webhooks</span>
              <span className="text-[#00ff66] font-bold">{INITIAL_USAGE_METRICS.dailyAlertsDispatched} / {INITIAL_USAGE_METRICS.alertsLimit}</span>
            </div>
            <div className="w-full bg-black rounded-full h-2 border border-black overflow-hidden">
              <div className="bg-[#00ff66] h-full" style={{ width: '12%' }} />
            </div>
          </div>

          <div className="brutal-box p-3 bg-[#0d1117] space-y-1.5">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-400">Team Seats Used</span>
              <span className="text-white font-bold">{INITIAL_USAGE_METRICS.teamMembers} / {INITIAL_USAGE_METRICS.teamLimit}</span>
            </div>
            <div className="w-full bg-black rounded-full h-2 border border-black overflow-hidden">
              <div className="bg-white h-full" style={{ width: '30%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Invoices & Receipts History Table */}
      <div className="brutal-panel p-5 bg-[#161b22] space-y-4">
        <div className="flex items-center justify-between border-b-2 border-black pb-2">
          <div className="flex items-center space-x-2">
            <Receipt className="h-4 w-4 text-[#00f0ff]" />
            <h3 className="font-display text-sm font-black text-white uppercase">INVOICES & PAYMENT RECEIPTS</h3>
          </div>
          <span className="brutal-badge bg-[#00ff66] text-black text-[9px]">PAID IN FULL</span>
        </div>

        <div className="overflow-x-auto rounded border-2 border-black shadow-[3px_3px_0px_#000] bg-[#0d1117]">
          <table className="w-full text-left text-xs font-mono">
            <thead className="border-b-2 border-black bg-[#21262d] text-white uppercase text-[10px] font-black">
              <tr>
                <th className="px-4 py-2 border-r border-black">INVOICE NUMBER</th>
                <th className="px-4 py-2 border-r border-black">DATE</th>
                <th className="px-4 py-2 border-r border-black">DESCRIPTION</th>
                <th className="px-4 py-2 border-r border-black">AMOUNT</th>
                <th className="px-4 py-2 border-r border-black">STATUS</th>
                <th className="px-4 py-2 text-right">RECEIPT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black text-slate-200">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-[#161b22]">
                  <td className="px-4 py-2 font-bold text-white border-r border-black">{inv.invoiceNumber}</td>
                  <td className="px-4 py-2 text-slate-400 border-r border-black">{inv.date}</td>
                  <td className="px-4 py-2 text-slate-300 border-r border-black">{inv.planName}</td>
                  <td className="px-4 py-2 font-black text-[#00ff66] border-r border-black">{inv.amount}</td>
                  <td className="px-4 py-2 border-r border-black">
                    <span className="brutal-badge bg-[#00ff66] text-black text-[8px]">PAID</span>
                  </td>
                  <td className="px-4 py-2 text-right">
                    <button
                      onClick={() => handleDownloadInvoice(inv)}
                      className="brutal-btn bg-white text-black px-2.5 py-1 text-[10px] font-black"
                    >
                      <Download className="h-3 w-3 mr-1" />
                      <span>PDF</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Checkout Modal */}
      <PaymentCheckoutModal
        plan={selectedPlanForCheckout}
        billingCycle={billingCycle}
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onSuccess={handleCheckoutSuccess}
      />
    </div>
  );
};
