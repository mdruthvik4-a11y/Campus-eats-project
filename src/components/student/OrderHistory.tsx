import React from 'react';
import { useApp } from '../../context/AppContext';
import { Order } from '../../types';
import { 
  RotateCcw, 
  Clock, 
  CheckCircle2, 
  ChefHat, 
  ArrowRight,
  ExternalLink,
  ShoppingBag
} from 'lucide-react';

export const OrderHistory: React.FC = () => {
  const { orders, reorder, setActiveOrderId, setStudentTab } = useApp();

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'placed':
        return (
          <span className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full">
            <Clock className="w-3 h-3" />
            <span>Order Placed</span>
          </span>
        );
      case 'preparing':
        return (
          <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
            <ChefHat className="w-3 h-3" />
            <span>In Kitchen</span>
          </span>
        );
      case 'ready':
        return (
          <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
            <CheckCircle2 className="w-3 h-3" />
            <span>Ready for Pickup</span>
          </span>
        );
      case 'collected':
        return (
          <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
            <CheckCircle2 className="w-3 h-3" />
            <span>Collected</span>
          </span>
        );
    }
  };

  const handleTrackOrder = (orderId: string) => {
    setActiveOrderId(orderId);
    setStudentTab('tracking');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">
            Your Order History
          </h2>
          <p className="text-xs text-slate-500">
            View all token receipts, track status, or quickly re-order your favorite campus meals.
          </p>
        </div>
        <span className="text-xs font-mono font-medium text-slate-500">
          {orders.length} {orders.length === 1 ? 'order' : 'orders'} total
        </span>
      </div>

      {orders.length === 0 ? (
        <div className="py-20 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40 p-8">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto mb-3">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <h3 className="font-semibold text-slate-900 dark:text-white mb-1">No past orders yet</h3>
          <p className="text-xs text-slate-500 mb-4">You haven&apos;t placed any orders with Campus Eats yet.</p>
          <button
            onClick={() => setStudentTab('menu')}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
          >
            Explore Today&apos;s Menu
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div
              key={order.id}
              className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 hover:border-amber-500/30 transition-all shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono font-bold text-xs">
                    Token #{order.tokenNumber}
                  </span>
                  {getStatusBadge(order.status)}
                  <span className="text-xs text-slate-400 font-mono">
                    {order.createdAt}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleTrackOrder(order.id)}
                    className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-300 hover:text-amber-500 transition-colors font-medium cursor-pointer"
                  >
                    <span>Live Track</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-slate-300 dark:text-slate-700">·</span>
                  <button
                    onClick={() => reorder(order)}
                    className="flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-500 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Re-order to Tray</span>
                  </button>
                </div>
              </div>

              {/* Items summary */}
              <div className="py-3 text-xs text-slate-700 dark:text-slate-300 space-y-1">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span>
                      <strong className="font-mono text-amber-600 dark:text-amber-400 mr-1.5">
                        {item.quantity}x
                      </strong>
                      {item.menuItem.name}
                    </span>
                    <span className="font-mono text-slate-500">
                      ₹{item.menuItem.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              {/* Order Footer */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <div className="text-slate-500">
                  Pickup Slot: <strong className="text-slate-800 dark:text-slate-200">{order.pickupSlot}</strong> · Counter {order.counterNumber}
                </div>
                <div className="font-mono text-sm font-bold text-slate-900 dark:text-white">
                  Paid: <span className="text-amber-500">₹{order.total}</span>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};
