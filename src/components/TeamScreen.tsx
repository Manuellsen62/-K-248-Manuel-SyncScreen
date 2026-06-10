import React, { useState } from 'react';
import { useAppState } from '../state/AppStateContext';
import { 
  Calendar, Layers, AlertCircle, CheckCircle, Info, Clock, 
  Users, ChevronDown, Sparkles, HelpCircle, X, CheckCircle2 
} from 'lucide-react';
import { getRelativeDateString, getGermanDayName } from '../data';
import { CalendarEntry, DependencyItem } from '../types';

export const TeamScreen: React.FC = () => {
  const { 
    calendarEntries, 
    dependencies, 
    selectedDate, 
    setSelectedDate 
  } = useAppState();

  const [selectedDependency, setSelectedDependency] = useState<DependencyItem | null>(null);

  // Define static dates for our active week (Monday to Sunday around June 9th 2026)
  const daysOfWeek = [
    { name: 'Mo', date: getRelativeDateString(-1), label: '8' }, // June 08
    { name: 'Di', date: getRelativeDateString(0), label: '9' },  // June 09 (Main Base)
    { name: 'Mi', date: getRelativeDateString(1), label: '10' }, // June 10
    { name: 'Do', date: getRelativeDateString(2), label: '11' }, // June 11
    { name: 'Fr', date: getRelativeDateString(3), label: '12' }, // June 12
    { name: 'Sa', date: getRelativeDateString(4), label: '13' }, // June 13
    { name: 'So', date: getRelativeDateString(5), label: '14' }, // June 14
  ];

  // Group active/confirmed events (status: released) by date
  const getEventsForDate = (dateStr: string) => {
    return calendarEntries.filter(entry => entry.date === dateStr && entry.status === 'released');
  };

  const activeDayEvents = getEventsForDate(selectedDate);
  const hasConflictOnActiveDay = activeDayEvents.length >= 2;

  // Helper to calculate total hours of a date (all types combined, but only confirmed/released entries counts)
  const getWorkshopHoursForDate = (dateStr: string) => {
    const dayEvents = calendarEntries.filter(entry => 
      entry.date === dateStr && entry.status === 'released'
    );
    return dayEvents.reduce((sum, entry) => {
      // If entry has a specified hours > 0, use it
      if (entry.hours !== undefined && entry.hours > 0) return sum + entry.hours;
      
      // Parse of time format "10:00 - 11:30" (1.5 hours)
      if (entry.time && entry.time.includes('-')) {
        const parts = entry.time.split('-');
        if (parts.length === 2) {
          const t1 = parts[0].trim();
          const t2 = parts[1].trim();
          const parseTimeToMinutes = (t: string) => {
            const timeParts = t.split(':');
            return timeParts.length >= 2 ? parseInt(timeParts[0]) * 60 + parseInt(timeParts[1]) : 0;
          };
          const m1 = parseTimeToMinutes(t1);
          const m2 = parseTimeToMinutes(t2);
          if (m2 > m1 && m1 > 0) {
            return sum + (m2 - m1) / 60;
          }
        }
      }
      
      // Fallback hours
      if (entry.type === 'integration') return sum + 1.0;
      return sum + 2.0;
    }, 0);
  };

  const activeDayWorkshopHours = getWorkshopHoursForDate(selectedDate);
  const isOverbookedOnActiveDay = activeDayWorkshopHours > 4;

  const getStatusColor = (status: DependencyItem['status']) => {
    switch (status) {
      case 'red': return 'bg-rose-500';
      case 'yellow': return 'bg-amber-400';
      case 'green': return 'bg-emerald-500';
      default: return 'bg-slate-400';
    }
  };

  const getStatusBg = (status: DependencyItem['status']) => {
    switch (status) {
      case 'red': return 'bg-rose-50 border-rose-100';
      case 'yellow': return 'bg-amber-50 border-amber-100';
      case 'green': return 'bg-emerald-50 border-emerald-100';
      default: return 'bg-slate-50 border-slate-100';
    }
  };

  const getStatusTextGerman = (status: DependencyItem['status']) => {
    switch (status) {
      case 'red': return 'Kritischer Stau';
      case 'yellow': return 'In Abklärung';
      case 'green': return 'Freigegeben';
      default: return 'Bereit';
    }
  };

  return (
    <div className="flex-1 p-4 space-y-4 slide-enter">
      
      {/* 1. SEKTION: KAPAZITÄTS- / INTEGRATIONSKALENDER */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-2xs space-y-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2 text-slate-800">
            <Calendar className="w-4 h-4 text-brand-500" />
            <span className="font-display font-bold text-xs tracking-wider uppercase text-slate-500">Integrationskalender</span>
          </div>
          <span className="text-[10px] text-slate-400 font-semibold uppercase">Juni 2026</span>
        </div>

        {/* Horizontal Calendar Picker */}
        <div className="grid grid-cols-7 gap-1">
          {daysOfWeek.map((day) => {
            const dayHours = getWorkshopHoursForDate(day.date);
            const isSelected = selectedDate === day.date;

            // Indicator color or background styling depending on current day's hours
            let dayBgClass = '';
            let indicatorBg = 'bg-emerald-400';

            if (dayHours < 4) {
              indicatorBg = 'bg-emerald-500';
              dayBgClass = isSelected
                ? 'bg-slate-900 border border-slate-900 text-white shadow-md font-bold scale-105 z-10'
                : 'bg-emerald-50/50 hover:bg-emerald-100/70 border border-emerald-250 text-emerald-800 font-medium';
            } else if (dayHours === 4) {
              indicatorBg = 'bg-amber-400';
              dayBgClass = isSelected
                ? 'bg-amber-600 border border-amber-600 text-white shadow-md font-bold scale-105 z-10'
                : 'bg-amber-50 hover:bg-amber-100/70 border border-amber-300 text-amber-800 font-semibold';
            } else {
              indicatorBg = 'bg-rose-500';
              dayBgClass = isSelected
                ? 'bg-rose-600 border border-rose-600 text-white shadow-md font-bold scale-105 z-10 animate-pulse'
                : 'bg-rose-50 hover:bg-rose-100/70 border border-rose-300 text-rose-800 font-bold';
            }

            return (
              <button
                key={day.date}
                onClick={() => setSelectedDate(day.date)}
                className={`py-2 px-1 rounded-xl flex flex-col items-center justify-between transition-all relative cursor-pointer ${dayBgClass}`}
              >
                <span className={`text-[10px] ${isSelected ? 'text-white/80' : 'text-slate-400'}`}>
                  {day.name}
                </span>
                <span className="text-xs font-semibold mt-0.5 block">
                  {day.label}
                </span>
                <span className={`text-[8.5px] leading-none mt-1 block font-bold ${
                  isSelected 
                    ? 'text-white/90' 
                    : dayHours > 4 
                      ? 'text-rose-605' 
                      : dayHours === 4 
                        ? 'text-amber-600' 
                        : 'text-emerald-700'
                }`}>
                  {dayHours}h/4h
                </span>

                {/* Overbooking indicator dot */}
                <span className="absolute -bottom-1 flex justify-center">
                  <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white ring-1 ring-slate-900/30' : indicatorBg} ${dayHours > 4 ? 'animate-pulse ring-2 ring-rose-200' : ''}`} />
                </span>
              </button>
            );
          })}
        </div>

        {/* OVERBOOKING WARNING BANNER (4-hour rule) */}
        {isOverbookedOnActiveDay && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-900 rounded-xl flex items-start space-x-2 animate-shake">
            <AlertCircle className="w-4.5 h-4.5 text-red-500 mt-0.5 shrink-0 animate-bounce" />
            <div className="text-[10px] text-left">
              <p className="font-bold">Planungswarnung!</p>
              <p className="text-red-700 leading-normal mt-0.5">Überbuchung! Mehr als 4 Stunden an diesem Tag verbucht.</p>
            </div>
          </div>
        )}

        {/* Dynamic event details listed for selected active day */}
        <div className="space-y-2 pt-1 font-sans">
          {activeDayEvents.length === 0 ? (
            <div className="py-4 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <span className="text-[10px] text-slate-400">Keine geplanten Termine an diesem Tag</span>
            </div>
          ) : (
            activeDayEvents.map((event) => {
              const isWorkshop = event.type === 'workshop';
              const isBlocker = event.type === 'blocker';
              const isIntegration = event.type === 'integration';

              let cardStyle = 'border-blue-150 bg-blue-50/15 hover:bg-blue-50/35'; // blue fallback
              let badgeStyle = 'bg-blue-100 text-blue-800 border border-blue-250';
              let badgeLabel = '🔵 INTEGRATION';

              if (isWorkshop) {
                cardStyle = 'border-emerald-200 bg-emerald-50/15 hover:bg-emerald-50/35';
                badgeStyle = 'bg-emerald-100 text-emerald-800 border border-emerald-250';
                badgeLabel = '🟢 WORKSHOP';
              } else if (isBlocker) {
                cardStyle = 'border-red-200 bg-red-50/15 hover:bg-red-50/35';
                badgeStyle = 'bg-red-100 text-red-805 border border-red-200';
                badgeLabel = '🔴 BLOCKER-WORKSHOP';
              }

              return (
                <div 
                  key={event.id}
                  className={`p-3 rounded-xl border transition-all ${cardStyle}`}
                >
                  <div className="flex justify-between items-start">
                    <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${badgeStyle}`}>
                      {badgeLabel}
                    </span>
                    <span className="text-2xs font-mono text-slate-500 bg-slate-100 py-0.5 px-1.5 rounded flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{event.time}</span>
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-slate-850 mt-2">
                    {event.title}
                  </h3>

                  {event.hours !== undefined && (
                    <p className="text-[9.5px] font-medium text-slate-600 mt-1">
                      Dauer: {event.hours} {event.hours === 1 ? 'Stunde' : 'Stunden'}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100/60">
                    <div className="flex flex-wrap gap-1">
                      {event.teams.map((t, idx) => (
                        <div 
                          key={idx}
                          className="text-[9px] font-semibold text-slate-600 bg-white border border-slate-200 px-1.5 py-0.5 rounded shadow-3xs"
                        >
                          {t}
                        </div>
                      ))}
                    </div>
                    {event.status === 'draft' && (
                      <span className="text-[9px] text-amber-600 font-medium">Wartet auf Freigabe</span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 2. SEKTION: DEPENDENCIES ZWISCHEN TEAMS */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-2xs space-y-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2 text-slate-800">
            <Layers className="w-4 h-4 text-brand-500" />
            <span className="font-display font-bold text-xs tracking-wider uppercase text-slate-500">Dependencies</span>
          </div>
          <span className="text-[10px] text-slate-400 font-semibold uppercase">Teampfade</span>
        </div>

        <div className="space-y-2">
          {dependencies.map((dep) => (
            <div
              key={dep.id}
              onClick={() => setSelectedDependency(dep)}
              className={`p-3 border rounded-xl flex items-center justify-between hover:scale-98 transition-all cursor-pointer ${getStatusBg(dep.status)}`}
            >
              <div className="flex items-center space-x-3">
                {/* Traffic status dots */}
                <span className={`w-3 h-3 rounded-full shrink-0 ${getStatusColor(dep.status)} shadow-sm`} />
                <div>
                  <div className="flex items-center space-x-1.5 font-mono">
                    <span className="text-xs font-bold text-slate-850">{dep.fromTeam}</span>
                    <span className="text-2xs text-slate-400">wartet auf</span>
                    <span className="text-xs font-bold text-slate-850">{dep.toTeam}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 truncate max-w-[210px] mt-0.5">
                    {dep.description}
                  </p>
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 transform -rotate-90" />
            </div>
          ))}
        </div>
      </div>

      {/* DETAILED DEPENDENCY BOTTOM SHEET DRAWER */}
      {selectedDependency && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-end justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-t-3xl w-full p-5 shadow-2xl border-t border-slate-200 slide-enter max-h-[450px] overflow-y-auto pb-8 flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center space-x-2">
                <span className={`w-3 h-3 rounded-full ${getStatusColor(selectedDependency.status)}`} />
                <h3 className="font-display font-medium text-sm text-slate-900 uppercase">
                  Abhängigkeit Detail ({selectedDependency.id})
                </h3>
              </div>
              <button 
                onClick={() => setSelectedDependency(null)}
                className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-slate-50 p-4 rounded-2xl space-y-2 border border-slate-100">
                <div className="flex justify-between items-center text-2xs uppercase text-slate-400 font-bold">
                  <span>Wartendes Team</span>
                  <span>Verantwortetes Team</span>
                </div>
                <div className="flex justify-between items-center text-sm font-bold text-slate-800">
                  <span className="bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs font-mono">{selectedDependency.fromTeam}</span>
                  <span className="text-slate-300">⟶</span>
                  <span className="bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs font-mono">{selectedDependency.toTeam}</span>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-slate-500 mb-1">Status Beschreibung</h4>
                <div className="bg-white border border-slate-150 p-3 rounded-xl leading-relaxed text-slate-700">
                  {selectedDependency.description}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center text-2xs font-medium">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <p className="text-slate-400">Abstimmungs-Status</p>
                  <p className="text-[11px] font-bold text-slate-850 mt-1">{getStatusTextGerman(selectedDependency.status)}</p>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <p className="text-slate-400">Verantwortung</p>
                  <p className="text-[11px] font-bold text-slate-850 mt-1">Schnittstellen-Eigner</p>
                </div>
              </div>

              {/* Action advice for PO / Scrum Master */}
              <div className="p-3 bg-brand-50 text-brand-800 border-l-4 border-brand-500 rounded-r-xl flex items-start space-x-2">
                <Info className="w-4 h-4 text-brand-500 mt-0.5 shrink-0" />
                <p className="text-[10px] leading-snug">
                  Änderungen an diesem Status können im Persona-spezifischen Modul "Persönlich" vorgenommen werden. Alle Synchronisationen erfolgen automatisch.
                </p>
              </div>

              <button
                onClick={() => setSelectedDependency(null)}
                className="w-full py-3 bg-slate-900 hover:bg-slate-850 text-white font-medium rounded-xl text-xs flex justify-center cursor-pointer transition-colors mt-2"
              >
                Fenster Schließen
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
