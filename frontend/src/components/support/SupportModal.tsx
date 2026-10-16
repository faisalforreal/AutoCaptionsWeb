import React, { useState } from 'react';
import { X, Heart, Coffee, Sparkles, Loader2, ArrowRight } from 'lucide-react';
import { ApiService } from '../../services/api';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SUPPORT_TIERS = [
  { amount: 3, label: 'Coffee', emoji: '☕', icon: Coffee },
  { amount: 5, label: 'Snack', emoji: '🥐' },
  { amount: 10, label: 'Lunch', emoji: '🍕' },
  { amount: 25, label: 'Super Fan', emoji: '⭐' },
];

export const SupportModal: React.FC<SupportModalProps> = ({ isOpen, onClose }) => {
  const [selectedAmount, setSelectedAmount] = useState<number>(5);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentAmount = isCustom
    ? parseFloat(customAmount) || 0
    : selectedAmount;

  const handleSelectTier = (amount: number) => {
    setIsCustom(false);
    setSelectedAmount(amount);
    setCustomAmount('');
    setErrorMessage(null);
  };

  const handleCustomChange = (val: string) => {
    setIsCustom(true);
    setCustomAmount(val);
    setErrorMessage(null);
  };

  const handleSupport = async () => {
    if (isCustom && (!customAmount || parseFloat(customAmount) < 1)) {
      setErrorMessage('Please enter an amount of $1 or more.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const amountToPay = isCustom ? parseFloat(customAmount) : selectedAmount;
      const response = await ApiService.createSupportCheckout(amountToPay);

      if (response?.checkoutUrl) {
        window.location.href = response.checkoutUrl;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (err: any) {
      console.error('Support checkout failed:', err);
      setErrorMessage(
        'Payment checkout is currently being configured. Please check back shortly!'
      );
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md select-none">
      <div className="relative w-full max-w-md bg-[#131326] border border-white/10 rounded-2xl shadow-2xl p-6 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/10 text-[#8888a0] hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-pink-500/20 border border-pink-500/30 flex items-center justify-center">
            <Heart className="w-5 h-5 text-pink-400 fill-pink-400" />
          </div>
          <div>
            <h3 className="font-bold text-base text-white tracking-tight">
              Support AutoCaption
            </h3>
            <p className="text-xs text-[#808098]">
              Keep it 100% free with no watermarks
            </p>
          </div>
        </div>

        <p className="text-xs text-[#a0a0b8] leading-relaxed mb-5">
          AutoCaption is completely free for everyone. If this tool saved you hours of editing or helped you grow your audience, your support helps cover maintenance and new features!
        </p>

        {/* Error Notice */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-pink-500/10 border border-pink-500/20 text-xs text-pink-300">
            {errorMessage}
          </div>
        )}

        {/* Support Amount Preset Pills */}
        <div className="space-y-3 mb-5">
          <label className="text-xs font-semibold text-[#808098] block">
            Choose an amount
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            {SUPPORT_TIERS.map((tier) => {
              const active = !isCustom && selectedAmount === tier.amount;
              return (
                <button
                  key={tier.amount}
                  type="button"
                  onClick={() => handleSelectTier(tier.amount)}
                  className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                    active
                      ? 'bg-purple-600/25 border-purple-500 text-white shadow-md shadow-purple-600/20'
                      : 'bg-[#18182c] border-white/[0.06] text-[#808098] hover:text-white hover:border-white/15'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">{tier.emoji}</span>
                    <span className="text-xs font-bold text-white">{tier.label}</span>
                  </div>
                  <span className={`text-xs font-bold ${active ? 'text-purple-300' : 'text-[#a0a0b8]'}`}>
                    ${tier.amount}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Custom Amount Field */}
          <div className="mt-3">
            <div
              className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all ${
                isCustom
                  ? 'bg-purple-600/20 border-purple-500 text-white'
                  : 'bg-[#18182c] border-white/[0.06] text-[#808098]'
              }`}
            >
              <span className="text-sm font-bold text-[#a0a0b8] pl-1">$</span>
              <input
                type="number"
                min="1"
                step="1"
                placeholder="Custom amount (USD)"
                value={customAmount}
                onChange={(e) => handleCustomChange(e.target.value)}
                onFocus={() => setIsCustom(true)}
                className="bg-transparent flex-1 text-sm text-white placeholder-[#505068] outline-none"
              />
              <span className="text-[11px] text-[#606078] pr-1">USD</span>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={handleSupport}
          disabled={loading || (isCustom && (!customAmount || parseFloat(customAmount) < 1))}
          className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 hover:from-purple-500 hover:to-rose-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-pink-600/25 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Preparing Checkout...</span>
            </>
          ) : (
            <>
              <Heart className="w-4 h-4 text-pink-200 fill-pink-200" />
              <span>
                Support with ${currentAmount > 0 ? currentAmount : 'any amount'}
              </span>
              <ArrowRight className="w-4 h-4 ml-0.5" />
            </>
          )}
        </button>

        <p className="text-[11px] text-center text-[#606078] mt-3">
          Secure payment · Cancel anytime · Pay what you want
        </p>
      </div>
    </div>
  );
};
