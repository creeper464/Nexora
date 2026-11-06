export interface User {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  bio: string;
  verified: boolean;
  followersCount: number;
  followingCount: number;
  likesCount: number;
  links?: string[];
  isFollowing?: boolean;
  tier: 'Rising Star' | 'Partner' | 'Nexora Icon';
  totalEarnings?: number;
  coverImage?: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userHandle: string;
  text: string;
  createdAt: string;
  likesCount: number;
  isLiked?: boolean;
  replies?: Comment[];
}

export interface Reel {
  id: string;
  creator: User;
  videoUrl: string;
  posterUrl: string;
  caption: string;
  soundTitle: string;
  soundAuthor: string;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  savesCount: number;
  sparksReceived: number;
  isLiked: boolean;
  isSaved: boolean;
  isFollowing: boolean;
  tags: string[];
  category: 'Gaming' | 'Music' | 'Tech' | 'Fashion' | 'Comedy' | 'Cinema' | 'Sports';
  comments: Comment[];
  createdAt: string;
}

export interface Post {
  id: string;
  creator: User;
  mediaUrl: string;
  mediaType: 'photo' | 'video';
  caption: string;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  tags: string[];
  isLiked?: boolean;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp: string;
  isMe: boolean;
  mediaUrl?: string;
  audioDuration?: string;
}

export interface ChatConversation {
  id: string;
  name: string;
  avatar: string;
  isGroup: boolean;
  membersCount?: number;
  lastMessage: string;
  lastTimestamp: string;
  unreadCount: number;
  online: boolean;
  messages: ChatMessage[];
}

export interface NotificationItem {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'spark' | 'payout';
  user: User;
  content: string;
  time: string;
  isRead: boolean;
  amount?: number;
  targetId?: string;
}

export interface MonetizationData {
  walletBalance: number;
  pendingPayout: number;
  superSparksEarned: number;
  subscriberCount: number;
  estimatedMonthly: number;
  payoutHistory: {
    id: string;
    date: string;
    amount: number;
    method: string;
    status: 'Completed' | 'Processing';
  }[];
}
