import React, { useState, useRef, useEffect } from 'react';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Zap,
  Volume2,
  VolumeX,
  Plus,
  Check,
  Disc3,
  Music,
  Play,
  Pause,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Reel, User } from '../types';

interface ReelsFeedProps {
  reels: Reel[];
  onSelectCreator: (creator: User) => void;
  onOpenComments: (reel: Reel) => void;
  onOpenSparks: (creator: User) => void;
  onOpenShare: (reel: Reel) => void;
  onToggleLike: (reelId: string) => void;
  onToggleSave: (reelId: string) => void;
  onToggleFollow: (creatorId: string) => void;
}

export const ReelsFeed: React.FC<ReelsFeedProps> = ({
  reels,
  onSelectCreator,
  onOpenComments,
  onOpenSparks,
  onOpenShare,
  onToggleLike,
  onToggleSave,
  onToggleFollow,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedTab, setFeedTab] = useState<'foryou' | 'following' | 'live'>('foryou');
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showPlayIcon, setShowPlayIcon] = useState(false);
  const [showHeartBurst, setShowHeartBurst] = useState(false);
  const [heartBurstPos, setHeartBurstPos] = useState({ x: 50, y: 50 });
  const [progress, setProgress] = useState(0);

  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const lastTapRef = useRef<number>(0);

  const filteredReels =
    feedTab === 'following'
      ? reels.filter((r) => r.isFollowing)
      : reels;

  const currentReel = filteredReels[currentIndex] || reels[0];

  useEffect(() => {
    // Play active video, pause others
    videoRefs.current.forEach((video, idx) => {
      if (video) {
        if (idx === currentIndex) {
          video.currentTime = 0;
          video.muted = isMuted;
          video.play().catch(() => {
            // Autoplay policy fallback
          });
          setIsPlaying(true);
        } else {
          video.pause();
        }
      }
    });
  }, [currentIndex, isMuted, filteredReels]);

  const handleNext = () => {
    if (currentIndex < filteredReels.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleVideoClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;

    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      // Double tap triggered: Heart explosion!
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      setHeartBurstPos({ x, y });
      setShowHeartBurst(true);
      setTimeout(() => setShowHeartBurst(false), 900);

      if (!currentReel.isLiked) {
        onToggleLike(currentReel.id);
      }
    } else {
      // Single tap toggle play/pause
      const activeVideo = videoRefs.current[currentIndex];
      if (activeVideo) {
        if (activeVideo.paused) {
          activeVideo.play();
          setIsPlaying(true);
        } else {
          activeVideo.pause();
          setIsPlaying(false);
        }
        setShowPlayIcon(true);
        setTimeout(() => setShowPlayIcon(false), 600);
      }
    }
    lastTapRef.current = now;
  };

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    if (video.duration) {
      setProgress((video.currentTime / video.duration) * 100);
    }
  };

  if (!currentReel) {
    return (
      <div className="h-full flex items-center justify-center text-center p-8 text-zinc-400 font-bold italic">
        No reels available in this category.
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-black overflow-hidden select-none flex items-center justify-center">
      {/* Top Header Floating Tabs */}
      <div className="absolute top-3 left-0 right-0 z-30 flex items-center justify-center gap-6 text-sm font-black italic uppercase tracking-wider text-white drop-shadow-md">
        <button
          onClick={() => {
            setFeedTab('following');
            setCurrentIndex(0);
          }}
          className={`transition-all pb-1 ${
            feedTab === 'following'
              ? 'text-white border-b-2 border-red-500 scale-105'
              : 'text-white/60 hover:text-white'
          }`}
        >
          Following
        </button>
        <button
          onClick={() => {
            setFeedTab('foryou');
            setCurrentIndex(0);
          }}
          className={`transition-all pb-1 ${
            feedTab === 'foryou'
              ? 'text-white border-b-2 border-yellow-400 scale-110 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]'
              : 'text-white/60 hover:text-white'
          }`}
        >
          For You
        </button>
        <button
          onClick={() => setFeedTab('live')}
          className={`transition-all pb-1 flex items-center gap-1.5 ${
            feedTab === 'live'
              ? 'text-red-500 border-b-2 border-red-500 scale-105'
              : 'text-white/60 hover:text-red-400'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
          Live
        </button>
      </div>

      {/* Mute / Unmute Button */}
      <button
        onClick={() => setIsMuted(!isMuted)}
        className="absolute top-3.5 right-4 z-30 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center border border-white/10 hover:bg-black/60 transition-colors"
      >
        {isMuted ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5 text-yellow-400" />}
      </button>

      {/* Vertical Navigation Controls for Desktop/Tablet */}
      <div className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-30 flex-col gap-3">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="w-10 h-10 rounded-full bg-zinc-900/80 backdrop-blur-md text-white flex items-center justify-center border border-zinc-700 disabled:opacity-20 hover:bg-zinc-800 transition-all"
          title="Previous Reel (Up)"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
        <button
          onClick={handleNext}
          disabled={currentIndex >= filteredReels.length - 1}
          className="w-10 h-10 rounded-full bg-zinc-900/80 backdrop-blur-md text-white flex items-center justify-center border border-zinc-700 disabled:opacity-20 hover:bg-zinc-800 transition-all"
          title="Next Reel (Down)"
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>

      {/* Active Reel Container */}
      <div
        className="relative w-full h-full max-w-[430px] mx-auto bg-zinc-950 flex items-center justify-center overflow-hidden"
        onClick={handleVideoClick}
      >
        {/* HTML5 Video element */}
        <video
          ref={(el) => {
            videoRefs.current[currentIndex] = el;
          }}
          src={currentReel.videoUrl}
          poster={currentReel.posterUrl}
          loop
          playsInline
          muted={isMuted}
          onTimeUpdate={handleTimeUpdate}
          className="w-full h-full object-cover"
        />

        {/* Ambient Dark Gradient Scrims for Legibility */}
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none" />

        {/* Play/Pause Center Indicator */}
        {showPlayIcon && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            <div className="w-20 h-20 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white animate-scale">
              {isPlaying ? <Play className="w-10 h-10 ml-1 text-white" /> : <Pause className="w-10 h-10 text-white" />}
            </div>
          </div>
        )}

        {/* Heart Burst Explosion on Double Tap */}
        {showHeartBurst && (
          <div
            className="absolute pointer-events-none z-30 animate-heart-burst"
            style={{
              left: `${heartBurstPos.x}%`,
              top: `${heartBurstPos.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <Heart className="w-24 h-24 fill-red-500 text-yellow-400 stroke-2 drop-shadow-[0_0_30px_#EF4444]" />
          </div>
        )}

        {/* Right Floating Actions Toolbar */}
        <div
          className="absolute right-3 bottom-16 z-20 flex flex-col items-center gap-4 text-white"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Creator Avatar & Follow (+) badge */}
          <div className="relative group cursor-pointer mb-2" onClick={() => onSelectCreator(currentReel.creator)}>
            <img
              src={currentReel.creator.avatar}
              alt={currentReel.creator.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-lg"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFollow(currentReel.creator.id);
              }}
              className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full flex items-center justify-center shadow-md transition-all ${
                currentReel.isFollowing
                  ? 'bg-zinc-800 text-emerald-400 border border-emerald-400/50'
                  : 'bg-red-600 text-white hover:scale-110'
              }`}
            >
              {currentReel.isFollowing ? <Check className="w-3 h-3 stroke-[3]" /> : <Plus className="w-3.5 h-3.5 stroke-[3]" />}
            </button>
          </div>

          {/* Like Button */}
          <button
            onClick={() => onToggleLike(currentReel.id)}
            className="flex flex-col items-center gap-1 group active:scale-90 transition-transform"
          >
            <div
              className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
                currentReel.isLiked
                  ? 'bg-red-600/30 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]'
                  : 'bg-black/40 text-white group-hover:bg-black/60'
              }`}
            >
              <Heart
                className={`w-6 h-6 transition-all ${
                  currentReel.isLiked ? 'fill-red-500 text-red-500 scale-110' : 'text-white'
                }`}
              />
            </div>
            <span className="text-[11px] font-black italic drop-shadow-md tabular-nums">
              {currentReel.likesCount >= 1000
                ? `${(currentReel.likesCount / 1000).toFixed(1)}k`
                : currentReel.likesCount}
            </span>
          </button>

          {/* Comments Button */}
          <button
            onClick={() => onOpenComments(currentReel)}
            className="flex flex-col items-center gap-1 group active:scale-90 transition-transform"
          >
            <div className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-black/60 transition-colors">
              <MessageCircle className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-black italic drop-shadow-md tabular-nums">
              {currentReel.commentsCount >= 1000
                ? `${(currentReel.commentsCount / 1000).toFixed(1)}k`
                : currentReel.commentsCount}
            </span>
          </button>

          {/* Super Sparks (Monetization Tip) Button */}
          <button
            onClick={() => onOpenSparks(currentReel.creator)}
            className="flex flex-col items-center gap-1 group active:scale-90 transition-transform"
          >
            <div className="w-11 h-11 rounded-full bg-yellow-400 text-black flex items-center justify-center shadow-[0_0_20px_rgba(250,204,21,0.6)] group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6 fill-black animate-pulse" />
            </div>
            <span className="text-[10px] font-black italic text-yellow-400 drop-shadow-md">
              Tip ⚡
            </span>
          </button>

          {/* Bookmark / Save Button */}
          <button
            onClick={() => onToggleSave(currentReel.id)}
            className="flex flex-col items-center gap-1 group active:scale-90 transition-transform"
          >
            <div
              className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
                currentReel.isSaved
                  ? 'bg-yellow-500/30 text-yellow-400'
                  : 'bg-black/40 text-white group-hover:bg-black/60'
              }`}
            >
              <Bookmark
                className={`w-6 h-6 ${currentReel.isSaved ? 'fill-yellow-400 text-yellow-400' : 'text-white'}`}
              />
            </div>
            <span className="text-[11px] font-black italic drop-shadow-md tabular-nums">
              {currentReel.savesCount >= 1000
                ? `${(currentReel.savesCount / 1000).toFixed(1)}k`
                : currentReel.savesCount}
            </span>
          </button>

          {/* Share Button */}
          <button
            onClick={() => onOpenShare(currentReel)}
            className="flex flex-col items-center gap-1 group active:scale-90 transition-transform"
          >
            <div className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-black/60 transition-colors">
              <Share2 className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-black italic drop-shadow-md tabular-nums">
              {currentReel.sharesCount >= 1000
                ? `${(currentReel.sharesCount / 1000).toFixed(1)}k`
                : currentReel.sharesCount}
            </span>
          </button>

          {/* Rotating Vinyl Audio Disc */}
          <div className="relative mt-2">
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-zinc-900 to-zinc-700 border-2 border-zinc-600 flex items-center justify-center animate-[spin_4s_linear_infinite] shadow-lg">
              <img
                src={currentReel.creator.avatar}
                alt="album"
                className="w-5 h-5 rounded-full object-cover"
              />
            </div>
            <Music className="w-3.5 h-3.5 text-yellow-400 absolute -top-1 -right-1 animate-bounce" />
          </div>
        </div>

        {/* Bottom Overlay: Creator info, Caption, Sound Marquee */}
        <div
          className="absolute left-4 right-16 bottom-6 z-20 space-y-2 text-white pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Creator name & handle */}
          <div
            className="flex items-center gap-2 cursor-pointer w-fit"
            onClick={() => onSelectCreator(currentReel.creator)}
          >
            <span className="text-base font-black italic text-white drop-shadow-md hover:underline">
              {currentReel.creator.name}
            </span>
            {currentReel.creator.verified && (
              <span className="w-4 h-4 rounded-full bg-sky-500 text-white text-[9px] flex items-center justify-center font-bold">
                ✓
              </span>
            )}
            <span className="text-xs font-bold italic text-zinc-400">
              {currentReel.creator.handle}
            </span>
          </div>

          {/* Caption & Hashtags */}
          <p className="text-sm font-semibold italic text-zinc-100 line-clamp-2 leading-snug drop-shadow-md">
            {currentReel.caption}
          </p>

          {/* Audio track ticker */}
          <div className="flex items-center gap-2 text-xs font-bold italic text-yellow-400/90 pt-1">
            <Music className="w-3.5 h-3.5 shrink-0 animate-pulse text-yellow-400" />
            <div className="overflow-hidden whitespace-nowrap w-48 text-[11px]">
              <span className="inline-block animate-[marquee_12s_linear_infinite]">
                {currentReel.soundTitle} • {currentReel.soundAuthor}
              </span>
            </div>
          </div>
        </div>

        {/* Video Bottom Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-800/80 z-20">
          <div
            className="h-full bg-gradient-to-r from-red-500 to-yellow-400 transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
