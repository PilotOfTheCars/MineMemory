export type GameMode = 'survival' | 'hardcore';

export type Dimension = 'Overworld' | 'Nether' | 'The End';

export type CoordCategory = 'Base' | 'Village' | 'Portal' | 'Mine' | 'Structure' | 'Farm' | 'Danger Zone' | 'Scenic' | 'Other';

export type ProjectStatus = 'Planned' | 'In Progress' | 'On Hold' | 'Completed';

export type GoalType = 'Daily' | 'Long-Term' | 'Exploration' | 'Combat' | 'Farming' | 'Advancement';

export type IncidentCause = 'Lava' | 'Creeper' | 'Fall Damage' | 'Void' | 'Drowning' | 'Wither/Ender Dragon' | 'Pet Lost' | 'Raid' | 'Other';

export interface Coordinate {
  id: string;
  name: string;
  x: number;
  y: number;
  z: number;
  dimension: Dimension;
  category: CoordCategory;
  notes: string;
  dangerLevel: 'Low' | 'Medium' | 'High' | 'Extreme';
  isPinned: boolean;
}

export interface SessionLog {
  id: string;
  title: string;
  realDate: string;
  minecraftDay: number;
  sessionType: 'Adventure' | 'Building' | 'Mining' | 'Farming' | 'Boss Fight' | 'Redstone' | 'Other';
  whatHappened: string;
  lootGained: string[];
  itemsLost: string[];
  coordinatesVisited: string[];
  nextGoals: string;
  moodRating: number; // 1 to 5 (represented by Hearts)
}

export interface ProjectChecklistItem {
  id: string;
  text: string;
  done: boolean;
}

export interface Project {
  id: string;
  name: string;
  status: ProjectStatus;
  priority: 'Low' | 'Medium' | 'High';
  description: string;
  materialsNeeded: string[];
  checklist: ProjectChecklistItem[];
  linkedCoords: string[]; // Coordinate IDs
  inspirationLinks: string[];
  progress: number; // 0-100
}

export interface Goal {
  id: string;
  text: string;
  type: GoalType;
  priority: 'Low' | 'Medium' | 'High';
  isCompleted: boolean;
  notes: string;
}

export interface Inspiration {
  id: string;
  title: string;
  link: string;
  category: 'Build' | 'Farm' | 'Redstone' | 'Survival Hack' | 'Other';
  tags: string[];
  notes: string;
}

export interface Incident {
  id: string;
  cause: IncidentCause;
  coordinates: string; // e.g. "x: 120, y: 32, z: -500"
  itemsLost: string;
  lessonLearned: string;
  recoveryStatus: 'Fully Recovered' | 'Major Loss' | 'Permanent Setback' | 'Still Restoring';
  date: string;
}

export interface HardcoreExtras {
  daysSurvived: number;
  riskMeter: number; // 1 to 10
  safehouses: string; // Description or coordinates
  backupGear: string; // Location details
  nearDeathReports: string[]; // List of historical matches
  worldWill: string; // Final message left behind
  emergencyPlans: string;
}

export interface MinecraftWorld {
  id: string;
  name: string;
  version: string;
  seed: string;
  difficulty: 'Peaceful' | 'Easy' | 'Normal' | 'Hard';
  startDate: string;
  mode: GameMode;
  modsNotes: string;
  description: string;
  isLost: boolean; // Hardcore death status
  lastSaved: string;
  
  // Child collections
  logs: SessionLog[];
  coordinates: Coordinate[];
  projects: Project[];
  goals: Goal[];
  inspirations: Inspiration[];
  incidents: Incident[];
  hardcoreExtras?: HardcoreExtras;
}

export interface UserAccount {
  email: string;
  passwordHash: string; // Plain password for a local mock is completely fine, but let's call it password for ease
  displayName: string;
}

