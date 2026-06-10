import React, { useState } from 'react';
import { useAppState } from '../state/AppStateContext';
import { 
  User, Shield, Target, LogOut, Heart, Percent, Sparkles, 
  Clock, TrendingUp, MonitorSmartphone, Power, CheckCircle
} from 'lucide-react';

export const ProfileScreen: React.FC = () => {
  const { currentUser, toggleOnline, logout } = useAppState();

  if (!currentUser) return null;

  // Percentage calculations for the time saved progress bar
  const weeklyGoal = 20; // 20 hours is the goal
  const progressRatio = Math.min((currentUser.timeSavedThisWeek / weeklyGoal) * 100, 100);

  return (
    <div className="flex-1 p-5 space-y-5 slide-enter font-sans">
      
      {/* 1. SEKTION: AVATAR & BASIC DETAILS */}
      <div className="flex flex-col items-center text-center space-y-2 pt-2">
        <div className="relative">
          {/* Avatar circle */}
          <div className="w-20 h-20 bg-gradient-to-tr from-sky-500 to-indigo-500 rounded-full flex items-center justify-center text-2xl font-display font-extrabold text-white shadow-lg relative border-4 border-white">
            {currentUser.avatar}
          </div>
          {/* Active green status light */}
          {currentUser.online ? (
            <span className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 border-4 border-white rounded-full sim-pulse"></span>
          ) : (
            <span className="absolute bottom-1 right-1 w-5 h-5 bg-slate-300 border-4 border-white rounded-full"></span>
          )}
        </div>

        <div>
          <h3 className="font-display font-bold text-base text-slate-800 leading-snug">
            {currentUser.name}
          </h3>
          <p className="text-[11px] font-bold text-sky-600 tracking-wide uppercase mt-0.5">
            {currentUser.role}
          </p>
        </div>
      </div>

      {/* 2. SEKTION: LOGISTIK INFO & ONLINE TOGGLE */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-2xs space-y-4">
        <div className="grid grid-cols-2 gap-3 pb-3 border-b border-slate-100 text-xs">
          <div>
            <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Zugeordnetes Team</h4>
            <p className="text-slate-700 font-semibold mt-1 font-mono">{currentUser.team}</p>
          </div>
          <div>
            <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Schnittstellen-Eigner</h4>
            <p className="text-slate-700 font-semibold mt-1">Geprüft & Aktiviert</p>
          </div>
        </div>

        {/* Live Online Toggle Switch */}
        <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border border-slate-100">
          <div className="flex items-center space-x-2">
            <div className={`p-1.5 rounded-lg ${currentUser.online ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-500'}`}>
              <Power className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-700">Online-Status</p>
              <p className="text-[9px] text-slate-400">Teamkollegen sehen dich sofort</p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer select-none">
            <input 
              id="profile-online-toggle"
              type="checkbox" 
              checked={currentUser.online}
              onChange={(e) => toggleOnline(e.target.checked)}
              className="sr-only peer" 
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
          </label>
        </div>
      </div>

      {/* 3. SEKTION: TEAM ZEITERSPARNIS (KPI) */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-2xs space-y-3">
        <div className="flex justify-between items-center">
          <h4 className="font-display font-bold text-xs text-slate-500 uppercase tracking-widest flex items-center space-x-1.5">
            <Clock className="w-4 h-4 text-sky-500" />
            <span>Team Zeitersparnis (KPI)</span>
          </h4>
          <span className="text-[9px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded-sm flex items-center space-x-0.5">
            <TrendingUp className="w-3 h-3 inline" />
            <span>+15%</span>
          </span>
        </div>

        {/* Big visual number metrics */}
        <div className="flex items-baseline space-x-2 py-1">
          <span id="kpi-hours" className="text-3xl font-display font-black text-slate-800 tracking-tight">
            {currentUser.timeSavedThisWeek} Std
          </span>
          <span className="text-2xs text-slate-400 font-medium pb-1">
            Diese Woche eingespart
          </span>
        </div>

        {/* Progress bar towards weekly goal */}
        <div className="space-y-1">
          <div className="flex justify-between text-[9px] text-slate-400 font-medium">
            <span>Ziel: {weeklyGoal} Std / Woche</span>
            <span>{progressRatio.toFixed(0)}% erreicht</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner">
            <div 
              className="h-full bg-gradient-to-r from-sky-400 to-indigo-500 rounded-full transition-all duration-500"
              style={{ width: `${progressRatio}%` }}
            />
          </div>
        </div>

        {/* Total accumulation statistics */}
        <p className="text-[10px] text-slate-500 bg-slate-50 py-2 px-3 border border-slate-100 rounded-xl leading-snug">
          Gesamt: <strong className="text-slate-800">{currentUser.timeSavedTotal} Std</strong> eingespart seit Pilot-Start dieser Plattform im Team.
        </p>
      </div>

      {/* 4. SEKTION: ABMELDEN BUTTON */}
      <button 
        id="profile-logout-btn"
        onClick={logout}
        className="w-full py-3.5 border-2 border-slate-100 hover:border-rose-100 hover:bg-rose-50/20 active:scale-95 text-slate-500 hover:text-rose-600 font-bold rounded-2xl text-xs flex justify-center items-center space-x-1.5 transition-all cursor-pointer"
      >
        <LogOut className="w-4 h-4 shrink-0" />
        <span>Abmelden</span>
      </button>

      {/* Bottom version spec indicator */}
      <p className="text-center text-[10px] text-slate-300 leading-normal">
        Eingeloggt über sichere Identitäts-Föderation.<br />
        IP: 10.233.1.28 • Secure Token v4
      </p>

    </div>
  );
};
