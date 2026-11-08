import React, { useState } from 'react';
import {
  Settings,
  DollarSign,
  Zap,
  Grid,
  Bookmark,
  Heart,
  Share2,
  ExternalLink,
  Edit3,
  Award,
  Layers,
  Sparkles,
  TrendingUp,
  CreditCard,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { User, Reel, Post, MonetizationData } from '../types';
import { MONETIZATION_DATA } from '../data/mockData';

interface ProfileViewProps {
  user: User;
  isCurrentUser: boolean;
  userReels: Reel[];
  userPosts: Post[];
  savedReels: Reel[];
  onSelectReel: (reel: Reel) => void;
  onOpenSettings: () => void;
  onOpenSparks: (user: User) => void;
  onToggleFollow: (userId: string) => void;
  onUpdateBio?: (newBio: string, newName: string) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  isCurrentUser,
  userReels,
  userPosts,
  savedReels,
  onSelectReel,
  onOpenSettings,
  onOpenSparks,
  onToggleFollow,
  onUpdateBio,
}) => {
  const [activeTab, setActiveTab] = useState<'reels' | 'posts' | 'saved' | 'monetization'>('reels');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editBio, setEditBio] = useState(user.bio);
  const [monetization, setMonetization] = useState<MonetizationData>(MONETIZATION_DATA);
  const [payoutRequested, setPayoutRequested] = useState(false);

  const handleSaveProfile = () => {
    if (onUpdateBio) {
      onUpdateBio(editBio, editName);
    }
    setShowEditModal(false);
  };

  const handleRequestPayout = () => {
    setPayoutRequested(true);
    setTimeout(() => {
      setMonetization((prev) => ({
        ...prev,
        walletBalance: 0,
        pendingPayout: prev.pendingPayout + prev.walletBalance,
        payoutHistory: [
          {
            id: `pay_${Date.now()}`,
            date: 'Just now',
            amount: prev.walletBalance,
            method: 'Stripe Direct Express (•••• 4921)',
            status: 'Processing',
          },
          ...prev.payoutHistory,
        ],
      }));
      setPayoutRequested(false);
    }, 1500);
  };

  return (
    <div className="w-full h-full overflow-y-auto no-scrollbar bg-black text-white pb-24">
      {/* Cover Banner */}
      <div className="relative h-44 sm:h-56 w-full bg-zinc-900 overflow-hidden">
        <img
          src={user.coverImage || '/src/assets/images/nexora_cover_cyber_1793842294301.jpg'}
          alt="Cover"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

        {/* Top Floating Actions */}
        <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
          {isCurrentUser ? (
            <>
              <button
                onClick={() => setActiveTab('monetization')}
                className="px-3 py-1.5 rounded-full bg-yellow-400 text-black text-xs font-black italic uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-yellow-500/20 hover:scale-105 transition-all"
              >
                <Zap className="w-3.5 h-3.5 fill-black" />
                Creator Studio
              </button>
              <button
                onClick={onOpenSettings}
                className="w-9 h-9 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/80 transition-colors border border-white/10"
                title="Settings"
              >
                <Settings className="w-4 h-4" />
              </button>
            </>
          ) : (
            <button
              onClick={() => onOpenSparks(user)}
              className="px-3 py-1.5 rounded-full bg-gradient-to-r from-yellow-400 to-red-500 text-black text-xs font-black italic uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-yellow-500/20"
            >
              <Zap className="w-3.5 h-3.5 fill-black" />
              Gift Sparks
            </button>
          )}
        </div>
      </div>

      {/* Profile Header Details */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative -mt-16 sm:-mt-20 space-y-4">
        {/* Avatar and Main Action */}
        <div className="flex items-end justify-between">
          <div className="relative">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-black shadow-2xl"
            />
            <span className="absolute bottom-1 right-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-red-600 to-yellow-500 text-black text-[9px] font-black italic uppercase tracking-wider border-2 border-black">
              {user.tier}
            </span>
          </div>

          <div className="flex items-center gap-2 pb-2">
            {isCurrentUser ? (
              <button
                onClick={() => setShowEditModal(true)}
                className="px-4 py-2 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-black italic uppercase tracking-wider flex items-center gap-1.5 transition-colors border border-zinc-700"
              >
                <Edit3 className="w-3.5 h-3.5" />
                Edit Profile
              </button>
            ) : (
              <button
                onClick={() => onToggleFollow(user.id)}
                className={`px-5 py-2 rounded-full text-xs font-black italic uppercase tracking-wider transition-all shadow-md ${
                  user.isFollowing
                    ? 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                    : 'bg-red-600 hover:bg-red-500 text-white'
                }`}
              >
                {user.isFollowing ? 'Following' : 'Follow +'}
              </button>
            )}
          </div>
        </div>

        {/* Name, Handle, Bio */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black italic text-white uppercase tracking-wider">
              {user.name}
            </h1>
            {user.verified && (
              <span className="w-4 h-4 rounded-full bg-sky-500 text-white text-[10px] font-bold flex items-center justify-center">
                ✓
              </span>
            )}
          </div>
          <div className="text-xs font-bold italic text-yellow-400">
            {user.handle}
          </div>
          <p className="text-sm font-semibold italic text-zinc-300 max-w-xl leading-relaxed pt-1">
            {user.bio}
          </p>

          {user.links && user.links.length > 0 && (
            <div className="flex items-center gap-3 pt-1 text-xs font-bold italic text-zinc-400">
              {user.links.map((link, idx) => (
                <span key={idx} className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer">
                  <ExternalLink className="w-3 h-3 text-red-500" />
                  {link}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Quantified Metrics Strip */}
        <div className="grid grid-cols-4 gap-2 py-3 border-y border-zinc-800/80 text-center">
          <div>
            <div className="text-base sm:text-lg font-black italic text-white tabular-nums">
              {(user.followersCount / 1000).toFixed(1)}k
            </div>
            <div className="text-[10px] font-bold italic uppercase tracking-wider text-zinc-500">
              Followers
            </div>
          </div>
          <div>
            <div className="text-base sm:text-lg font-black italic text-white tabular-nums">
              {user.followingCount}
            </div>
            <div className="text-[10px] font-bold italic uppercase tracking-wider text-zinc-500">
              Following
            </div>
          </div>
          <div>
            <div className="text-base sm:text-lg font-black italic text-white tabular-nums">
              {(user.likesCount / 1000000).toFixed(1)}M
            </div>
            <div className="text-[10px] font-bold italic uppercase tracking-wider text-zinc-500">
              Likes
            </div>
          </div>
          <div>
            <div className="text-base sm:text-lg font-black italic text-yellow-400 tabular-nums">
              ⚡ 18.4k
            </div>
            <div className="text-[10px] font-bold italic uppercase tracking-wider text-zinc-500">
              Sparks
            </div>
          </div>
        </div>

        {/* Showcase Tabs */}
        <div className="flex items-center justify-around border-b border-zinc-800 pt-2">
          <button
            onClick={() => setActiveTab('reels')}
            className={`pb-2.5 text-xs font-black italic uppercase tracking-wider flex items-center gap-1.5 transition-all ${
              activeTab === 'reels'
                ? 'text-yellow-400 border-b-2 border-yellow-400'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Grid className="w-4 h-4" />
            Reels ({userReels.length})
          </button>
          <button
            onClick={() => setActiveTab('posts')}
            className={`pb-2.5 text-xs font-black italic uppercase tracking-wider flex items-center gap-1.5 transition-all ${
              activeTab === 'posts'
                ? 'text-yellow-400 border-b-2 border-yellow-400'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Layers className="w-4 h-4" />
            Posts ({userPosts.length})
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`pb-2.5 text-xs font-black italic uppercase tracking-wider flex items-center gap-1.5 transition-all ${
              activeTab === 'saved'
                ? 'text-yellow-400 border-b-2 border-yellow-400'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            Saved ({savedReels.length})
          </button>
          {isCurrentUser && (
            <button
              onClick={() => setActiveTab('monetization')}
              className={`pb-2.5 text-xs font-black italic uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                activeTab === 'monetization'
                  ? 'text-red-500 border-b-2 border-red-500'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <DollarSign className="w-4 h-4" />
              Creator Studio
            </button>
          )}
        </div>

        {/* Tab Content Panels */}
        {activeTab === 'reels' && (
          <div className="grid grid-cols-3 gap-2 pt-2">
            {userReels.map((reel) => (
              <div
                key={reel.id}
                onClick={() => onSelectReel(reel)}
                className="relative aspect-[9/16] rounded-xl overflow-hidden bg-zinc-900 cursor-pointer group border border-zinc-850 hover:border-yellow-400 transition-all"
              >
                <img
                  src={reel.posterUrl}
                  alt={reel.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-2 left-2 text-[10px] font-bold italic text-white flex items-center gap-1">
                  <Heart className="w-3 h-3 fill-red-500 text-red-500" />
                  {reel.likesCount >= 1000
                    ? `${(reel.likesCount / 1000).toFixed(1)}k`
                    : reel.likesCount}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'posts' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
            {userPosts.map((post) => (
              <div
                key={post.id}
                className="relative aspect-square rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800"
              >
                <img
                  src={post.mediaUrl}
                  alt={post.caption}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-2.5 left-2.5 right-2.5 text-xs font-bold italic text-white truncate">
                  {post.caption}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'saved' && (
          <div className="grid grid-cols-3 gap-2 pt-2">
            {savedReels.length === 0 ? (
              <div className="col-span-3 text-center py-12 text-zinc-500 font-bold italic text-xs">
                No saved reels yet. Tap the bookmark icon on any reel to save it here!
              </div>
            ) : (
              savedReels.map((reel) => (
                <div
                  key={reel.id}
                  onClick={() => onSelectReel(reel)}
                  className="relative aspect-[9/16] rounded-xl overflow-hidden bg-zinc-900 cursor-pointer group border border-zinc-850 hover:border-yellow-400 transition-all"
                >
                  <img
                    src={reel.posterUrl}
                    alt={reel.caption}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-2 left-2 text-[10px] font-bold italic text-white flex items-center gap-1">
                    <Bookmark className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    Saved
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Creator Studio & Monetization Hub */}
        {activeTab === 'monetization' && isCurrentUser && (
          <div className="space-y-6 pt-2">
            {/* Wallet Balance Hero Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-zinc-900 via-black to-zinc-900 border-2 border-yellow-500/40 relative overflow-hidden shadow-[0_0_40px_rgba(250,204,21,0.15)]">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-black italic uppercase tracking-wider text-yellow-400 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 fill-yellow-400" />
                  Nexora Creator Earnings Hub
                </span>
                <span className="text-[10px] font-bold italic text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  Instant Payouts Active
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="text-[11px] font-bold italic text-zinc-400 uppercase tracking-wider">
                    Available Wallet Balance
                  </div>
                  <div className="text-3xl font-black italic text-white tabular-nums mt-1">
                    ${monetization.walletBalance.toFixed(2)}
                  </div>
                  <p className="text-[11px] font-semibold italic text-zinc-400 mt-1">
                    Combined revenue from Super Sparks, Creator Rewards, and Subs.
                  </p>
                </div>

                <div className="flex flex-col justify-end gap-2">
                  <button
                    onClick={handleRequestPayout}
                    disabled={payoutRequested || monetization.walletBalance <= 0}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-yellow-400 to-red-500 text-black font-black italic text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 disabled:opacity-50 transition-all shadow-md"
                  >
                    <CreditCard className="w-4 h-4" />
                    {payoutRequested ? 'Transferring...' : 'Request Instant Payout'}
                  </button>
                  <span className="text-[9px] text-center font-bold italic text-zinc-500">
                    Transfers directly to Stripe Express (•••• 4921)
                  </span>
                </div>
              </div>
            </div>

            {/* Performance KPI Grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
                <div className="text-[10px] font-bold italic text-zinc-400 uppercase">
                  Super Sparks Gifted
                </div>
                <div className="text-xl font-black italic text-yellow-400 mt-1">
                  ⚡ {monetization.superSparksEarned.toLocaleString()}
                </div>
                <div className="text-[10px] font-semibold italic text-emerald-400 mt-0.5">
                  +38% this month
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
                <div className="text-[10px] font-bold italic text-zinc-400 uppercase">
                  Paid Subscriptions
                </div>
                <div className="text-xl font-black italic text-white mt-1">
                  {monetization.subscriberCount}
                </div>
                <div className="text-[10px] font-semibold italic text-emerald-400 mt-0.5">
                  $4.99/mo per sub
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
                <div className="text-[10px] font-bold italic text-zinc-400 uppercase">
                  Est. Next Payout
                </div>
                <div className="text-xl font-black italic text-white mt-1">
                  ${monetization.estimatedMonthly.toFixed(2)}
                </div>
                <div className="text-[10px] font-semibold italic text-zinc-500 mt-0.5">
                  Dec 01, 2026
                </div>
              </div>
            </div>

            {/* Payout History */}
            <div className="space-y-3">
              <h4 className="text-xs font-black italic uppercase tracking-wider text-zinc-400">
                Recent Payout History
              </h4>
              <div className="divide-y divide-zinc-800/80 bg-zinc-900/40 rounded-2xl border border-zinc-800 overflow-hidden">
                {monetization.payoutHistory.map((item) => (
                  <div key={item.id} className="p-3.5 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-black italic text-white">
                        ${item.amount.toFixed(2)} USD
                      </div>
                      <div className="text-[10px] font-semibold italic text-zinc-400">
                        {item.method} • {item.date}
                      </div>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black italic uppercase ${
                        item.status === 'Completed'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-3xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-black italic text-white uppercase tracking-wider">
              Edit Nexora Profile
            </h3>

            <div className="space-y-3 text-xs font-bold italic text-zinc-300">
              <div>
                <label className="block mb-1 text-zinc-400">Display Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-yellow-400"
                />
              </div>

              <div>
                <label className="block mb-1 text-zinc-400">Bio</label>
                <textarea
                  rows={3}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-yellow-400"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 rounded-full text-xs font-black italic text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                className="px-5 py-2 rounded-full bg-gradient-to-r from-red-600 to-yellow-500 text-black text-xs font-black italic uppercase tracking-wider"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
