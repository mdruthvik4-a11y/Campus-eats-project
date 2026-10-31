import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MenuItem, Category, DietaryType } from '../../types';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  Clock, 
  BarChart3, 
  Sparkles, 
  Check, 
  X,
  AlertCircle
} from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const { 
    adminTab, 
    setAdminTab, 
    menuItems, 
    addMenuItem, 
    updateMenuItem, 
    deleteMenuItem,
    orders 
  } = useApp();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // Form states for Add / Edit
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    price: number;
    category: Category;
    dietary: DietaryType;
    calories: number;
    prepTimeMins: number;
    isDailySpecial: boolean;
    image: string;
  }>({
    name: '',
    description: '',
    price: 80,
    category: 'meals',
    dietary: 'veg',
    calories: 350,
    prepTimeMins: 10,
    isDailySpecial: false,
    image: '/src/assets/images/food_paneer_tikka_roll_1793441466043.jpg',
  });

  // Calculate analytics
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0) + 14850; // include historical base
  const totalOrdersCount = orders.length + 84;
  const avgPrepTime = '11.8 mins';
  const peakRushWindow = '12:30 PM - 01:30 PM';

  const hourlyData = [
    { hour: '08:00 AM', orders: 18 },
    { hour: '09:00 AM', orders: 32 },
    { hour: '10:00 AM', orders: 24 },
    { hour: '11:00 AM', orders: 42 },
    { hour: '12:00 PM', orders: 85 },
    { hour: '01:00 PM', orders: 98 }, // Peak
    { hour: '02:00 PM', orders: 45 },
    { hour: '03:00 PM', orders: 20 },
    { hour: '04:00 PM', orders: 36 },
    { hour: '05:00 PM', orders: 58 },
  ];

  const maxHourOrders = Math.max(...hourlyData.map(h => h.orders));

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      description: '',
      price: 90,
      category: 'meals',
      dietary: 'veg',
      calories: 380,
      prepTimeMins: 10,
      isDailySpecial: false,
      image: '/src/assets/images/food_masala_dosa_crisp_1793441466426.jpg',
    });
    setEditingItem(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      dietary: item.dietary,
      calories: item.calories,
      prepTimeMins: item.prepTimeMins,
      isDailySpecial: !!item.isDailySpecial,
      image: item.image,
    });
    setIsAddModalOpen(true);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingItem) {
      updateMenuItem({
        ...editingItem,
        ...formData,
      });
    } else {
      addMenuItem({
        ...formData,
        rating: 4.8,
        ratingCount: 1,
        isAvailable: true,
      });
    }
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Admin Tabs */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAdminTab('analytics')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              adminTab === 'analytics'
                ? 'bg-amber-500 text-white shadow-sm shadow-amber-500/20'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Analytics & Reports</span>
          </button>

          <button
            onClick={() => setAdminTab('menu')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              adminTab === 'menu'
                ? 'bg-amber-500 text-white shadow-sm shadow-amber-500/20'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Edit3 className="w-4 h-4" />
            <span>Menu & Price Management</span>
          </button>
        </div>

        {adminTab === 'menu' && (
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Food Item</span>
          </button>
        )}
      </div>

      {adminTab === 'analytics' ? (
        /* Analytics View */
        <div className="space-y-6">
          
          {/* KPI Cards Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Daily Revenue */}
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span>Daily Sales Revenue</span>
                <span className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <TrendingUp className="w-4 h-4" />
                </span>
              </div>
              <div className="font-mono text-2xl font-bold text-slate-900 dark:text-white">
                ₹{totalRevenue.toLocaleString()}
              </div>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
                +18.4% vs last week average
              </p>
            </div>

            {/* Total Orders */}
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span>Total Orders Today</span>
                <span className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <ShoppingBag className="w-4 h-4" />
                </span>
              </div>
              <div className="font-mono text-2xl font-bold text-slate-900 dark:text-white">
                {totalOrdersCount}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Avg. order size: <strong className="text-slate-700 dark:text-slate-300 font-mono">₹165</strong>
              </p>
            </div>

            {/* Average Prep Time */}
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span>Average Kitchen Prep</span>
                <span className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  <Clock className="w-4 h-4" />
                </span>
              </div>
              <div className="font-mono text-2xl font-bold text-slate-900 dark:text-white">
                {avgPrepTime}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Target: &lt;15 mins on campus
              </p>
            </div>

            {/* Peak Rush Window */}
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span>Peak Rush Window</span>
                <span className="p-2 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400">
                  <Clock className="w-4 h-4" />
                </span>
              </div>
              <div className="font-mono text-lg font-bold text-amber-500">
                {peakRushWindow}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                42% of volume pre-ordered
              </p>
            </div>

          </div>

          {/* Hourly Volume Distribution Chart */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <h3 className="font-display text-sm font-bold text-slate-900 dark:text-white mb-1">
              Hourly Canteen Order Volume (Campus Rush Timeline)
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Breakdown of food orders received across breakfast, lunch rush, and evening snacks.
            </p>

            <div className="h-44 flex items-end gap-2 sm:gap-4 pt-4 border-b border-slate-200 dark:border-slate-800">
              {hourlyData.map(d => {
                const heightPercent = Math.round((d.orders / maxHourOrders) * 100);
                const isPeak = d.orders === maxHourOrders;

                return (
                  <div key={d.hour} className="flex-1 flex flex-col items-center gap-1.5 group h-full justify-end">
                    <span className="text-[10px] font-mono text-slate-400 group-hover:text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      {d.orders}
                    </span>
                    <div 
                      className={`w-full rounded-t-md transition-all duration-300 ${
                        isPeak 
                          ? 'bg-amber-500 shadow-md shadow-amber-500/30' 
                          : 'bg-slate-200 dark:bg-slate-800 hover:bg-amber-400/60'
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    />
                    <span className="text-[9px] sm:text-[10px] font-mono text-slate-500 truncate w-full text-center">
                      {d.hour.split(' ')[0]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Best Selling Items Table */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <h3 className="font-display text-sm font-bold text-slate-900 dark:text-white mb-4">
              Today&apos;s Top Campus Sellers
            </h3>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {menuItems.slice(0, 5).map((item, idx) => (
                <div key={item.id} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-mono font-bold text-slate-600 dark:text-slate-300">
                      0{idx + 1}
                    </span>
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">
                        {item.name}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {item.category.replace('_', ' ')} · ₹{item.price}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-mono font-bold text-slate-900 dark:text-white">
                      {item.ratingCount} orders
                    </div>
                    <div className="text-[10px] text-emerald-500 font-medium">
                      ★ {item.rating} rating
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      ) : (
        /* Menu Management View */
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h2 className="font-display text-base font-bold text-slate-900 dark:text-white">
                Live Canteen Dishes & Pricing
              </h2>
              <p className="text-xs text-slate-500">
                Modify pricing in ₹, mark daily chef specials, or delete discontinued items.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Dish Details</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Price (₹)</th>
                  <th className="py-3 px-4">Daily Special</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {menuItems.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-10 h-10 rounded-lg object-cover bg-slate-200"
                        />
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white">
                            {item.name}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            {item.calories} kcal · {item.prepTimeMins}m prep
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400 capitalize">
                      {item.category.replace('_', ' ')}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        item.dietary === 'veg' 
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                          : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                      }`}>
                        {item.dietary}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                      ₹{item.price}
                    </td>
                    <td className="py-3 px-4">
                      {item.isDailySpecial ? (
                        <span className="flex items-center gap-1 text-amber-500 font-semibold text-[11px]">
                          <Sparkles className="w-3 h-3" />
                          <span>Special</span>
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Standard</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                          title="Edit item"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteMenuItem(item.id)}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 cursor-pointer"
                          title="Delete item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Dish Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white mb-1">
              {editingItem ? 'Edit Dish Details' : 'Add New Canteen Dish'}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Configure name, Indian Rupee price, category, and daily chef special highlight.
            </p>

            <form onSubmit={handleSaveItem} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Item Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Masala Dosa, Paneer Wrap..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  required
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Appetizing description of ingredients and spices..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    required
                    min={5}
                    max={1000}
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="breakfast">Breakfast</option>
                    <option value="rolls_wraps">Rolls & Wraps</option>
                    <option value="meals">Hearty Meals</option>
                    <option value="snacks">Snacks</option>
                    <option value="beverages">Beverages</option>
                    <option value="desserts">Desserts</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Dietary Classification
                  </label>
                  <select
                    value={formData.dietary}
                    onChange={(e) => setFormData({ ...formData, dietary: e.target.value as DietaryType })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="veg">Vegetarian (Pure Veg)</option>
                    <option value="non-veg">Non-Vegetarian</option>
                    <option value="egg">Egg / Eggetarian</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Prep Time (Minutes)
                  </label>
                  <input
                    type="number"
                    min={2}
                    max={45}
                    value={formData.prepTimeMins}
                    onChange={(e) => setFormData({ ...formData, prepTimeMins: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isDailySpecial"
                  checked={formData.isDailySpecial}
                  onChange={(e) => setFormData({ ...formData, isDailySpecial: e.target.checked })}
                  className="rounded text-amber-500 focus:ring-amber-500 w-4 h-4 cursor-pointer"
                />
                <label htmlFor="isDailySpecial" className="font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                  Feature as Today&apos;s Daily Special (Golden Chef Badge)
                </label>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Save Dish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
