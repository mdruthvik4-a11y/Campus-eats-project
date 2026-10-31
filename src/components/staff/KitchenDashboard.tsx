import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Order, OrderStatus } from '../../types';
import { 
  ChefHat, 
  Clock, 
  CheckCircle2, 
  ShoppingBag, 
  Volume2, 
  VolumeX, 
  Flame, 
  Search, 
  ArrowRight,
  Filter,
  Check,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  Plus
} from 'lucide-react';

export const KitchenDashboard: React.FC = () => {
  const { 
    orders, 
    updateOrderStatus, 
    menuItems, 
    toggleItemAvailability,
    soundEnabled,
    setSoundEnabled,
    playNotificationSound
  } = useApp();

  const [activeTab, setActiveTab] = useState<'board' | 'stock'>('board');
  const [tokenSearch, setTokenSearch] = useState('');
  const [counterFilter, setCounterFilter] = useState<string>('all');

  const filteredOrders = orders.filter(order => {
    if (tokenSearch.trim()) {
      const match = order.tokenNumber.toLowerCase().includes(tokenSearch.toLowerCase()) ||
                    order.customerName.toLowerCase().includes(tokenSearch.toLowerCase());
      if (!match) return false;
    }
    if (counterFilter !== 'all' && order.counterNumber.toString() !== counterFilter) {
      return false;
    }
    return true;
  });

  const ordersByStatus = {
    placed: filteredOrders.filter(o => o.status === 'placed'),
    preparing: filteredOrders.filter(o => o.status === 'preparing'),
    ready: filteredOrders.filter(o => o.status === 'ready'),
    collected: filteredOrders.filter(o => o.status === 'collected'),
  };

  const handleAdvance = (order: Order) => {
    if (order.status === 'placed') {
      updateOrderStatus(order.id, 'preparing');
    } else if (order.status === 'preparing') {
      updateOrderStatus(order.id, 'ready');
      playNotificationSound();
    } else if (order.status === 'ready') {
      updateOrderStatus(order.id, 'collected');
    }
  };

  const getActionLabel = (status: OrderStatus) => {
    switch (status) {
      case 'placed':
        return { label: 'Start Cooking', color: 'bg-amber-500 hover:bg-amber-600' };
      case 'preparing':
        return { label: 'Mark Ready', color: 'bg-emerald-600 hover:bg-emerald-700' };
      case 'ready':
        return { label: 'Hand Over (Collected)', color: 'bg-slate-800 hover:bg-slate-900 dark:bg-slate-700' };
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Controls Strip */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        
        {/* Left: View Switcher */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('board')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'board'
                ? 'bg-amber-500 text-white shadow-sm shadow-amber-500/20'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <ChefHat className="w-4 h-4" />
            <span>Live Kitchen Board</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-white/20 font-mono">
              {orders.filter(o => o.status !== 'collected').length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('stock')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'stock'
                ? 'bg-amber-500 text-white shadow-sm shadow-amber-500/20'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <ToggleRight className="w-4 h-4" />
            <span>Quick Stock Manager</span>
            <span className="text-[10px] text-slate-400">
              ({menuItems.filter(m => !m.isAvailable).length} Sold Out)
            </span>
          </button>
        </div>

        {/* Right: Audio Chime & Filters */}
        <div className="flex items-center gap-3">
          
          {/* Audio Chime Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
              soundEnabled
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700'
            }`}
            title="Toggle kitchen chime on new orders"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline">{soundEnabled ? 'Kitchen Bell Active' : 'Sound Muted'}</span>
          </button>

          {/* Counter Filter */}
          <select
            value={counterFilter}
            onChange={(e) => setCounterFilter(e.target.value)}
            className="text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-700 dark:text-slate-200 focus:outline-none"
          >
            <option value="all">All Counters</option>
            <option value="1">Counter 1 (Fast Food)</option>
            <option value="2">Counter 2 (Hot Meals)</option>
            <option value="3">Counter 3 (Beverages)</option>
          </select>

          {/* Token Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={tokenSearch}
              onChange={(e) => setTokenSearch(e.target.value)}
              placeholder="Search token..."
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500 w-28 sm:w-36 font-mono"
            />
          </div>

        </div>

      </div>

      {/* Main Tab: Kanban Board */}
      {activeTab === 'board' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
          
          {/* Column 1: Placed (Incoming) */}
          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 dark:bg-blue-950/10 p-3 sm:p-4">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-blue-500/20">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-500" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  New Orders (Queue)
                </h3>
              </div>
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-full bg-blue-500 text-white">
                {ordersByStatus.placed.length}
              </span>
            </div>

            <div className="space-y-3">
              {ordersByStatus.placed.map(order => renderOrderCard(order, handleAdvance, getActionLabel))}
              {ordersByStatus.placed.length === 0 && (
                <div className="py-8 text-center text-xs text-slate-400">
                  No incoming orders waiting
                </div>
              )}
            </div>
          </div>

          {/* Column 2: Preparing (In Kitchen) */}
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 dark:bg-amber-950/10 p-3 sm:p-4">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-amber-500/20">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-500" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  Cooking / Preparing
                </h3>
              </div>
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500 text-white">
                {ordersByStatus.preparing.length}
              </span>
            </div>

            <div className="space-y-3">
              {ordersByStatus.preparing.map(order => renderOrderCard(order, handleAdvance, getActionLabel))}
              {ordersByStatus.preparing.length === 0 && (
                <div className="py-8 text-center text-xs text-slate-400">
                  No orders currently cooking
                </div>
              )}
            </div>
          </div>

          {/* Column 3: Ready for Pickup */}
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-950/10 p-3 sm:p-4">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-emerald-500/20">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-emerald-500" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Ready at Counter
                </h3>
              </div>
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-white">
                {ordersByStatus.ready.length}
              </span>
            </div>

            <div className="space-y-3">
              {ordersByStatus.ready.map(order => renderOrderCard(order, handleAdvance, getActionLabel))}
              {ordersByStatus.ready.length === 0 && (
                <div className="py-8 text-center text-xs text-slate-400">
                  No orders waiting for pickup
                </div>
              )}
            </div>
          </div>

          {/* Column 4: Collected History */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 p-3 sm:p-4">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-slate-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Collected
                </h3>
              </div>
              <span className="font-mono text-xs font-medium px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {ordersByStatus.collected.length}
              </span>
            </div>

            <div className="space-y-3">
              {ordersByStatus.collected.slice(0, 5).map(order => renderOrderCard(order, handleAdvance, getActionLabel))}
            </div>
          </div>

        </div>
      ) : (
        /* Tab 2: Quick Item Availability / Stock Toggle */
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-6 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h2 className="font-display text-base font-bold text-slate-900 dark:text-white">
                1-Click Menu Item Stock & Availability
              </h2>
              <p className="text-xs text-slate-500">
                Instantly mark items as In Stock or Sold Out. Changes reflect live on all student screens!
              </p>
            </div>
            <div className="text-xs text-slate-400">
              Total items: <strong className="text-slate-900 dark:text-white font-mono">{menuItems.length}</strong>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {menuItems.map(item => (
              <div
                key={item.id}
                className={`p-4 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                  item.isAvailable
                    ? 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40'
                    : 'border-rose-500/30 bg-rose-500/5 dark:bg-rose-950/10'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-700 shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className={`w-full h-full object-cover ${!item.isAvailable ? 'grayscale' : ''}`}
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {item.name}
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      ₹{item.price} · {item.category.replace('_', ' ')}
                    </div>
                  </div>
                </div>

                {/* 1-Click Toggle Switch */}
                <button
                  onClick={() => toggleItemAvailability(item.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                    item.isAvailable
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500 hover:text-white'
                      : 'bg-rose-500 text-white shadow-sm'
                  }`}
                >
                  {item.isAvailable ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>In Stock</span>
                    </>
                  ) : (
                    <span>Sold Out</span>
                  )}
                </button>
              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
};

// Reusable order card inside kitchen columns
function renderOrderCard(
  order: Order, 
  handleAdvance: (order: Order) => void,
  getActionLabel: (status: OrderStatus) => { label: string; color: string } | null
) {
  const action = getActionLabel(order.status);

  return (
    <div
      key={order.id}
      className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3"
    >
      {/* Header: Token & Time */}
      <div className="flex items-center justify-between">
        <span className="font-mono text-base font-extrabold text-amber-500">
          #{order.tokenNumber}
        </span>
        <span className="text-[10px] font-mono text-slate-400">
          Slot: {order.pickupSlot.split(' ')[0]}
        </span>
      </div>

      {/* Customer & Counter */}
      <div className="text-xs text-slate-600 dark:text-slate-400">
        <div>Customer: <strong className="text-slate-900 dark:text-white">{order.customerName}</strong></div>
        <div className="text-[11px] text-slate-500">Counter {order.counterNumber} · {order.createdAt}</div>
      </div>

      {/* Items List */}
      <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs space-y-1.5">
        {order.items.map((item, idx) => (
          <div key={idx} className="flex justify-between items-start">
            <span className="font-medium text-slate-800 dark:text-slate-200">
              <strong className="text-amber-500 font-mono mr-1">{item.quantity}x</strong>
              {item.menuItem.name}
              {item.spiceLevel && (
                <span className="ml-1 text-[10px] text-amber-600 dark:text-amber-400">
                  ({item.spiceLevel === 1 ? 'Mild' : item.spiceLevel === 2 ? 'Med' : 'Spicy'})
                </span>
              )}
            </span>
          </div>
        ))}
      </div>

      {/* Action Button */}
      {action && (
        <button
          onClick={() => handleAdvance(order)}
          className={`w-full py-2 px-3 text-xs font-bold text-white rounded-lg transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer ${action.color}`}
        >
          <span>{action.label}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
