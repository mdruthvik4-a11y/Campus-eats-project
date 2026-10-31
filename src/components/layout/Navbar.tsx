import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Role } from '../../types';
import { 
  ShoppingBag, 
  Moon, 
  Sun, 
  UtensilsCrossed, 
  ChefHat, 
  ShieldCheck, 
  User, 
  ChevronDown,
  Volume2,
  VolumeX,
  Clock
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    role, 
    setRole, 
    theme, 
    toggleTheme, 
    studentTab, 
    setStudentTab, 
    cartCount, 
    cartSubtotal, 
    setIsCartOpen,
    soundEnabled,
    setSoundEnabled,
    orders
  } = useApp();

  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const activeOrdersCount = orders.filter(o => o.status === 'placed' || o.status === 'preparing' || o.status === 'ready').length;

  const handleRoleSelect = (newRole: Role) => {
    setRole(newRole);
    setRoleDropdownOpen(false);
  };

  const roleLabels: Record<Role, { title: string; badge: string; icon: React.ReactNode }> = {
    student: {
      title: 'Student / Staff',
      badge: 'Order Food',
      icon: <User className="w-4 h-4 text-amber-500" />
    },
    staff: {
      title: 'Canteen Staff',
      badge: 'Kitchen Board',
      icon: <ChefHat className="w-4 h-4 text-emerald-500" />
    },
    admin: {
      title: 'Canteen Admin',
      badge: 'Management',
      icon: <ShieldCheck className="w-4 h-4 text-blue-500" />
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 glass-panel">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 md:gap-8">
        
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-white shadow-sm shadow-amber-500/20">
            <UtensilsCrossed className="w-5 h-5" />
          </div>
          <button 
            onClick={() => setStudentTab('menu')}
            className="text-left group cursor-pointer"
          >
            <span className="font-display text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
              Campus<span className="text-amber-500">Eats</span>
            </span>
          </button>
        </div>

        {/* Zone 2: Navigation Links based on active role */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          {role === 'student' && (
            <>
              <button
                onClick={() => setStudentTab('menu')}
                className={`transition-colors whitespace-nowrap shrink-0 hover:text-amber-500 ${
                  studentTab === 'menu' ? 'text-amber-600 dark:text-amber-400 font-semibold' : ''
                }`}
              >
                Food Menu
              </button>
              <button
                onClick={() => setStudentTab('tracking')}
                className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 hover:text-amber-500 ${
                  studentTab === 'tracking' ? 'text-amber-600 dark:text-amber-400 font-semibold' : ''
                }`}
              >
                <span>Live Order Tracker</span>
                {activeOrdersCount > 0 && (
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                )}
              </button>
              <button
                onClick={() => setStudentTab('history')}
                className={`transition-colors whitespace-nowrap shrink-0 hover:text-amber-500 ${
                  studentTab === 'history' ? 'text-amber-600 dark:text-amber-400 font-semibold' : ''
                }`}
              >
                Past Orders
              </button>
            </>
          )}

          {role === 'staff' && (
            <div className="flex items-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1 text-slate-800 dark:text-slate-200">
                <ChefHat className="w-4 h-4 text-emerald-500" />
                <span>Kitchen Fulfillment Board</span>
              </span>
              <span>·</span>
              <span>Active Orders: <strong className="text-slate-900 dark:text-white font-mono">{activeOrdersCount}</strong></span>
              <span>·</span>
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-amber-500 transition-colors"
                title="Toggle Kitchen Chime"
              >
                {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-500" /> : <VolumeX className="w-3.5 h-3.5 text-slate-400" />}
                <span>{soundEnabled ? 'Chime ON' : 'Chime Muted'}</span>
              </button>
            </div>
          )}

          {role === 'admin' && (
            <div className="flex items-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1 text-slate-800 dark:text-slate-200">
                <ShieldCheck className="w-4 h-4 text-blue-500" />
                <span>Canteen Management Portal</span>
              </span>
              <span>·</span>
              <span>Central Campus Canteen Unit</span>
            </div>
          )}
        </nav>

        {/* Zone 3: Primary Action & Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* Demo Role Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 transition-colors"
              aria-label="Switch active role"
            >
              <div className="flex items-center gap-1">
                {roleLabels[role].icon}
                <span className="hidden sm:inline font-semibold">{roleLabels[role].title}</span>
                <span className="sm:hidden font-semibold">{role.toUpperCase()}</span>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${roleDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {roleDropdownOpen && (
              <div 
                className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
                role="menu"
              >
                <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                  Switch Portal View
                </div>
                {(['student', 'staff', 'admin'] as Role[]).map(r => (
                  <button
                    key={r}
                    onClick={() => handleRoleSelect(r)}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${
                      role === r ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold' : 'text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {roleLabels[r].icon}
                      <span>{roleLabels[r].title}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-normal">
                      {roleLabels[r].badge}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle color theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Student Cart Button */}
          {role === 'student' && (
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white text-xs font-semibold rounded-lg shadow-sm shadow-amber-500/20 transition-all duration-150"
              aria-label="Open Cart"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline font-mono">
                {cartCount > 0 ? `₹${cartSubtotal}` : 'Cart'}
              </span>
            </button>
          )}

          {/* Staff Quick Link */}
          {role === 'staff' && (
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg font-medium">
              <Clock className="w-3.5 h-3.5" />
              <span>Counter Active</span>
            </div>
          )}
        </div>

      </div>

      {/* Mobile Sub-Navigation for Students */}
      {role === 'student' && (
        <div className="md:hidden flex items-center justify-around border-t border-slate-200 dark:border-slate-800 px-4 py-2 bg-white/70 dark:bg-slate-900/70 text-xs font-medium">
          <button
            onClick={() => setStudentTab('menu')}
            className={`py-1 px-2.5 rounded-md ${
              studentTab === 'menu' ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 font-semibold' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Menu
          </button>
          <button
            onClick={() => setStudentTab('tracking')}
            className={`py-1 px-2.5 rounded-md flex items-center gap-1 ${
              studentTab === 'tracking' ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 font-semibold' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <span>Live Tracking</span>
            {activeOrdersCount > 0 && <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />}
          </button>
          <button
            onClick={() => setStudentTab('history')}
            className={`py-1 px-2.5 rounded-md ${
              studentTab === 'history' ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 font-semibold' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Past Orders
          </button>
        </div>
      )}
    </header>
  );
};
