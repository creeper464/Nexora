import React, { useState } from 'react';
import { X, Heart, Send, CornerDownRight } from 'lucide-react';
import { Comment } from '../types';

interface CommentsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  comments: Comment[];
  onAddComment: (text: string, replyToId?: string) => void;
  onLikeComment: (commentId: string) => void;
}

export const CommentsDrawer: React.FC<CommentsDrawerProps> = ({
  isOpen,
  onClose,
  comments,
  onAddComment,
  onLikeComment,
}) => {
  const [inputText, setInputText] = useState('');
  const [replyingTo, setReplyingTo] = useState<{ id: string; name: string } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onAddComment(inputText.trim(), replyingTo?.id);
    setInputText('');
    setReplyingTo(null);
  };

  const quickEmojis = ['🔥', '⚡', '🖤', '🙌', '❤️', '🤯', '💯', '✨'];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 backdrop-blur-sm transition-opacity">
      {/* Background click to dismiss */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Sheet Content */}
      <div className="relative z-10 w-full max-w-lg bg-zinc-950 border-t border-zinc-800 rounded-t-3xl max-h-[82vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-200">
        {/* Grab bar */}
        <div className="w-12 h-1.5 bg-zinc-700 rounded-full mx-auto my-3 cursor-grab" onClick={onClose} />

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-2 border-b border-zinc-800/80">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-black italic text-white tracking-wide uppercase">
              Comments
            </h3>
            <span className="text-xs font-bold italic text-zinc-400">
              ({comments.length})
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 no-scrollbar">
          {comments.length === 0 ? (
            <div className="text-center py-12 text-zinc-500 font-bold italic">
              No comments yet. Be the first to spark the conversation!
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="space-y-2">
                <div className="flex items-start justify-between gap-3 group">
                  <div className="flex items-start gap-3 flex-1">
                    <img
                      src={comment.userAvatar}
                      alt={comment.userName}
                      className="w-9 h-9 rounded-full object-cover border border-zinc-700 shrink-0"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black italic text-white">
                          {comment.userName}
                        </span>
                        <span className="text-[10px] font-bold italic text-zinc-500">
                          {comment.createdAt}
                        </span>
                      </div>
                      <p className="text-sm font-semibold italic text-zinc-200 leading-snug">
                        {comment.text}
                      </p>
                      <button
                        onClick={() =>
                          setReplyingTo({ id: comment.id, name: comment.userName })
                        }
                        className="text-[11px] font-bold italic text-zinc-400 hover:text-yellow-400 transition-colors pt-1 inline-flex items-center gap-1"
                      >
                        Reply
                      </button>
                    </div>
                  </div>

                  {/* Comment Like Button */}
                  <button
                    onClick={() => onLikeComment(comment.id)}
                    className="flex flex-col items-center gap-0.5 text-zinc-400 hover:text-red-500 transition-colors p-1"
                  >
                    <Heart
                      className={`w-4 h-4 transition-transform ${
                        comment.isLiked
                          ? 'fill-red-500 text-red-500 scale-110'
                          : 'text-zinc-500 hover:scale-110'
                      }`}
                    />
                    <span className="text-[10px] font-bold italic tabular-nums">
                      {comment.likesCount}
                    </span>
                  </button>
                </div>

                {/* Nested Replies */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="ml-10 pl-3 border-l-2 border-zinc-800 space-y-3 pt-1">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2.5">
                          <img
                            src={reply.userAvatar}
                            alt={reply.userName}
                            className="w-7 h-7 rounded-full object-cover border border-zinc-700 shrink-0"
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-black italic text-zinc-200">
                                {reply.userName}
                              </span>
                              <span className="text-[10px] font-bold italic text-zinc-500">
                                {reply.createdAt}
                              </span>
                            </div>
                            <p className="text-xs font-semibold italic text-zinc-300 leading-relaxed">
                              {reply.text}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Quick Emoji Bar */}
        <div className="flex items-center justify-between px-5 py-2 border-t border-zinc-900 bg-zinc-900/60 overflow-x-auto no-scrollbar gap-2">
          {quickEmojis.map((emoji) => (
            <button
              key={emoji}
              onClick={() => setInputText((prev) => prev + emoji)}
              className="text-lg hover:scale-125 transition-transform p-1 shrink-0"
            >
              {emoji}
            </button>
          ))}
        </div>

        {/* Reply To indicator */}
        {replyingTo && (
          <div className="flex items-center justify-between px-5 py-1.5 bg-yellow-500/10 border-t border-yellow-500/20 text-xs font-bold italic text-yellow-400">
            <span className="flex items-center gap-1.5">
              <CornerDownRight className="w-3.5 h-3.5" />
              Replying to {replyingTo.name}
            </span>
            <button
              onClick={() => setReplyingTo(null)}
              className="hover:text-white transition-colors"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Input Bar */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-3 p-4 border-t border-zinc-800 bg-zinc-950"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              replyingTo ? `Reply to ${replyingTo.name}...` : 'Add comment on Nexora...'
            }
            className="flex-1 bg-zinc-900 border border-zinc-800 text-white rounded-full px-4 py-2.5 text-sm font-bold italic focus:outline-none focus:border-red-500 transition-colors placeholder:text-zinc-500"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="w-10 h-10 rounded-full bg-gradient-to-tr from-red-600 to-yellow-500 flex items-center justify-center text-white disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-all shrink-0 active:scale-95 shadow-md"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
