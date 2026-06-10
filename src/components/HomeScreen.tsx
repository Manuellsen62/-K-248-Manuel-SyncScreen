import React, { useState } from 'react';
import { useAppState } from '../state/AppStateContext';
import { 
  Bell, AlertTriangle, Calendar, ClipboardList, CheckCircle2, 
  ChevronRight, ArrowRight, X, Clock, HelpCircle, User, Zap 
} from 'lucide-react';
import { Notification, CalendarEntry } from '../types';

interface HomeScreenProps {
  setActiveTab: (tab: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ setActiveTab }) => {
  const { 
    currentUser, 
    notifications, 
    calendarEntries, 
    personalTasks,
    blockers,
    isGlockeOpen,
    setGlockeOpen
  } = useAppState();

  const [selectedNotif, setSelectedNotif] = useState<Notification | null>(null);

  if (!currentUser) return null;

  // 1. Filter notifications relevant to current logged-in role
  const relevantNotifications = notifications.filter(n => {
    return n.targetRole === 'all' || n.targetRole === currentUser.id;
  });

  // 2. Identify priority items (escalations & red blockers)
  const priorityAlerts = relevantNotifications.filter(n => 
    n.type === 'escalation' || (n.type === 'blocker' && n.title.includes('Kritisch'))
  );
  
  // Normal notifications
  const standardNotifications = relevantNotifications.filter(n => 
    !(n.type === 'escalation' || (n.type === 'blocker' && n.title.includes('Kritisch')))
  );

  // 3. Rollenspezifische anstehende Termine & Aufgaben
  const getRoleSpecificEventsAndTasks = () => {
    const todayStr = new Date('2026-06-09').toISOString().split('T')[0];
    
    // Sort upcoming events
    const sortedEvents = [...calendarEntries].sort((a, b) => a.date.localeCompare(b.date));

    // Eugen (Entwickler) - focused on developer duties
    if (currentUser.id === 'eugen') {
      const activeTasks = personalTasks.filter(t => !t.completed);
      return {
        title: 'Deine anstehenden Aufgaben & Integrationen',
        emptyMessage: 'Keine offenen Tasks heute! Hervorragend.',
        items: [
          ...activeTasks.map(t => ({
            id: t.id,
            type: 'task' as const,
            title: t.title,
            subtitle: `Deadline: ${t.deadline}`,
            priority: 'blue',
            original: t
          })),
          ...sortedEvents.filter(e => e.status === 'released').map(e => ({
            id: e.id,
            type: 'calendar' as const,
            title: e.title,
            subtitle: `${e.date} um ${e.time} (${e.teams.join(' & ')})`,
            priority: 'green',
            original: e
          }))
        ]
      };
    }

    // Piotr (PO) - focused on release and capacities
    if (currentUser.id === 'piotr') {
      const draftEvents = sortedEvents.filter(e => e.status === 'draft');
      const redBlockers = blockers.filter(b => b.status === 'red');
      return {
        title: 'Anstehende PO Handlungen',
        emptyMessage: 'Alle Releases auf Grün, keine Terminfreigaben offen.',
        items: [
          ...redBlockers.map(b => ({
            id: b.id,
            type: 'blocker' as const,
            title: `Kritischer Blocker: ${b.title}`,
            subtitle: `Blockiert: ${b.team} ${b.escalated ? '🔥 (ESKALIERT)' : ''}`,
            priority: 'red',
            original: b
          })),
          ...draftEvents.map(e => ({
            id: e.id,
            type: 'calendar' as const,
            title: `Terminfreigabe ausstehend: ${e.title}`,
            subtitle: `${e.date} um ${e.time} (${e.teams.join(', ')})`,
            priority: 'yellow',
            original: e
          }))
        ]
      };
    }

    // Sergej (Scrum Master) - focused on blockers and dynamic workshops
    const unresolvedBlockers = blockers.filter(b => b.status === 'red' || b.status === 'yellow');
    return {
      title: 'Scrum Master Impediments & Syncs',
      emptyMessage: 'Keine aktiven Impediments oder ausstehenden Syncs.',
      items: [
        ...unresolvedBlockers.map(b => ({
          id: b.id,
          type: 'blocker' as const,
          title: `Blocker ${b.id}: ${b.title}`,
          subtitle: `Zuständig: ${b.team} • Status: ${b.status === 'red' ? 'Kritisch' : 'Warnung'}`,
          priority: b.status === 'red' ? 'red' : 'yellow',
          original: b
        })),
        ...sortedEvents.map(e => ({
          id: e.id,
          type: 'calendar' as const,
          title: e.title,
          subtitle: `Status: ${e.status === 'released' ? 'Freigegeben' : 'Draft'} • ${e.date}`,
          priority: e.status === 'released' ? 'green' : 'slate',
          original: e
        }))
      ]
    };
  };

  const overviewItem = getRoleSpecificEventsAndTasks();

  const getNotifIcon = (type: Notification['type']) => {
    switch (type) {
      case 'blocker':
        return <div className="p-2 bg-amber-50 text-amber-500 rounded-lg"><AlertTriangle className="w-4 h-4" /></div>;
      case 'escalation':
        return <div className="p-2 bg-rose-50 text-rose-500 rounded-lg"><AlertTriangle className="w-4 h-4 animate-bounce" /></div>;
      case 'workshop':
        return <div className="p-2 bg-purple-50 text-purple-500 rounded-lg"><Calendar className="w-4 h-4" /></div>;
      case 'release':
        return <div className="p-2 bg-emerald-50 text-emerald-500 rounded-lg"><CheckCircle2 className="w-4 h-4" /></div>;
      case 'task_update':
        return <div className="p-2 bg-sky-50 text-sky-500 rounded-lg"><ClipboardList className="w-4 h-4" /></div>;
      default:
        return <div className="p-2 bg-slate-50 text-slate-500 rounded-lg"><HelpCircle className="w-4 h-4" /></div>;
    }
  };

  return (
    <div className="flex-1 p-4 space-y-4 slide-enter">
      
      {/* Hello Board banner */}
      <div className="bg-gradient-to-r from-brand-50 to-indigo-50/50 rounded-2xl p-4 border border-brand-100 flex items-center justify-between shadow-xs">
        <div>
          <span className="text-[10px] text-brand-600 font-bold uppercase tracking-wider font-display">Willkommen zurück</span>
          <h3 className="font-display text-base font-bold text-slate-800">{currentUser.name}</h3>
          <p className="text-xs text-slate-500">{currentUser.role} • {currentUser.team}</p>
        </div>
        <div className="w-10 h-10 bg-brand-500/10 text-brand-700 rounded-full font-display font-medium flex items-center justify-center text-sm border border-brand-100 shadow-inner">
          {currentUser.avatar}
        </div>
      </div>

      {/* 1. SECTION: PRIORITY ALERTS (Puffs up escalations) */}
      {priorityAlerts.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center space-x-1.5 text-rose-600">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
            <span className="text-xs font-bold uppercase tracking-wider">Dringende Handlungsschritte</span>
          </div>
          <div className="space-y-2">
            {priorityAlerts.map(alert => (
              <div 
                key={alert.id}
                onClick={() => setSelectedNotif(alert)}
                className="p-3 bg-rose-50/75 hover:bg-rose-50 border border-rose-100 rounded-xl flex items-start space-x-3 transition-all cursor-pointer shadow-xs duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <div className="p-1.5 bg-rose-500 text-white rounded-lg shrink-0">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 tracking-tight">{alert.title}</h4>
                  <p className="text-2xs text-rose-700/80 my-0.5 truncate">{alert.text}</p>
                  <span className="text-[9px] text-rose-400 font-medium flex items-center space-x-1">
                    <Clock className="w-3 h-3 inline" />
                    <span>{alert.time}</span>
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-rose-400 self-center shrink-0" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. SECTION: ALL NOTIFICATIONS */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            Benachrichtigungen ({relevantNotifications.length})
          </h4>
        </div>

        {relevantNotifications.length === 0 ? (
          <div className="bg-white border border-slate-100 rounded-2xl p-6 text-center shadow-2xs">
            <Bell className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-700">Keine neuen Meldungen</p>
            <p className="text-[10px] text-slate-400 mt-1">Gute Arbeit! Alle Schnittstellen sind aktuell synchronisiert.</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-[220px] overflow-y-auto pr-0.5">
            {/* If there are regular notifications, show them */}
            {standardNotifications.map(notif => (
              <div
                key={notif.id}
                onClick={() => setSelectedNotif(notif)}
                className={`p-3 bg-white hover:bg-slate-50 border rounded-xl flex items-start space-x-3 transition-colors cursor-pointer shadow-2xs ${
                  notif.read ? 'border-slate-100 opacity-80' : 'border-brand-100 bg-brand-50/20'
                }`}
              >
                {getNotifIcon(notif.type)}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h5 className="text-xs font-bold text-slate-800 truncate pr-2">{notif.title}</h5>
                    {!notif.read && (
                      <span className="w-1.5 h-1.5 bg-brand-500 rounded-full shrink-0 mt-1"></span>
                    )}
                  </div>
                  <p className="text-2xs text-slate-500 mt-0.5 line-clamp-1">{notif.text}</p>
                  <span className="text-[9px] text-slate-400 font-medium block mt-1">
                    {notif.time}
                  </span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 self-center shrink-0" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. SECTION: ROLE-SPECIFIC TASKS & OVERVIEW */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">
          AKTUELLE AUFGABEN & STATUS
        </h4>
        
        {overviewItem.items.length === 0 ? (
          <div className="bg-sky-50/40 border border-dashed border-sky-200 rounded-2xl p-6 text-center">
            <CheckCircle2 className="w-8 h-8 text-sky-400 mx-auto mb-2 animate-pulse" />
            <p className="text-xs font-bold text-sky-800">{overviewItem.emptyMessage}</p>
          </div>
        ) : (
          <div className="space-y-2">
            {overviewItem.items.slice(0, 4).map(item => (
              <div 
                key={item.id}
                onClick={() => setActiveTab('persoenlich')}
                className="bg-white border border-slate-150 rounded-xl p-3 flex items-center justify-between shadow-2xs hover:border-sky-200 transition-colors cursor-pointer group"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                    item.priority === 'red' ? 'bg-rose-500' :
                    item.priority === 'yellow' ? 'bg-amber-400' :
                    item.priority === 'blue' ? 'bg-indigo-500' :
                    item.priority === 'green' ? 'bg-emerald-500' : 'bg-slate-300'
                  }`} />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-800 truncate leading-tight group-hover:text-sky-600 transition-colors">
                      {item.title}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate mt-0.5">
                      {item.subtitle}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-1 shrink-0 text-slate-300 group-hover:text-sky-500 transition-colors">
                  <span className="text-[9px] font-medium hidden group-hover:inline">Bearbeiten</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* DETAILED NOTIFICATION DIALOG MODAL */}
      {selectedNotif && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-5 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-[320px] p-5 shadow-2xl border border-slate-100 flex flex-col slide-enter">
            <div className="flex justify-between items-start mb-3">
              <span className="text-[9px] font-bold tracking-widest uppercase bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full inline-block">
                {selectedNotif.type.toUpperCase()} ALERT
              </span>
              <button 
                id="close-notif-modal-btn"
                onClick={() => setSelectedNotif(null)}
                className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center space-x-2 mb-3">
              {getNotifIcon(selectedNotif.type)}
              <h3 className="font-display font-bold text-sm text-slate-800 leading-tight">
                {selectedNotif.title}
              </h3>
            </div>

            <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-100 leading-relaxed">
              {selectedNotif.text}
            </p>

            <div className="mt-4 flex items-center justify-between text-[10px] text-slate-400">
              <span className="font-medium">Empfänger: {selectedNotif.targetRole.toUpperCase()}</span>
              <span className="flex items-center space-x-1">
                <Clock className="w-3 h-3 inline" />
                <span>{selectedNotif.time}</span>
              </span>
            </div>

            {/* Direct smart action link */}
            <button
              onClick={() => {
                setSelectedNotif(null);
                setActiveTab('persoenlich');
              }}
              className="mt-4 w-full py-2.5 bg-brand-500 hover:bg-brand-600 active:scale-95 text-white text-xs font-semibold rounded-xl flex items-center justify-center space-x-2 transition-all cursor-pointer"
            >
              <span>Ausführen in "Persönlich"</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
