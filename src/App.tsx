import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { HeroSection } from './components/student/HeroSection';
import { MenuCatalog } from './components/student/MenuCatalog';
import { CartDrawer } from './components/student/CartDrawer';
import { LiveOrderTracker } from './components/student/LiveOrderTracker';
import { OrderHistory } from './components/student/OrderHistory';
import { KitchenDashboard } from './components/staff/KitchenDashboard';
import { AdminPanel } from './components/admin/AdminPanel';
import { NotificationToast } from './components/common/NotificationToast';
import { CursorGlow } from './components/common/CursorGlow';
import { UtensilsCrossed, Clock, MapPin, Heart } from 'lucide-react';

const MainContent: React.FC = () => {
  const { role, studentTab } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDietary, setSelectedDietary] = useState('all');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      
      {/* Interactive Cursor Glow Effect */}
      <CursorGlow />

      {/* Top Bar Navigation */}
      <Navbar />

      {/* Real-time Toast Notifications */}
      <NotificationToast />

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Role: Student / Staff Customer Experience */}
        {role === 'student' && (
          <>
            {studentTab === 'menu' && (
              <div className="space-y-6">
                <HeroSection
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  selectedDietary={selectedDietary}
                  setSelectedDietary={setSelectedDietary}
                />
                <MenuCatalog
                  searchQuery={searchQuery}
                  selectedDietary={selectedDietary}
                />
              </div>
            )}

            {studentTab === 'tracking' && <LiveOrderTracker />}

            {studentTab === 'history' && <OrderHistory />}

            {/* Cart & Checkout Drawer */}
            <CartDrawer />
          </>
        )}

        {/* Role: Canteen Staff (Kitchen Fulfillment Dashboard) */}
        {role === 'staff' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
                  Kitchen Fulfillment Dashboard
                </h1>
                <p className="text-xs text-slate-500">
                  Manage live token queues, move orders between cooking stages, and toggle out-of-stock items.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Live Counter Synced</span>
              </div>
            </div>

            <KitchenDashboard />
          </div>
        )}

        {/* Role: Canteen Admin (Analytics & Menu Management) */}
        {role === 'admin' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
                  Canteen Admin & Analytics
                </h1>
                <p className="text-xs text-slate-500">
                  Review daily revenue in ₹, analyze peak hour wait times, and update menu prices.
                </p>
              </div>
              <div className="text-xs text-slate-400 font-mono">
                Academic Year 2026-27
              </div>
            </div>

            <AdminPanel />
          </div>
        )}

      </main>

      {/* Quiet, Polish Footer */}
      <footer className="border-t border-slate-200/80 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/40 text-xs text-slate-500 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-display text-slate-800 dark:text-slate-200 font-bold">
            <UtensilsCrossed className="w-4 h-4 text-amber-500" />
            <span>Campus Eats</span>
            <span className="font-normal text-slate-400">· Central Campus Dining & Pre-Order System</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-amber-500" />
              <span>Block B Dining Hall, Ground Floor</span>
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <span>08:00 AM – 09:00 PM Daily</span>
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
