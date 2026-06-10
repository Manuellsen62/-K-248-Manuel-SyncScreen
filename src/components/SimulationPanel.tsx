import React from 'react';
import { useAppState } from '../state/AppStateContext';
import { 
  Users, KeyRound, ArrowRight, RefreshCw, Sparkles, 
  Settings, HelpCircle, CheckCircle2, AlertTriangle, Play 
} from 'lucide-react';
import { UserRole } from '../types';

export const SimulationPanel: React.FC = () => {
  const { 
    currentUser, 
    personas, 
    blockers, 
    calendarEntries, 
    notifications,
    workshopRequests,
    switchUserDirectly,
    resetAllData,
    escalateBlocker,
    releaseCalendarEntry,
    toggleTaskComplete,
    reportBlockerFromEugen,
    createWorkshopFromPiotr,
    sendWorkshopInvitation
  } = useAppState();

  const handleQuickLogin = (role: UserRole) => {
    switchUserDirectly(role);
  };

  // Run scripted synchronization actions instantly to show cross-collaboration
  const triggerFlow = (flowId: number) => {
    switch (flowId) {
      case 1: // Sergej eskaliert Blocker -> Piotr benachrichtigt
        const unesc = blockers.find(b => !b.escalated);
        if (unesc) {
          escalateBlocker(unesc.id);
          alert(`Flow 1: Blocker ${unesc.id} wurde von Sergej eskaliert! Piotr erhält sofort ein rotes Handlungs-Alert.`);
        } else {
          alert('Alle Blocker wurden bereits eskaliert. Setze die Daten zurück um neu zu testen.');
        }
        break;
      case 2: // Piotr gibt Termine frei -> Eugen erhält Benachrichtigung
        const unreleased = calendarEntries.find(c => c.status === 'draft');
        if (unreleased) {
          releaseCalendarEntry(unreleased.id);
          alert(`Flow 2: Piotr hat "${unreleased.title}" freigegeben! Eugen sieht diesen Termin jetzt auf seiner Liste.`);
        } else {
          alert('Alle Termine sind bereits freigegeben.');
        }
        break;
      case 3: // Eugen hakt Task ab -> Sergejs Dashboard aktualisiert sich
        const openTask = personalTasksHelper().find(t => !t.completed);
        if (openTask) {
          toggleTaskComplete(openTask.id);
          alert(`Flow 3: Eugen hakt "${openTask.title}" ab! Sergej und Piotr sehen sofort das Performance-Update im KPI.`);
        } else {
          alert('Keine offenen Tasks bei Eugen vorhanden.');
        }
        break;
      case 4: // Eugen meldet Blocker -> Sergej erhält Alert
        reportBlockerFromEugen(
          'API Gateway Timeout im Checkout', 
          'Fehlercode 504 Gateway Timeout beim Aufruf der Checkout-Payments.', 
          'red',
          'Team 4'
        );
        alert('Flow 4: Eugen hat einen neuen kritischen Blocker eingereicht! SM Sergej sieht sofort ein rotes Blocker-Alert auf seinem Home-Screen.');
        break;
      case 5: // Piotr fragt Workshop an -> Sergej erhält Anfrage
        createWorkshopFromPiotr(
          'Schnittstellenspezifikation Team 1',
          ['Team 1', 'Team 4'],
          '2 Std',
          '2026-06-11'
        );
        alert('Flow 5: Piotr hat einen Workshop angefragt! Sergej sieht diese Anfrage nun in seinem "Workshopplaner" und kann sie mit 1 Klick bestätigen.');
        break;
      case 6: // Sergej sendet Einladung -> Eugen sieht sie
        sendWorkshopInvitation(
          '2026-06-12', 
          '4 Std', 
          ['Team 4'], 
          'Security und SSL Refactoring'
        );
        alert('Flow 6: Sergej hat Workshop-Einladungen für Team 4 erzeugt! Eugen sieht sofort eine hervorgehobene violette Einladungskarte in seinem "Persönlich"-Tab und kann direkt mit Zusagen/Absagen reagieren.');
        break;
      default:
        break;
    }
  };

  // Helper inside panel context
  const personalTasksHelper = () => {
    return [
      { id: 'T1', title: 'Frontend API Anbindung abschließen', completed: false },
      { id: 'T2', title: 'Pull Request #412 reviewen', completed: false },
      { id: 'T3', title: 'Komponententests schreiben', completed: true }
    ];
  };

  return (
    <div className="w-full xl:w-[420px] bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex flex-col space-y-6 shrink-0 h-fit max-w-[500px] xl:max-w-none">
      
      {/* Title */}
      <div>
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display font-medium text-lg text-slate-900 leading-snug">Prototyp Control Center</h2>
            <p className="text-2xs text-slate-400">Nutze dieses Panel, um Synchronisationen und Rollen sofort live zu testen.</p>
          </div>
        </div>
      </div>

      {/* Login Credentials Guide */}
      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-3">
        <h3 className="text-xs font-bold text-slate-700 flex items-center space-x-1.5 uppercase tracking-wider">
          <KeyRound className="w-4 h-4 text-slate-400" />
          <span>Zugriffsdaten (Login)</span>
        </h3>
        
        <div className="space-y-2 text-2xs leading-relaxed">
          <div className="flex justify-between border-b border-slate-100 pb-1.5">
            <div>
              <span className="font-bold text-slate-700">Sergej</span> (Scrum Master)
              <p className="text-slate-400">sergej@syncspace.ch</p>
            </div>
            <code className="bg-slate-200 px-1 rounded-sm text-slate-600 self-center">sergej123</code>
          </div>

          <div className="flex justify-between border-b border-slate-100 pb-1.5">
            <div>
              <span className="font-bold text-slate-700">Piotr</span> (Product Owner)
              <p className="text-slate-400">piotr@syncspace.ch</p>
            </div>
            <code className="bg-slate-200 px-1 rounded-sm text-slate-600 self-center">piotr123</code>
          </div>

          <div className="flex justify-between">
            <div>
              <span className="font-bold text-slate-700">Eugen</span> (Entwickler)
              <p className="text-slate-400">eugen@syncspace.ch</p>
            </div>
            <code className="bg-slate-200 px-1 rounded-sm text-slate-600 self-center">eugen123</code>
          </div>
        </div>
      </div>

      {/* 1-Click Persona Bypass Login inside the Emulator */}
      <div className="space-y-2.5">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest block">
          Rollen-Schnellwechsel (1-Klick Login)
        </h3>
        
        <div className="grid grid-cols-3 gap-2">
          {personas.map((p) => {
            const isActive = currentUser?.id === p.id;
            return (
              <button
                key={p.id}
                onClick={() => handleQuickLogin(p.id)}
                className={`py-2 px-1 rounded-xl text-center flex flex-col justify-center items-center transition-all border cursor-pointer ${
                  isActive 
                    ? 'bg-brand-50 border-brand-500 text-brand-700 ring-2 ring-brand-500/10' 
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                  p.id === 'sergej' ? 'bg-cyan-100 text-cyan-800' :
                  p.id === 'piotr' ? 'bg-pink-100 text-pink-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {p.avatar}
                </div>
                <span className="text-[10px] font-bold mt-1 block truncate max-w-[85px]">{p.name.split(' ')[0]}</span>
                <span className="text-[8px] text-slate-400 block truncate">{p.role}</span>
              </button>
            );
          })}
        </div>
        {currentUser && (
          <p className="text-[9px] text-slate-400 text-center">
            Aktuell eingeloggt als <strong className="text-slate-600">{currentUser.name}</strong>
          </p>
        )}
      </div>

      {/* Interactive Flow Demonstrator Short-cuts */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest block">
          Interaktive Flow-Motive auslösen
        </h3>

        <div className="space-y-2">
          {/* Flow 1 */}
          <button
            onClick={() => triggerFlow(1)}
            className="w-full p-2.5 bg-slate-50 hover:bg-brand-50 border border-slate-150 rounded-xl flex items-center justify-between text-left text-2xs transition-colors cursor-pointer group"
          >
            <div className="min-w-0 pr-2">
              <span className="font-bold text-slate-700 block group-hover:text-brand-600">Flow 1: Blocker eskalieren</span>
              <span className="text-slate-400">Sergej (SM) eskaliert ⟶ Piotr (PO) erhält Alert auf Home</span>
            </div>
            <Play className="w-3.5 h-3.5 text-slate-400 shrink-0 group-hover:text-brand-600 group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* Flow 2 */}
          <button
            onClick={() => triggerFlow(2)}
            className="w-full p-2.5 bg-slate-50 hover:bg-brand-50 border border-slate-150 rounded-xl flex items-center justify-between text-left text-2xs transition-colors cursor-pointer group"
          >
            <div className="min-w-0 pr-2">
              <span className="font-bold text-slate-700 block group-hover:text-brand-600">Flow 2: Termine freigeben</span>
              <span className="text-slate-400">Piotr (PO) gibt Datum frei ⟶ Eugen (Dev) sieht Termin & Notif</span>
            </div>
            <Play className="w-3.5 h-3.5 text-slate-400 shrink-0 group-hover:text-brand-600 group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* Flow 3 */}
          <button
            onClick={() => triggerFlow(3)}
            className="w-full p-2.5 bg-slate-50 hover:bg-brand-50 border border-slate-150 rounded-xl flex items-center justify-between text-left text-2xs transition-colors cursor-pointer group"
          >
            <div className="min-w-0 pr-2">
              <span className="font-bold text-slate-700 block group-hover:text-brand-600">Flow 3: Task abhaken Sichten</span>
              <span className="text-slate-400">Eugen (Dev) checkt Tasks ⟶ Dashboards/KPIs synchronisiert</span>
            </div>
            <Play className="w-3.5 h-3.5 text-slate-400 shrink-0 group-hover:text-brand-600 group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* Flow 4 */}
          <button
            onClick={() => triggerFlow(4)}
            className="w-full p-2.5 bg-slate-50 hover:bg-brand-50 border border-slate-150 rounded-xl flex items-center justify-between text-left text-2xs transition-colors cursor-pointer group"
          >
            <div className="min-w-0 pr-2">
              <span className="font-bold text-slate-700 block group-hover:text-brand-600">Flow 4: Blocker einreichen</span>
              <span className="text-slate-400">Eugen (Dev) reicht Blocker ein ⟶ Sergej (SM) erhält roten Blockade-Alert</span>
            </div>
            <Play className="w-3.5 h-3.5 text-slate-400 shrink-0 group-hover:text-brand-600 group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* Flow 5 */}
          <button
            onClick={() => triggerFlow(5)}
            className="w-full p-2.5 bg-slate-50 hover:bg-brand-50 border border-slate-150 rounded-xl flex items-center justify-between text-left text-2xs transition-colors cursor-pointer group"
          >
            <div className="min-w-0 pr-2">
              <span className="font-bold text-slate-700 block group-hover:text-brand-600">Flow 5: Workshop vorschlagen</span>
              <span className="text-slate-400">Piotr (PO) beanlagt Workshop ⟶ Sergej (SM) sieht offene Anfrage</span>
            </div>
            <Play className="w-3.5 h-3.5 text-slate-400 shrink-0 group-hover:text-brand-600 group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* Flow 6 */}
          <button
            onClick={() => triggerFlow(6)}
            className="w-full p-2.5 bg-slate-50 hover:bg-brand-50 border border-slate-150 rounded-xl flex items-center justify-between text-left text-2xs transition-colors cursor-pointer group"
          >
            <div className="min-w-0 pr-2">
              <span className="font-bold text-slate-700 block group-hover:text-brand-600">Flow 6: Einladung ausschreiben</span>
              <span className="text-slate-400">Sergej (SM) lädt Team ein ⟶ Eugen (Dev) sieht Karte zum Zusagen</span>
            </div>
            <Play className="w-3.5 h-3.5 text-slate-400 shrink-0 group-hover:text-brand-600 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* Global State telemetry specs */}
      <div className="pt-4 border-t border-slate-150 flex items-center justify-between">
        <div className="text-2xs text-slate-400">
          <p>Mock-Daten status: <strong className="text-emerald-500">Online</strong></p>
          <p>Letzte Synchronisation: Gerade eben</p>
        </div>
        
        <button
          onClick={() => {
            resetAllData();
            alert('Prototyp-Zustand wurde auf Standard-Szenarien zurückgesetzt!');
          }}
          className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-2xs flex items-center space-x-1 cursor-pointer shadow-xs transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5 shrink-0" />
          <span>Daten Zurücksetzen</span>
        </button>
      </div>

    </div>
  );
};
