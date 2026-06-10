export type UserRole = 'sergej' | 'piotr' | 'eugen';

export interface Persona {
  id: UserRole;
  name: string;
  role: string;
  team: string;
  email: string;
  online: boolean;
  avatar: string;
  timeSavedThisWeek: number; // in hours, e.g. 12.5
  timeSavedTotal: number; // e.g. 47
}

export interface Blocker {
  id: string; // e.g. "B1"
  title: string;
  team: string; // e.g. "Team 1"
  status: 'green' | 'yellow' | 'red';
  description: string;
  escalated: boolean; // True to notify Piotr
  reportedBy?: string; // e.g., "Eugen"
}

export interface WorkshopRequest {
  id: string;
  date?: string;
  time?: string;
  length: string; // e.g., "2 Std", "4 Std" etc.
  teams: string[];
  goal: string;
  sender: 'piotr' | 'sergej';
  status: 'erstellt' | 'bearbeitung' | 'geplant';
  eugenRsvp?: 'invited' | 'confirmed' | 'declined';
  piotrConfirmed?: boolean;
  categoryType: 'integration' | 'workshop' | 'blocker';
  subcategory: string;
}

export interface PersonalTask {
  id: string;
  title: string;
  deadline: string;
  completed: boolean;
  storyPoints?: number;
  assignedTo?: 'eugen' | 'eliot' | 'magnus' | 'steve';
}

export interface CalendarEntry {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g., "10:00"
  teams: string[];
  status: 'draft' | 'released';
  conflict?: boolean;
  type?: 'integration' | 'workshop' | 'blocker';
  hours?: number;
  subcategory?: string;
}

export interface Notification {
  id: string;
  title: string;
  text: string;
  time: string; // human readable, e.g., "Vor 5 Min"
  timestamp: number; // mills for ordering
  type: 'blocker' | 'escalation' | 'workshop' | 'release' | 'task_update';
  targetRole: 'sergej' | 'piotr' | 'eugen' | 'all';
  read: boolean;
}

export interface DependencyItem {
  id: string;
  fromTeam: string;
  toTeam: string;
  description: string;
  status: 'green' | 'yellow' | 'red';
}
