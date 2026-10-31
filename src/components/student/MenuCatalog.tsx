import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { MenuItem, Category } from '../../types';
import { 
  Plus, 
  Minus, 
  Star, 
  Clock, 
  Flame, 
  Check, 
  SlidersHorizontal,
  Sparkles,
  Info,
  X
} from 'lucide-react';

interface MenuCatalogProps {
  searchQuery: string;
  selectedDietary: string;
}

export const MenuCatalog: React.FC<MenuCatalogProps> = ({
  searchQuery,
  selectedDietary,
}) => {
  const { menuItems, cart, addToCart, updateCartQuantity } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'price-asc' | 'price-desc' | 'rating'>('popular');
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);
  const [modalSpiceLevel, setModalSpiceLevel] = useState<1 | 2 | 3>(2);
  const [modalNotes, setModalNotes] = useState<string>('');

  const categories: { id: Category; label: string }[] = [
    { id: 'all', label: 'All Items' },
    { id: 'breakfast', label: 'Breakfast' },
    { id: 'rolls_wraps', label: 'Rolls & Wraps' },
    { id: 'meals', label: 'Hearty Meals' },
    { id: 'snacks', label: 'Snacks & Quickies' },
    { id: 'beverages', label: 'Beverages' },
    { id: 'desserts', label: 'Sweet Treats' },
  ];

  // Filtering & sorting logic
  const filteredItems = useMemo(() => {
    return menuItems.filter(item => {
      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      // Dietary filter
      if (selectedDietary !== 'all') {
        if (selectedDietary === 'veg' && item.dietary !== 'veg') return false;
        if (selectedDietary === 'non-veg' && item.dietary === 'veg') return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        const matchesCategory = item.category.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesCategory) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return b.ratingCount - a.ratingCount; // 'popular'
    });
  }, [menuItems, selectedCategory, selectedDietary, searchQuery, sortBy]);

  const getCartQuantity = (itemId: string) => {
    const itemInCart = cart.find(c => c.menuItem.id === itemId);
    return itemInCart ? itemInCart.quantity : 0;
  };

  const handleOpenCustomize = (item: MenuItem) => {
    setCustomizingItem(item);
    setModalSpiceLevel(item.spiceLevel || 2);
    setModalNotes('');
  };

  const handleConfirmCustomize = () => {
    if (customizingItem) {
      addToCart(customizingItem, 1, modalSpiceLevel, modalNotes);
      setCustomizingItem(null);
    }
  };

  return (
    <div className="w-full">
      {/* Category Tabs & Sort Strip */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-200 dark:border-slate-800">
        
        {/* Category Pills/Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-amber-500 text-white shadow-sm shadow-amber-500/20'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-amber-400'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs text-slate-500">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-xs font-medium bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            <option value="popular">Most Popular</option>
            <option value="rating">Highest Rated</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>

      </div>

      {/* Results Count & Feedback */}
      <div className="flex items-center justify-between mb-4 text-xs text-slate-500 dark:text-slate-400">
        <span>Showing <strong className="text-slate-900 dark:text-slate-100 font-mono">{filteredItems.length}</strong> canteen items</span>
        {searchQuery && (
          <span className="italic">Filtering by &ldquo;{searchQuery}&rdquo;</span>
        )}
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="py-16 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40 p-8">
          <div className="w-12 h-12 mx-auto rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 mb-3">
            <Info className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-1">
            No dishes found
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-4">
            We couldn&apos;t find any food items matching your active category and dietary filters.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
            }}
            className="px-4 py-2 text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Food Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map(item => {
          const qty = getCartQuantity(item.id);
          const isVeg = item.dietary === 'veg';
          const isEgg = item.dietary === 'egg';

          return (
            <div
              key={item.id}
              className={`group rounded-2xl border overflow-hidden transition-all duration-200 flex flex-col bg-white dark:bg-slate-900/90 ${
                item.isAvailable
                  ? 'border-slate-200/90 dark:border-slate-800 hover:border-amber-500/40 hover:shadow-lg dark:hover:shadow-amber-500/5'
                  : 'border-slate-200 dark:border-slate-800 opacity-70 bg-slate-50 dark:bg-slate-950/40'
              }`}
            >
              {/* Image & Overlays */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img
                  src={item.image}
                  alt={item.name}
                  referrerPolicy="no-referrer"
                  className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                    !item.isAvailable ? 'grayscale contrast-75' : ''
                  }`}
                  onError={(e) => {
                    // Zero broken image fallback
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />

                {/* Daily Special Label */}
                {item.isDailySpecial && item.isAvailable && (
                  <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-500 text-white text-[11px] font-bold shadow-md shadow-amber-500/30">
                    <Sparkles className="w-3 h-3" />
                    <span>CHEF SPECIAL</span>
                  </div>
                )}

                {/* Sold Out Overlay */}
                {!item.isAvailable && (
                  <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
                    <span className="px-3 py-1 rounded-md bg-rose-600/90 text-white font-bold text-xs uppercase tracking-wider shadow-lg">
                      Sold Out Today
                    </span>
                  </div>
                )}

                {/* Dietary Symbol (Standard Indian FSSAI Veg / Non-Veg Indicator) */}
                <div 
                  className="absolute bottom-3 right-3 p-1.5 rounded-lg bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-md"
                  title={item.dietary.toUpperCase()}
                >
                  <div className={`w-4 h-4 border-2 flex items-center justify-center rounded-xs ${
                    isVeg ? 'border-emerald-600' : isEgg ? 'border-amber-600' : 'border-rose-600'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${
                      isVeg ? 'bg-emerald-600' : isEgg ? 'bg-amber-600' : 'bg-rose-600'
                    }`} />
                  </div>
                </div>

                {/* Prep time badge */}
                <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-medium font-mono">
                  <Clock className="w-3 h-3 text-amber-400" />
                  <span>{item.prepTimeMins}m prep</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                <div>
                  {/* Category & Rating */}
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5">
                    <span className="uppercase tracking-wider font-semibold text-[10px] text-amber-600 dark:text-amber-400">
                      {item.category.replace('_', ' ')}
                    </span>
                    <div className="flex items-center gap-1 text-slate-700 dark:text-slate-300 font-semibold font-mono">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{item.rating}</span>
                      <span className="text-[10px] text-slate-400 font-normal">({item.ratingCount})</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-display text-base font-bold text-slate-900 dark:text-white mb-1.5 group-hover:text-amber-500 transition-colors">
                    {item.name}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-3">
                    {item.description}
                  </p>

                  {/* Calories & Allergens */}
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-4 font-mono">
                    <span>{item.calories} kcal</span>
                    {item.allergens && item.allergens.length > 0 && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="text-slate-500">{item.allergens.join(', ')}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Footer: Price & Add to Cart */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-bold text-slate-900 dark:text-white font-mono">
                      ₹{item.price}
                    </span>
                  </div>

                  {item.isAvailable ? (
                    qty === 0 ? (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenCustomize(item)}
                          className="px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-amber-400 hover:text-amber-500 transition-colors cursor-pointer"
                          title="Customize notes / spice"
                        >
                          Spice
                        </button>
                        <button
                          onClick={() => addToCart(item, 1)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white text-xs font-bold rounded-lg shadow-sm shadow-amber-500/20 transition-all cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>ADD</span>
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 bg-amber-500/10 dark:bg-amber-500/20 p-1 rounded-lg border border-amber-500/30">
                        <button
                          onClick={() => updateCartQuantity(item.id, -1)}
                          className="w-6 h-6 rounded-md bg-white dark:bg-slate-800 text-slate-700 dark:text-white flex items-center justify-center hover:bg-amber-500 hover:text-white transition-colors cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-5 text-center text-xs font-bold font-mono text-amber-600 dark:text-amber-400">
                          {qty}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.id, 1)}
                          className="w-6 h-6 rounded-md bg-amber-500 text-white flex items-center justify-center hover:bg-amber-600 transition-colors cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    )
                  ) : (
                    <button
                      disabled
                      className="px-3 py-1.5 text-xs font-medium text-slate-400 dark:text-slate-600 bg-slate-100 dark:bg-slate-800 rounded-lg cursor-not-allowed"
                    >
                      Unavailable
                    </button>
                  )}
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* Item Customization Modal */}
      {customizingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl relative">
            
            <button
              onClick={() => setCustomizingItem(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs uppercase tracking-wider font-semibold text-amber-500">
                Custom Preparation
              </span>
            </div>

            <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white mb-1">
              {customizingItem.name}
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              Customize how the canteen kitchen prepares your meal.
            </p>

            {/* Spice Level Selector */}
            <div className="mb-5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Spice Preference:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { level: 1 as const, label: 'Mild', desc: 'Less chili' },
                  { level: 2 as const, label: 'Medium', desc: 'Standard balance' },
                  { level: 3 as const, label: 'Spicy', desc: 'Extra fiery' },
                ].map(opt => (
                  <button
                    key={opt.level}
                    type="button"
                    onClick={() => setModalSpiceLevel(opt.level)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      modalSpiceLevel === opt.level
                        ? 'border-amber-500 bg-amber-500/10 text-slate-900 dark:text-white'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-1 font-semibold text-xs mb-0.5">
                      <Flame className={`w-3.5 h-3.5 ${modalSpiceLevel >= opt.level ? 'text-amber-500' : 'text-slate-400'}`} />
                      <span>{opt.label}</span>
                    </div>
                    <span className="text-[10px] text-slate-400">{opt.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Cooking Notes */}
            <div className="mb-6">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Kitchen Cooking Instructions (Optional):
              </label>
              <input
                type="text"
                value={modalNotes}
                onChange={(e) => setModalNotes(e.target.value)}
                placeholder="e.g. Extra green chutney, no raw onions, less oil"
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            {/* Confirm & Add */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <span className="font-bold font-mono text-base text-slate-900 dark:text-white">
                ₹{customizingItem.price}
              </span>
              <button
                onClick={handleConfirmCustomize}
                className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl shadow-md shadow-amber-500/20 transition-all cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
