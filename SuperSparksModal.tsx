import React, { useState } from 'react';
import { X, Zap, Check, Sparkles } from 'lucide-react';
import { User } from '../types';

interface SuperSparksModalProps {
  isOpen: boolean;
  onClose: () => void;
  creator: User;
  onSendSparks: (amount: number, message: string) => void;
}

export const SuperSparksModal: React.FC<SuperSparksModalProps> = ({
  isOpen,
  onClose,
  creator,
  onSendSparks,
}) => {
  const [selectedAmount, setSelectedAmount] = useState<number>(100);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [customMessage, setCustomMessage] = useState<string>('');
  const [isSent, setIsSent] = useState<boolean>(false);

  if (!isOpen) return null;

  const sparkPresets = [
    { sparks: 50, price: '$0.50', label: 'Quick Boost', icon: '⚡' },
    { sparks: 100, price: '$1.00', label: 'Fan Love', icon: '🔥', popular: true },
    { sparks: 500, price: '$5.00', label: 'Super Spark', icon: '✨' },
    { sparks: 1000, price: '$10.00', label: 'Mega Catalyst', icon: '💎' },
  ];

  const handleSend = () => {
    const finalAmount = customAmount ? parseInt(customAmount, 10) : selectedAmount;
    if (!finalAmount || isNaN(finalAmount)) return;

    setIsSent(true);
    setTimeout(() => {
      onSendSparks(finalAmount, customMessage);
      setIsSent(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-sm bg-gradient-to-b from-zinc-900 to-black border-2 border-yellow-500/40 rounded-3xl p-6 shadow-[0_0_50px_rgba(250,204,21,0.25)] overflow-hidden">
        {/* Animated background glow */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-yellow-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-red-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-full bg-zinc-800/60 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {isSent ? (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-yellow-400 text-black flex items-center justify-center animate-bounce shadow-[0_0_30px_#FACC15]">
              <Sparkles className="w-9 h-9" />
            </div>
            <h4 className="text-xl font-black italic text-white uppercase tracking-wider">
              Super Sparks Sent!
            </h4>
            <p className="text-sm font-bold italic text-yellow-400">
              +{selectedAmount || customAmount} Sparks gifted to {creator.name}
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Creator Header */}
            <div className="flex items-center gap-3">
              <img
                src={creator.avatar}
                alt={creator.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-yellow-400 shrink-0"
              />
              <div>
                <span className="text-[10px] font-bold italic uppercase tracking-wider text-yellow-400 flex items-center gap-1">
                  <Zap className="w-3 h-3 fill-yellow-400" />
                  Creator Monetization
                </span>
                <h4 className="text-base font-black italic text-white">
                  Gift Super Sparks to {creator.name}
                </h4>
                <p className="text-xs font-semibold italic text-zinc-400">
                  {creator.handle} • {creator.tier}
                </p>
              </div>
            </div>

            {/* Presets Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              {sparkPresets.map((preset) => {
                const isSelected = selectedAmount === preset.sparks && !customAmount;
                return (
                  <button
                    key={preset.sparks}
                    type="button"
                    onClick={() => {
                      setSelectedAmount(preset.sparks);
                      setCustomAmount('');
                    }}
                    className={`relative p-3 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'border-yellow-400 bg-yellow-500/15 shadow-[0_0_15px_rgba(250,204,21,0.3)]'
                        : 'border-zinc-800 bg-zinc-900/60 hover:border-zinc-700'
                    }`}
                  >
                    {preset.popular && (
                      <span className="absolute -top-2 right-2 px-2 py-0.5 rounded-full bg-red-600 text-white text-[9px] font-black italic uppercase tracking-wider">
                        HOT
                      </span>
                    )}
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-lg">{preset.icon}</span>
                      <span className="text-xs font-bold italic text-zinc-400 tabular-nums">
                        {preset.price}
                      </span>
                    </div>
                    <div className="text-sm font-black italic text-white">
                      {preset.sparks} Sparks
                    </div>
                    <div className="text-[10px] font-semibold italic text-zinc-400">
                      {preset.label}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Message input */}
            <div>
              <input
                type="text"
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Include a shoutout message with your tip..."
                maxLength={60}
                className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl px-3.5 py-2.5 text-xs font-bold italic focus:outline-none focus:border-yellow-400 placeholder:text-zinc-500"
              />
            </div>

            {/* Submit Action */}
            <button
              onClick={handleSend}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-yellow-500 via-yellow-400 to-red-500 text-black font-black italic text-sm tracking-wider uppercase flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-yellow-500/20"
            >
              <Zap className="w-4 h-4 fill-black" />
              Send {customAmount ? `${customAmount} Sparks` : `${selectedAmount} Super Sparks`}
            </button>
            <p className="text-[10px] text-center font-bold italic text-zinc-500">
              Creators receive 85% revenue share instantly credited to their Nexora wallet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
