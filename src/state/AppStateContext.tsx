import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Persona, Blocker, PersonalTask, CalendarEntry, 
  DependencyItem, Notification, WorkshopRequest, UserRole 
} from '../types';
import { 
  initialPersonas, initialBlockers, initialDependencies, 
  initialTasks, initialCalendarEntries, initialNotifications,
  getRelativeDateString
} from '../data';

interface AppStateContextType {
  currentUser: Persona | null;
  personas: Persona[];
  blockers: Blocker[];
  dependencies: DependencyItem[];
  personalTasks: PersonalTask[];
  calendarEntries: CalendarEntry[];
  notifications: Notification[];
  workshopRequests: WorkshopRequest[];
  selectedDate: string;
  isGlockeOpen: boolean;
  setGlockeOpen: (open: boolean) => void;
  setSelectedDate: (date: string) => void;
  
  // Actions
  login: (email: string, pass: string) => { success: boolean; error?: string };
  logout: () => void;
  switchUserDirectly: (role: UserRole) => void;
  toggleOnline: (isOnline: boolean) => void;
  escalateBlocker: (blockerId: string) => void;
  createWorkshopFromPiotr: (goal: string, teams: string[], length: string, categoryType: 'integration' | 'workshop' | 'blocker', subcategory: string, date?: string) => void;
  sendWorkshopInvitation: (date: string, length: string, teams: string[], goal: string) => void;
  startPlanningWorkshop: (requestId: string) => void;
  planWorkshopBySergej: (requestId: string, date: string, time: string) => void;
  confirmWorkshopByPiotr: (requestId: string) => void;
  toggleTaskComplete: (taskId: string) => void;
  reportBlockerFromEugen: (title: string, description: string, severity: 'green' | 'yellow' | 'red', team: string) => void;
  releaseCalendarEntry: (entryId: string) => void;
  updateCalendarEntry: (entryId: string, date: string, time: string) => void;
  respondToWorkshopInvitation: (requestId: string, status: 'confirmed' | 'declined') => void;
  reallocateCapacity: (memberName: string) => void;
  clearNotifications: () => void;
  markNotificationsAsRead: () => void;
  resetAllData: () => void;
  updateTaskStoryPoints: (taskId: string, sp: number) => void;
}

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<Persona | null>(null);
  const [personas, setPersonas] = useState<Persona[]>(initialPersonas);
  const [blockers, setBlockers] = useState<Blocker[]>(initialBlockers);
  const [dependencies, setDependencies] = useState<DependencyItem[]>(initialDependencies);
  const [personalTasks, setPersonalTasks] = useState<PersonalTask[]>(initialTasks);
  const [calendarEntries, setCalendarEntries] = useState<CalendarEntry[]>(initialCalendarEntries);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [workshopRequests, setWorkshopRequests] = useState<WorkshopRequest[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(getRelativeDateString(0));
  const [isGlockeOpen, setGlockeOpen] = useState<boolean>(false);

  // Initialize and load from localStorage if available
  useEffect(() => {
    const sanitizePersona = (p: Persona): Persona => {
      let name = p.name;
      let email = p.email;
      if (p.id === 'sergej') {
        name = 'Sergej';
        email = 'sergej@syncspace.ch';
      } else if (p.id === 'piotr') {
        name = 'Piotr';
        email = 'piotr@syncspace.ch';
      } else if (p.id === 'eugen') {
        name = 'Eugen';
        email = 'eugen@syncspace.ch';
      }
      return { ...p, name, email };
    };

    const cachedUser = localStorage.getItem('syncspace_current_user');
    const cachedPersonas = localStorage.getItem('syncspace_personas');
    const cachedBlockers = localStorage.getItem('syncspace_blockers');
    const cachedDependencies = localStorage.getItem('syncspace_dependencies');
    const cachedTasks = localStorage.getItem('syncspace_tasks');
    const cachedCalendar = localStorage.getItem('syncspace_calendar');
    const cachedNotifications = localStorage.getItem('syncspace_notifications');
    const cachedWorkshops = localStorage.getItem('syncspace_workshops');

    if (cachedUser) {
      try {
        const parsed = JSON.parse(cachedUser);
        setCurrentUser(sanitizePersona(parsed));
      } catch (e) {
        // ignore
      }
    }
    if (cachedPersonas) {
      try {
        const parsed = JSON.parse(cachedPersonas);
        if (Array.isArray(parsed)) {
          setPersonas(parsed.map(sanitizePersona));
        }
      } catch (e) {
        // ignore
      }
    }
    if (cachedBlockers) setBlockers(JSON.parse(cachedBlockers));
    if (cachedDependencies) setDependencies(JSON.parse(cachedDependencies));
    if (cachedTasks) setPersonalTasks(JSON.parse(cachedTasks));
    if (cachedCalendar) setCalendarEntries(JSON.parse(cachedCalendar));
    if (cachedNotifications) {
      try {
        const parsed = JSON.parse(cachedNotifications);
        if (Array.isArray(parsed)) {
          // Replace any lingering names in strings
          const cleanedNotifs = parsed.map(n => ({
            ...n,
            text: n.text
              ? n.text
                  .replace(/Sergej Schmidt/g, 'Sergej')
                  .replace(/Sergej Mustermann/g, 'Sergej')
                  .replace(/Piotr Kowalski/g, 'Piotr')
                  .replace(/Eugen Schmidt/g, 'Eugen')
              : n.text
          }));
          setNotifications(cleanedNotifs);
        }
      } catch (e) {}
    }
    if (cachedWorkshops) setWorkshopRequests(JSON.parse(cachedWorkshops));
  }, []);

  // Save changes helper
  const saveState = (
    updatedCurrentUser: Persona | null,
    updatedPersonas: Persona[],
    updatedBlockers: Blocker[],
    updatedDependencies: DependencyItem[],
    updatedTasks: PersonalTask[],
    updatedCalendar: CalendarEntry[],
    updatedNotifications: Notification[],
    updatedWorkshops: WorkshopRequest[]
  ) => {
    localStorage.setItem('syncspace_current_user', JSON.stringify(updatedCurrentUser));
    localStorage.setItem('syncspace_personas', JSON.stringify(updatedPersonas));
    localStorage.setItem('syncspace_blockers', JSON.stringify(updatedBlockers));
    localStorage.setItem('syncspace_dependencies', JSON.stringify(updatedDependencies));
    localStorage.setItem('syncspace_tasks', JSON.stringify(updatedTasks));
    localStorage.setItem('syncspace_calendar', JSON.stringify(updatedCalendar));
    localStorage.setItem('syncspace_notifications', JSON.stringify(updatedNotifications));
    localStorage.setItem('syncspace_workshops', JSON.stringify(updatedWorkshops));

    setCurrentUser(updatedCurrentUser);
    setPersonas(updatedPersonas);
    setBlockers(updatedBlockers);
    setDependencies(updatedDependencies);
    setPersonalTasks(updatedTasks);
    setCalendarEntries(updatedCalendar);
    setNotifications(updatedNotifications);
    setWorkshopRequests(updatedWorkshops);
  };

  const addNotificationHelper = (
    title: string,
    text: string,
    type: Notification['type'],
    targetRole: Notification['targetRole'],
    existingList: Notification[]
  ): Notification[] => {
    const newNotif: Notification = {
      id: 'N_' + Date.now() + Math.random().toString(36).substr(2, 4),
      title,
      text,
      time: 'Just now',
      timestamp: Date.now(),
      type,
      targetRole,
      read: false
    };
    return [newNotif, ...existingList];
  };

  // 1. LOGIN
  const login = (email: string, pass: string) => {
    const trimmedEmail = email.trim().toLowerCase();
    const matchedPersona = personas.find(p => p.email.toLowerCase() === trimmedEmail);
    
    if (!matchedPersona) {
      return { success: false, error: 'Ungültige E-Mail-Adresse. Versuche sergej@syncspace.ch, piotr@syncspace.ch oder eugen@syncspace.ch' };
    }
    
    // Checkpassword mock matching the logins specified
    const expectedPass = matchedPersona.id + '123';
    if (pass !== expectedPass) {
      return { success: false, error: 'Falsches Passwort. (Tipp: Verwende "' + expectedPass + '" zum Testen)' };
    }

    // Success
    const updated = { ...matchedPersona, online: true };
    const updatedPersonas = personas.map(p => p.id === matchedPersona.id ? updated : p);
    saveState(
      updated,
      updatedPersonas,
      blockers,
      dependencies,
      personalTasks,
      calendarEntries,
      notifications,
      workshopRequests
    );
    return { success: true };
  };

  // 2. LOGOUT
  const logout = () => {
    if (currentUser) {
      const updatedUser = { ...currentUser, online: false };
      const updatedPersonas = personas.map(p => p.id === currentUser.id ? updatedUser : p);
      saveState(
        null,
        updatedPersonas,
        blockers,
        dependencies,
        personalTasks,
        calendarEntries,
        notifications,
        workshopRequests
      );
    }
  };

  // Direct switch tool (Simulator)
  const switchUserDirectly = (role: UserRole) => {
    const destUser = personas.find(p => p.id === role);
    if (destUser) {
      const updatedUser = { ...destUser, online: true };
      const updatedPersonas = personas.map(p => p.id === role ? updatedUser : p);
      saveState(
        updatedUser,
        updatedPersonas,
        blockers,
        dependencies,
        personalTasks,
        calendarEntries,
        notifications,
        workshopRequests
      );
    }
  };

  // 3. TOGGLE ONLINE STATUS IN PROFILE
  const toggleOnline = (isOnline: boolean) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, online: isOnline };
    const updatedPersonas = personas.map(p => p.id === currentUser.id ? updatedUser : p);
    
    let notifs = [...notifications];
    if (isOnline) {
      notifs = addNotificationHelper(
        `${currentUser.name} ist online`,
        `Der Status von ${currentUser.name} (${currentUser.role}) wurde auf Online aktualisiert.`,
        'release',
        'all',
        notifs
      );
    }

    saveState(
      updatedUser,
      updatedPersonas,
      blockers,
      dependencies,
      personalTasks,
      calendarEntries,
      notifs,
      workshopRequests
    );
  };

  // 4. ESCALATE BLOCKER (Sergej -> Piotr)
  const escalateBlocker = (blockerId: string) => {
    const updatedBlockers = blockers.map(b => b.id === blockerId ? { ...b, escalated: true } : b);
    const escalatedBlockerItem = blockers.find(b => b.id === blockerId);
    
    let updatedNotifs = [...notifications];
    if (escalatedBlockerItem) {
      updatedNotifs = addNotificationHelper(
        `🚨 ESKALATION: Blocker ${blockerId}`,
        `Scrum Master Sergej hat den Blocker "${escalatedBlockerItem.title}" für ${escalatedBlockerItem.team} eskaliert! Prioritäre Handlung im Kapazitätsplaner erforderlich.`,
        'escalation',
        'piotr',
        updatedNotifs
      );
    }

    saveState(
      currentUser,
      personas,
      updatedBlockers,
      dependencies,
      personalTasks,
      calendarEntries,
      updatedNotifs,
      workshopRequests
    );
  };

  // 5. PIOTR REQUESTS WORKSHOP (Piotr -> Sergej)
  const createWorkshopFromPiotr = (goal: string, teams: string[], length: string, categoryType: 'integration' | 'workshop' | 'blocker', subcategory: string, date?: string) => {
    const newRequest: WorkshopRequest = {
       id: 'W_' + Date.now(),
       date: date || '',
       length,
       teams,
       goal,
       sender: 'piotr',
       status: 'erstellt',
       eugenRsvp: 'invited',
       categoryType,
       subcategory
    };

    const updatedWorkshops = [newRequest, ...workshopRequests];
    const isIntegration = categoryType === 'integration';
    const isBlocker = categoryType === 'blocker';
    let label = 'Workshop';
    let notifType: Notification['type'] = 'workshop';
    if (isIntegration) {
      label = 'Integration';
      notifType = 'release';
    } else if (isBlocker) {
      label = 'Blocker-Behebung';
      notifType = 'blocker';
    }
    
    const updatedNotifs = addNotificationHelper(
      isIntegration ? `🔗 Integration erstellt: ${goal}` : isBlocker ? `🚨 Blocker-Behebung erstellt: ${goal}` : `📅 Workshop erstellt: ${goal}`,
      `Product Owner Piotr hat einen Eintrag vom Typ ${label} (${subcategory}) mit dem Thema "${goal}" für die Teams: ${teams.join(', ')} (Dauer ${length}) erstellt.`,
      notifType,
      'sergej',
      notifications
    );

    saveState(
      currentUser,
      personas,
      blockers,
      dependencies,
      personalTasks,
      calendarEntries,
      updatedNotifs,
      updatedWorkshops
    );
  };

  // legacy / fallback sign
  const sendWorkshopInvitation = (date: string, length: string, teams: string[], goal: string) => {
    // Just map to Piotr creating then Sergej planning instantly!
    const newRequest: WorkshopRequest = {
      id: 'W_' + Date.now(),
      date,
      length,
      teams,
      goal,
      sender: 'piotr',
      status: 'geplant',
      eugenRsvp: 'invited',
      categoryType: 'workshop',
      subcategory: 'Planung'
    };

    const newCalendarEntry: CalendarEntry = {
      id: 'C_WS_' + Date.now(),
      title: `Workshop: ${goal}`,
      date,
      time: '14:00 - 15:00',
      teams,
      status: 'released',
      type: 'workshop',
      hours: parseFloat(length) || 2
    };

    const updatedWorkshops = [newRequest, ...workshopRequests];
    const updatedCalendar = [...calendarEntries, newCalendarEntry];
    const updatedNotifs = addNotificationHelper(
      `✉️ Workshop geplant (Geplant)`,
      `Scrum Master Sergej hat den Workshop "${goal}" am ${date} fertig geplant.`,
      'workshop',
      'eugen',
      notifications
    );

    saveState(
      currentUser,
      personas,
      blockers,
      dependencies,
      personalTasks,
      updatedCalendar,
      updatedNotifs,
      updatedWorkshops
    );
  };

  // New precise 3-step state handlers
  const startPlanningWorkshop = (requestId: string) => {
    const updatedWorkshops = workshopRequests.map(w => 
      w.id === requestId ? { ...w, status: 'bearbeitung' as const } : w
    );
    saveState(
      currentUser,
      personas,
      blockers,
      dependencies,
      personalTasks,
      calendarEntries,
      notifications,
      updatedWorkshops
    );
  };

  const planWorkshopBySergej = (requestId: string, date: string, time: string) => {
    const workshop = workshopRequests.find(w => w.id === requestId);
    if (!workshop) return;

    const updatedWorkshops = workshopRequests.map(w => 
      w.id === requestId ? { ...w, status: 'geplant' as const, date, time, eugenRsvp: 'invited' as const } : w
    );

    // Parse duration hours
    const matchHours = parseFloat(workshop.length) || 2.0;
    const isIntegration = workshop.categoryType === 'integration';
    const isBlocker = workshop.categoryType === 'blocker';

    const newCalendarEntry: CalendarEntry = {
      id: 'C_WS_' + Date.now(),
      title: `${isIntegration ? '🔗 Integration' : isBlocker ? '🔴 Blocker-Behebung' : '👥 Workshop'} (${workshop.subcategory}): ${workshop.goal}`,
      date,
      time,
      teams: workshop.teams,
      status: 'released',
      type: workshop.categoryType,
      subcategory: workshop.subcategory,
      hours: matchHours
    };

    const updatedCalendar = [...calendarEntries, newCalendarEntry];
    const updatedNotifs = addNotificationHelper(
      `✉️ Workshop geplant: ${workshop.goal}`,
      `Scrum Master Sergej hat den Workshop "${workshop.goal}" am ${date} um ${time} geplant.`,
      'workshop',
      'eugen',
      notifications
    );

    saveState(
      currentUser,
      personas,
      blockers,
      dependencies,
      personalTasks,
      updatedCalendar,
      updatedNotifs,
      updatedWorkshops
    );
  };

  const confirmWorkshopByPiotr = (requestId: string) => {
    const workshop = workshopRequests.find(w => w.id === requestId);
    if (!workshop) return;

    const updatedWorkshops = workshopRequests.map(w => 
      w.id === requestId ? { ...w, piotrConfirmed: true } : w
    );

    const updatedNotifs = addNotificationHelper(
      `✅ Workshop bestätigt`,
      `Product Owner Piotr hat den Workshop für "${workshop.goal}" am ${workshop.date} um ${workshop.time} bestätigt.`,
      'workshop',
      'all',
      notifications
    );

    saveState(
      currentUser,
      personas,
      blockers,
      dependencies,
      personalTasks,
      calendarEntries,
      updatedNotifs,
      updatedWorkshops
    );
  };

  // 7. EUGEN CHECKS TASK (Eugen -> Sergej/Piotr)
  const toggleTaskComplete = (taskId: string) => {
    const updatedTasks = personalTasks.map(t => 
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );
    const toggledTask = personalTasks.find(t => t.id === taskId);
    
    let updatedNotifs = [...notifications];
    if (toggledTask) {
      const isNowCompleted = !toggledTask.completed;
      const statusText = isNowCompleted ? 'erledigt' : 'wieder geöffnet';
      
      // Automatic performance increment!
      let updatedUser = currentUser;
      let updatedPersonas = [...personas];
      if (isNowCompleted && currentUser?.id === 'eugen') {
        const timeDelta = 1.5; // save 1.5 hour per resolved bottleneck
        updatedUser = { 
          ...currentUser, 
          timeSavedThisWeek: parseFloat((currentUser.timeSavedThisWeek + timeDelta).toFixed(1)),
          timeSavedTotal: currentUser.timeSavedTotal + 1
        };
        updatedPersonas = personas.map(p => p.id === 'eugen' ? updatedUser! : p);
      }
      
      updatedNotifs = addNotificationHelper(
        `✅ Task Status: ${toggledTask.title}`,
        `Entwickler Eugen hat die Aufgabe "${toggledTask.title}" als ${statusText} markiert. Dashboard synchronisiert.`,
        'task_update',
        'sergej', // Sergej receives notice
        updatedNotifs
      );
      
      // Also notify Piotr
      updatedNotifs = addNotificationHelper(
        `📈 Projektfortschritt vordefiniert`,
        `Entwickler Eugen arbeitet Task "${toggledTask.title}" ab. Kapazitäten werden entlastet.`,
        'task_update',
        'piotr',
        updatedNotifs
      );

      saveState(
        updatedUser,
        updatedPersonas,
        blockers,
        dependencies,
        updatedTasks,
        calendarEntries,
        updatedNotifs,
        workshopRequests
      );
    }
  };

  // 8. EUGEN REPORTS BLOCKER (Eugen -> Sergej)
  const reportBlockerFromEugen = (
    title: string,
    description: string,
    severity: 'green' | 'yellow' | 'red',
    team: string
  ) => {
    const newBlocker: Blocker = {
      id: 'B' + (blockers.length + 1),
      title,
      description,
      status: severity,
      team,
      escalated: false,
      reportedBy: 'Eugen'
    };

    const updatedBlockers = [newBlocker, ...blockers];
    const updatedNotifs = addNotificationHelper(
      `⚠️ Neuer Blocker eingereicht`,
      `Entwickler Eugen meldet Blocker "${title}" für ${team} mit Schweregrad: ${severity.toUpperCase()}.`,
      'blocker',
      'sergej',
      notifications
    );

    saveState(
      currentUser,
      personas,
      updatedBlockers,
      dependencies,
      personalTasks,
      calendarEntries,
      updatedNotifs,
      workshopRequests
    );
  };

  // 9. PIOTR RELEASES CALENDAR ENTRY (Piotr -> Eugen)
  const releaseCalendarEntry = (entryId: string) => {
    const updatedCalendar = calendarEntries.map(c => 
      c.id === entryId ? { ...c, status: 'released' as const } : c
    );
    const entryItem = calendarEntries.find(c => c.id === entryId);

    let updatedNotifs = [...notifications];
    if (entryItem) {
      updatedNotifs = addNotificationHelper(
        `📅 Integration freigegeben`,
        `Product Owner Piotr hat den Termin "${entryItem.title}" am ${entryItem.date} freigegeben.`,
        'release',
        'eugen',
        updatedNotifs
      );
      // also notify SM
      updatedNotifs = addNotificationHelper(
        `📅 Integrationstermin fixiert`,
        `Piotr hat "${entryItem.title}" genehmigt. Der Workshoplaner wurde abgeglichen.`,
        'release',
        'sergej',
        updatedNotifs
      );
    }

    saveState(
      currentUser,
      personas,
      blockers,
      dependencies,
      personalTasks,
      updatedCalendar,
      updatedNotifs,
      workshopRequests
    );
  };

  // Update calendar details by Piotr
  const updateCalendarEntry = (entryId: string, date: string, time: string) => {
    const updatedCalendar = calendarEntries.map(c => 
      c.id === entryId ? { ...c, date, time } : c
    );
    const entryItem = calendarEntries.find(c => c.id === entryId);

    let updatedNotifs = [...notifications];
    if (entryItem) {
      updatedNotifs = addNotificationHelper(
        `🔄 Termin verschoben`,
        `Piotr hat den Termin "${entryItem.title}" auf den ${date} (${time}) verschoben.`,
        'release',
        'all',
        updatedNotifs
      );
    }

    saveState(
      currentUser,
      personas,
      blockers,
      dependencies,
      personalTasks,
      updatedCalendar,
      updatedNotifs,
      workshopRequests
    );
  };

  // 10. EUGEN CONFIRMS WORKSHOP
  const respondToWorkshopInvitation = (requestId: string, status: 'confirmed' | 'declined') => {
    const updatedWorkshops = workshopRequests.map(w => 
      w.id === requestId ? { ...w, status } : w
    );

    const workshop = workshopRequests.find(w => w.id === requestId);
    let updatedNotifs = [...notifications];
    if (workshop) {
      updatedNotifs = addNotificationHelper(
        status === 'confirmed' ? `🤝 Workshop zugesagt` : `❌ Workshop abgelehnt`,
        `Eugen hat die Einladung zum Workshop "${workshop.goal}" ${status === 'confirmed' ? 'BESTÄTIGT' : 'ABGELEHNT'}.`,
        'task_update',
        'sergej',
        updatedNotifs
      );
    }

    saveState(
      currentUser,
      personas,
      blockers,
      dependencies,
      personalTasks,
      calendarEntries,
      updatedNotifs,
      updatedWorkshops
    );
  };

  // 11. PIOTR REALLOCATE CAPACITY
  const reallocateCapacity = (memberName: string) => {
    let updatedNotifs = addNotificationHelper(
      `⚖️ Kapazität neu priorisiert`,
      `Product Owner Piotr hat Aufgaben für ${memberName} angepasst, um Engpässe zu entzerren.`,
      'release',
      'sergej',
      notifications
    );

    saveState(
      currentUser,
      personas,
      blockers,
      dependencies,
      personalTasks,
      calendarEntries,
      updatedNotifs,
      workshopRequests
    );
  };

  // Clear or mark read notifications
  const clearNotifications = () => {
    saveState(
      currentUser,
      personas,
      blockers,
      dependencies,
      personalTasks,
      calendarEntries,
      [],
      workshopRequests
    );
  };

  const markNotificationsAsRead = () => {
    const updatedNotifs = notifications.map(n => ({ ...n, read: true }));
    saveState(
      currentUser,
      personas,
      blockers,
      dependencies,
      personalTasks,
      calendarEntries,
      updatedNotifs,
      workshopRequests
    );
  };

  const updateTaskStoryPoints = (taskId: string, storyPoints: number) => {
    const updatedTasks = personalTasks.map(t => 
      t.id === taskId ? { ...t, storyPoints } : t
    );
    saveState(
      currentUser,
      personas,
      blockers,
      dependencies,
      updatedTasks,
      calendarEntries,
      notifications,
      workshopRequests
    );
  };

  // 12. RESET STATE TO INITIAL
  const resetAllData = () => {
    localStorage.removeItem('syncspace_current_user');
    localStorage.removeItem('syncspace_personas');
    localStorage.removeItem('syncspace_blockers');
    localStorage.removeItem('syncspace_dependencies');
    localStorage.removeItem('syncspace_tasks');
    localStorage.removeItem('syncspace_calendar');
    localStorage.removeItem('syncspace_notifications');
    localStorage.removeItem('syncspace_workshops');

    setCurrentUser(null);
    setPersonas(initialPersonas);
    setBlockers(initialBlockers);
    setDependencies(initialDependencies);
    setPersonalTasks(initialTasks);
    setCalendarEntries(initialCalendarEntries);
    setNotifications(initialNotifications);
    setWorkshopRequests([]);
    setSelectedDate(getRelativeDateString(0));
    setGlockeOpen(false);
  };

  return (
    <AppStateContext.Provider value={{
      currentUser,
      personas,
      blockers,
      dependencies,
      personalTasks,
      calendarEntries,
      notifications,
      workshopRequests,
      selectedDate,
      isGlockeOpen,
      setGlockeOpen,
      setSelectedDate,
      login,
      logout,
      switchUserDirectly,
      toggleOnline,
      escalateBlocker,
      createWorkshopFromPiotr,
      sendWorkshopInvitation,
      startPlanningWorkshop,
      planWorkshopBySergej,
      confirmWorkshopByPiotr,
      toggleTaskComplete,
      reportBlockerFromEugen,
      releaseCalendarEntry,
      updateCalendarEntry,
      respondToWorkshopInvitation,
      reallocateCapacity,
      clearNotifications,
      markNotificationsAsRead,
      resetAllData,
      updateTaskStoryPoints
    }}>
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
};
