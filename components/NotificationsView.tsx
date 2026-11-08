import React, { useState } from 'react';
import { Bell, Heart, MessageCircle, UserPlus, Zap, DollarSign, CheckCheck } from 'lucide-react';
import { NotificationItem, User, Reel } from '../types';

interface NotificationsViewProps {
  notifications: NotificationItem[];
  onSelectCreator: (user: User) => void;
  onMarkAllAsRead: () => void;
  onFollowBack: (userId: string) => void;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({
  notifications,
  onSelectCreator,
  onMarkAllAsRead,
  onFollowBack,
}) => {
  const [filter, setFilter] = useState<'all' | 'sparks' | 'comments' | 'follows'>('all');

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'sparks') return n.type === 'spark' || n.type === 'payout';
    if (filter === 'comments') return n.type === 'comment';
    if (filter === 'follows') return n.type === 'follow';
    return true;
  });

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'spark':
        return <Zap className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />;
      case 'like':
        return <Heart className="w-3.5 h-3.5 fill-red-500 text-red-500" />;
      case 'comment':
        return <MessageCircle className="w-3.5 h-3.5 text-sky-400" />;
      case 'follow':
        return <UserPlus className="w-3.5 h-3.5 text-emerald-400" />;
      case 'payout':
        return <DollarSign className="w-3.5 h-3.5 text-emerald-400" />;
    }
  };

  return (
    <div className="w-full h-full overflow-y-auto no-scrollbar bg-black text-white p-4 max-w-2xl mx-auto pb-24 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
        <div>
          <h2 className="text-lg font-black italic text-white uppercase tracking-wider flex items-center gap-2">
            <Bell className="w-5 h-5 text-red-500" />
            Activity Center
          </h2>
          <p className="text-xs font-semibold italic text-zinc-400">
            Real-time interactions, tips, and creator payouts
          </p>
        </div>

        <button
          onClick={onMarkAllAsRead}
          className="text-xs font-black italic text-yellow-400 hover:underline flex items-center gap-1"
        >
          <CheckCheck className="w-3.5 h-3.5" />
          Mark all read
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {(['all', 'sparks', 'comments', 'follows'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-black italic uppercase tracking-wider transition-all ${
              filter === tab
                ? 'bg-gradient-to-r from-red-600 to-yellow-500 text-black shadow-md'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            {tab === 'all'
              ? 'All'
              : tab === 'sparks'
              ? '⚡ Sparks & Payouts'
              : tab === 'comments'
              ? 'Comments'
              : 'Followers'}
          </button>
        ))}
      </div>

      {/* Notification items */}
      <div className="space-y-2.5">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12 text-zinc-500 font-bold italic text-xs">
            No notifications in this filter.
          </div>
        ) : (
          filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-3.5 rounded-2xl flex items-center justify-between gap-3 transition-colors border ${
                notif.isRead
                  ? 'bg-zinc-950 border-zinc-900'
                  : 'bg-zinc-900/70 border-zinc-800 shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative shrink-0">
                  <img
                    src={notif.user.avatar}
                    alt={notif.user.name}
                    className="w-11 h-11 rounded-full object-cover border border-zinc-700"
                  />
                  <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center">
                    {getIcon(notif.type)}
                  </span>
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-semibold italic text-zinc-200 leading-snug">
                    <span
                      onClick={() => onSelectCreator(notif.user)}
                      className="font-black italic text-white hover:underline cursor-pointer mr-1"
                    >
                      {notif.user.name}
                    </span>
                    {notif.content}
                  </p>
                  <span className="text-[10px] font-bold italic text-zinc-500">
                    {notif.time}
                  </span>
                </div>
              </div>

              {/* Action contextual button */}
              {notif.type === 'follow' && (
                <button
                  onClick={() => onFollowBack(notif.user.id)}
                  className="px-3 py-1.5 rounded-full bg-red-600 hover:bg-red-500 text-white text-[11px] font-black italic uppercase tracking-wider shrink-0 shadow"
                >
                  Follow
                </button>
              )}

              {notif.type === 'spark' && (
                <div className="px-2.5 py-1 rounded-xl bg-yellow-500/15 border border-yellow-500/30 text-yellow-400 text-xs font-black italic shrink-0">
                  +⚡
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
