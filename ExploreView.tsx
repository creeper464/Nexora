import React, { useState } from 'react';
import { Search, Flame, TrendingUp, Play, Sparkles, Filter, Music, Film, Gamepad2, Shirt, Radio } from 'lucide-react';
import { Reel, User } from '../types';
import { TRENDING_TAGS, CREATORS } from '../data/mockData';

interface ExploreViewProps {
  reels: Reel[];
  onSelectReel: (reel: Reel) => void;
  onSelectCreator: (creator: User) => void;
}

export const ExploreView: React.FC<ExploreViewProps> = ({
  reels,
  onSelectReel,
  onSelectCreator,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = [
    { id: 'All', label: '🔥 All Trending' },
    { id: 'Music', label: '🎵 Music' },
    { id: 'Tech', label: '⚡ Tech & AI' },
    { id: 'Fashion', label: '👗 Fashion' },
    { id: 'Gaming', label: '🎮 Gaming' },
    { id: 'Cinema', label: '🍿 Cinema' },
  ];

  const filteredReels = reels.filter((reel) => {
    const matchesSearch =
      reel.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reel.creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reel.creator.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reel.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'All' || reel.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-full h-full overflow-y-auto no-scrollbar bg-black text-white p-4 md:p-6 pb-24 space-y-6">
      {/* Search Bar Header */}
      <div className="relative max-w-2xl mx-auto">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search creators, sounds, hashtags or #cyberpunk..."
          className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-bold italic text-white placeholder:text-zinc-500 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/50 transition-all shadow-inner"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold italic text-zinc-400 hover:text-white"
          >
            Clear
          </button>
        )}
      </div>

      {/* Categories Filter Strip */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 max-w-4xl mx-auto">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-black italic whitespace-nowrap transition-all uppercase tracking-wider ${
              selectedCategory === cat.id
                ? 'bg-gradient-to-r from-red-600 to-yellow-500 text-black shadow-lg shadow-yellow-500/20 scale-105'
                : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Worldwide Trending Hashtags Strip */}
      <div className="max-w-4xl mx-auto space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black italic uppercase tracking-wider text-yellow-400 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-yellow-400" />
            Worldwide Trending Topics
          </span>
          <span className="text-[10px] font-bold italic text-zinc-500">Live 24h Radar</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {TRENDING_TAGS.map((trend) => (
            <button
              key={trend.tag}
              onClick={() => setSearchQuery(trend.tag)}
              className="flex items-center justify-between p-3 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 hover:border-red-500/50 hover:bg-zinc-900 transition-all text-left group"
            >
              <div>
                <div className="text-xs font-black italic text-white group-hover:text-yellow-400 transition-colors">
                  {trend.tag}
                </div>
                <div className="text-[10px] font-semibold italic text-zinc-500">
                  {trend.category}
                </div>
              </div>
              <span className="text-[10px] font-bold italic text-zinc-400 tabular-nums">
                {trend.views}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Top Rising Creators Carousel */}
      <div className="max-w-4xl mx-auto space-y-2.5 pt-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black italic uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-red-500" />
            Featured Nexora Creators
          </span>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1">
          {Object.values(CREATORS).map((creator) => (
            <div
              key={creator.id}
              onClick={() => onSelectCreator(creator)}
              className="flex items-center gap-3 p-3 bg-zinc-900 border border-zinc-800 rounded-2xl shrink-0 cursor-pointer hover:border-yellow-400/50 transition-all group min-w-[200px]"
            >
              <img
                src={creator.avatar}
                alt={creator.name}
                className="w-11 h-11 rounded-full object-cover border border-zinc-700 group-hover:border-yellow-400 transition-colors shrink-0"
              />
              <div className="overflow-hidden">
                <div className="text-xs font-black italic text-white truncate flex items-center gap-1">
                  {creator.name}
                  {creator.verified && <span className="text-[10px] text-sky-400">✓</span>}
                </div>
                <div className="text-[10px] font-bold italic text-zinc-400 truncate">
                  {creator.handle}
                </div>
                <div className="text-[9px] font-semibold italic text-yellow-400">
                  {creator.tier}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trending Visual Media Grid */}
      <div className="max-w-4xl mx-auto space-y-3 pt-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black italic text-white uppercase tracking-wider flex items-center gap-2">
            <Flame className="w-4 h-4 text-red-500" />
            Viral Drops & Reels
          </h3>
          <span className="text-xs font-bold italic text-zinc-500">
            {filteredReels.length} results
          </span>
        </div>

        {filteredReels.length === 0 ? (
          <div className="text-center py-16 bg-zinc-900/30 rounded-3xl border border-zinc-800">
            <p className="text-sm font-bold italic text-zinc-400">
              No content found matching "{searchQuery}".
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="mt-3 px-4 py-2 rounded-full bg-red-600 text-white text-xs font-black italic uppercase"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-3.5">
            {filteredReels.map((reel) => (
              <div
                key={reel.id}
                onClick={() => onSelectReel(reel)}
                className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-zinc-900 cursor-pointer group border border-zinc-800/80 hover:border-yellow-400/80 transition-all shadow-md"
              >
                {/* Poster / Thumbnail image */}
                <img
                  src={reel.posterUrl}
                  alt={reel.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Ambient shadow gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                {/* Top Category Badge */}
                <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[9px] font-black italic uppercase text-yellow-400 border border-yellow-400/30">
                  {reel.category}
                </span>

                {/* Center Play Icon on Hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-12 h-12 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg shadow-red-600/40 transform scale-90 group-hover:scale-100 transition-transform">
                    <Play className="w-6 h-6 ml-1 fill-white" />
                  </div>
                </div>

                {/* Bottom stats overlay */}
                <div className="absolute bottom-2.5 left-2.5 right-2.5 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <img
                      src={reel.creator.avatar}
                      alt={reel.creator.name}
                      className="w-5 h-5 rounded-full object-cover border border-white"
                    />
                    <span className="text-[11px] font-bold italic text-white truncate drop-shadow">
                      {reel.creator.name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-bold italic text-zinc-300 drop-shadow">
                    <span className="flex items-center gap-1">
                      <Play className="w-3 h-3 fill-zinc-300" />
                      {(reel.likesCount * 3.4).toFixed(0)}
                    </span>
                    <span className="text-yellow-400">
                      ⚡ {reel.sparksReceived}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
