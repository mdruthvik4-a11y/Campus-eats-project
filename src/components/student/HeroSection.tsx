import React from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Flame, Clock, Sparkles } from 'lucide-react';

interface HeroSectionProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedDietary: string;
  setSelectedDietary: (dietary: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  searchQuery,
  setSearchQuery,
  selectedDietary,
  setSelectedDietary,
}) => {
  const { rushStatus, setIsCartOpen } = useApp();

  return (
    <section className="relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 text-white mb-8 shadow-xl">
      {/* Background Hero Image with measured scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/hero_canteen_feast_1793441463783.jpg"
          alt="Campus Canteen feast"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center opacity-35 scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-900/60" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-8 sm:py-12 lg:py-14">
        
        {/* Top Kicker & Rush Indicator */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2 text-xs font-medium text-amber-300">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="font-semibold tracking-wide">CAMPUS CENTRAL CANTEEN</span>
            <span aria-hidden="true" className="text-slate-500">·</span>
            <span className="text-slate-300">Open 8:00 AM – 9:00 PM</span>
          </div>

          {/* Peak-hour crowd indicator badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-amber-500/30 backdrop-blur-md text-xs">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-slate-300 font-medium">Canteen Wait:</span>
            <strong className="text-amber-400 font-mono">~{rushStatus.averageWaitMins} mins</strong>
            <span className="hidden sm:inline text-slate-400">({rushStatus.activeOrdersCount} orders active)</span>
          </div>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4 text-balance">
          Fresh, hot campus food <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-200">
            Ready when you arrive.
          </span>
        </h1>

        <p className="max-w-2xl text-sm sm:text-base text-slate-300 mb-8 leading-relaxed">
          Skip the 25-minute lunch break rush. Pre-order your favorite South Indian dosas, kathi rolls, biryanis, and chilled cold coffee with guaranteed time slot pick-up.
        </p>

        {/* Search & Action Bar */}
        <div className="max-w-2xl bg-white/95 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl p-2.5 sm:p-3 shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-2.5">
          <div className="relative w-full flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dosa, roll, cold coffee, biryani..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Dietary Selector inside search block */}
          <div className="flex items-center gap-1 w-full sm:w-auto p-1 bg-slate-100 dark:bg-slate-800 rounded-xl shrink-0">
            <button
              onClick={() => setSelectedDietary('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                selectedDietary === 'all'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedDietary('veg')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1 ${
                selectedDietary === 'veg'
                  ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Veg</span>
            </button>
            <button
              onClick={() => setSelectedDietary('non-veg')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1 ${
                selectedDietary === 'non-veg'
                  ? 'bg-white dark:bg-slate-700 text-rose-600 dark:text-rose-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span>Non-Veg</span>
            </button>
          </div>
        </div>

        {/* Feature Highlights Row */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400 shrink-0" />
            <span>30-Min Time Slots</span>
          </div>
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-400 shrink-0" />
            <span>Cooked Fresh on Order</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
            <span>Digital Token Queue</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCartOpen(true)}
              className="text-amber-400 hover:text-amber-300 font-medium underline underline-offset-4 cursor-pointer"
            >
              Pre-Order Pickup &rarr;
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
