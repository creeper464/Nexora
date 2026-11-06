import React, { useState } from 'react';
import {
  Home,
  Compass,
  Plus,
  MessageSquare,
  User as UserIcon,
  Bell,
  Sparkles,
  Smartphone,
  Monitor,
  Flame,
  Check,
} from 'lucide-react';
import { NexoraLogo } from './components/NexoraLogo';
import { ReelsFeed } from './components/ReelsFeed';
import { ExploreView } from './components/ExploreView';
import { CreateStudio } from './components/CreateStudio';
import { InboxView } from './components/InboxView';
import { ProfileView } from './components/ProfileView';
import { NotificationsView } from './components/NotificationsView';
import { CommentsDrawer } from './components/CommentsDrawer';
import { SuperSparksModal } from './components/SuperSparksModal';
import { ShareModal } from './components/ShareModal';
import { NexoraAIAssistant } from './components/NexoraAIAssistant';
import { SettingsModal } from './components/SettingsModal';

import {
  CURRENT_USER,
  SAMPLE_REELS,
  SAMPLE_POSTS,
  SAMPLE_CHATS,
  SAMPLE_NOTIFICATIONS,
  CREATORS,
} from './data/mockData';
import { Reel, Post, User, ChatConversation, NotificationItem } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'explore' | 'inbox' | 'profile' | 'notifications'>('home');
  const [deviceMode, setDeviceMode] = useState<'mobile' | 'desktop'>('mobile');

  // Modals & Drawers state
  const [createOpen, setCreateOpen] = useState(false);
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [commentsState, setCommentsState] = useState<{ isOpen: boolean; reel: Reel | null }>({
    isOpen: false,
    reel: null,
  });
  const [sparksState, setSparksState] = useState<{ isOpen: boolean; creator: User | null }>({
    isOpen: false,
    creator: null,
  });
  const [shareState, setShareState] = useState<{ isOpen: boolean; reel: Reel | null }>({
    isOpen: false,
    reel: null,
  });
  const [selectedCreator, setSelectedCreator] = useState<User | null>(null);

  // App core state
  const [currentUser, setCurrentUser] = useState<User>(CURRENT_USER);
  const [reels, setReels] = useState<Reel[]>(SAMPLE_REELS);
  const [posts, setPosts] = useState<Post[]>(SAMPLE_POSTS);
  const [conversations, setConversations] = useState<ChatConversation[]>(SAMPLE_CHATS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(SAMPLE_NOTIFICATIONS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Like Reel Handler
  const handleToggleLikeReel = (reelId: string) => {
    setReels((prev) =>
      prev.map((r) => {
        if (r.id === reelId) {
          const isLiked = !r.isLiked;
          return {
            ...r,
            isLiked,
            likesCount: isLiked ? r.likesCount + 1 : r.likesCount - 1,
          };
        }
        return r;
      })
    );
  };

  // Save Reel Handler
  const handleToggleSaveReel = (reelId: string) => {
    setReels((prev) =>
      prev.map((r) => {
        if (r.id === reelId) {
          const isSaved = !r.isSaved;
          showToast(isSaved ? 'Reel saved to bookmarks!' : 'Removed from saved');
          return {
            ...r,
            isSaved,
            savesCount: isSaved ? r.savesCount + 1 : r.savesCount - 1,
          };
        }
        return r;
      })
    );
  };

  // Follow Creator Handler
  const handleToggleFollow = (creatorId: string) => {
    setReels((prev) =>
      prev.map((r) => {
        if (r.creator.id === creatorId) {
          const nextFollowing = !r.isFollowing;
          return {
            ...r,
            isFollowing: nextFollowing,
            creator: {
              ...r.creator,
              followersCount: nextFollowing
                ? r.creator.followersCount + 1
                : r.creator.followersCount - 1,
            },
          };
        }
        return r;
      })
    );
    showToast('Updated following status');
  };

  // Add Comment Handler
  const handleAddComment = (text: string, replyToId?: string) => {
    if (!commentsState.reel) return;

    const newComment = {
      id: `comm_${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      userHandle: currentUser.handle,
      text,
      createdAt: 'Just now',
      likesCount: 0,
    };

    setReels((prev) =>
      prev.map((r) => {
        if (r.id === commentsState.reel?.id) {
          return {
            ...r,
            commentsCount: r.commentsCount + 1,
            comments: [newComment, ...r.comments],
          };
        }
        return r;
      })
    );

    // Update current active comments modal state
    setCommentsState((prev) => ({
      ...prev,
      reel: prev.reel
        ? {
            ...prev.reel,
            commentsCount: prev.reel.commentsCount + 1,
            comments: [newComment, ...prev.reel.comments],
          }
        : null,
    }));

    showToast('Comment posted!');
  };

  // Like Comment Handler
  const handleLikeComment = (commentId: string) => {
    if (!commentsState.reel) return;

    setReels((prev) =>
      prev.map((r) => {
        if (r.id === commentsState.reel?.id) {
          return {
            ...r,
            comments: r.comments.map((c) => {
              if (c.id === commentId) {
                const nextLiked = !c.isLiked;
                return {
                  ...c,
                  isLiked: nextLiked,
                  likesCount: nextLiked ? c.likesCount + 1 : c.likesCount - 1,
                };
              }
              return c;
            }),
          };
        }
        return r;
      })
    );

    // Sync modal state
    setCommentsState((prev) => ({
      ...prev,
      reel: prev.reel
        ? {
            ...prev.reel,
            comments: prev.reel.comments.map((c) => {
              if (c.id === commentId) {
                const nextLiked = !c.isLiked;
                return {
                  ...c,
                  isLiked: nextLiked,
                  likesCount: nextLiked ? c.likesCount + 1 : c.likesCount - 1,
                };
              }
              return c;
            }),
          }
        : null,
    }));
  };

  // Super Sparks Send Handler
  const handleSendSparks = (amount: number, message: string) => {
    if (!sparksState.creator) return;

    // Update sparks received count on reels by this creator
    setReels((prev) =>
      prev.map((r) => {
        if (r.creator.id === sparksState.creator?.id) {
          return {
            ...r,
            sparksReceived: r.sparksReceived + amount,
          };
        }
        return r;
      })
    );

    showToast(`⚡ ${amount} Super Sparks gifted to ${sparksState.creator.name}!`);
  };

  // Publish New Reel from Studio
  const handlePublishReel = (newReel: Reel) => {
    setReels((prev) => [newReel, ...prev]);
    setActiveTab('home');
    showToast('Your video is live on NEXORA!');
  };

  // Chat message send handler
  const handleSendMessage = (conversationId: string, text: string) => {
    const userMsg = {
      id: `msg_${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      text,
      timestamp: 'Just now',
      isMe: true,
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === conversationId) {
          return {
            ...c,
            lastMessage: text,
            lastTimestamp: 'Just now',
            messages: [...c.messages, userMsg],
          };
        }
        return c;
      })
    );

    // Simulate instant reply from friend
    setTimeout(() => {
      const replies = [
        'Awesome idea! Let’s collaborate on that drop.',
        'Checked it out, the visual quality is insane! ⚡',
        'Dropping my new sound pack tomorrow, will send you a preview!',
      ];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];

      const friendMsg = {
        id: `msg_rep_${Date.now()}`,
        senderId: 'friend',
        senderName: 'Marcus Ray',
        senderAvatar: '/src/assets/images/nexora_avatar_marcus_1793842294512.jpg',
        text: randomReply,
        timestamp: 'Just now',
        isMe: false,
      };

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === conversationId) {
            return {
              ...c,
              lastMessage: randomReply,
              lastTimestamp: 'Just now',
              messages: [...c.messages, friendMsg],
            };
          }
          return c;
        })
      );
    }, 1500);
  };

  const unreadNotifs = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="flex h-screen w-screen bg-black text-white overflow-hidden font-bold italic select-none">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-red-600 via-yellow-500 to-yellow-400 text-black px-4 py-2 rounded-full text-xs font-black italic shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
          <Check className="w-4 h-4 stroke-[3]" />
          {toastMessage}
        </div>
      )}

      {/* Main Container Wrapper (Responsive Mobile Frame or Fullscreen Desktop) */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Header Bar */}
        <header className="h-14 px-4 border-b border-zinc-900 bg-black/90 backdrop-blur-md flex items-center justify-between z-40 shrink-0">
          {/* Brand Logo & Slogan */}
          <div
            className="cursor-pointer"
            onClick={() => {
              setSelectedCreator(null);
              setActiveTab('home');
            }}
          >
            <NexoraLogo size="md" showText={true} showSlogan={false} />
          </div>

          {/* Right Header Zone */}
          <div className="flex items-center gap-2">
            {/* Desktop / Mobile Frame Viewport Switcher */}
            <div className="hidden lg:flex items-center bg-zinc-900 p-0.5 rounded-full border border-zinc-800 text-[10px] font-black uppercase mr-2">
              <button
                onClick={() => setDeviceMode('mobile')}
                className={`px-2.5 py-1 rounded-full flex items-center gap-1 transition-all ${
                  deviceMode === 'mobile'
                    ? 'bg-yellow-400 text-black shadow'
                    : 'text-zinc-400 hover:text-white'
                }`}
                title="Mobile Phone Experience"
              >
                <Smartphone className="w-3 h-3" />
                Mobile View
              </button>
              <button
                onClick={() => setDeviceMode('desktop')}
                className={`px-2.5 py-1 rounded-full flex items-center gap-1 transition-all ${
                  deviceMode === 'desktop'
                    ? 'bg-yellow-400 text-black shadow'
                    : 'text-zinc-400 hover:text-white'
                }`}
                title="Expanded Desktop Experience"
              >
                <Monitor className="w-3 h-3" />
                Full Width
              </button>
            </div>

            {/* AI Assistant Button ("NEXORA SPARK") */}
            <button
              onClick={() => setAiAssistantOpen(true)}
              className="px-3 py-1.5 rounded-full bg-gradient-to-r from-yellow-500 to-red-500 text-black text-xs font-black italic uppercase tracking-wider flex items-center gap-1.5 hover:brightness-110 active:scale-95 transition-all shadow-md shadow-yellow-500/20"
              title="Open NEXORA SPARK AI Assistant"
            >
              <Sparkles className="w-3.5 h-3.5 text-black" />
              <span className="hidden sm:inline">NEXORA SPARK</span>
            </button>

            {/* Notifications Bell */}
            <button
              onClick={() => {
                setSelectedCreator(null);
                setActiveTab('notifications');
              }}
              className="relative p-2 rounded-full text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
              title="Activity Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifs > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse border-2 border-black" />
              )}
            </button>
          </div>
        </header>

        {/* Viewport Content Area */}
        <div className="flex-1 overflow-hidden flex items-center justify-center bg-zinc-950">
          <div
            className={`w-full h-full relative transition-all duration-300 flex flex-col overflow-hidden ${
              deviceMode === 'mobile'
                ? 'max-w-[430px] border-x border-zinc-900 shadow-2xl bg-black'
                : 'w-full bg-black'
            }`}
          >
            {/* Main Active Tab Views */}
            <div className="flex-1 overflow-hidden relative">
              {activeTab === 'home' && (
                <ReelsFeed
                  reels={reels}
                  onSelectCreator={(creator) => {
                    setSelectedCreator(creator);
                    setActiveTab('profile');
                  }}
                  onOpenComments={(reel) => setCommentsState({ isOpen: true, reel })}
                  onOpenSparks={(creator) => setSparksState({ isOpen: true, creator })}
                  onOpenShare={(reel) => setShareState({ isOpen: true, reel })}
                  onToggleLike={handleToggleLikeReel}
                  onToggleSave={handleToggleSaveReel}
                  onToggleFollow={handleToggleFollow}
                />
              )}

              {activeTab === 'explore' && (
                <ExploreView
                  reels={reels}
                  onSelectReel={(reel) => {
                    setCommentsState({ isOpen: false, reel: null });
                    setActiveTab('home');
                  }}
                  onSelectCreator={(creator) => {
                    setSelectedCreator(creator);
                    setActiveTab('profile');
                  }}
                />
              )}

              {activeTab === 'inbox' && (
                <InboxView
                  conversations={conversations}
                  currentUser={currentUser}
                  onSendMessage={handleSendMessage}
                  onOpenSparks={(user) => setSparksState({ isOpen: true, creator: user })}
                />
              )}

              {activeTab === 'profile' && (
                <ProfileView
                  user={selectedCreator || currentUser}
                  isCurrentUser={!selectedCreator || selectedCreator.id === currentUser.id}
                  userReels={reels.filter((r) => r.creator.id === (selectedCreator?.id || currentUser.id))}
                  userPosts={posts.filter((p) => p.creator.id === (selectedCreator?.id || currentUser.id))}
                  savedReels={reels.filter((r) => r.isSaved)}
                  onSelectReel={(reel) => setActiveTab('home')}
                  onOpenSettings={() => setSettingsOpen(true)}
                  onOpenSparks={(user) => setSparksState({ isOpen: true, creator: user })}
                  onToggleFollow={handleToggleFollow}
                  onUpdateBio={(newBio, newName) => {
                    setCurrentUser((prev) => ({ ...prev, bio: newBio, name: newName }));
                    showToast('Profile updated!');
                  }}
                />
              )}

              {activeTab === 'notifications' && (
                <NotificationsView
                  notifications={notifications}
                  onSelectCreator={(creator) => {
                    setSelectedCreator(creator);
                    setActiveTab('profile');
                  }}
                  onMarkAllAsRead={() => {
                    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
                    showToast('All notifications marked as read');
                  }}
                  onFollowBack={handleToggleFollow}
                />
              )}
            </div>

            {/* Bottom Navigation Bar */}
            <nav className="h-16 px-4 bg-black/95 backdrop-blur-md border-t border-zinc-900 grid grid-cols-5 items-center z-40 shrink-0">
              {/* Tab 1: Home (Reels) */}
              <button
                onClick={() => {
                  setSelectedCreator(null);
                  setActiveTab('home');
                }}
                className={`flex flex-col items-center justify-center gap-1 transition-all ${
                  activeTab === 'home'
                    ? 'text-yellow-400 scale-105'
                    : 'text-zinc-500 hover:text-white'
                }`}
              >
                <Home className="w-5 h-5" />
                <span className="text-[10px] font-black italic uppercase tracking-wider">
                  Home
                </span>
              </button>

              {/* Tab 2: Explore */}
              <button
                onClick={() => {
                  setSelectedCreator(null);
                  setActiveTab('explore');
                }}
                className={`flex flex-col items-center justify-center gap-1 transition-all ${
                  activeTab === 'explore'
                    ? 'text-yellow-400 scale-105'
                    : 'text-zinc-500 hover:text-white'
                }`}
              >
                <Compass className="w-5 h-5" />
                <span className="text-[10px] font-black italic uppercase tracking-wider">
                  Explore
                </span>
              </button>

              {/* Tab 3: Create Button (Signature Plus Action in Red/Yellow Glow) */}
              <div className="flex justify-center items-center">
                <button
                  onClick={() => setCreateOpen(true)}
                  className="w-12 h-10 rounded-2xl bg-gradient-to-tr from-red-600 via-red-500 to-yellow-400 flex items-center justify-center text-black font-black shadow-[0_0_18px_rgba(239,68,68,0.5)] hover:scale-110 active:scale-95 transition-all cursor-pointer"
                  title="Create (Video, Photo, Story, Live, Post)"
                >
                  <Plus className="w-6 h-6 stroke-[3] text-black" />
                </button>
              </div>

              {/* Tab 4: Inbox */}
              <button
                onClick={() => {
                  setSelectedCreator(null);
                  setActiveTab('inbox');
                }}
                className={`relative flex flex-col items-center justify-center gap-1 transition-all ${
                  activeTab === 'inbox'
                    ? 'text-yellow-400 scale-105'
                    : 'text-zinc-500 hover:text-white'
                }`}
              >
                <div className="relative">
                  <MessageSquare className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-600" />
                </div>
                <span className="text-[10px] font-black italic uppercase tracking-wider">
                  Inbox
                </span>
              </button>

              {/* Tab 5: Profile */}
              <button
                onClick={() => {
                  setSelectedCreator(null);
                  setActiveTab('profile');
                }}
                className={`flex flex-col items-center justify-center gap-1 transition-all ${
                  activeTab === 'profile' && !selectedCreator
                    ? 'text-yellow-400 scale-105'
                    : 'text-zinc-500 hover:text-white'
                }`}
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className={`w-5 h-5 rounded-full object-cover border ${
                    activeTab === 'profile' && !selectedCreator
                      ? 'border-yellow-400'
                      : 'border-zinc-700'
                  }`}
                />
                <span className="text-[10px] font-black italic uppercase tracking-wider">
                  Profile
                </span>
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Create Studio Modal */}
      <CreateStudio
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        currentUser={currentUser}
        onPublishReel={handlePublishReel}
        onOpenAIAssistant={() => setAiAssistantOpen(true)}
      />

      {/* Built-in AI Assistant ("NEXORA SPARK") Modal */}
      <NexoraAIAssistant
        isOpen={aiAssistantOpen}
        onClose={() => setAiAssistantOpen(false)}
        onApplyPromptToCaption={(captionText) => {
          setCreateOpen(true);
        }}
      />

      {/* Comments Drawer Sheet */}
      {commentsState.reel && (
        <CommentsDrawer
          isOpen={commentsState.isOpen}
          onClose={() => setCommentsState({ isOpen: false, reel: null })}
          comments={commentsState.reel.comments}
          onAddComment={handleAddComment}
          onLikeComment={handleLikeComment}
        />
      )}

      {/* Super Sparks Tip Modal */}
      {sparksState.creator && (
        <SuperSparksModal
          isOpen={sparksState.isOpen}
          onClose={() => setSparksState({ isOpen: false, creator: null })}
          creator={sparksState.creator}
          onSendSparks={handleSendSparks}
        />
      )}

      {/* Share Modal Sheet */}
      {shareState.reel && (
        <ShareModal
          isOpen={shareState.isOpen}
          onClose={() => setShareState({ isOpen: false, reel: null })}
          reel={shareState.reel}
          onSendViaDM={(recipient) => {
            showToast(`Reel shared with ${recipient.name}!`);
            setShareState({ isOpen: false, reel: null });
          }}
        />
      )}

      {/* Privacy and Security Settings Modal */}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  );
}
