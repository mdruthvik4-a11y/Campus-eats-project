import React from 'react';
import { useApp } from '../../context/AppContext';
import { OrderStatus } from '../../types';
import { 
  CheckCircle2, 
  Clock, 
  ChefHat, 
  ShoppingBag, 
  QrCode, 
  Bell, 
  ArrowRight,
  Flame,
  Check,
  AlertCircle
} from 'lucide-react';

export const LiveOrderTracker: React.FC = () => {
  const { 
    orders, 
    activeOrderId, 
    setActiveOrderId, 
    updateOrderStatus,
    setRole,
    setStudentTab 
  } = useApp();

  // Find the selected order, or default to the most recent active order
  const activeOrder = orders.find(o => o.id === activeOrderId) || orders[0];

  const steps: { key: OrderStatus; label: string; desc: string; icon: React.ReactNode }[] = [
    {
      key: 'placed',
      label: 'Order Placed',
      desc: 'Token generated & added to kitchen queue',
      icon: <Clock className="w-5 h-5" />
    },
    {
      key: 'preparing',
      label: 'Preparing in Kitchen',
      desc: 'Chefs are cooking your meal fresh',
      icon: <ChefHat className="w-5 h-5" />
    },
    {
      key: 'ready',
      label: 'Ready for Pickup',
      desc: 'Hot & packed at counter',
      icon: <ShoppingBag className="w-5 h-5" />
    },
    {
      key: 'collected',
      label: 'Collected',
      desc: 'Order handed over. Enjoy your meal!',
      icon: <CheckCircle2 className="w-5 h-5" />
    }
  ];

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'placed': return 0;
      case 'preparing': return 1;
      case 'ready': return 2;
      case 'collected': return 3;
    }
  };

  if (!activeOrder) {
    return (
      <div className="py-20 text-center max-w-md mx-auto">
        <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mx-auto mb-4">
          <Clock className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No Active Order</h3>
        <p className="text-xs text-slate-500 mb-6">
          You haven&apos;t placed any orders yet today. Choose delicious snacks or meals from the canteen menu!
        </p>
        <button
          onClick={() => setStudentTab('menu')}
          className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
        >
          View Canteen Menu
        </button>
      </div>
    );
  }

  const currentStepIndex = getStepIndex(activeOrder.status);

  // Simulation helpers for the demo
  const handleAdvanceStatus = () => {
    if (activeOrder.status === 'placed') updateOrderStatus(activeOrder.id, 'preparing');
    else if (activeOrder.status === 'preparing') updateOrderStatus(activeOrder.id, 'ready');
    else if (activeOrder.status === 'ready') updateOrderStatus(activeOrder.id, 'collected');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Switch orders selector if multiple active */}
      {orders.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          <span className="text-xs text-slate-500 font-medium whitespace-nowrap">Your Orders:</span>
          {orders.map(o => (
            <button
              key={o.id}
              onClick={() => setActiveOrderId(o.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer whitespace-nowrap ${
                activeOrder.id === o.id
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              #{o.tokenNumber} ({o.status})
            </button>
          ))}
        </div>
      )}

      {/* Main Token & Status Billboard */}
      <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-b from-amber-500/10 via-white to-white dark:via-slate-900 dark:to-slate-900 p-6 sm:p-8 shadow-xl relative overflow-hidden">
        
        {/* Glow corner */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
              <span>Campus Canteen Live Status</span>
            </div>

            {/* Huge Token Badge */}
            <div className="flex items-baseline gap-3">
              <span className="text-xs text-slate-500 font-semibold uppercase">Token</span>
              <h1 className="font-mono text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                #{activeOrder.tokenNumber}
              </h1>
            </div>
            
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
              Assigned to <strong className="text-slate-900 dark:text-white">{activeOrder.customerName}</strong> · Pickup at <strong className="text-amber-600 dark:text-amber-400">Counter {activeOrder.counterNumber} (Hot Meals)</strong>
            </p>
          </div>

          {/* Time Slot & Estimate Card */}
          <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 backdrop-blur-md flex items-center gap-4 shrink-0 shadow-sm">
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-medium">Pickup Time Window</div>
              <div className="text-sm font-bold text-slate-900 dark:text-white font-mono">
                {activeOrder.pickupSlot}
              </div>
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">
                Ready by ~{activeOrder.estimatedReadyTime}
              </div>
            </div>
          </div>
        </div>

        {/* Stepper Progress Indicator */}
        <div className="py-8">
          <div className="relative">
            
            {/* Desktop progress track */}
            <div className="hidden sm:block absolute top-6 left-8 right-8 h-1 bg-slate-200 dark:bg-slate-800 -z-0">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 transition-all duration-500 ease-out"
                style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
              />
            </div>

            {/* Steps grid */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 sm:gap-2 relative z-10">
              {steps.map((step, idx) => {
                const isCompleted = idx < currentStepIndex;
                const isCurrent = idx === currentStepIndex;
                const isFuture = idx > currentStepIndex;

                return (
                  <div key={step.key} className="flex sm:flex-col items-center sm:text-center gap-4 sm:gap-2">
                    
                    {/* Circle Indicator */}
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-md ${
                      isCompleted
                        ? 'bg-emerald-500 text-white'
                        : isCurrent
                        ? 'bg-amber-500 text-white ring-4 ring-amber-500/25 scale-110 animate-pulse'
                        : 'bg-white dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700'
                    }`}>
                      {isCompleted ? <Check className="w-5 h-5 stroke-[2.5]" /> : step.icon}
                    </div>

                    {/* Step Text */}
                    <div className="sm:mt-2 text-left sm:text-center">
                      <div className={`text-xs font-bold ${
                        isCurrent
                          ? 'text-amber-600 dark:text-amber-400'
                          : isCompleted
                          ? 'text-slate-900 dark:text-white'
                          : 'text-slate-400'
                      }`}>
                        {step.label}
                      </div>
                      <p className="text-[11px] text-slate-500 leading-tight mt-0.5 max-w-[140px] sm:mx-auto">
                        {step.desc}
                      </p>
                    </div>

                  </div>
                );
              })}
            </div>

          </div>
        </div>

        {/* Counter QR Code & Pickup Notice */}
        <div className="mt-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-16 h-16 rounded-xl bg-white p-1.5 shadow-sm border border-slate-200 shrink-0 flex items-center justify-center">
              <QrCode className="w-full h-full text-slate-900" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>Fast Counter Verification Pass</span>
              </h4>
              <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">
                Show this digital pass at <strong>Counter {activeOrder.counterNumber}</strong> or speak your Token <strong className="font-mono">#{activeOrder.tokenNumber}</strong> for express pickup without queueing.
              </p>
            </div>
          </div>

          {/* Interactive Simulation Controls */}
          <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto shrink-0">
            {activeOrder.status !== 'collected' && (
              <button
                onClick={handleAdvanceStatus}
                className="w-full sm:w-auto px-4 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold rounded-xl hover:opacity-90 transition-opacity cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>Simulate Next Step</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={() => setRole('staff')}
              className="w-full sm:w-auto px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-amber-500 border border-slate-200 dark:border-slate-700 rounded-xl transition-colors cursor-pointer"
            >
              Open Kitchen Board
            </button>
          </div>

        </div>

      </div>

      {/* Item Breakdown Summary Card */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <h3 className="font-display text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center justify-between">
          <span>Ordered Items in Token #{activeOrder.tokenNumber}</span>
          <span className="font-mono text-xs text-slate-500">
            Placed at {activeOrder.createdAt}
          </span>
        </h3>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {activeOrder.items.map((item, idx) => (
            <div key={idx} className="py-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-mono font-bold">
                  {item.quantity}x
                </span>
                <div>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {item.menuItem.name}
                  </span>
                  {item.spiceLevel && (
                    <span className="ml-2 text-[10px] text-amber-500">
                      ({item.spiceLevel === 1 ? 'Mild' : item.spiceLevel === 2 ? 'Medium' : 'Spicy'})
                    </span>
                  )}
                  {item.specialInstructions && (
                    <p className="text-[10px] text-slate-400 italic">
                      Note: {item.specialInstructions}
                    </p>
                  )}
                </div>
              </div>
              <span className="font-mono font-bold text-slate-900 dark:text-white">
                ₹{item.menuItem.price * item.quantity}
              </span>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="pt-4 mt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
          <div className="text-slate-500">
            Payment: <strong className="uppercase font-mono text-slate-700 dark:text-slate-300">{activeOrder.paymentMethod}</strong> ({activeOrder.paymentStatus})
          </div>
          <div className="text-base font-bold font-mono text-amber-500">
            Total Paid: ₹{activeOrder.total}
          </div>
        </div>
      </div>

    </div>
  );
};
