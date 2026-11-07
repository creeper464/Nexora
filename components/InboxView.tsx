import React, { useState } from 'react';
import {
  Search,
  Send,
  ArrowLeft,
  Users,
  MessageSquare,
  Sparkles,
  Zap,
  Mic,
  Smile,
  Image as ImageIcon,
  CheckCheck,
  Check,
} from 'lucide-react';
import { ChatConversation, ChatMessage, User } from '../types';

interface InboxViewProps {
  conversations: ChatConversation[];
  onSendMessage: (conversationId: string, text: string) => void;
  onOpenSparks: (user: User) => void;
  currentUser: User;
}

export const InboxView: React.FC<InboxViewProps> = ({
  conversations,
  onSendMessage,
  onOpenSparks,
  currentUser,
}) => {
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'direct' | 'groups'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [messageInput, setMessageInput] = useState('');

  const activeChat = conversations.find((c) => c.id === activeChatId);

  const filteredConversations = conversations.filter((c) => {
    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'direct' && !c.isGroup) ||
      (activeTab === 'groups' && c.isGroup);

    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeChatId) return;

    onSendMessage(activeChatId, messageInput.trim());
    setMessageInput('');
  };

  return (
    <div className="w-full h-full flex bg-black text-white overflow-hidden pb-16 md:pb-0">
      {/* Conversations List (Sidebar on Desktop, Full view on Mobile when no active chat) */}
      <div
        className={`w-full md:w-80 lg:w-96 flex flex-col border-r border-zinc-800 bg-zinc-950 ${
          activeChatId ? 'hidden md:flex' : 'flex'
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black italic text-white uppercase tracking-wider flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-red-500" />
              Direct Messages
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-red-600/20 text-red-400 text-[10px] font-black italic uppercase">
              Encrypted
            </span>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-3 py-2 text-xs font-bold italic text-white placeholder:text-zinc-500 focus:outline-none focus:border-yellow-400"
            />
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-2">
            {(['all', 'direct', 'groups'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1 rounded-lg text-xs font-black italic uppercase tracking-wider transition-colors ${
                  activeTab === tab
                    ? 'bg-zinc-800 text-yellow-400'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {tab === 'all' ? 'All' : tab === 'direct' ? 'Direct' : 'Groups'}
              </button>
            ))}
          </div>
        </div>

        {/* List of chats */}
        <div className="flex-1 overflow-y-auto no-scrollbar divide-y divide-zinc-900">
          {filteredConversations.length === 0 ? (
            <div className="text-center py-12 text-zinc-500 font-bold italic text-xs">
              No conversations found.
            </div>
          ) : (
            filteredConversations.map((chat) => {
              const isSelected = chat.id === activeChatId;
              return (
                <div
                  key={chat.id}
                  onClick={() => setActiveChatId(chat.id)}
                  className={`flex items-center gap-3 p-3.5 cursor-pointer transition-colors ${
                    isSelected ? 'bg-zinc-900/80 border-l-4 border-yellow-400' : 'hover:bg-zinc-900/40'
                  }`}
                >
                  <div className="relative shrink-0">
                    <img
                      src={chat.avatar}
                      alt={chat.name}
                      className="w-12 h-12 rounded-full object-cover border border-zinc-700"
                    />
                    {chat.online && (
                      <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-black" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs font-black italic text-white truncate flex items-center gap-1">
                        {chat.isGroup && <Users className="w-3 h-3 text-yellow-400" />}
                        {chat.name}
                      </span>
                      <span className="text-[10px] font-bold italic text-zinc-500 shrink-0">
                        {chat.lastTimestamp}
                      </span>
                    </div>
                    <p className="text-xs font-semibold italic text-zinc-400 truncate">
                      {chat.lastMessage}
                    </p>
                  </div>

                  {chat.unreadCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-red-600 text-white text-[10px] font-black italic flex items-center justify-center shrink-0">
                      {chat.unreadCount}
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Active Conversation View */}
      <div
        className={`flex-1 flex flex-col bg-black ${
          !activeChatId ? 'hidden md:flex items-center justify-center' : 'flex'
        }`}
      >
        {activeChat ? (
          <>
            {/* Conversation Header */}
            <div className="px-4 py-3 border-b border-zinc-800 bg-zinc-950 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveChatId(null)}
                  className="md:hidden p-1.5 text-zinc-400 hover:text-white rounded-full bg-zinc-900"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <img
                  src={activeChat.avatar}
                  alt={activeChat.name}
                  className="w-10 h-10 rounded-full object-cover border border-zinc-700"
                />
                <div>
                  <div className="text-sm font-black italic text-white flex items-center gap-1.5">
                    {activeChat.name}
                    {activeChat.isGroup && (
                      <span className="text-[10px] text-zinc-400 font-bold">
                        ({activeChat.membersCount} members)
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] font-bold italic text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    {activeChat.online ? 'Active now' : 'Seen recently'}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const friendUser: User = {
                      id: activeChat.id,
                      name: activeChat.name,
                      handle: `@${activeChat.name.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
                      avatar: activeChat.avatar,
                      bio: 'Nexora creator',
                      verified: true,
                      followersCount: 154000,
                      followingCount: 300,
                      likesCount: 500000,
                      tier: 'Partner',
                    };
                    onOpenSparks(friendUser);
                  }}
                  className="px-3 py-1.5 rounded-full bg-yellow-400 text-black text-xs font-black italic uppercase tracking-wider flex items-center gap-1 hover:brightness-110 shadow-md"
                >
                  <Zap className="w-3.5 h-3.5 fill-black" />
                  Gift Sparks
                </button>
              </div>
            </div>

            {/* Messages Thread */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 no-scrollbar bg-gradient-to-b from-zinc-950/40 to-black">
              {activeChat.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-end gap-2 ${msg.isMe ? 'justify-end' : 'justify-start'}`}
                >
                  {!msg.isMe && (
                    <img
                      src={msg.senderAvatar}
                      alt={msg.senderName}
                      className="w-7 h-7 rounded-full object-cover border border-zinc-700 shrink-0 mb-1"
                    />
                  )}
                  <div
                    className={`max-w-[75%] rounded-2xl p-3.5 text-xs font-bold italic ${
                      msg.isMe
                        ? 'bg-gradient-to-r from-red-600 to-yellow-500 text-black font-black'
                        : 'bg-zinc-900 border border-zinc-800 text-white'
                    }`}
                  >
                    {!msg.isMe && activeChat.isGroup && (
                      <div className="text-[10px] text-yellow-400 mb-1 font-black">
                        {msg.senderName}
                      </div>
                    )}
                    <p className="leading-relaxed">{msg.text}</p>
                    <div
                      className={`text-[9px] mt-1 text-right flex items-center justify-end gap-1 ${
                        msg.isMe ? 'text-black/70' : 'text-zinc-500'
                      }`}
                    >
                      {msg.timestamp}
                      {msg.isMe && <CheckCheck className="w-3 h-3 inline" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Composer */}
            <form
              onSubmit={handleSend}
              className="p-3 border-t border-zinc-800 bg-zinc-950 flex items-center gap-2"
            >
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder={`Message ${activeChat.name}...`}
                className="flex-1 bg-zinc-900 border border-zinc-800 text-white rounded-full px-4 py-2.5 text-xs font-bold italic placeholder:text-zinc-500 focus:outline-none focus:border-yellow-400"
              />
              <button
                type="submit"
                disabled={!messageInput.trim()}
                className="w-10 h-10 rounded-full bg-gradient-to-tr from-red-600 to-yellow-500 text-black flex items-center justify-center font-black disabled:opacity-40 hover:brightness-110 active:scale-95 transition-all shadow-md shrink-0"
              >
                <Send className="w-4 h-4 ml-0.5" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-8 space-y-3">
            <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500">
              <MessageSquare className="w-8 h-8" />
            </div>
            <h3 className="text-base font-black italic text-white uppercase tracking-wider">
              Your Messages
            </h3>
            <p className="text-xs font-bold italic text-zinc-400 max-w-xs">
              Select a chat to connect with fellow creators, collaborate on projects, or send Super Sparks.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
