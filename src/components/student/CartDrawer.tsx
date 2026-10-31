import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PICKUP_SLOTS } from '../../data/mockData';
import { PaymentMethod } from '../../types';
import confetti from 'canvas-confetti';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  Clock, 
  CreditCard, 
  QrCode, 
  Wallet, 
  Banknote, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    updateCartQuantity, 
    removeFromCart, 
    clearCart,
    cartSubtotal,
    cartCount,
    placeOrder
  } = useApp();

  const [selectedSlot, setSelectedSlot] = useState<string>(PICKUP_SLOTS[1]); // Default 12:30 PM - 01:00 PM
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [studentName, setStudentName] = useState('Rahul Verma');
  const [studentPhone, setStudentPhone] = useState('+91 98765 43210');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showUPISimulation, setShowUPISimulation] = useState(false);

  const taxes = Math.round(cartSubtotal * 0.05);
  const discount = cartSubtotal >= 200 ? 20 : 0;
  const grandTotal = cartSubtotal + taxes - discount;

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#10b981', '#3b82f6', '#f43f5e']
      });
    } catch {
      // safe fallback
    }
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setIsSubmitting(true);

    setTimeout(() => {
      placeOrder(selectedSlot, paymentMethod, studentName, studentPhone);
      triggerConfetti();
      setIsSubmitting(false);
      setIsCartOpen(false);
    }, 600);
  };

  if (!isCartOpen) {
    // Render sticky bottom bar for mobile if cart has items
    if (cartCount > 0) {
      return (
        <div className="fixed bottom-4 left-4 right-4 z-30 md:hidden animate-in slide-in-from-bottom-3 duration-200">
          <div className="bg-slate-900/95 dark:bg-slate-900/95 text-white p-3.5 rounded-2xl shadow-2xl border border-amber-500/30 backdrop-blur-md flex items-center justify-between">
            <div>
              <div className="text-[11px] text-amber-400 font-medium">
                {cartCount} {cartCount === 1 ? 'item' : 'items'} in cart
              </div>
              <div className="text-base font-bold font-mono">
                ₹{grandTotal} <span className="text-[10px] text-slate-400 font-normal">incl. taxes</span>
              </div>
            </div>
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
            >
              <span>View Cart</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      );
    }
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      
      {/* Click outside backdrop */}
      <div 
        className="flex-1 cursor-pointer"
        onClick={() => setIsCartOpen(false)}
        aria-hidden="true"
      />

      {/* Drawer content */}
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 h-full flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Your Food Tray</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono font-bold">
                {cartCount}
              </span>
            </h2>
            <p className="text-xs text-slate-500">Review items & choose pre-order pickup slot</p>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6">
          
          {/* Empty Tray State */}
          {cart.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-4">
                <Trash2 className="w-7 h-7" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Your tray is empty</h3>
              <p className="text-xs text-slate-500 mb-5 max-w-xs mx-auto">
                Explore our hot dosas, kathi rolls, and refreshing cold coffee to fill your cart.
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Browse Menu
              </button>
            </div>
          ) : (
            <>
              {/* Items List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <span>Selected Dishes</span>
                  <button
                    onClick={clearCart}
                    className="text-rose-500 hover:text-rose-600 text-[11px] font-medium transition-colors"
                  >
                    Clear Tray
                  </button>
                </div>

                {cart.map(({ menuItem, quantity, spiceLevel, specialInstructions }) => (
                  <div
                    key={menuItem.id}
                    className="p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-700 shrink-0">
                        <img
                          src={menuItem.image}
                          alt={menuItem.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {menuItem.name}
                        </h4>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                          <span className="font-mono font-medium text-slate-700 dark:text-slate-300">
                            ₹{menuItem.price * quantity}
                          </span>
                          {spiceLevel && (
                            <>
                              <span>·</span>
                              <span className="text-amber-500">
                                {spiceLevel === 1 ? 'Mild' : spiceLevel === 2 ? 'Medium' : 'Spicy'}
                              </span>
                            </>
                          )}
                        </div>
                        {specialInstructions && (
                          <p className="text-[10px] text-slate-400 italic truncate max-w-[170px]">
                            &ldquo;{specialInstructions}&rdquo;
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Stepper */}
                    <div className="flex items-center gap-1.5 shrink-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-1">
                      <button
                        onClick={() => updateCartQuantity(menuItem.id, -1)}
                        className="w-6 h-6 rounded flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-5 text-center text-xs font-bold font-mono text-slate-900 dark:text-white">
                        {quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(menuItem.id, 1)}
                        className="w-6 h-6 rounded flex items-center justify-center text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/30"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => removeFromCart(menuItem.id)}
                        className="ml-1 text-slate-400 hover:text-rose-500 p-0.5"
                        title="Remove item"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Crucial Value Feature: Pre-Order Pickup Time Slot Selector */}
              <div className="p-4 rounded-2xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400">
                    <Clock className="w-4 h-4" />
                    <span>PRE-ORDER PICKUP SLOT</span>
                  </div>
                  <span className="text-[10px] text-slate-500">Guaranteed Fresh</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mb-3 leading-relaxed">
                  Select when you want to collect your food at the counter. Food is prepared right before your window!
                </p>

                <div className="grid grid-cols-2 gap-2">
                  {PICKUP_SLOTS.map(slot => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      className={`p-2 rounded-xl text-left text-xs font-medium transition-all ${
                        selectedSlot === slot
                          ? 'bg-amber-500 text-white font-semibold shadow-sm shadow-amber-500/25 ring-2 ring-amber-400/50'
                          : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-amber-400'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="truncate">{slot}</span>
                        {selectedSlot === slot && <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Student Details Form */}
              <div className="space-y-3">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Pickup Contact Details
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] text-slate-600 dark:text-slate-400 mb-1">
                      Student / Staff Name
                    </label>
                    <input
                      type="text"
                      required
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      placeholder="e.g. Rahul Verma"
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-600 dark:text-slate-400 mb-1">
                      SMS Phone #
                    </label>
                    <input
                      type="text"
                      required
                      value={studentPhone}
                      onChange={(e) => setStudentPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-2.5">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Select Payment Method
                </div>
                <div className="grid grid-cols-2 gap-2">
                  
                  {/* UPI */}
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod('upi');
                      setShowUPISimulation(true);
                    }}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      paymentMethod === 'upi'
                        ? 'border-amber-500 bg-amber-500/10 text-slate-900 dark:text-white'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-xs font-bold mb-0.5">
                      <QrCode className="w-4 h-4 text-emerald-500" />
                      <span>UPI / QR</span>
                    </div>
                    <span className="text-[10px] text-slate-400">GPay, PhonePe, Paytm</span>
                  </button>

                  {/* Campus Wallet */}
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod('campus_wallet');
                      setShowUPISimulation(false);
                    }}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      paymentMethod === 'campus_wallet'
                        ? 'border-amber-500 bg-amber-500/10 text-slate-900 dark:text-white'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-xs font-bold mb-0.5">
                      <Wallet className="w-4 h-4 text-blue-500" />
                      <span>Campus Card</span>
                    </div>
                    <span className="text-[10px] text-slate-400">Balance: ₹450</span>
                  </button>

                  {/* Credit / Debit Card */}
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod('card');
                      setShowUPISimulation(false);
                    }}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      paymentMethod === 'card'
                        ? 'border-amber-500 bg-amber-500/10 text-slate-900 dark:text-white'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-xs font-bold mb-0.5">
                      <CreditCard className="w-4 h-4 text-purple-500" />
                      <span>Card / NetBanking</span>
                    </div>
                    <span className="text-[10px] text-slate-400">Instant gateway</span>
                  </button>

                  {/* Pay at Counter */}
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod('counter');
                      setShowUPISimulation(false);
                    }}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      paymentMethod === 'counter'
                        ? 'border-amber-500 bg-amber-500/10 text-slate-900 dark:text-white'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-xs font-bold mb-0.5">
                      <Banknote className="w-4 h-4 text-amber-500" />
                      <span>Pay at Counter</span>
                    </div>
                    <span className="text-[10px] text-slate-400">Cash / POS upon pickup</span>
                  </button>

                </div>
              </div>

              {/* UPI Instant QR Simulation Banner if chosen */}
              {paymentMethod === 'upi' && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center p-1 border border-slate-200 shrink-0">
                    <QrCode className="w-7 h-7 text-emerald-600" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-slate-100">
                      Direct UPI Intent
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      campuseats@okhdfcbank
                    </div>
                  </div>
                </div>
              )}

              {/* Bill Breakdown */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Tray Subtotal</span>
                  <span className="font-mono text-slate-900 dark:text-white font-medium">₹{cartSubtotal}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Canteen Tax (5% GST)</span>
                  <span className="font-mono text-slate-900 dark:text-white font-medium">₹{taxes}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                    <span>Campus Subsidy Discount</span>
                    <span className="font-mono">-₹{discount}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between items-baseline font-bold text-sm text-slate-900 dark:text-white">
                  <span>Grand Total</span>
                  <span className="font-mono text-base text-amber-500">₹{grandTotal}</span>
                </div>
              </div>

            </>
          )}

        </div>

        {/* Sticky Drawer Footer */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
            <div className="flex items-center justify-between mb-3 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Token generated instantly</span>
              </span>
              <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                Slot: {selectedSlot.split(' ')[0]}
              </span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-600 active:scale-[0.98] disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {isSubmitting ? (
                <span>Generating Token...</span>
              ) : (
                <>
                  <span>Confirm Order · Pay ₹{grandTotal}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
