import React, { useState } from 'react';
import { X, Copy, Check, Send, Share2, Download, MessageCircle, ExternalLink } from 'lucide-react';
import { Reel, User } from '../types';
import { CREATORS } from '../data/mockData';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  reel: Reel;
  onSendViaDM?: (recipient: User) => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  reel,
  onSendViaDM,
}) => {
  const [copied, setCopied] = useState(false);
  const [sentUserIds, setSentUserIds] = useState<string[]>([]);

  if (!isOpen) return null;

  const shareUrl = `${window.location.origin}/reel/${reel.id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendDM = (user: User) => {
    setSentUserIds((prev) => [...prev, user.id]);
    if (onSendViaDM) onSendViaDM(user);
  };

  const friendList = Object.values(CREATORS);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg bg-zinc-950 border-t border-zinc-800 rounded-t-3xl p-5 shadow-2xl animate-in slide-in-from-bottom duration-200 space-y-5">
        <div className="w-12 h-1.5 bg-zinc-700 rounded-full mx-auto -mt-1 cursor-grab" onClick={onClose} />

        <div className="flex items-center justify-between">
          <h3 className="text-base font-black italic text-white uppercase tracking-wider flex items-center gap-2">
            <Share2 className="w-4 h-4 text-red-500" />
            Share Reel
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-full bg-zinc-900"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Send to friends in Direct Messages */}
        <div className="space-y-2">
          <span className="text-xs font-black italic text-zinc-400 uppercase tracking-wider">
            Send via Nexora Direct
          </span>
          <div className="flex items-center gap-4 overflow-x-auto no-scrollbar py-2">
            {friendList.map((friend) => {
              const isSent = sentUserIds.includes(friend.id);
              return (
                <div
                  key={friend.id}
                  className="flex flex-col items-center gap-1.5 shrink-0 w-16 text-center cursor-pointer group"
                  onClick={() => !isSent && handleSendDM(friend)}
                >
                  <div className="relative">
                    <img
                      src={friend.avatar}
                      alt={friend.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-zinc-700 group-hover:border-yellow-400 transition-colors"
                    />
                    {isSent ? (
                      <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    ) : (
                      <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Send className="w-2.5 h-2.5" />
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-bold italic text-zinc-300 truncate w-full">
                    {friend.name.split(' ')[0]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action icons row */}
        <div className="grid grid-cols-4 gap-2 pt-2 border-t border-zinc-800/80">
          <button
            onClick={handleCopyLink}
            className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 transition-all active:scale-95 text-center"
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${copied ? 'bg-emerald-500 text-white' : 'bg-zinc-800 text-zinc-200'}`}>
              {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            </div>
            <span className="text-[10px] font-bold italic text-zinc-300">
              {copied ? 'Copied!' : 'Copy Link'}
            </span>
          </button>

          <button
            onClick={() => {
              window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out ${reel.creator.name}'s reel on NEXORA: ${shareUrl}`)}`, '_blank');
            }}
            className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 transition-all active:scale-95 text-center"
          >
            <div className="w-10 h-10 rounded-full bg-zinc-800 text-zinc-200 flex items-center justify-center">
              <span className="font-black italic text-sm">X</span>
            </div>
            <span className="text-[10px] font-bold italic text-zinc-300">Post to X</span>
          </button>

          <button
            onClick={() => {
              window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`${reel.caption} ${shareUrl}`)}`, '_blank');
            }}
            className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 transition-all active:scale-95 text-center"
          >
            <div className="w-10 h-10 rounded-full bg-emerald-600/30 text-emerald-400 flex items-center justify-center">
              <MessageCircle className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold italic text-zinc-300">WhatsApp</span>
          </button>

          <button
            onClick={() => {
              const a = document.createElement('a');
              a.href = reel.videoUrl;
              a.download = `nexora_reel_${reel.id}.mp4`;
              a.target = '_blank';
              a.click();
            }}
            className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 transition-all active:scale-95 text-center"
          >
            <div className="w-10 h-10 rounded-full bg-zinc-800 text-zinc-200 flex items-center justify-center">
              <Download className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold italic text-zinc-300">Save Video</span>
          </button>
        </div>
      </div>
    </div>
  );
};
