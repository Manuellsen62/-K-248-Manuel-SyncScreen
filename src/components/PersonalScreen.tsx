import React, { useState } from 'react';
import { useAppState } from '../state/AppStateContext';
import { 
  AlertTriangle, Hammer, Users, Calendar, HelpCircle, 
  CheckSquare, Square, Info, Plus, ChevronRight, X, Clock,
  ArrowRight, ShieldAlert, Sparkles, Send, CheckCircle2, UserCheck
} from 'lucide-react';
import { Blocker, CalendarEntry, PersonalTask, WorkshopRequest } from '../types';
import { getRelativeDateString } from '../data';

export const PersonalScreen: React.FC = () => {
  const { 
    currentUser, 
    blockers, 
    escalateBlocker, 
    sendWorkshopInvitation,
    startPlanningWorkshop,
    planWorkshopBySergej,
    confirmWorkshopByPiotr,
    workshopRequests,
    calendarEntries,
    releaseCalendarEntry,
    updateCalendarEntry,
    createWorkshopFromPiotr,
    personalTasks,
    toggleTaskComplete,
    reportBlockerFromEugen,
    respondToWorkshopInvitation,
    reallocateCapacity,
    updateTaskStoryPoints
  } = useAppState();

  const [activeSubModal, setActiveSubModal] = useState<string | null>(null);
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  
  // Specific view local states
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Define static dates for active week 
  const daysOfWeek = [
    { name: 'Mo', date: getRelativeDateString(-1), label: '8' },
    { name: 'Di', date: getRelativeDateString(0), label: '9' },
    { name: 'Mi', date: getRelativeDateString(1), label: '10' },
    { name: 'Do', date: getRelativeDateString(2), label: '11' },
    { name: 'Fr', date: getRelativeDateString(3), label: '12' },
    { name: 'Sa', date: getRelativeDateString(4), label: '13' },
    { name: 'So', date: getRelativeDateString(5), label: '14' },
  ];

  // Form states - Sergej Workshop
  const [wsDate, setWsDate] = useState(getRelativeDateString(2));
  const [wsLength, setWsLength] = useState('2 Std');
  const [wsTeams, setWsTeams] = useState<string[]>(['Platform Operations']);
  const [wsTime, setWsTime] = useState('13:00 - 15:00');
  const [wsGoal, setWsGoal] = useState('');

  // Form states - Piotr Workshop
  const [pWsGoal, setPWsGoal] = useState('');
  const [pWsTeams, setPWsTeams] = useState<string[]>(['Integration Engineering', 'Platform Operations']);
  const [pWsLength, setPWsLength] = useState('2 Std');
  const [pWsDate, setPWsDate] = useState(getRelativeDateString(1));
  const [pWsCategoryType, setPWsCategoryType] = useState<'integration' | 'workshop' | 'blocker'>('integration');
  const [pWsSubcategory, setPWsSubcategory] = useState<string>('Go-Live');

  // Form states - Eugen Blocker
  const [ebTitle, setEbTitle] = useState('');
  const [ebDesc, setEbDesc] = useState('');
  const [ebSeverity, setEbSeverity] = useState<'green' | 'yellow' | 'red'>('red');
  const [ebTeam, setEbTeam] = useState('Platform Operations');

  // Form states - Piotr Date editing
  const [editingCalendarId, setEditingCalendarId] = useState<string | null>(null);
  const [editDate, setEditDate] = useState('');
  const [editTime, setEditTime] = useState('');

  // Local state for Piotr workloads (allows demonstrating instant priority changes!)
  const [memberWorkloads, setMemberWorkloads] = useState<{ [key: string]: number }>({
    'Eugen': 92,
    'Eliot': 65,
    'Magnus': 80,
    'Steve': 45
  });

  if (!currentUser) return null;

  const showBannerMessage = (msg: string) => {
    setSuccessBanner(msg);
    setTimeout(() => {
      setSuccessBanner(null);
    }, 4000);
  };

  // Team options helper
  const availableTeams = [
    'Integration Engineering',
    'Platform Operations',
    'Data & Analytics',
    'Cloud Infrastructure',
    'Application Development',
    'Cyber Security'
  ];

  // Toggle teams checkbox in workshop planner
  const handleTeamToggle = (team: string) => {
    if (wsTeams.includes(team)) {
      setWsTeams(wsTeams.filter(t => t !== team));
    } else {
      setWsTeams([...wsTeams, team]);
    }
  };

  const handlePiotrTeamToggle = (team: string) => {
    if (pWsTeams.includes(team)) {
      setPWsTeams(pWsTeams.filter(t => t !== team));
    } else {
      setPWsTeams([...pWsTeams, team]);
    }
  };

  // Submit Sergej Workshopplaner
  const handleSergejWsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wsGoal) return alert('Bitte lege ein Ziel fest!');
    sendWorkshopInvitation(wsDate, wsLength, wsTeams, wsGoal);
    showBannerMessage(`Einladungen für "${wsGoal}" generiert und an Eugen verschickt!`);
    setWsGoal('');
  };

  // Submit Piotr Workshop request
  const handlePiotrWsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pWsGoal) return alert('Bitte Thema/Ziel angeben!');
    createWorkshopFromPiotr(pWsGoal, pWsTeams, pWsLength, pWsCategoryType, pWsSubcategory, pWsDate);
    showBannerMessage(`Anfrage "${pWsGoal}" (${pWsSubcategory}) wurde an Sergej gesendet!`);
    setPWsGoal('');
    setActiveSubModal(null);
  };

  // Submit Eugen Blocker
  const handleEugenBlockerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ebTitle || !ebDesc) return alert('Bitte Titel und Beschreibung ausfüllen!');
    reportBlockerFromEugen(ebTitle, ebDesc, ebSeverity, ebTeam);
    showBannerMessage(`Blocker "${ebTitle}" erfolgreich an Scrum Master Sergej übermittelt.`);
    setEbTitle('');
    setEbDesc('');
    setActiveSubModal(null);
  };

  // Trigger Piotr's priority allocation
  const handlePiotrReprioritize = (member: string) => {
    setMemberWorkloads({
      ...memberWorkloads,
      [member]: 68 // Reprioritized load to safe zone
    });
    reallocateCapacity(member);
    showBannerMessage(`Kapazitäten für ${member} erfolgreich entlastet und neupriorisiert!`);
  };

  return (
    <div className="flex-1 p-4 space-y-4 slide-enter font-sans">
      
      {/* Dynamic Success Toast */}
      {successBanner && (
        <div className="bg-emerald-500 text-white p-3 rounded-xl flex items-center space-x-2 text-xs font-medium border border-emerald-400 shadow-lg slide-enter">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <p>{successBanner}</p>
        </div>
      )}

      {/* ==============================================
          VARIANTE A: SCRUM MASTER (SERGEJ) 
          ============================================== */}
      {currentUser.id === 'sergej' && (
        <div className="space-y-4">
          
          {/* Header */}
          <div className="flex justify-between items-center bg-slate-900 text-white rounded-2xl p-4 shadow-sm">
            <div>
              <span className="text-[10px] text-cyan-400 font-extrabold uppercase tracking-widest">SM Werkzeuge</span>
              <h2 className="text-sm font-bold font-display mt-0.5">Blocker & Workshopplanung</h2>
            </div>
            <ShieldAlert className="w-5 h-5 text-cyan-400 animate-pulse" />
          </div>

          {/* Bereich Blocker / Dependencies Table */}
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs space-y-3">
            <h3 className="font-display font-bold text-xs text-slate-500 uppercase tracking-widest flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-cyan-500" />
              <span>Blocker & Dependencies ({blockers.length})</span>
            </h3>

            <div className="border border-slate-100 rounded-xl overflow-x-auto shadow-2xs">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-slate-50 text-slate-400 text-[10px] uppercase font-bold tracking-wider border-b border-slate-100">
                    <th className="py-2.5 px-3">Blocker-ID</th>
                    <th className="py-2.5 px-3">Titel</th>
                    <th className="py-2.5 px-3">Schweregrad</th>
                    <th className="py-2.5 px-3">Gemeldet von</th>
                    <th className="py-2.5 px-3">Betroffenes Team</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Eskalation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {blockers.map((blocker) => {
                    const isSolved = blocker.status === 'green';
                    const blockerStatusLabel = isSolved ? 'Gelöst' : blocker.escalated ? 'Eskaliert' : 'Offen';
                    const severityLabel = blocker.status === 'red' ? 'Kritisch' : blocker.status === 'yellow' ? 'Warnung' : 'Niedrig';
                    
                    return (
                      <tr key={blocker.id} className="hover:bg-slate-50/50 transition-colors">
                        {/* Blocker-ID */}
                        <td className="py-3 px-3">
                          <button
                            onClick={() => {
                              setActiveSubModal('detail_' + blocker.id);
                            }}
                            className="font-bold text-cyan-650 hover:underline flex items-center space-x-1 cursor-pointer text-left font-mono"
                          >
                            <span>{blocker.id}</span>
                          </button>
                        </td>

                        {/* Name / Titel */}
                        <td className="py-3 px-3">
                          <button
                            onClick={() => {
                              setActiveSubModal('detail_' + blocker.id);
                            }}
                            className="font-semibold text-slate-800 hover:text-cyan-600 transition-colors text-left font-sans block max-w-[250px] truncate"
                            title={blocker.title}
                          >
                            {blocker.title}
                          </button>
                        </td>

                        {/* Schweregrad */}
                        <td className="py-3 px-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                            blocker.status === 'red' 
                              ? 'bg-rose-50 text-rose-700 border border-rose-250' 
                              : blocker.status === 'yellow' 
                                ? 'bg-amber-50 text-amber-700 border border-amber-250' 
                                : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                              blocker.status === 'red' ? 'bg-rose-500' :
                              blocker.status === 'yellow' ? 'bg-amber-400' : 'bg-emerald-500'
                            }`} />
                            {severityLabel}
                          </span>
                        </td>

                        {/* Gemeldet von */}
                        <td className="py-3 px-3 font-medium text-slate-550">
                          {blocker.reportedBy || 'System'}
                        </td>

                        {/* Betroffenes Team */}
                        <td className="py-3 px-3 font-medium text-slate-600 font-mono text-[10.5px]">
                          {blocker.team}
                        </td>

                        {/* Status */}
                        <td className="py-3 px-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            isSolved 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : blocker.escalated 
                                ? 'bg-rose-100 text-rose-850 border border-rose-220 font-extrabold animate-pulse' 
                                : 'bg-slate-100 text-slate-700'
                          }`}>
                            {blockerStatusLabel}
                          </span>
                        </td>

                        {/* Eskalations-Button */}
                        <td className="py-3 px-3 text-right">
                          {blocker.escalated ? (
                            <span className="text-[10px] text-rose-500 font-bold bg-rose-50 px-2 py-1 rounded-md border border-rose-100">
                              Eskaliert
                            </span>
                          ) : isSolved ? (
                            <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">
                              Erledigt
                            </span>
                          ) : (
                            <button
                              onClick={() => {
                                escalateBlocker(blocker.id);
                                showBannerMessage(`Blocker ${blocker.id} an Product Owner Piotr eskaliert!`);
                              }}
                              className="text-[10px] font-bold bg-amber-500 hover:bg-amber-600 text-white px-2.5 py-1 rounded-md transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95"
                            >
                              PO Alert
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bereich Workshopplaner */}
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs space-y-4 font-sans">
            <h3 className="font-display font-bold text-xs text-slate-500 uppercase tracking-widest flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-cyan-500" />
              <span>Workshopplaner (3-Schritt-Prozess)</span>
            </h3>

            {/* Helper inside render for Team Availability Lookup */}
            {(() => {
              const getAvailabilityForTeamsOnDate = (teams: string[], dateStr: string) => {
                const dayEvents = calendarEntries.filter(entry => 
                  entry.date === dateStr && entry.status === 'released' &&
                  entry.teams.some(team => teams.includes(team))
                );
                return dayEvents.reduce((sum, entry) => {
                  if (entry.hours !== undefined && entry.hours > 0) return sum + entry.hours;
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
                      if (m2 > m1 && m1 > 0) return sum + (m2 - m1) / 60;
                    }
                  }
                  if (entry.type === 'integration') return sum + 1.0;
                  return sum + 2.0;
                }, 0);
              };

              const requestedWorkshops = workshopRequests.filter(w => w.status === 'erstellt' || w.status === 'bearbeitung');

              return (
                <>
                  {/* Step 1: Open / In progress planning list */}
                  {requestedWorkshops.length === 0 ? (
                    <div className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-center space-y-1.5">
                      <p className="text-2xs font-semibold text-slate-500">Keine offenen Workshop-Anfragen</p>
                      <p className="text-[10px] text-slate-450 leading-relaxed">
                        Wechsle zum <strong>Product Owner Piotr</strong>, um eine neue Workshop-Anfrage (Thema, Dauer, Teams) zu erstellen.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {requestedWorkshops.map((w) => {
                        const isCurrentPlanning = w.status === 'bearbeitung';
                        const isIntegration = w.categoryType === 'integration';
                        const isBlocker = w.categoryType === 'blocker';
                        return (
                          <div 
                            key={w.id} 
                            className={`p-3.5 rounded-xl border transition-all text-left ${
                              isCurrentPlanning 
                                ? 'bg-cyan-50/10 border-cyan-300 ring-2 ring-cyan-500/5' 
                                : isIntegration 
                                  ? 'bg-blue-50/5 border-blue-150 hover:border-blue-200'
                                  : isBlocker
                                    ? 'bg-red-50/5 border-red-200 hover:border-red-300 ring-1 ring-red-100/50'
                                    : 'bg-emerald-50/5 border-emerald-150 hover:border-emerald-250'
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="flex gap-1 flex-wrap items-center">
                                  <span className={`text-[8.5px] font-bold uppercase px-1.5 py-0.5 rounded ${
                                    isIntegration 
                                      ? 'bg-blue-100 text-blue-800' 
                                      : isBlocker
                                        ? 'bg-red-100 text-red-800 border border-red-300 font-extrabold animate-pulse'
                                        : 'bg-emerald-100 text-emerald-800'
                                  }`}>
                                    {isIntegration ? '🔵 Integration' : isBlocker ? '🚨 Blocker-Behebung' : '🟢 Workshop'} ({w.subcategory})
                                  </span>
                                  <span className={`text-[8.5px] font-bold px-1.5 py-0.5 rounded uppercase border ${
                                    w.status === 'erstellt' 
                                      ? 'bg-amber-50 text-amber-805 border-amber-200' 
                                      : 'bg-cyan-50 text-cyan-805 border-cyan-205'
                                  }`}>
                                    {w.status === 'erstellt' ? 'Erstellt' : 'In Bearbeitung'}
                                  </span>
                                </div>
                                <h4 className="font-bold text-xs text-slate-800 mt-2">Thema: "{w.goal}"</h4>
                                <p className="text-[10px] text-slate-500 font-medium mt-1">
                                  Dauer: {w.length} • Benötigte Teams: {w.teams.join(', ')}
                                </p>
                              </div>
                            </div>

                            {w.status === 'erstellt' ? (
                              <div className="mt-3">
                                <button
                                  onClick={() => {
                                    startPlanningWorkshop(w.id);
                                    showBannerMessage(`Planung für "${w.goal}" gestartet. Status: IN BEARBEITUNG.`);
                                  }}
                                  className="w-full py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white text-[10px] font-bold rounded-lg transition-colors cursor-pointer flex justify-center items-center space-x-1"
                                >
                                  <span>📅 Planung starten (Schritt 2)</span>
                                </button>
                              </div>
                            ) : (
                              <div className="mt-4 pt-3 border-t border-slate-100 space-y-3">
                                {/* Verfügbarkeits-Lookup */}
                                <div className="bg-slate-50 border border-slate-150 p-3 rounded-lg space-y-2">
                                  <span className="text-[8.5px] font-bold text-slate-500 uppercase tracking-wider block">Verfügbarkeits-Check der benötigten Teams:</span>
                                  <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                                    {daysOfWeek.map((day) => {
                                      const hours = getAvailabilityForTeamsOnDate(w.teams, day.date);
                                      const over = hours > 4;
                                      const full = hours === 4;
                                      return (
                                        <div key={day.date} className="flex justify-between items-center py-0.5 bg-white border border-slate-100 rounded px-1.5 font-medium">
                                          <span className="text-slate-600">{day.name}, {day.label}. Juni</span>
                                          <span className={`font-bold px-1 rounded-sm text-[8px] ${
                                            over 
                                              ? 'bg-rose-100 text-rose-700' 
                                              : full 
                                                ? 'bg-amber-100 text-amber-700' 
                                                : 'bg-emerald-100 text-emerald-700'
                                          }`}>
                                            {hours} Std ({over ? 'Überbucht' : full ? 'Voll' : 'Frei'})
                                          </span>
                                        </div>
                                      );
                                    })}
                                  </div>
                                  <p className="text-[8.5px] text-slate-400 italic">4-Stunden-Regel: Ein Tag ist rot markiert, wenn Teams &gt; 4 Stunden Workshops haben.</p>
                                </div>

                                {/* Terminauswahl */}
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                  <div>
                                    <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Datum wählen</label>
                                    <select 
                                      value={wsDate}
                                      onChange={(e) => setWsDate(e.target.value)}
                                      className="w-full p-2 border border-slate-200 rounded-lg text-2xs bg-white font-medium"
                                    >
                                      {daysOfWeek.map((day) => {
                                        const hours = getAvailabilityForTeamsOnDate(w.teams, day.date);
                                        return (
                                          <option key={day.date} value={day.date}>
                                            {day.name}, {day.label}. Juni ({hours}h Workshops)
                                          </option>
                                        );
                                      })}
                                    </select>
                                  </div>
                                  <div>
                                    <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Uhrzeit</label>
                                    <select 
                                      value={wsTime}
                                      onChange={(e) => setWsTime(e.target.value)}
                                      className="w-full p-2 border border-slate-200 rounded-lg text-2xs bg-white font-medium"
                                    >
                                      <option value="09:00 - 11:00">09:00 - 11:00</option>
                                      <option value="11:05 - 13:05">11:05 - 13:05</option>
                                      <option value="13:30 - 15:30">13:30 - 15:30</option>
                                      <option value="15:30 - 17:30">15:30 - 17:30</option>
                                    </select>
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => {
                                    planWorkshopBySergej(w.id, wsDate, wsTime);
                                    showBannerMessage(`Workshop "${w.goal}" wurde erfolgreich für den ${wsDate} um ${wsTime} geplant! Status: GEPLANT.`);
                                  }}
                                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold rounded-lg transition-colors cursor-pointer flex justify-center items-center space-x-1"
                                >
                                  <span>🚀 Planen & Beteiligte einladen (Schritt 3)</span>
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Step 3 Tracking: Geplante Workshops */}
                  {workshopRequests.filter(w => w.status === 'geplant').length > 0 && (
                    <div className="pt-3 border-t border-slate-100/60 space-y-2">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block font-display">Geplante Workshops & RSVPs</span>
                      <div className="space-y-1.5 text-2xs">
                        {workshopRequests.filter(w => w.status === 'geplant').map((w) => (
                          <div key={w.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                            <div>
                              <p className="font-bold text-slate-700 truncate max-w-[170px]">"{w.goal}"</p>
                              <p className="text-[9.5px] text-slate-405 mt-0.5">{getRelativeDateString(0) === w.date ? 'Heute' : w.date} um {w.time}</p>
                            </div>
                            <div className="flex space-x-1 items-center">
                              {w.piotrConfirmed ? (
                                <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold px-1.5 py-0.5 rounded text-[7.5px] uppercase">PO Bestätigt</span>
                              ) : (
                                <span className="bg-sky-100 text-sky-800 border border-sky-200 font-bold px-1.5 py-0.5 rounded text-[7.5px] uppercase animate-pulse">PO Offen</span>
                              )}
                              {w.eugenRsvp === 'confirmed' ? (
                                <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold px-1.5 py-0.5 rounded text-[7.5px] uppercase">Eugen Zugesagt</span>
                              ) : w.eugenRsvp === 'declined' ? (
                                <span className="bg-rose-150 text-rose-800 border border-rose-200 font-bold px-1.5 py-0.5 rounded text-[7.5px] uppercase">Eugen Abgesagt</span>
                              ) : (
                                <span className="bg-amber-100 text-amber-800 border border-amber-200 font-bold px-1.5 py-0.5 rounded text-[7.5px] uppercase">Eugen Offen</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        </div>
      )}


      {/* ==============================================
          VARIANTE B: PRODUCT OWNER (PIOTR) 
          ============================================== */}
      {currentUser.id === 'piotr' && (
        <div className="space-y-4">
          
          {/* Header */}
          <div className="flex justify-between items-center bg-slate-900 text-white rounded-2xl p-4 shadow-sm animate-fade-in">
            <div>
              <span className="text-[10px] text-pink-400 font-extrabold uppercase tracking-widest">PO Cockpit</span>
              <h2 className="text-sm font-bold font-display mt-0.5">Kapazitäten & Freigaben</h2>
            </div>
            <Sparkles className="w-5 h-5 text-pink-400 animate-pulse" />
          </div>

          {/* Kapazitätsplaner */}
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs space-y-3">
            <div className="flex justify-between items-center text-xs">
              <h3 className="font-display font-bold text-xs text-slate-500 uppercase tracking-widest flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-pink-500" />
                <span>Kapazitätsplaner (Auslastung basierend auf Storypoints)</span>
              </h3>
              <span className="text-[9px] text-slate-400">Mitglied anklicken für Task-Details</span>
            </div>

            <div className="space-y-3">
              {[
                { id: 'eugen', name: 'Eugen' },
                { id: 'eliot', name: 'Eliot' },
                { id: 'magnus', name: 'Magnus' },
                { id: 'steve', name: 'Steve' }
              ].map((m) => {
                const memberTasks = personalTasks.filter(t => t.assignedTo === m.id);
                const completedTasks = memberTasks.filter(t => t.completed);
                const completedSP = completedTasks.reduce((sum, t) => sum + (t.storyPoints || 0), 0);
                const completedCount = completedTasks.length;

                // Capacity status logic:
                // > 25 SP = Stark belastet (Orange Badge + bar)
                // 10-25 SP = Normal (Grün Badge + bar)
                // < 10 SP = Überlastet / Blockiert (Rot Badge + bar)
                let statusLabel = 'Überlastet / Blockiert';
                let badgeClass = 'bg-red-50 text-red-700 border-red-200';
                let barColor = 'bg-red-500';
                let explanation = 'Kaum Aufgaben abgeschlossen. Wahrscheinlich blockiert.';

                if (completedSP > 25) {
                  statusLabel = 'Stark belastet';
                  badgeClass = 'bg-amber-50 text-amber-700 border-amber-200';
                  barColor = 'bg-amber-500';
                  explanation = 'Arbeitet an sehr vielen SP. Gefahr von Überlastung.';
                } else if (completedSP >= 10) {
                  statusLabel = 'Normal';
                  badgeClass = 'bg-emerald-50 text-emerald-800 border-emerald-200';
                  barColor = 'bg-emerald-500';
                  explanation = 'Gesunde Auslastung der Kapazitäten.';
                }

                // progress percent mapping on a standard max of 40 SP visual scale
                const progressWidth = Math.min((completedSP / 40) * 100, 100);

                return (
                  <div 
                    key={m.id}
                    onClick={() => setSelectedMember(m.id)}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-150 hover:border-pink-300 hover:bg-pink-50/5 transition-all text-left cursor-pointer space-y-2"
                  >
                    <div className="flex justify-between items-start text-2xs">
                      <div>
                        <div className="flex items-center space-x-1.5 flex-wrap">
                          <span className="font-bold text-slate-800 text-xs">{m.name}</span>
                          <span className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded border shrink-0 ${badgeClass}`}>
                            {statusLabel}
                          </span>
                        </div>
                        <p className="text-[9.5px] text-slate-450 mt-1">{explanation}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-[11px] font-extrabold text-slate-800 block">{completedSP} SP</span>
                        <span className="text-[9px] text-slate-450 block">{completedCount} erledigt</span>
                      </div>
                    </div>

                    {/* Visuelle Skala */}
                    <div className="space-y-0.5">
                      <div className="w-full bg-slate-205 h-2 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-300 ${barColor}`}
                          style={{ width: `${progressWidth}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[8px] text-slate-400 px-0.5 font-medium leading-none">
                        <span>0 SP</span>
                        <span>10 SP</span>
                        <span>25 SP</span>
                        <span>40+ SP</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section: ESKALIERTE BLOCKER (NEU) */}
          {blockers.filter(b => b.escalated).length > 0 ? (
            <div className="bg-rose-50/30 rounded-2xl p-4 border border-rose-200 shadow-2xs space-y-3 animate-fade-in text-left">
              <div className="flex justify-between items-center">
                <h3 className="font-display font-bold text-xs text-rose-700 uppercase tracking-widest flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                  <span>🚨 Eskalierte Blocker ({blockers.filter(b => b.escalated).length})</span>
                </h3>
              </div>

              <div className="space-y-2">
                {blockers.filter(b => b.escalated).map((b) => (
                  <div key={b.id} className="bg-white p-3.5 border border-rose-150 rounded-xl shadow-3xs space-y-2 transition-shadow hover:shadow-2xs">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[8px] font-extrabold bg-red-100 text-red-850 px-2 py-0.5 rounded border border-red-200 uppercase">
                          Kritisch Eskaliert
                        </span>
                        <h4 className="text-xs font-bold text-slate-800 mt-1.5">Blocker {b.id}: {b.title}</h4>
                      </div>
                      <span className="text-[9px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded font-mono">
                        {b.team}
                      </span>
                    </div>

                    <p className="text-[10px] text-slate-500 leading-relaxed bg-slate-50/50 p-2 rounded-lg border border-slate-100 italic">
                      "{b.description}"
                    </p>

                    <div className="flex justify-end pt-1">
                      <button
                        onClick={() => {
                          setPWsCategoryType('blocker');
                          setPWsSubcategory('Blocker-Analyse');
                          setPWsGoal(`Notfall-Abstimmung für Blocker: ${b.title}`);
                          setPWsTeams(['Dev Team Core', b.team]);
                          setActiveSubModal('piotr_ws');
                        }}
                        className="py-1.5 px-3 bg-red-600 hover:bg-red-700 text-white font-bold text-[9.5px] uppercase tracking-wider rounded-lg flex items-center space-x-1 cursor-pointer transition-transform active:scale-95 shadow-2xs"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Workshop buchen</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 rounded-2xl p-4 border border-dashed border-slate-205 text-left text-xs text-slate-500 font-medium">
              <span>Keine eskalierten Blocker momentan vorliegend. Alle Systeme laufen im Soll-Zustand.</span>
            </div>
          )}

          {/* Terminplaner */}
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-display font-bold text-xs text-slate-500 uppercase tracking-widest flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-pink-500" />
                <span>Terminplaner (Releases)</span>
              </h3>
              <button
                onClick={() => setActiveSubModal('piotr_ws')}
                className="p-1 text-pink-600 bg-pink-50 hover:bg-pink-100 rounded-lg transition-colors flex items-center space-x-1 text-2xs font-extrabold tracking-tight uppercase border border-pink-100 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Planen</span>
              </button>
            </div>

            <div className="space-y-2">
              {calendarEntries.map(entry => (
                <div key={entry.id} className="p-3 bg-slate-5/50 border border-slate-100 rounded-xl space-y-2 relative">
                  <div className="flex justify-between items-center">
                    <span className="text-2xs font-bold text-slate-700">{entry.title}</span>
                    <span className={`text-[9px] uppercase px-2 py-0.5 rounded-full font-bold ${
                      entry.status === 'released' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {entry.status === 'released' ? 'Aktiviert' : 'Entwurf'}
                    </span>
                  </div>

                  <p className="text-[10px] text-slate-500 font-medium">
                    {entry.date} • {entry.time} • Teams: {entry.teams.join(', ')}
                  </p>

                  <div className="flex justify-end space-x-1.5 pt-1.5 border-t border-slate-100/60">
                    <button
                      onClick={() => {
                        setEditingCalendarId(entry.id);
                        setEditDate(entry.date);
                        setEditTime(entry.time);
                        setActiveSubModal('edit_calendar');
                      }}
                      className="px-2 py-1 border border-slate-200 hover:bg-slate-100 text-[9px] font-bold rounded-lg text-slate-500 transition-colors cursor-pointer"
                    >
                      Verschieben
                    </button>
                    {entry.status === 'draft' && (
                      <button
                        onClick={() => {
                          releaseCalendarEntry(entry.id);
                          showBannerMessage(`Termin "${entry.title}" freigegeben! Eugen erhält Alert.`);
                        }}
                        className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-600 text-white text-[9px] font-bold rounded-lg transition-colors cursor-pointer"
                      >
                        Freigeben
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Workshops & Statusübersicht */}
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs space-y-3">
            <h3 className="font-display font-bold text-xs text-slate-500 uppercase tracking-widest flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-pink-500" />
              <span>Workshop Statusübersicht</span>
            </h3>

            {workshopRequests.length === 0 ? (
              <div className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-center">
                <p className="text-2xs font-semibold text-slate-500">Keine Workshops beantragt</p>
                <p className="text-[10px] text-slate-455 mt-1">Verwende die "Planen"-Schaltfläche oben, um einen Workshop anzufragen.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {workshopRequests.map((w) => {
                  const isIntegration = w.categoryType === 'integration';
                  const isBlocker = w.categoryType === 'blocker';
                  return (
                    <div key={w.id} className={`p-3 border rounded-xl space-y-2 text-left bg-white shadow-3xs transition-shadow hover:shadow-2xs ${
                      isIntegration 
                        ? 'border-blue-150 bg-blue-50/5' 
                        : isBlocker 
                          ? 'border-rose-250 bg-rose-50/5' 
                          : 'border-emerald-150 bg-emerald-50/5'
                    }`}>
                      <div className="flex justify-between items-start font-medium">
                        <div>
                          <div className="flex gap-1 items-center flex-wrap mb-1.5">
                            <span className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded ${
                              isIntegration 
                                ? 'bg-blue-100 text-blue-800' 
                                : isBlocker 
                                  ? 'bg-red-100 text-red-800 border border-red-200' 
                                  : 'bg-emerald-100 text-emerald-800'
                            }`}>
                              {isIntegration ? '🔵 Integration' : isBlocker ? '🔴 Blocker' : '🟢 Workshop'} ({w.subcategory})
                            </span>
                          </div>
                          <span className="text-[10px] font-bold text-slate-700">Thema: "{w.goal}"</span>
                          <p className="text-[9.5px] text-slate-450 mt-0.5 font-medium">
                            Dauer: {w.length} • Teams: {w.teams.join(', ')}
                          </p>
                          {w.date && (
                            <p className="text-[9.5px] text-brand-600 font-semibold mt-0.5">
                              Terminvorschlag: {w.date} {w.time ? `um ${w.time}` : ''}
                            </p>
                          )}
                        </div>
                        
                        <div className="flex flex-col items-end space-y-1 shrink-0">
                          {w.status === 'erstellt' ? (
                            <span className="text-[8.5px] bg-amber-50 text-amber-800 font-bold px-2 py-0.5 rounded border border-amber-200 uppercase shadow-3xs">
                              Erstellt
                            </span>
                          ) : w.status === 'bearbeitung' ? (
                            <span className="text-[8.5px] bg-blue-50 text-blue-800 font-bold px-2 py-0.5 rounded border border-blue-200 uppercase animate-pulse shadow-3xs">
                              In Bearbeitung
                            </span>
                          ) : w.piotrConfirmed ? (
                            <span className="text-[8.5px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded border border-emerald-250 uppercase shadow-3xs">
                              Geplant
                            </span>
                          ) : (
                            <span className="text-[8.5px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded border border-amber-250 uppercase shadow-3xs animate-bounce">
                              Vorschlag
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Bestätigen button if status === 'geplant' and not yet confirmed by Piotr */}
                      {w.status === 'geplant' && !w.piotrConfirmed && (
                        <div className="p-2.5 bg-sky-50 rounded-lg border border-sky-100 text-[10px] flex justify-between items-center mt-1">
                          <span className="text-sky-850 font-medium">Sergej schlägt diesen Termin vor.</span>
                          <button
                            onClick={() => {
                              confirmWorkshopByPiotr(w.id);
                              showBannerMessage(`Workshop-Termin für "${w.goal}" erfolgreich bestätigt!`);
                            }}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2.5 py-0.5 rounded shadow-3xs cursor-pointer transition-transform active:scale-95 text-[9px] uppercase tracking-wide"
                          >
                            Bestätigen
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}


      {/* ==============================================
          VARIANTE C: ENTWICKLER (EUGEN) 
          ============================================== */}
      {currentUser.id === 'eugen' && (
        <div className="space-y-4">
          
          {/* Header */}
          <div className="flex justify-between items-center bg-slate-900 text-white rounded-2xl p-4 shadow-sm animate-fade-in">
            <div>
              <span className="text-[10px] text-amber-400 font-extrabold uppercase tracking-widest">Developer Area</span>
              <h2 className="text-sm font-bold font-display mt-0.5">Tasks & Blocker-Meldungen</h2>
            </div>
            <Users className="w-5 h-5 text-amber-400 animate-pulse" />
          </div>

          {/* Bereich Workshop-Einladungen */}
          {workshopRequests.filter(w => w.status === 'geplant').length > 0 && (
            <div className="bg-purple-50/50 border border-purple-200 rounded-2xl p-4 space-y-3 shadow-2xs">
              <span className="text-[9px] font-bold bg-purple-200 text-purple-800 px-2.5 py-0.5 rounded-full uppercase">Geplante Workshops & Einladungen</span>
              {workshopRequests.filter(w => w.status === 'geplant').map((w) => {
                const isIntegration = w.categoryType === 'integration';
                return (
                  <div key={w.id} className={`space-y-2 p-3 bg-white/90 rounded-xl border ${
                    isIntegration ? 'border-blue-150' : 'border-emerald-150'
                  }`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <span className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded ${
                          isIntegration ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {isIntegration ? '🔵 Integration' : '🟢 Workshop'} ({w.subcategory})
                        </span>
                        <h4 className="text-xs font-bold text-slate-800 mt-1.5">Thema: {w.goal}</h4>
                      </div>
                      {w.eugenRsvp === 'confirmed' && (
                        <span className="text-[8px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded border border-emerald-300 uppercase">Zugesagt</span>
                      )}
                      {w.eugenRsvp === 'declined' && (
                        <span className="text-[8px] bg-rose-100 text-rose-800 font-bold px-1.5 py-0.2 rounded border border-rose-300 uppercase">Abgesagt</span>
                      )}
                      {(!w.eugenRsvp || w.eugenRsvp === 'invited') && (
                        <span className="text-[8px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.2 rounded border border-amber-300 uppercase animate-pulse">Offen</span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-600 leading-normal font-medium">
                      Datum: {w.date} • Uhrzeit: {w.time} • Länge: {w.length}<br/>
                      Beteiligte Teams: {w.teams.join(', ')}
                    </p>
                    
                    <div className="flex space-x-2 pt-1">
                      <button
                        onClick={() => {
                          respondToWorkshopInvitation(w.id, 'confirmed');
                          showBannerMessage('Workshop erfolgreich zugesagt! Sergej wird informiert.');
                        }}
                        className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                          w.eugenRsvp === 'confirmed'
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                        }`}
                      >
                        {w.eugenRsvp === 'confirmed' ? '✓ Zugesagt' : 'Beteiligung zusagen'}
                      </button>
                      <button
                        onClick={() => {
                          respondToWorkshopInvitation(w.id, 'declined');
                          showBannerMessage('Workshop abgesagt.');
                        }}
                        className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                          w.eugenRsvp === 'declined'
                            ? 'bg-rose-600 text-white shadow-sm'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {w.eugenRsvp === 'declined' ? '✗ Abgesagt' : 'Ablehnen'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Persönliche Tasks checkliste */}
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-display font-bold text-xs text-slate-500 uppercase tracking-widest flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                <span>Persönliche Tasks ({personalTasks.length})</span>
              </h3>
              <span className="text-[10px] text-slate-400">Checkbox tippen</span>
            </div>

            <div className="space-y-2">
              {personalTasks.map((task) => (
                <div 
                  key={task.id}
                  onClick={() => toggleTaskComplete(task.id)}
                  className="p-3 bg-slate-50 rounded-xl flex items-start space-x-3 hover:bg-slate-100/50 transition-colors cursor-pointer border border-transparent hover:border-slate-200"
                >
                  <div className="pt-0.5 shrink-0 text-brand-500">
                    {task.completed ? (
                      <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 fill-emerald-50" />
                    ) : (
                      <div className="w-4.5 h-4.5 border-2 border-slate-300 rounded-md bg-white hover:border-brand-500 transition-colors" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <p className={`text-xs font-semibold ${task.completed ? 'text-slate-400 line-through font-normal' : 'text-slate-700 font-bold'}`}>
                      {task.title}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 mt-1.5 text-[10px] text-slate-400">
                      <p className="flex items-center space-x-1 shrink-0 font-medium">
                        <Clock className="w-3 h-3 text-slate-300 inline" />
                        <span>Fällig: {task.deadline || 'ohne Frist'}</span>
                      </p>
                      
                      {/* Story Points Selector */}
                      <div className="flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
                        <span className="font-semibold text-slate-400 shrink-0">Aufwand:</span>
                        <select
                          value={task.storyPoints || 0}
                          onChange={(e) => {
                            e.stopPropagation();
                            updateTaskStoryPoints(task.id, parseInt(e.target.value) || 0);
                            showBannerMessage(`Task "${task.title}" auf ${e.target.value} SP geupdated!`);
                          }}
                          className="bg-slate-100 border border-slate-200 text-slate-700 rounded px-1.5 py-0.5 font-bold text-[9px] cursor-pointer"
                        >
                          <option value="1">1 SP</option>
                          <option value="3">3 SP</option>
                          <option value="5">5 SP</option>
                          <option value="8">8 SP</option>
                          <option value="13">13 SP</option>
                          <option value="21">21 SP</option>
                          <option value="34">34 SP</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Termine */}
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs space-y-3">
            <div className="flex justify-between items-center text-left">
              <h3 className="font-display font-bold text-xs text-slate-500 uppercase tracking-widest flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>Anstehende Termine</span>
              </h3>
            </div>

            <div className="space-y-2 text-left">
              {calendarEntries.filter(c => c.status === 'released' && c.teams.includes('Team 4')).length === 0 ? (
                <p className="text-2xs text-slate-400 italic py-2">Keine anstehenden Termine für heute registriert.</p>
              ) : (
                calendarEntries.filter(c => c.status === 'released' && c.teams.includes('Team 4')).map(entry => (
                  <div key={entry.id} className="p-3 bg-indigo-50/20 border border-slate-100 rounded-xl flex items-start justify-between">
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate">{entry.title}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Teams: {entry.teams.join(', ')}</p>
                    </div>
                    <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-1 rounded-lg shrink-0">
                      Heute • {entry.time.split(' ')[0]}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Neuer eigener Abschnitt: BLOCKER */}
          <div className="bg-white rounded-2xl p-4 border border-rose-200 shadow-2xs space-y-4 text-left animate-fade-in">
            <div className="flex justify-between items-center pb-2 border-b border-rose-100">
              <h3 className="font-display font-bold text-xs text-rose-700 uppercase tracking-widest flex items-center space-x-2">
                <ShieldAlert className="w-4 h-4 text-rose-500 animate-pulse" />
                <span>⚠️ Blocker Cockpit</span>
              </h3>
              
              <button
                onClick={() => setActiveSubModal('eugen_blocker')}
                className="py-1.5 px-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-[9px] uppercase tracking-wider rounded-lg flex items-center space-x-1 cursor-pointer transition-all active:scale-95 shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5 shrink-0" />
                <span>Blocker melden</span>
              </button>
            </div>

            {/* Liste aller Blocker die ihn betreffen */}
            <div className="space-y-2.5">
              <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider block">Betroffene Blocker:</span>
              
              {(() => {
                // Eugen is affected by:
                // - Blocker he reported (reportedBy is 'Eugen')
                // - Blocker that are assigned to his team or general Team 4 / Platform Operations, or target his dependencies.
                const eugenBlockers = blockers.filter(b => 
                  b.reportedBy?.toLowerCase() === 'eugen' || 
                  b.team === 'Platform Operations' || 
                  b.team === 'Dev Team Core'
                );

                if (eugenBlockers.length === 0) {
                  return (
                    <div className="p-4 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-center">
                      <p className="text-2xs text-slate-500 font-medium">Keine aktiven Blocker gemeldet oder betroffen.</p>
                    </div>
                  );
                }

                return (
                  <div className="space-y-2">
                    {eugenBlockers.map(b => (
                      <div key={b.id} className="p-3 bg-slate-50 border border-slate-150 rounded-xl space-y-1.5 shadow-3xs hover:border-slate-300 transition-colors">
                        <div className="flex justify-between items-start">
                          <h4 className="text-xs font-bold text-slate-800 flex-1 pr-2">
                            {b.title}
                          </h4>
                          <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase border shrink-0 ${
                            b.status === 'red' 
                              ? 'bg-rose-100 text-rose-800 border-rose-250' 
                              : b.status === 'yellow'
                                ? 'bg-amber-100 text-amber-800 border-amber-250'
                                : 'bg-emerald-100 text-emerald-800 border-emerald-250'
                          }`}>
                            {b.status === 'red' ? 'Kritisch' : b.status === 'yellow' ? 'Warnung' : 'Gering'}
                          </span>
                        </div>

                        <p className="text-[10px] text-slate-500 leading-normal font-medium">
                          {b.description}
                        </p>

                        <div className="flex justify-between items-center pt-1.5 border-t border-slate-200/50 text-[9px] text-slate-400 font-medium font-mono">
                          <span>Team: <strong className="text-slate-650">{b.team}</strong></span>
                          <span className="flex items-center space-x-1">
                            <span>Status:</span>
                            <span className={`font-bold uppercase ${b.escalated ? 'text-rose-600 animate-pulse font-extrabold' : 'text-slate-500'}`}>
                              {b.escalated ? 'Eskaliert' : 'Offen'}
                            </span>
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}


      {/* ==============================================
          MODALS & FORM DRAWERS 
          ============================================== */}
      
      {/* 0. Member Detail Task Modals (clickable capacity details) */}
      {selectedMember && (() => {
        const memberName = selectedMember.charAt(0).toUpperCase() + selectedMember.slice(1);
        const memberTasks = personalTasks.filter(t => t.assignedTo === selectedMember);
        const completedSP = memberTasks.filter(t => t.completed).reduce((sum, t) => sum + (t.storyPoints || 0), 0);
        return (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-5 z-50 animate-fade-in">
            <div className="bg-white rounded-3xl w-full max-w-[340px] p-5 shadow-2xl relative slide-enter text-left">
              <button 
                onClick={() => setSelectedMember(null)}
                className="absolute top-4 right-4 p-1 rounded-full hover:bg-slate-100 text-slate-400 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-4">
                <div>
                  <h3 className="font-display font-bold text-xs text-slate-400 uppercase tracking-widest flex items-center space-x-1.5">
                    <UserCheck className="w-4 h-4 text-pink-500" />
                    <span>Kapazitäts-Details</span>
                  </h3>
                  <h2 className="text-sm font-extrabold text-slate-800 mt-1">{memberName} ({completedSP} SP erledigt in 5 Tagen)</h2>
                </div>

                <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Tasks der letzten 5 Arbeitstage:</p>
                  {memberTasks.length === 0 ? (
                    <p className="text-2xs text-slate-400 italic">Keine Tasks für diese Person zugewiesen.</p>
                  ) : (
                    <div className="space-y-2">
                      {memberTasks.map(t => (
                        <div key={t.id} className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl flex items-start space-x-2.5 text-2xs">
                          <span className={`pt-0.5 font-bold ${t.completed ? 'text-emerald-500' : 'text-amber-500'}`}>
                            {t.completed ? '✓' : '○'}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className={`font-semibold ${t.completed ? 'text-slate-400 line-through' : 'text-slate-700 font-bold'}`}>{t.title}</p>
                            <p className="text-[9px] text-slate-400 mt-0.5">{t.deadline ? `Fällig: ${t.deadline}` : 'Keine Deadline'}</p>
                          </div>
                          <span className="font-bold text-slate-650 bg-slate-200/50 px-1.5 py-0.5 rounded shrink-0">
                            {t.storyPoints || 0} SP
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setSelectedMember(null)}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-center text-2xs cursor-pointer transition-colors uppercase tracking-wider"
                >
                  Schließen
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* 1. Blocker Detail Modal (for Sergej Blocker checks) */}
      {blockers.map((b) => {
        if (activeSubModal !== 'detail_' + b.id) return null;
        return (
          <div key={b.id} className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-5 z-50">
            <div className="bg-white rounded-3xl w-full max-w-[310px] p-5 shadow-2xl relative slide-enter">
              <button 
                onClick={() => setActiveSubModal(null)}
                className="absolute top-4 right-4 p-1 rounded-full hover:bg-slate-100 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center space-x-2 mb-3">
                <span className={`w-3 h-3 rounded-full ${b.status === 'red' ? 'bg-red-500' : 'bg-yellow-400'}`} />
                <h3 className="font-display font-bold text-sm text-slate-800">Blocker Detail: {b.id}</h3>
              </div>

              <div className="space-y-3 pt-1 text-xs">
                <div>
                  <h4 className="font-bold text-slate-400 text-[10px] uppercase">Titel</h4>
                  <p className="text-slate-700 font-semibold">{b.title}</p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-400 text-[10px] uppercase">Zuständiges Team</h4>
                  <p className="font-mono bg-slate-100 inline-block px-1.5 py-0.5 rounded text-slate-600 font-bold">{b.team}</p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-400 text-[10px] uppercase">Beschreibung</h4>
                  <p className="text-slate-500 leading-normal bg-slate-50 p-2.5 rounded-xl border border-slate-100">{b.description}</p>
                </div>

                {b.reportedBy && (
                  <div>
                    <h4 className="font-bold text-slate-400 text-[10px] uppercase">Gemeldet von</h4>
                    <p className="text-slate-600 font-semibold">👷 {b.reportedBy}</p>
                  </div>
                )}

                <button
                  onClick={() => {
                    if (!b.escalated) escalateBlocker(b.id);
                    setActiveSubModal(null);
                    showBannerMessage(`Blocker ${b.id} erfolgreich eskaliert!`);
                  }}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs shadow-2xs transition-all cursor-pointer ${
                    b.escalated 
                      ? 'bg-slate-105 border border-slate-200 text-slate-400' 
                      : 'bg-rose-500 hover:bg-rose-600 text-white'
                  }`}
                  disabled={b.escalated}
                >
                  {b.escalated ? 'Bereits an PO eskaliert' : 'An Product Owner eskalieren'}
                </button>
              </div>
            </div>
          </div>
        );
      })}

      {/* 2. Piotr Workshop Form Drawer */}
      {activeSubModal === 'piotr_ws' && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-end justify-center z-50">
          <div className="bg-white rounded-t-3xl p-5 shadow-2xl border-t border-slate-200 w-full slide-enter max-h-[500px] overflow-y-auto pb-8">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
              <h3 className="font-display font-bold text-xs text-slate-700 uppercase tracking-wider">Workshop anfragen</h3>
              <button onClick={() => setActiveSubModal(null)} className="p-1 hover:bg-slate-100 rounded-full text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePiotrWsSubmit} className="space-y-4 text-xs select-none">
              {/* 1. Typ wählen */}
              <div>
                <label className="block text-[10.5px] font-bold text-slate-500 uppercase mb-1.5">1. Typ wählen</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setPWsCategoryType('integration');
                      setPWsSubcategory('Go-Live');
                    }}
                    className={`py-2 px-1 border rounded-xl text-center text-xs font-bold transition-all cursor-pointer ${
                      pWsCategoryType === 'integration'
                        ? 'bg-blue-50 border-blue-400 text-blue-700 shadow-3xs'
                        : 'bg-slate-50 border-slate-200 text-slate-500'
                    }`}
                  >
                    🔵 Integration
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPWsCategoryType('workshop');
                      setPWsSubcategory('Planung');
                    }}
                    className={`py-2 px-1 border rounded-xl text-center text-xs font-bold transition-all cursor-pointer ${
                      pWsCategoryType === 'workshop'
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-700 shadow-3xs'
                        : 'bg-slate-50 border-slate-200 text-slate-500'
                    }`}
                  >
                    🟢 Workshop
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPWsCategoryType('blocker');
                      setPWsSubcategory('Blocker-Analyse');
                    }}
                    className={`py-2 px-1 border rounded-xl text-center text-xs font-bold transition-all cursor-pointer ${
                      pWsCategoryType === 'blocker'
                        ? 'bg-red-50 border-red-400 text-red-700 shadow-3xs'
                        : 'bg-slate-50 border-slate-200 text-slate-500'
                    }`}
                  >
                    🔴 Blocker
                  </button>
                </div>
              </div>

              {/* 2. Unterkategorie wählen */}
              <div>
                <label className="block text-[10.5px] font-bold text-slate-500 uppercase mb-1.5">2. Unterkategorie wählen</label>
                <select
                  value={pWsSubcategory}
                  onChange={(e) => setPWsSubcategory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700"
                >
                  {pWsCategoryType === 'integration' ? (
                    <>
                      <option value="Go-Live">Go-Live</option>
                      <option value="Update / Release">Update / Release</option>
                      <option value="Schnittstellenfreigabe">Schnittstellenfreigabe</option>
                      <option value="Migration">Migration</option>
                    </>
                  ) : pWsCategoryType === 'workshop' ? (
                    <>
                      <option value="Planung">Planung</option>
                      <option value="Erarbeitung">Erarbeitung</option>
                      <option value="Testing">Testing</option>
                      <option value="Review">Review</option>
                    </>
                  ) : (
                    <>
                      <option value="Blocker-Analyse">Blocker-Analyse</option>
                      <option value="Blocker-Behebung">Blocker-Behebung</option>
                      <option value="Notfall-Abstimmung">Notfall-Abstimmung</option>
                    </>
                  )}
                </select>
              </div>

              {/* 3. Restliche Felder ausfüllen */}
              <div>
                <label className="block text-[10.5px] font-bold text-slate-500 uppercase mb-1.5">3. Thema (Titel)</label>
                <input
                  type="text"
                  placeholder="z.B. REST Definition Gateway v2"
                  value={pWsGoal}
                  onChange={(e) => setPWsGoal(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Zeitraum (Datum)</label>
                  <input
                    type="date"
                    value={pWsDate}
                    onChange={(e) => setPWsDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-650"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Dauer</label>
                  <select
                    value={pWsLength}
                    onChange={(e) => setPWsLength(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="2 Std">2 Std</option>
                    <option value="4 Std">4 Std</option>
                    <option value="Tages-Workshop">1 Tag</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Beteiligte Teams (1-Klick)</label>
                <div className="grid grid-cols-3 gap-1 pt-1">
                  {availableTeams.map((team) => {
                    const isChecked = pWsTeams.includes(team);
                    return (
                      <button
                        type="button"
                        key={team}
                        onClick={() => handlePiotrTeamToggle(team)}
                        className={`py-1.5 px-2 border rounded-lg text-[10px] font-semibold transition-all ${
                          isChecked 
                            ? 'bg-pink-100 border-pink-400 text-pink-800' 
                            : 'bg-slate-50 border-slate-200 text-slate-500'
                        }`}
                      >
                        {team}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-xl flex justify-center uppercase tracking-wider text-2xs cursor-pointer transition-colors"
              >
                Anfrage an Sergej schicken
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 3. Eugen Blocker Form Modal */}
      {activeSubModal === 'eugen_blocker' && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-end justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-t-3xl p-5 shadow-2xl border-t border-slate-200 w-full slide-enter max-h-[500px] overflow-y-auto pb-8">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
              <h3 className="font-display font-bold text-xs text-slate-700 uppercase tracking-wild flex items-center space-x-1">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                <span>Kritischen Blocker einreichen</span>
              </h3>
              <button onClick={() => setActiveSubModal(null)} className="p-1 hover:bg-slate-100 rounded-full text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEugenBlockerSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Blocker-Titel (Kurz)</label>
                <input
                  type="text"
                  placeholder="z.B. DB Migrations-Skript bricht ab"
                  value={ebTitle}
                  onChange={(e) => setEbTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Problembeschreibung (Detail)</label>
                <textarea
                  placeholder="Beschreibe die Schnittstelle, die blockiert, oder den Fehlercode..."
                  value={ebDesc}
                  onChange={(e) => setEbDesc(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Zuständiges Team</label>
                  <select
                    value={ebTeam}
                    onChange={(e) => setEbTeam(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    {availableTeams.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Schweregrad</label>
                  <div className="flex space-x-1 mt-1">
                    <button
                      type="button"
                      onClick={() => setEbSeverity('green')}
                      className={`flex-1 py-1 px-1.5 text-[9px] font-bold rounded-lg border text-center transition-all cursor-pointer ${
                        ebSeverity === 'green' ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-slate-50 border-slate-200 text-slate-500'
                      }`}
                    >
                      Gering
                    </button>
                    <button
                      type="button"
                      onClick={() => setEbSeverity('yellow')}
                      className={`flex-1 py-1 px-1.5 text-[9px] font-bold rounded-lg border text-center transition-all cursor-pointer ${
                        ebSeverity === 'yellow' ? 'bg-amber-500 text-white border-amber-500' : 'bg-slate-50 border-slate-200 text-slate-505'
                      }`}
                    >
                      Warnung
                    </button>
                    <button
                      type="button"
                      onClick={() => setEbSeverity('red')}
                      className={`flex-1 py-1 px-1.5 text-[9px] font-bold rounded-lg border text-center transition-all cursor-pointer ${
                        ebSeverity === 'red' ? 'bg-rose-500 text-white border-rose-500 animate-pulse' : 'bg-slate-50 border-slate-200 text-slate-505'
                      }`}
                    >
                      Kritisch
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl flex justify-center uppercase tracking-wider text-2xs cursor-pointer transition-colors mt-2"
              >
                Absenden an Scrum Master (Sergej)
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 4. Piotr Calendar Date Editing Modal */}
      {activeSubModal === 'edit_calendar' && editingCalendarId && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-5 z-50">
          <div className="bg-white rounded-3xl w-full max-w-[290px] p-5 shadow-2xl relative slide-enter">
            <button 
              onClick={() => setActiveSubModal(null)}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-slate-100 text-slate-400"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="font-display font-bold text-xs text-slate-700 uppercase tracking-wide mb-3">Termin-Uhrzeit bearbeiten</h3>
            
            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Neues Datum</label>
                <input
                  type="date"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Neue Uhrzeit (z.B. "10:00 - 11:30")</label>
                <input
                  type="text"
                  value={editTime}
                  onChange={(e) => setEditTime(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <button
                onClick={() => {
                  updateCalendarEntry(editingCalendarId, editDate, editTime);
                  setActiveSubModal(null);
                  showBannerMessage('Termin erfolgreich verschoben und teamweit aktualisiert!');
                }}
                className="w-full py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl"
              >
                Termin Verschieben
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
