import React, { useState } from 'react';
import { 
  X, 
  CreditCard, 
  Check, 
  ShieldCheck, 
  Sparkles, 
  Lock, 
  Zap,
  ArrowRight,
  Receipt,
  QrCode
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PricingPlan, BillingCycle } from '../../types';

interface PaymentCheckoutModalProps {
  plan: PricingPlan | null;
  billingCycle: BillingCycle;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (planId: string) => void;
}

export const PaymentCheckoutModal: React.FC<PaymentCheckoutModalProps> = ({
  plan,
  billingCycle,
  isOpen,
  onClose,
  onSuccess
}) => {
  const { addToast } = useApp();

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'paypal'>('card');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('948');
  const [cardName, setCardName] = useState('Arvind Sharma');
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [upiId, setUpiId] = useState('arvind@okhdfcbank');

  if (!isOpen || !plan) return null;

  const basePrice = billingCycle === 'annual' ? plan.annualPrice * 12 : plan.monthlyPrice;
  const discountAmount = appliedDiscount ? (basePrice * appliedDiscount) / 100 : 0;
  const finalPrice = Math.max(0, basePrice - discountAmount);

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'PRO20' || promoCode.trim().toUpperCase() === 'LAUNCH') {
      setAppliedDiscount(20);
      addToast({
        type: 'success',
        title: 'Promo Code Applied! (-20%)',
        message: '20% extra discount has been deducted from your order.'
      });
    } else {
      addToast({
        type: 'error',
        title: 'Invalid Promo Code',
        message: 'Try code "PRO20" for 20% off.'
      });
    }
  };

  const handleProcessPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate Payment Gateway (Stripe / Razorpay) handshake
    await new Promise((r) => setTimeout(r, 1200));

    setIsProcessing(false);
    onSuccess(plan.id);
    onClose();

    addToast({
      type: 'success',
      title: `🎉 Payment Successful! ($${finalPrice.toFixed(2)})`,
      message: `Your workspace has been upgraded to the ${plan.name} tier!`
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-3 sm:p-4 font-mono text-xs animate-in fade-in duration-150">
      <div className="w-full max-w-xl brutal-panel p-5 sm:p-6 bg-[#161b22] border-[3px] border-black shadow-[12px_12px_0px_#000] space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-black pb-3">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded border-2 border-black bg-[#ffee00] text-black shadow-[2px_2px_0px_#000]">
              <Lock className="h-4 w-4" />
            </div>
            <div>
              <h2 className="font-display text-base font-black text-white uppercase tracking-tight">
                Secure Checkout & Subscription
              </h2>
              <p className="text-[10px] text-slate-400">
                256-bit Encrypted Stripe & UPI Gateway
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="brutal-badge bg-white text-black hover:bg-[#ffee00] cursor-pointer p-1.5"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Left: Payment Method & Input Form */}
          <div className="md:col-span-7 space-y-4">
            {/* Method Tabs */}
            <div className="flex rounded bg-[#0d1117] p-1 border-2 border-black shadow-[3px_3px_0px_#000]">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`flex-1 py-1.5 text-center font-black rounded transition-all cursor-pointer ${
                  paymentMethod === 'card' ? 'bg-[#ffee00] text-black shadow-[2px_2px_0px_#000]' : 'text-slate-300'
                }`}
              >
                CARD (STRIPE)
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`flex-1 py-1.5 text-center font-black rounded transition-all cursor-pointer ${
                  paymentMethod === 'upi' ? 'bg-[#00f0ff] text-black shadow-[2px_2px_0px_#000]' : 'text-slate-300'
                }`}
              >
                UPI / QR
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('paypal')}
                className={`flex-1 py-1.5 text-center font-black rounded transition-all cursor-pointer ${
                  paymentMethod === 'paypal' ? 'bg-[#00ff66] text-black shadow-[2px_2px_0px_#000]' : 'text-slate-300'
                }`}
              >
                PAYPAL
              </button>
            </div>

            <form onSubmit={handleProcessPayment} className="space-y-3">
              {paymentMethod === 'card' && (
                <>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-300 uppercase mb-1">Name on Card</label>
                    <input
                      type="text"
                      required
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="w-full brutal-box px-3 py-1.5 text-white bg-[#0d1117] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-300 uppercase mb-1">Card Number</label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-2 h-4 w-4 text-slate-500" />
                      <input
                        type="text"
                        required
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full brutal-box pl-9 pr-3 py-1.5 text-white bg-[#0d1117] outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-300 uppercase mb-1">Expiry</label>
                      <input
                        type="text"
                        required
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full brutal-box px-3 py-1.5 text-white bg-[#0d1117] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-300 uppercase mb-1">CVC / CVV</label>
                      <input
                        type="text"
                        required
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        placeholder="123"
                        className="w-full brutal-box px-3 py-1.5 text-white bg-[#0d1117] outline-none"
                      />
                    </div>
                  </div>
                </>
              )}

              {paymentMethod === 'upi' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-300 uppercase mb-1">Enter UPI VPA ID</label>
                    <input
                      type="text"
                      required
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="username@okaxis"
                      className="w-full brutal-box px-3 py-2 text-white bg-[#0d1117] outline-none"
                    />
                  </div>

                  <div className="brutal-box p-3 bg-[#0d1117] flex items-center justify-between">
                    <div>
                      <div className="text-[#00f0ff] font-bold">Instant QR Code</div>
                      <div className="text-[10px] text-slate-400">Scan via GPay / PhonePe / Paytm</div>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded border border-black bg-white text-black font-black">
                      <QrCode className="h-6 w-6" />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'paypal' && (
                <div className="brutal-box p-4 bg-[#0d1117] text-center space-y-2">
                  <p className="text-slate-300 text-xs">
                    You will be redirected to PayPal to complete your subscription securely.
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full brutal-btn brutal-btn-yellow py-2.5 text-xs font-black min-h-[42px] mt-2 shadow-[3px_3px_0px_#000]"
              >
                {isProcessing ? 'PROCESSING PAYMENT WITH BANK...' : `PAY $${finalPrice.toFixed(2)} & UPGRADE`}
              </button>
            </form>
          </div>

          {/* Right: Order Summary & Coupon */}
          <div className="md:col-span-5 brutal-box p-4 bg-[#0d1117] flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between border-b border-black pb-2 mb-3">
                <span className="text-[#ffee00] font-black uppercase text-xs">ORDER SUMMARY</span>
                <span className="brutal-badge bg-[#00ff66] text-black text-[8px]">{billingCycle.toUpperCase()}</span>
              </div>

              <div className="space-y-2 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-white font-bold">{plan.name} Plan</span>
                  <span className="text-white font-mono">${basePrice.toFixed(2)}</span>
                </div>

                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-[#00ff66]">
                    <span>Discount ({appliedDiscount}%)</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-400">
                  <span>Taxes & GST (0%)</span>
                  <span>$0.00</span>
                </div>

                <div className="border-t border-black pt-2 flex justify-between text-sm font-black text-white">
                  <span>Total Due</span>
                  <span className="text-[#00f0ff] font-mono">${finalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Promo Code Input */}
            <div className="space-y-1.5 pt-2 border-t border-black">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Have a promo code? (Try PRO20)</span>
              <div className="flex space-x-1">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="PRO20"
                  className="flex-1 rounded border border-black bg-[#161b22] px-2 py-1 text-white font-bold uppercase outline-none"
                />
                <button
                  type="button"
                  onClick={handleApplyPromo}
                  className="brutal-btn bg-white text-black px-2.5 py-1 text-[10px] font-black"
                >
                  APPLY
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
