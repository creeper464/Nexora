import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Camera,
  Video,
  Radio,
  Image as ImageIcon,
  Sparkles,
  Zap,
  RotateCcw,
  Sliders,
  Check,
  Upload,
  Layers,
  Heart,
  MessageCircle,
  Eye,
} from 'lucide-react';
import { Reel, Post, User } from '../types';

interface CreateStudioProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onPublishReel: (newReel: Reel) => void;
  onOpenAIAssistant: () => void;
}

type CreateMode = 'video' | 'photo' | 'story' | 'live' | 'post';

export const CreateStudio: React.FC<CreateStudioProps> = ({
  isOpen,
  onClose,
  currentUser,
  onPublishReel,
  onOpenAIAssistant,
}) => {
  const [mode, setMode] = useState<CreateMode>('video');
  const [speed, setSpeed] = useState<string>('1x');
  const [filter, setFilter] = useState<string>('normal');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [caption, setCaption] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>(['#NexoraCreators', '#Viral2026']);
  const [monetizeSparks, setMonetizeSparks] = useState<boolean>(true);
  const [soundTitle, setSoundTitle] = useState<string>('Original Sound - Alex Vance');
  const [uploadedMediaUrl, setUploadedMediaUrl] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [isLiveStreaming, setIsLiveStreaming] = useState<boolean>(false);
  const [liveViewers, setLiveViewers] = useState<number>(1280);
  const [liveComments, setLiveComments] = useState<{ id: string; user: string; text: string }[]>([
    { id: '1', user: 'Marcus', text: 'Mic audio is crystal clear! 🔊' },
    { id: '2', user: 'Zara', text: 'That studio lighting is fire ⚡' },
  ]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => {
          if (prev >= 60) {
            setIsRecording(false);
            clearInterval(timerRef.current);
            return 60;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  // Live simulation ticks
  useEffect(() => {
    let interval: any;
    if (isLiveStreaming) {
      interval = setInterval(() => {
        setLiveViewers((prev) => prev + Math.floor(Math.random() * 15 - 5));
        const newComments = [
          'Sent 100 Sparks! ⚡',
          'Greetings from Tokyo!',
          'Drop the bass! 💥',
          'Loving this stream!',
          'What camera are you using?',
        ];
        const randomUser = ['Kai_99', 'NeonRider', 'Maya_SF', 'AeroVibe'][Math.floor(Math.random() * 4)];
        const randomText = newComments[Math.floor(Math.random() * newComments.length)];

        setLiveComments((prev) => [...prev.slice(-6), { id: String(Date.now()), user: randomUser, text: randomText }]);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isLiveStreaming]);

  if (!isOpen) return null;

  const filtersList = [
    { id: 'normal', name: 'Original', css: '' },
    { id: 'cyberpunk', name: 'Cyberpunk', css: 'contrast-125 saturate-150 hue-rotate-15' },
    { id: 'noir', name: 'Noir 35mm', css: 'grayscale contrast-150' },
    { id: 'sunset', name: 'Sunset Gold', css: 'sepia-50 brightness-110 saturate-125' },
    { id: 'neon_red', name: 'Crimson Glow', css: 'contrast-125 saturate-200' },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadedMediaUrl(url);
    }
  };

  const handlePublish = () => {
    setIsPublishing(true);
    setTimeout(() => {
      const newReel: Reel = {
        id: `reel_${Date.now()}`,
        creator: currentUser,
        videoUrl:
          uploadedMediaUrl ||
          'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        posterUrl: '/src/assets/images/nexora_cover_cyber_1793842294301.jpg',
        caption:
          caption.trim() ||
          'Fresh creative drop on NEXORA! Built with passion. ⚡ #NexoraCreators #Viral2026',
        soundTitle: soundTitle,
        soundAuthor: `${currentUser.name} • Original Audio`,
        likesCount: 1,
        commentsCount: 0,
        sharesCount: 0,
        savesCount: 0,
        sparksReceived: 50,
        isLiked: true,
        isSaved: false,
        isFollowing: false,
        tags: selectedTags,
        category: 'Tech',
        comments: [],
        createdAt: 'Just now',
      };

      onPublishReel(newReel);
      setIsPublishing(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/90 backdrop-blur-md">
      <div className="relative w-full h-full sm:h-[90vh] max-w-xl bg-black sm:border sm:border-zinc-800 sm:rounded-3xl flex flex-col overflow-hidden shadow-2xl">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 z-20 bg-gradient-to-b from-black/80 to-transparent">
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <span className="text-sm font-black italic uppercase text-white tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              NEXORA Studio
            </span>
          </div>

          <button
            onClick={onOpenAIAssistant}
            className="px-3 py-1.5 rounded-full bg-yellow-400 text-black text-xs font-black italic uppercase tracking-wider flex items-center gap-1 hover:brightness-110 shadow-md"
            title="Ask AI Copilot for Hook & Script"
          >
            <Sparkles className="w-3.5 h-3.5" />
            AI Hook
          </button>
        </div>

        {/* Viewport / Camera Canvas Area */}
        <div className="relative flex-1 bg-zinc-950 overflow-hidden flex items-center justify-center">
          {/* Simulated Camera Feed with Applied Filter */}
          <div
            className={`w-full h-full relative flex items-center justify-center transition-all ${
              filtersList.find((f) => f.id === filter)?.css
            }`}
          >
            {uploadedMediaUrl ? (
              <video
                src={uploadedMediaUrl}
                autoPlay
                loop
                muted
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="relative w-full h-full flex flex-col items-center justify-center bg-gradient-to-tr from-zinc-950 via-zinc-900 to-black text-center p-6">
                <img
                  src="/src/assets/images/nexora_cover_cyber_1793842294301.jpg"
                  alt="Studio stage"
                  className="absolute inset-0 w-full h-full object-cover opacity-35"
                />

                {/* Viewfinder Grid Crosshairs */}
                <div className="absolute inset-8 border border-white/20 rounded-2xl pointer-events-none flex items-center justify-center">
                  <div className="w-6 h-6 border-t-2 border-l-2 border-yellow-400 absolute top-0 left-0" />
                  <div className="w-6 h-6 border-t-2 border-r-2 border-yellow-400 absolute top-0 right-0" />
                  <div className="w-6 h-6 border-b-2 border-l-2 border-yellow-400 absolute bottom-0 left-0" />
                  <div className="w-6 h-6 border-b-2 border-r-2 border-yellow-400 absolute bottom-0 right-0" />
                  <div className="w-4 h-4 rounded-full border border-red-500/80" />
                </div>

                {/* Live stream broadcast overlay */}
                {mode === 'live' && isLiveStreaming && (
                  <div className="absolute inset-0 z-10 flex flex-col justify-between p-4 pointer-events-none">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 bg-red-600 px-3 py-1 rounded-full text-white text-xs font-black italic uppercase tracking-wider animate-pulse">
                        <Radio className="w-3.5 h-3.5" />
                        LIVE STREAMING
                      </div>
                      <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black italic text-white">
                        <Eye className="w-3.5 h-3.5 text-yellow-400" />
                        {liveViewers} watching
                      </div>
                    </div>

                    {/* Incoming comments feed */}
                    <div className="space-y-1.5 max-w-xs text-left">
                      {liveComments.map((c) => (
                        <div
                          key={c.id}
                          className="px-3 py-1 rounded-xl bg-black/60 backdrop-blur-md text-xs font-bold italic text-white"
                        >
                          <span className="text-yellow-400 mr-1.5">{c.user}:</span>
                          {c.text}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Status indicator */}
                {!isLiveStreaming && (
                  <div className="z-10 space-y-2 max-w-xs">
                    <div className="w-14 h-14 rounded-full bg-zinc-800/80 border border-zinc-700 mx-auto flex items-center justify-center text-yellow-400 shadow-xl">
                      {mode === 'video' && <Video className="w-7 h-7" />}
                      {mode === 'photo' && <Camera className="w-7 h-7" />}
                      {mode === 'story' && <Layers className="w-7 h-7" />}
                      {mode === 'live' && <Radio className="w-7 h-7" />}
                      {mode === 'post' && <ImageIcon className="w-7 h-7" />}
                    </div>
                    <h4 className="text-base font-black italic text-white uppercase tracking-wider">
                      Ready to {mode}
                    </h4>
                    <p className="text-xs font-medium italic text-zinc-400">
                      Record with studio lens or upload custom 4K media from your device.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Floating Studio Tools */}
          <div className="absolute right-4 top-16 z-20 flex flex-col items-center gap-3">
            {/* Speed selector */}
            {mode === 'video' && (
              <div className="flex flex-col items-center bg-black/50 backdrop-blur-md rounded-2xl p-1 border border-white/10 text-[11px] font-black italic text-white gap-1">
                {['0.5x', '1x', '2x'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSpeed(s)}
                    className={`px-2 py-1 rounded-xl transition-all ${
                      speed === s ? 'bg-yellow-400 text-black' : 'hover:text-yellow-400'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Filter selection trigger */}
            <div className="flex flex-col items-center bg-black/50 backdrop-blur-md rounded-2xl p-2 border border-white/10 gap-2">
              <span className="text-[9px] font-black italic uppercase text-zinc-400">Filter</span>
              {filtersList.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={`w-6 h-6 rounded-full border text-[9px] flex items-center justify-center transition-all ${
                    filter === f.id
                      ? 'border-yellow-400 scale-110 shadow-[0_0_8px_#FACC15]'
                      : 'border-zinc-600 opacity-60'
                  }`}
                  title={f.name}
                >
                  {f.name[0]}
                </button>
              ))}
            </div>

            {/* Upload file trigger */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white flex items-center justify-center hover:bg-black/70 hover:text-yellow-400 transition-all shadow-md"
              title="Upload media file"
            >
              <Upload className="w-4 h-4" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*,image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>

          {/* Recording Timer Badge */}
          {isRecording && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-red-600/90 text-white px-3 py-1 rounded-full text-xs font-black italic tracking-wider animate-pulse">
              <span className="w-2 h-2 rounded-full bg-white" />
              00:{recordingSeconds < 10 ? `0${recordingSeconds}` : recordingSeconds}
            </div>
          )}
        </div>

        {/* Caption & Post Configuration Area (When media is ready) */}
        <div className="px-5 py-3 bg-zinc-950 border-t border-zinc-800 space-y-3 z-20">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write a viral caption... (use #tags for Explore)"
              className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs font-bold italic text-white placeholder:text-zinc-500 focus:outline-none focus:border-yellow-400"
            />
            <button
              onClick={() => setMonetizeSparks(!monetizeSparks)}
              className={`px-3 py-2 rounded-xl text-xs font-black italic flex items-center gap-1 transition-all ${
                monetizeSparks
                  ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40'
                  : 'bg-zinc-900 text-zinc-500 border border-zinc-800'
              }`}
              title="Enable Super Sparks tipping on this post"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              Sparks
            </button>
          </div>

          {/* Quick Hashtags */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {['#NexoraViral', '#CyberStage', '#ProducerTok', '#Techwear', '#TokyoDrop'].map((tag) => (
              <button
                key={tag}
                onClick={() => setCaption((prev) => (prev ? `${prev} ${tag}` : tag))}
                className="text-[10px] font-bold italic text-zinc-400 hover:text-white bg-zinc-900 px-2 py-0.5 rounded-md shrink-0"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Shutter & Mode Switcher */}
        <div className="p-4 bg-black border-t border-zinc-900 flex flex-col items-center gap-4 z-20">
          {/* Shutter / Capture Button */}
          <div className="flex items-center justify-center gap-8 w-full">
            {mode === 'live' ? (
              <button
                onClick={() => setIsLiveStreaming(!isLiveStreaming)}
                className={`px-8 py-3.5 rounded-full font-black italic text-sm tracking-wider uppercase transition-all shadow-xl flex items-center gap-2 ${
                  isLiveStreaming
                    ? 'bg-zinc-800 text-red-500 border border-red-500'
                    : 'bg-red-600 hover:bg-red-500 text-white shadow-red-600/40'
                }`}
              >
                <Radio className="w-4 h-4" />
                {isLiveStreaming ? 'End Live Broadcast' : 'Go Live Now'}
              </button>
            ) : (
              <div className="flex items-center gap-6">
                <button
                  onClick={() => {
                    if (isRecording) {
                      setIsRecording(false);
                    } else {
                      setIsRecording(true);
                      setRecordingSeconds(0);
                    }
                  }}
                  className={`w-18 h-18 rounded-full border-4 p-1 flex items-center justify-center transition-all ${
                    isRecording
                      ? 'border-red-500 bg-red-600/20 scale-110'
                      : 'border-white hover:border-yellow-400'
                  }`}
                >
                  <div
                    className={`rounded-full transition-all ${
                      isRecording
                        ? 'w-7 h-7 bg-red-600 rounded-sm'
                        : 'w-14 h-14 bg-gradient-to-tr from-red-600 to-yellow-500'
                    }`}
                  />
                </button>

                <button
                  onClick={handlePublish}
                  disabled={isPublishing}
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-red-600 to-yellow-500 text-black font-black italic text-xs uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-yellow-500/20 flex items-center gap-1.5"
                >
                  {isPublishing ? (
                    'Publishing...'
                  ) : (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      Post to Nexora
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Mode Switcher Buttons */}
          <div className="flex items-center gap-4 text-xs font-black italic uppercase tracking-wider text-zinc-400 overflow-x-auto no-scrollbar py-1">
            {(['video', 'photo', 'story', 'live', 'post'] as CreateMode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`transition-all whitespace-nowrap pb-1 ${
                  mode === m
                    ? 'text-yellow-400 border-b-2 border-yellow-400 scale-110'
                    : 'hover:text-white'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
