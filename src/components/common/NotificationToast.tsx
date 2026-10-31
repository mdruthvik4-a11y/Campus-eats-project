import React from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, X, CheckCircle2 } from 'lucide-react';

export const NotificationToast: React.FC = () => {
  const { notificationMessage, dismissNotification } = useApp();

  if (!notificationMessage) return null;

  return (
    <div className="fixed top-20 right-4 sm:right-6 z-50 max-w-sm w-full animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="p-4 rounded-xl shadow-xl border bg-white/95 dark:bg-slate-900/95 border-amber-500/30 backdrop-blur-md flex items-start gap-3">
        <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
          <Bell className="w-5 h-5 animate-bounce" />
        </div>
        <div className="flex-1 text-sm">
          <div className="flex items-center gap-1.5 font-semibold text-slate-900 dark:text-slate-100 mb-0.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Campus Notification</span>
          </div>
          <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
            {notificationMessage}
          </p>
        </div>
        <button
          onClick={dismissNotification}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-md transition-colors"
          aria-label="Dismiss notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
