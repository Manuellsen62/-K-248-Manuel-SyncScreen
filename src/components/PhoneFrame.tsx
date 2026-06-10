import React from 'react';
import { useAppState } from '../state/AppStateContext';
import { 
  Bell, Home, Users, Briefcase, User, Wifi, Signal, Battery, 
  RotateCcw, Sparkles 
} from 'lucide-react';

interface PhoneFrameProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  title?: string;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({ 
  children, 
  activeTab, 
  setActiveTab, 
  title = "SyncSpace" 
}) => {
  const { currentUser, notifications, isGlockeOpen, setGlockeOpen, markNotificationsAsRead } = useAppState();

  // Filter notifications relevant to current logged-in role
  const unreadCount = notifications.filter(n => {
    if (!currentUser) return false;
    if (n.read) return false;
    const isTarget = n.targetRole === 'all' || n.targetRole === currentUser.id;
    return isTarget;
  }).length;

  const handleGlockeClick = () => {
    setGlockeOpen(!isGlockeOpen);
    if (!isGlockeOpen) {
      markNotificationsAsRead();
    }
  };

  return (
    <div className="w-full h-screen h-[100dvh] bg-white overflow-hidden flex flex-col select-none md:relative md:mx-auto md:my-3 md:w-[390px] md:h-[844px] md:rounded-[55px] md:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] md:border-[12px] md:border-slate-900 md:ring-[1px] md:ring-slate-800">
      
      {/* iOS Dynamic Island & Status Bar */}
      <div className="bg-slate-50 text-slate-900 h-[44px] pt-4 px-6 relative flex justify-between items-center z-50 shrink-0 font-sans">
        {/* Mock Time of the applet execution state */}
        <span className="text-xs font-semibold tracking-tight">08:53</span>
        
        {/* Screen Dynamic Island Cutout (hidden on actual mobile screen to avoid double-notch) */}
        <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 top-[12px] w-[95px] h-[22px] bg-black rounded-full shadow-inner"></div>
        
        {/* Cellular wifi and battery signals */}
        <div className="flex items-center space-x-1.5">
          <Signal className="w-3.5 h-3.5 text-slate-900" strokeWidth={2.5} />
          <Wifi className="w-3.5 h-3.5 text-slate-900" strokeWidth={2.5} />
          <div className="flex items-center space-x-0.5">
            <span className="text-[10px] font-bold">100%</span>
            <Battery className="w-4 h-4 text-slate-900" strokeWidth={1} />
          </div>
        </div>
      </div>

      {/* Top Brand Bar (Rendered if logged in) */}
      {currentUser && (
        <div className="bg-white border-b border-slate-100 px-4 py-3.5 flex justify-between items-center z-40 shrink-0 shadow-xs">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 bg-brand-500 rounded-lg flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <h1 className="font-display font-bold text-lg tracking-tight text-brand-500">
              SyncSpace
            </h1>
          </div>
          
          <button 
            id="glocke-notify-btn"
            onClick={handleGlockeClick}
            className="p-1.5 hover:bg-slate-50 rounded-full transition-colors relative"
            aria-label="Notifikationen"
          >
            <Bell className="w-5 h-5 text-slate-600 hover:text-slate-900 transition-colors" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center rounded-full border border-white animate-bounce">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      )}

      {/* Primary Application Screen Content */}
      <div className="flex-1 bg-slate-50 overflow-y-auto overflow-x-hidden relative flex flex-col">
        {children}
      </div>

      {/* Bottom Navigation with 4 tabs (Rendered if logged in) */}
      {currentUser && (
        <div className="bg-white border-t border-slate-100 flex justify-around py-2.5 px-2 pb-3 md:pb-5 z-40 shrink-0 shadow-[0_-4px_12px_rgba(0,0,0,0.02)]">
          <button
            id="nav-tab-home"
            onClick={() => { setActiveTab('home'); setGlockeOpen(false); }}
            className={`flex flex-col items-center justify-center w-16 transition-colors ${
              activeTab === 'home' ? 'text-brand-500 font-semibold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Home className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-medium tracking-tight">Home</span>
          </button>

          <button
            id="nav-tab-team"
            onClick={() => { setActiveTab('team'); setGlockeOpen(false); }}
            className={`flex flex-col items-center justify-center w-16 transition-colors ${
              activeTab === 'team' ? 'text-brand-500 font-semibold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Users className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-medium tracking-tight">Team</span>
          </button>

          <button
            id="nav-tab-persoenlich"
            onClick={() => { setActiveTab('persoenlich'); setGlockeOpen(false); }}
            className={`flex flex-col items-center justify-center w-16 transition-colors ${
              activeTab === 'persoenlich' ? 'text-brand-500 font-semibold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Briefcase className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-medium tracking-tight">Persönlich</span>
          </button>

          <button
            id="nav-tab-profil"
            onClick={() => { setActiveTab('profil'); setGlockeOpen(false); }}
            className={`flex flex-col items-center justify-center w-16 transition-colors ${
              activeTab === 'profil' ? 'text-brand-500 font-semibold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <User className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-medium tracking-tight">Profil</span>
          </button>
        </div>
      )}

      {/* iOS Home Indicator Bar - Hidden on actual mobile screen viewport */}
      <div className="hidden md:block absolute bottom-[4px] left-1/2 transform -translate-x-1/2 w-[130px] h-[5px] bg-slate-900 rounded-full z-50"></div>
    </div>
  );
};
