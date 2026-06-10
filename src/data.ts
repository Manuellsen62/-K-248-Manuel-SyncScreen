import { Persona, Blocker, PersonalTask, CalendarEntry, DependencyItem, Notification, WorkshopRequest } from './types';

// Standard personas with roles and passwords (simplified for prototype login)
export const initialPersonas: Persona[] = [
  {
    id: 'sergej',
    name: 'Sergej',
    role: 'Scrum Master',
    team: 'Scrum Team 1',
    email: 'sergej@syncspace.ch',
    online: true,
    avatar: 'SM',
    timeSavedThisWeek: 12.5,
    timeSavedTotal: 47,
  },
  {
    id: 'piotr',
    name: 'Piotr',
    role: 'Product Owner',
    team: 'Product Team',
    email: 'piotr@syncspace.ch',
    online: true,
    avatar: 'PO',
    timeSavedThisWeek: 9.0,
    timeSavedTotal: 34,
  },
  {
    id: 'eugen',
    name: 'Eugen',
    role: 'Entwickler',
    team: 'Dev Team Core',
    email: 'eugen@syncspace.ch',
    online: true,
    avatar: 'EN',
    timeSavedThisWeek: 14.0,
    timeSavedTotal: 58,
  }
];

// Helper to get formatted date string (YYYY-MM-DD) based on offset from a base date
export function getRelativeDateString(offsetDays: number): string {
  const baseDate = new Date('2026-06-09');
  baseDate.setDate(baseDate.getDate() + offsetDays);
  return baseDate.toISOString().split('T')[0];
}

export function getGermanDayName(dateStr: string): string {
  const days = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
  const d = new Date(dateStr);
  return days[d.getDay()];
}

export const initialBlockers: Blocker[] = [
  {
    id: 'B1',
    title: 'Schnittstellendefinition API v2 fehlt',
    team: 'Integration Engineering',
    status: 'red',
    description: 'Integration Engineering hat die REST API Spezifikation für das Gateway noch nicht finalisiert. Dies blockiert die Integration von Platform Operations.',
    escalated: false,
    reportedBy: 'Platform Operations',
  },
  {
    id: 'B2',
    title: 'Datenbank-Migration verzögert',
    team: 'Platform Operations',
    status: 'yellow',
    description: 'Das Schema-Upgrade läuft auf dem Testsystem in Timeouts. Notwendiger Hotfix ist in Arbeit.',
    escalated: false,
    reportedBy: 'Eugen',
  },
  {
    id: 'B3',
    title: 'Test-Abnahme blocked durch Zertifikate',
    team: 'Data & Analytics',
    status: 'red',
    description: 'Neue SSL-Zertifikate für das Staging-Umfeld wurden vom Cyber Security-Team noch nicht signiert.',
    escalated: false,
    reportedBy: 'Integration Engineering',
  },
  {
    id: 'B4',
    title: 'Authentifizierungs-Token Ablaufzeit',
    team: 'Cloud Infrastructure',
    status: 'green',
    description: 'Token-Refresh-Periode wurde angepasst und erfolgreich im Sandbox-Betrieb verifiziert.',
    escalated: false,
    reportedBy: 'Cloud Infrastructure',
  }
];

export const initialDependencies: DependencyItem[] = [
  {
    id: 'D1',
    fromTeam: 'Platform Operations',
    toTeam: 'Integration Engineering',
    description: 'Wartet auf Bereitstellung der Backend-Endpoints für das Order-Handling.',
    status: 'red'
  },
  {
    id: 'D2',
    fromTeam: 'Cyber Security',
    toTeam: 'Platform Operations',
    description: 'Bedingt durch UI-Komponenten für das neue Bezahl-Widget.',
    status: 'yellow'
  },
  {
    id: 'D3',
    fromTeam: 'Cloud Infrastructure',
    toTeam: 'Application Development',
    description: 'Freigabe der Security-Whitepapers für Web Sockets.',
    status: 'green'
  }
];

export const initialTasks: PersonalTask[] = [
  // Eugen (Entwickler Core)
  {
    id: 'T1',
    title: 'Frontend API Anbindung abschließen',
    deadline: 'Morgen, 12:00 Uhr',
    completed: false,
    storyPoints: 8,
    assignedTo: 'eugen',
  },
  {
    id: 'T2',
    title: 'Pull Request #412 reviewen',
    deadline: '11. Juni, 17:00 Uhr',
    completed: false,
    storyPoints: 3,
    assignedTo: 'eugen',
  },
  {
    id: 'T3',
    title: 'Komponententests für Mock-Services schreiben',
    deadline: '12. Juni, 15:00 Uhr',
    completed: true,
    storyPoints: 5,
    assignedTo: 'eugen',
  },
  {
    id: 'T4',
    title: 'Schnittstellenspezifikation Gateway v2',
    deadline: 'Gestern, 10:00 Uhr',
    completed: true,
    storyPoints: 13,
    assignedTo: 'eugen',
  },
  {
    id: 'T5',
    title: 'Datenbank-Indizes für Staging anpassen',
    deadline: 'Vor 2 Tagen',
    completed: true,
    storyPoints: 8,
    assignedTo: 'eugen',
  },
  {
    id: 'T6',
    title: 'Refactoring Authentifizierungs-Token',
    deadline: 'Vor 3 Tagen',
    completed: true,
    storyPoints: 5,
    assignedTo: 'eugen',
  },

  // Eliot (Platform Operations)
  {
    id: 'T7',
    title: 'Pipeline Optimierung GitLab CI/CD',
    deadline: 'Vor 1 Tag',
    completed: true,
    storyPoints: 8,
    assignedTo: 'eliot',
  },
  {
    id: 'T8',
    title: 'Helm Charts für Gateway anpassen',
    deadline: 'Vor 2 Tagen',
    completed: true,
    storyPoints: 5,
    assignedTo: 'eliot',
  },
  {
    id: 'T9',
    title: 'SSL-Zertifikate Staging hinterlegen',
    deadline: 'Vor 4 Tagen',
    completed: true,
    storyPoints: 3,
    assignedTo: 'eliot',
  },
  {
    id: 'T10',
    title: 'Infrastruktur-Alerting im Sandbox-Szenario testen',
    deadline: 'In 3 Tagen',
    completed: false,
    storyPoints: 5,
    assignedTo: 'eliot',
  },

  // Magnus (Integration Engineering)
  {
    id: 'T11',
    title: 'Setup Kafka Topic für Realtime-Payments',
    deadline: 'Vor 2 Tagen',
    completed: true,
    storyPoints: 21,
    assignedTo: 'magnus',
  },
  {
    id: 'T12',
    title: 'Docker Compose lokales Setup restrukturieren',
    deadline: 'Vor 3 Tagen',
    completed: true,
    storyPoints: 8,
    assignedTo: 'magnus',
  },
  {
    id: 'T13',
    title: 'API Gateway NextGen Performance Benchmark',
    deadline: 'In 5 Tagen',
    completed: false,
    storyPoints: 13,
    assignedTo: 'magnus',
  },

  // Steve (Data & Analytics)
  {
    id: 'T14',
    title: 'Konzept für neues BigData Analytics Gateway v2',
    deadline: 'Vor 1 Tag',
    completed: true,
    storyPoints: 5,
    assignedTo: 'steve',
  },
  {
    id: 'T15',
    title: 'Dokumentation für externe Schnittstellen freigeben',
    deadline: 'Vor 4 Tagen',
    completed: true,
    storyPoints: 3,
    assignedTo: 'steve',
  },
  {
    id: 'T16',
    title: 'Sicherheits-Audit Compliance-Bericht vorbereiten',
    deadline: 'In 4 Tagen',
    completed: false,
    storyPoints: 8,
    assignedTo: 'steve',
  }
];

export const initialCalendarEntries: CalendarEntry[] = [
  {
    id: 'C1',
    title: 'Integration Core-API & Gateway',
    date: getRelativeDateString(0), // 2026-06-09
    time: '10:00 - 11:30',
    teams: ['Integration Engineering', 'Platform Operations'],
    status: 'released',
    type: 'integration',
    hours: 0
  },
  {
    id: 'C2',
    title: 'Schnittstellen-Workshop Mobile',
    date: getRelativeDateString(1), // 2026-06-10
    time: '14:00 - 15:00',
    teams: ['Cloud Infrastructure', 'Platform Operations'],
    status: 'draft',
    type: 'workshop',
    hours: 1.0
  },
  {
    id: 'C3',
    title: 'Sicherheits-Audit & VPN Sync',
    date: getRelativeDateString(1), // 2026-06-10
    time: '14:30 - 16:00', 
    teams: ['Integration Engineering', 'Cyber Security'],
    status: 'draft',
    type: 'integration',
    hours: 0
  },
  {
    id: 'C4',
    title: 'End-to-End Test-Lauf Phase 2',
    date: getRelativeDateString(3), // 2026-06-12
    time: '09:00 - 11:00',
    teams: ['Platform Operations', 'Data & Analytics'],
    status: 'released',
    type: 'integration',
    hours: 0
  }
];

export const initialNotifications: Notification[] = [
  {
    id: 'N1',
    title: 'Kritischer Blocker gemeldet',
    text: 'Eugen hat einen neuen Blocker (B1) gemeldet: "Schnittstellendefinition API v2 fehlt" für Integration Engineering.',
    time: 'Vor 10 Min',
    timestamp: Date.now() - 10 * 60 * 1000,
    type: 'blocker',
    targetRole: 'sergej',
    read: false,
  },
  {
    id: 'N2',
    title: 'Workshop angefragt',
    text: 'Piotr hat einen neuen Workshop zum Thema "API-Harmonisierung" für Integration Engineering & Platform Operations vorschlagen.',
    time: 'Vor 30 Min',
    timestamp: Date.now() - 30 * 60 * 1000,
    type: 'workshop',
    targetRole: 'sergej',
    read: false,
  },
  {
    id: 'N3',
    title: 'Integrationstermin freigegeben',
    text: 'Der Termin "Core-API & Gateway" wurde von Product Owner Piotr freigegeben.',
    time: 'Gestern',
    timestamp: Date.now() - 24 * 60 * 60 * 1000,
    type: 'release',
    targetRole: 'eugen',
    read: false,
  }
];
