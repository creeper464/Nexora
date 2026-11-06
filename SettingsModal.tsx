import React, { useState } from 'react';
import { X, Shield, Lock, Eye, Bell, Smartphone, DollarSign, Check, Sliders } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'privacy' | 'security' | 'creator' | 'playback'>('privacy');
  const [isPrivateAccount, setIsPrivateAccount] = useState(false);
  const [activityStatus, setActivityStatus] = useState(true);
  const [readReceipts, setReadReceipts] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(true);
  const [superSparksEnabled, setSuperSparksEnabled] = useState(true);
  const [brandDealsEnabled, setBrandDealsEnabled] = useState(true);
  const [dataSaver, setDataSaver] = useState(false);
  const [highResUploads, setHighResUploads] = useState(true);
  const [savedToast, setSavedToast] = useState(false);

  if (!isOpen) return null;

  const triggerSaveToast = () => {
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/50">
          <div className="flex items-center gap-2.5">
            <Shield className="w-5 h-5 text-red-500" />
            <h3 className="text-base font-black italic text-white uppercase tracking-wider">
              Settings & Privacy
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-full bg-zinc-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Saved feedback toast */}
        {savedToast && (
          <div className="bg-emerald-500 text-black px-4 py-2 text-xs font-black italic text-center flex items-center justify-center gap-1.5 animate-in fade-in">
            <Check className="w-4 h-4" /> Preferences updated and synced!
          </div>
        )}

        {/* Tab Selector */}
        <div className="flex items-center px-6 border-b border-zinc-800 bg-zinc-900/30 gap-2 overflow-x-auto no-scrollbar py-2">
          <button
            onClick={() => setActiveTab('privacy')}
            className={`px-3 py-1.5 rounded-full text-xs font-black italic uppercase tracking-wider transition-all shrink-0 ${
              activeTab === 'privacy'
                ? 'bg-red-500 text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Privacy
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-3 py-1.5 rounded-full text-xs font-black italic uppercase tracking-wider transition-all shrink-0 ${
              activeTab === 'security'
                ? 'bg-red-500 text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Security & 2FA
          </button>
          <button
            onClick={() => setActiveTab('creator')}
            className={`px-3 py-1.5 rounded-full text-xs font-black italic uppercase tracking-wider transition-all shrink-0 ${
              activeTab === 'creator'
                ? 'bg-yellow-400 text-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Monetization
          </button>
          <button
            onClick={() => setActiveTab('playback')}
            className={`px-3 py-1.5 rounded-full text-xs font-black italic uppercase tracking-wider transition-all shrink-0 ${
              activeTab === 'playback'
                ? 'bg-zinc-700 text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Playback
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
          {activeTab === 'privacy' && (
            <div className="space-y-5">
              <div>
                <h4 className="text-xs font-black italic text-zinc-400 uppercase tracking-widest mb-3">
                  Account Visibility
                </h4>
                <div className="space-y-4 bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800/80">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-black italic text-white">Private Account</div>
                      <div className="text-xs font-medium italic text-zinc-400">
                        Only approved followers can view your reels and posts.
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setIsPrivateAccount(!isPrivateAccount);
                        triggerSaveToast();
                      }}
                      className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                        isPrivateAccount ? 'bg-red-500' : 'bg-zinc-700'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white transition-transform ${
                          isPrivateAccount ? 'translate-x-6' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="border-t border-zinc-800 pt-3 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-black italic text-white">Active Status</div>
                      <div className="text-xs font-medium italic text-zinc-400">
                        Allow friends to see when you're active on Nexora.
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setActivityStatus(!activityStatus);
                        triggerSaveToast();
                      }}
                      className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                        activityStatus ? 'bg-emerald-500' : 'bg-zinc-700'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white transition-transform ${
                          activityStatus ? 'translate-x-6' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="border-t border-zinc-800 pt-3 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-black italic text-white">Read Receipts</div>
                      <div className="text-xs font-medium italic text-zinc-400">
                        Show checkmarks when you have seen messages in Direct.
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setReadReceipts(!readReceipts);
                        triggerSaveToast();
                      }}
                      className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                        readReceipts ? 'bg-red-500' : 'bg-zinc-700'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white transition-transform ${
                          readReceipts ? 'translate-x-6' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-5">
              <div>
                <h4 className="text-xs font-black italic text-zinc-400 uppercase tracking-widest mb-3">
                  Two-Factor Authentication & Devices
                </h4>
                <div className="space-y-4 bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800/80">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-black italic text-white">2-Factor Authentication (2FA)</div>
                      <div className="text-xs font-medium italic text-zinc-400">
                        Require an authentication app code on new logins.
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setTwoFactorAuth(!twoFactorAuth);
                        triggerSaveToast();
                      }}
                      className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                        twoFactorAuth ? 'bg-emerald-500' : 'bg-zinc-700'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white transition-transform ${
                          twoFactorAuth ? 'translate-x-6' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="border-t border-zinc-800 pt-3">
                    <div className="text-sm font-black italic text-white mb-2">
                      Active Recognized Devices
                    </div>
                    <div className="space-y-2 text-xs font-medium italic text-zinc-300">
                      <div className="flex items-center justify-between p-2.5 bg-black/40 rounded-xl">
                        <div>
                          <div className="font-bold text-white">iPhone 16 Pro • Tokyo, Japan</div>
                          <div className="text-[10px] text-emerald-400 font-bold">This device • Active now</div>
                        </div>
                        <span className="text-[10px] text-zinc-500">NEXORA App v3.2</span>
                      </div>
                      <div className="flex items-center justify-between p-2.5 bg-black/40 rounded-xl">
                        <div>
                          <div className="font-bold text-white">MacBook Pro M3 Max • San Francisco, CA</div>
                          <div className="text-[10px] text-zinc-400">Chrome Browser • 3 days ago</div>
                        </div>
                        <button className="text-[10px] text-red-400 font-bold hover:underline">
                          Revoke
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'creator' && (
            <div className="space-y-5">
              <div>
                <h4 className="text-xs font-black italic text-yellow-400 uppercase tracking-widest mb-3">
                  Monetization & Revenue Controls
                </h4>
                <div className="space-y-4 bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800/80">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-black italic text-white">Enable Super Sparks (Tipping)</div>
                      <div className="text-xs font-medium italic text-zinc-400">
                        Allow viewers to send ⚡ Super Sparks on your reels and live streams.
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setSuperSparksEnabled(!superSparksEnabled);
                        triggerSaveToast();
                      }}
                      className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                        superSparksEnabled ? 'bg-yellow-400' : 'bg-zinc-700'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-black transition-transform ${
                          superSparksEnabled ? 'translate-x-6' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="border-t border-zinc-800 pt-3 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-black italic text-white">Brand Deal Collaboration Requests</div>
                      <div className="text-xs font-medium italic text-zinc-400">
                        Receive verified sponsor inquiries directly in your Creator Inbox.
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setBrandDealsEnabled(!brandDealsEnabled);
                        triggerSaveToast();
                      }}
                      className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                        brandDealsEnabled ? 'bg-yellow-400' : 'bg-zinc-700'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-black transition-transform ${
                          brandDealsEnabled ? 'translate-x-6' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'playback' && (
            <div className="space-y-5">
              <div>
                <h4 className="text-xs font-black italic text-zinc-400 uppercase tracking-widest mb-3">
                  Media & Feed Settings
                </h4>
                <div className="space-y-4 bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800/80">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-black italic text-white">Cellular Data Saver</div>
                      <div className="text-xs font-medium italic text-zinc-400">
                        Lower video resolution when not on Wi-Fi to reduce data usage.
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setDataSaver(!dataSaver);
                        triggerSaveToast();
                      }}
                      className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                        dataSaver ? 'bg-red-500' : 'bg-zinc-700'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white transition-transform ${
                          dataSaver ? 'translate-x-6' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="border-t border-zinc-800 pt-3 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-black italic text-white">Upload in Ultra 4K HDR</div>
                      <div className="text-xs font-medium italic text-zinc-400">
                        Always publish reels and photos in maximum fidelity.
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setHighResUploads(!highResUploads);
                        triggerSaveToast();
                      }}
                      className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                        highResUploads ? 'bg-red-500' : 'bg-zinc-700'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white transition-transform ${
                          highResUploads ? 'translate-x-6' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-zinc-800 bg-zinc-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white font-black italic text-xs uppercase tracking-wider transition-colors"
          >
            Close Settings
          </button>
        </div>
      </div>
    </div>
  );
};
