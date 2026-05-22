import React, { useState } from 'react';
import { MinecraftWorld, Coordinate, SessionLog, Project, Goal, Incident, HardcoreExtras } from '../types';
import { sounds } from '../utils/audio';
import { 
  Skull, Heart, Home, BookOpen, MapPin, Hammer, Award, ShieldAlert, Compass, 
  Settings, LogOut, Volume2, VolumeX, Shield, Circle, Pin, Plus, Check, Play, Flame, Save 
} from 'lucide-react';

// Import subpages
import SessionLogsPage from './SessionLogsPage';
import CoordinateVault from './CoordinateVault';
import ProjectTracker from './ProjectTracker';
import GoalBoard from './GoalBoard';
import IncidentLogs from './IncidentLogs';
import SeedExplorer from './SeedExplorer';
import AiOracle from './AiOracle';
import { Sparkles } from 'lucide-react';

interface WorldDashboardProps {
  world: MinecraftWorld;
  coordinatesList: Coordinate[];
  onExitWorld: () => void;
  onUpdateWorld: (updated: MinecraftWorld) => void;
  soundMuted: boolean;
  onToggleSound: () => void;
  currentUser?: { email: string; displayName: string };
  onLogout?: () => void;
  isReadOnly?: boolean;
}

type TabType = 'dashboard' | 'logs' | 'coords' | 'projects' | 'goals' | 'incidents' | 'seed' | 'oracle';

export default function WorldDashboard({
  world,
  coordinatesList,
  onExitWorld,
  onUpdateWorld,
  soundMuted,
  onToggleSound,
  currentUser,
  onLogout,
  isReadOnly = false
}: WorldDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [descText, setDescText] = useState(world.description);
  
  // Hardcore form edits
  const [isEditingHC, setIsEditingHC] = useState(false);
  const [hcDays, setHcDays] = useState(world.hardcoreExtras?.daysSurvived || 0);
  const [hcRisk, setHcRisk] = useState(world.hardcoreExtras?.riskMeter || 5);
  const [hcWill, setHcWill] = useState(world.hardcoreExtras?.worldWill || '');
  const [hcSafe, setHcSafe] = useState(world.hardcoreExtras?.safehouses || '');
  const [hcGear, setHcGear] = useState(world.hardcoreExtras?.backupGear || '');
  const [hcPlans, setHcPlans] = useState(world.hardcoreExtras?.emergencyPlans || '');

  // Copy tele feedback
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const isHardcore = world.mode === 'hardcore';

  const handleSaveDescription = () => {
    sounds.playLevelUp();
    onUpdateWorld({
      ...world,
      description: descText
    });
    setIsEditingDesc(false);
  };

  const handleSaveHardcoreExtras = () => {
    sounds.playLevelUp();
    onUpdateWorld({
      ...world,
      hardcoreExtras: {
        daysSurvived: Number(hcDays) || 0,
        riskMeter: Number(hcRisk) || 5,
        worldWill: hcWill,
        safehouses: hcSafe,
        backupGear: hcGear,
        nearDeathReports: world.hardcoreExtras?.nearDeathReports || [],
        emergencyPlans: hcPlans
      }
    });
    setIsEditingHC(false);
  };

  const handleTriggerDeath = () => {
    sounds.playHurt();
    const c1 = confirm("⚠️ CRITICAL HAZARD CHECK ⚠️\n\nDid you fall in lava, explode to a creeper, or fall below the void in Hardcore?\nClicking Yes will PERMANENTLY MARK this world as LOST, locking you into the obituary screen.");
    if (c1) {
      const c2 = confirm("FINAL INQUEST:\nIs the world profile officially lost? (This cannot be undone without resurrect commands)");
      if (c2) {
        onUpdateWorld({
          ...world,
          isLost: true
        });
      }
    }
  };

  // Sub collection updates
  const handleAddLog = (newLog: Omit<SessionLog, 'id'>) => {
    const logs = [...(world.logs || [])];
    const logItem: SessionLog = {
      ...newLog,
      id: `log-${Date.now()}`
    };
    logs.unshift(logItem); // Add latest log to head
    
    // Auto sync Days Survived if Hardcore is enabled
    let extrasUpdate = world.hardcoreExtras;
    if (isHardcore && newLog.minecraftDay > (world.hardcoreExtras?.daysSurvived || 0)) {
      extrasUpdate = {
        ...world.hardcoreExtras!,
        daysSurvived: newLog.minecraftDay
      };
      setHcDays(newLog.minecraftDay);
    }

    onUpdateWorld({
      ...world,
      logs,
      hardcoreExtras: extrasUpdate
    });
  };

  const handleDeleteLog = (id: string) => {
    const logs = (world.logs || []).filter(l => l.id !== id);
    onUpdateWorld({ ...world, logs });
  };

  const handleAddCoord = (newCo: Omit<Coordinate, 'id'>) => {
    const coordinates = [...(world.coordinates || [])];
    const coordItem: Coordinate = {
      ...newCo,
      id: `coord-${Date.now()}`
    };
    coordinates.push(coordItem);
    onUpdateWorld({ ...world, coordinates });
  };

  const handleDeleteCoord = (id: string) => {
    const coordinates = (world.coordinates || []).filter(c => c.id !== id);
    onUpdateWorld({ ...world, coordinates });
  };

  const handleTogglePinCoord = (id: string) => {
    const coordinates = (world.coordinates || []).map(c => 
      c.id === id ? { ...c, isPinned: !c.isPinned } : c
    );
    onUpdateWorld({ ...world, coordinates });
  };

  const handleAddProject = (newProj: Omit<Project, 'id' | 'progress'>) => {
    const projects = [...(world.projects || [])];
    const projectItem: Project = {
      ...newProj,
      id: `proj-${Date.now()}`,
      progress: 0
    };
    projects.push(projectItem);
    onUpdateWorld({ ...world, projects });
  };

  const handleDeleteProject = (id: string) => {
    const projects = (world.projects || []).filter(p => p.id !== id);
    onUpdateWorld({ ...world, projects });
  };

  const handleUpdateProjectChecklist = (projectId: string, checklist: Project['checklist']) => {
    const projects = (world.projects || []).map(p => {
      if (p.id === projectId) {
        const total = checklist.length;
        const done = checklist.filter(item => item.done).length;
        const progress = total > 0 ? Math.round((done / total) * 100) : 0;
        return { ...p, checklist, progress };
      }
      return p;
    });
    onUpdateWorld({ ...world, projects });
  };

  const handleAddGoal = (newGoal: Omit<Goal, 'id'>) => {
    const goals = [...(world.goals || [])];
    const goalItem: Goal = {
      ...newGoal,
      id: `goal-${Date.now()}`
    };
    goals.push(goalItem);
    onUpdateWorld({ ...world, goals });
  };

  const handleDeleteGoal = (id: string) => {
    const goals = (world.goals || []).filter(g => g.id !== id);
    onUpdateWorld({ ...world, goals });
  };

  const handleToggleGoal = (id: string) => {
    const goals = (world.goals || []).map(g => 
      g.id === id ? { ...g, isCompleted: !g.isCompleted } : g
    );
    onUpdateWorld({ ...world, goals });
  };

  const handleAddIncident = (newInc: Omit<Incident, 'id'>) => {
    const incidents = [...(world.incidents || [])];
    const incidentItem: Incident = {
      ...newInc,
      id: `incident-${Date.now()}`
    };
    incidents.unshift(incidentItem);
    onUpdateWorld({ ...world, incidents });
  };

  const handleDeleteIncident = (id: string) => {
    const incidents = (world.incidents || []).filter(i => i.id !== id);
    onUpdateWorld({ ...world, incidents });
  };

  const handleCopyCmd = (co: Coordinate) => {
    sounds.playClick();
    const cmdText = `/execute in minecraft:${co.dimension.toLowerCase().replace(' ', '_')} run tp @s ${co.x} ${co.y} ${co.z}`;
    navigator.clipboard.writeText(cmdText).then(() => {
      setCopiedId(co.id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const handleTabSelect = (tab: TabType) => {
    sounds.playChestOpen();
    setActiveTab(tab);
  };

  // Derived calculations
  const totalDays = isHardcore ? world.hardcoreExtras?.daysSurvived || 0 : (world.logs?.[0]?.minecraftDay || 1);
  const pinnedCoords = (world.coordinates || []).filter(c => c.isPinned);
  const incompleteGoals = (world.goals || []).filter(g => !g.isCompleted);
  const workingProjects = (world.projects || []).filter(p => p.progress < 100);

  return (
    <div className="relative min-h-screen font-mono text-zinc-100 flex flex-col justify-between overflow-hidden">
      
      {/* Immersive background decoration layers */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {isHardcore ? (
          <>
            {/* Hardcore / Nether style apocalyptic theme layout */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#180505] via-[#2a0a0a] to-[#0f0202]"></div>
            
            {/* Fiery nether clouds or crimson fog silhouettes */}
            <div className="absolute top-12 left-[15%] w-64 h-14 bg-[#aa0000]/15 border-b-4 border-r-4 border-[#aa0000]/5 shadow-[6px_6px_0_rgba(0,0,0,0.15)]"></div>
            <div className="absolute top-24 right-[10%] w-80 h-16 bg-[#3e0b06]/40 border-b-4 border-l-4 border-red-950/20 shadow-[8px_8px_0_rgba(0,0,0,0.2)]"></div>
            
            {/* Jagged Nether Mountains at bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-40 bg-[#35100c] border-t-8 border-[#aa1e16] opacity-60"></div>
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-[#1e0705] border-t-8 border-[#52130e]"></div>
          </>
        ) : (
          <>
            {/* Classic Overworld Survival mode layouts */}
            <div className="absolute inset-0 bg-minecraft-sky"></div>
            
            {/* Overworld pixel clouds */}
            <div className="absolute top-12 left-[10%] w-60 h-14 bg-white/75 border-b-4 border-r-4 border-white/10 shadow-[6px_6px_0_rgba(0,0,0,0.08)]"></div>
            <div className="absolute top-28 right-[12%] w-80 h-16 bg-white/90 border-b-4 border-l-4 border-white/20 shadow-[6px_6px_0_rgba(0,0,0,0.08)]"></div>
            
            {/* Rolling Overworld Green Hills at the bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-40 bg-[#4e792c] border-t-8 border-[#3b5d21] opacity-75"></div>
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-[#3b5d21] border-t-8 border-[#294216]"></div>
          </>
        )}
      </div>
      
      {/* Top OS Header panel */}
      <header className="bg-black/85 border-b-4 border-zinc-700 py-4 px-4 sm:px-6 relative z-10 flex flex-col sm:flex-row gap-4 items-center justify-between shadow-md">
        
        {/* Left branding */}
        <div className="flex items-center gap-3">
          <div className="mc-slot p-0.5 shrink-0">
            <div className={`w-10 h-10 flex items-center justify-center mc-slot-inner ${isHardcore ? 'bg-red-950/40' : 'bg-emerald-900/10'}`}>
              {isHardcore ? (
                <Skull className="w-5 h-5 text-mc-red animate-heart" />
              ) : (
                <Heart className="w-5 h-5 text-mc-red animate-pulse" />
              )}
            </div>
          </div>

          <div>
            <span className="font-pressstart text-[8px] text-mc-gold tracking-widest block">MINEMEMORY COMPASS</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <h2 className="font-pressstart text-xs sm:text-sm text-white">{world.name}</h2>
              <span className={`font-pressstart text-[7px] px-1.5 py-0.5 ${
                isHardcore ? 'bg-red-950 text-[#ff5555] border border-red-800' : 'bg-emerald-950 text-[#55ff55] border border-emerald-800'
              }`}>
                {world.mode.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Global Toolbar actions */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          
          {currentUser && (
            <div className="bg-[#5a8934]/30 border border-[#5a8934]/65 px-3 py-1.5 text-[11px] text-white flex items-center gap-1.5">
              <span className="text-[#ffff55]">👤 {currentUser.displayName}</span>
            </div>
          )}

          <div className="bg-zinc-950 border border-zinc-550 px-3 py-1.5 text-[11px] text-zinc-400">
            SEED: <span className="text-[#ffff55] select-all font-bold">{world.seed}</span> | VERSION: <span className="text-[#55ffff] font-bold">{world.version}</span>
          </div>

          <button
            onClick={() => { sounds.playClick(); onToggleSound(); }}
            className="mc-button p-2"
            title={soundMuted ? "Unmute Retro Sounds" : "Mute Retro Sounds"}
          >
            {soundMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-mc-yellow" />}
          </button>

          {onLogout && (
            <button
              onClick={() => { sounds.playClick(); onLogout(); }}
              className="mc-button py-2 px-3 text-[9px] font-pressstart uppercase hover:bg-red-850"
              style={{ textShadow: '1px 1px 0px #000' }}
              title="Secure log out from terminal profile session"
            >
              LOG OUT
            </button>
          )}

          <button
            onClick={() => { sounds.playClick(); onExitWorld(); }}
            className="mc-button mc-button-red flex items-center gap-1 py-1.5"
            title="Seal deck space and return to selects list"
          >
            <LogOut className="w-3.5 h-3.5" /> EXIT
          </button>
        </div>

      </header>

      {/* Main OS Body Frame Split */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col lg:flex-row p-4 gap-6 items-start z-10 relative">
        
        {/* Navigation Inventory-style Sidebar */}
        <aside className="w-full lg:w-64 bg-black/40 border-2 border-zinc-700 p-4 shrink-0 flex flex-row lg:flex-col overflow-x-auto gap-2 lg:space-y-2 select-none">
          
          <button
            onClick={() => handleTabSelect('dashboard')}
            className={`w-auto lg:w-full py-3 px-4 font-pressstart text-[9px] text-left flex items-center gap-3 border-2 tracking-wide ${
              activeTab === 'dashboard'
                ? 'bg-[#7c7c7c] border-[#ffffa0] text-[#ffffa0] font-bold'
                : 'bg-black/30 border-transparent text-zinc-400 hover:text-white hover:border-zinc-700'
            }`}
          >
            <Home className="w-4 h-4 shrink-0" /> DASHBOARD
          </button>

          <button
            onClick={() => handleTabSelect('logs')}
            className={`w-auto lg:w-full py-3 px-4 font-pressstart text-[9px] text-left flex items-center gap-3 border-2 tracking-wide ${
              activeTab === 'logs'
                ? 'bg-[#7c7c7c] border-[#ffffa0] text-[#ffffa0] font-bold'
                : 'bg-black/30 border-transparent text-zinc-400 hover:text-white hover:border-zinc-700'
            }`}
          >
            <BookOpen className="w-4 h-4 shrink-0" /> JOURNAL ({world.logs?.length || 0})
          </button>

          <button
            onClick={() => handleTabSelect('coords')}
            className={`w-auto lg:w-full py-3 px-4 font-pressstart text-[9px] text-left flex items-center gap-3 border-2 tracking-wide ${
              activeTab === 'coords'
                ? 'bg-[#7c7c7c] border-[#ffffa0] text-[#ffffa0] font-bold'
                : 'bg-black/30 border-transparent text-zinc-400 hover:text-white hover:border-zinc-700'
            }`}
          >
            <MapPin className="w-4 h-4 shrink-0" /> COORDS ({world.coordinates?.length || 0})
          </button>

          <button
            onClick={() => handleTabSelect('projects')}
            className={`w-auto lg:w-full py-3 px-4 font-pressstart text-[9px] text-left flex items-center gap-3 border-2 tracking-wide ${
              activeTab === 'projects'
                ? 'bg-[#7c7c7c] border-[#ffffa0] text-[#ffffa0] font-bold'
                : 'bg-black/30 border-transparent text-zinc-400 hover:text-white hover:border-zinc-700'
            }`}
          >
            <Hammer className="w-4 h-4 shrink-0" /> BLUEPRINTS ({world.projects?.length || 0})
          </button>

          <button
            onClick={() => handleTabSelect('goals')}
            className={`w-auto lg:w-full py-3 px-4 font-pressstart text-[9px] text-left flex items-center gap-3 border-2 tracking-wide ${
              activeTab === 'goals'
                ? 'bg-[#7c7c7c] border-[#ffffa0] text-[#ffffa0] font-bold'
                : 'bg-black/30 border-transparent text-zinc-400 hover:text-white hover:border-zinc-700'
            }`}
          >
            <Award className="w-4 h-4 shrink-0" /> ACHIEVE ({world.goals?.length || 0})
          </button>

          <button
            onClick={() => handleTabSelect('incidents')}
            className={`w-auto lg:w-full py-3 px-4 font-pressstart text-[9px] text-left flex items-center gap-3 border-2 tracking-wide ${
              activeTab === 'incidents'
                ? 'bg-[#7c7c7c] border-[#ffffa0] text-[#ffffa0] font-bold'
                : 'bg-black/30 border-transparent text-zinc-400 hover:text-white hover:border-zinc-700'
            }`}
          >
            <ShieldAlert className="w-4 h-4 shrink-0" /> CASUALTIES ({world.incidents?.length || 0})
          </button>

          <button
            onClick={() => handleTabSelect('seed')}
            className={`w-auto lg:w-full py-3 px-4 font-pressstart text-[9px] text-left flex items-center gap-3 border-2 tracking-wide ${
              activeTab === 'seed'
                ? 'bg-[#7c7c7c] border-[#ffffa0] text-[#ffffa0] font-bold'
                : 'bg-black/30 border-transparent text-zinc-400 hover:text-white hover:border-zinc-700'
            }`}
          >
            <Compass className="w-4 h-4 shrink-0" /> MCSEEDMAP.NET
          </button>

          <button
            onClick={() => handleTabSelect('oracle')}
            className={`w-auto lg:w-full py-3 px-4 font-pressstart text-[9px] text-left flex items-center gap-3 border-2 tracking-wide ${
              activeTab === 'oracle'
                ? 'bg-[#291e38] border-[#df97ff] text-[#e8c5ff] font-bold'
                : 'bg-black/30 border-transparent text-zinc-400 hover:text-white hover:border-zinc-700'
            }`}
          >
            <Sparkles className="w-5 h-5 shrink-0 text-[#df97ff]" /> ORACLE CLOUD
          </button>

        </aside>

        {/* Dynamic Panel content board */}
        <main className="flex-1 w-full bg-black/40 border-4 border-zinc-700 p-6 shadow-xl relative min-h-[500px]">
          
          {activeTab === 'dashboard' && (
            /* Inside default overview widgets dashboard */
            <div className="space-y-6">
              
              {/* Row 1: Profile card with stats */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
                
                {/* Profile card beacon with description */}
                <div className="md:col-span-8 bg-[#2d2116]/60 border-2 border-zinc-700 p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
                      <span className="font-pressstart text-[9px] text-zinc-400 uppercase">PROFILE BEACON ARCHIVE:</span>
                      <span className="text-zinc-600 font-mono text-xs">SPAWNED: {world.startDate}</span>
                    </div>

                    {isEditingDesc ? (
                      <div className="mt-3 space-y-2">
                        <textarea
                          value={descText}
                          onChange={(e) => setDescText(e.target.value)}
                          className="w-full h-24 bg-zinc-950 border border-zinc-600 p-2 text-xs font-mono text-white resize-none"
                        />
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={handleSaveDescription}
                            className="mc-button py-1 px-3 text-[8px]"
                          >
                            SAVE
                          </button>
                          <button
                            onClick={() => { sounds.playClick(); setIsEditingDesc(false); }}
                            className="mc-button py-1 px-2 text-[8px] bg-red-950/25 border-red-800"
                          >
                            CANCEL
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-3 relative group">
                        <p className="text-sm text-zinc-300 leading-relaxed italic pr-8">
                          “ {world.description || 'Welcome! Draft your core world rules or castle planning memos right here.'} ”
                        </p>
                        {!isReadOnly && (
                          <button
                            onClick={() => { sounds.playClick(); setIsEditingDesc(true); }}
                            className="absolute right-0 top-0 p-1 text-zinc-500 hover:text-[#ffffa0] opacity-30 group-hover:opacity-100 transition"
                          >
                            <Settings className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="mt-6 pt-3 border-t border-zinc-850 flex flex-wrap gap-4 text-xs font-mono text-zinc-500 uppercase">
                    <div>MODPACKS: <span className="text-zinc-300 capitalize">{world.modsNotes || 'OptiFine only'}</span></div>
                    <div>DIFFICULTY: <span className="text-mc-gold font-bold">{world.difficulty}</span></div>
                  </div>
                </div>

                {/* Big survival / Hardcore counters */}
                <div className="md:col-span-4 bg-zinc-950/40 border-2 border-zinc-750 p-5 flex flex-col items-center justify-center text-center">
                  {isHardcore ? (
                    <>
                      <Skull className="w-10 h-10 text-red-500 fill-current mb-2 animate-pulse" />
                      <span className="font-pressstart text-[8px] text-[#ff5555]">DAYS SURVIVED</span>
                      <h4 className="font-pressstart text-3xl text-red-500 font-bold mt-2">{world.hardcoreExtras?.daysSurvived || 0}</h4>
                      <div className="font-pressstart text-[7px] text-zinc-600 mt-1 uppercase">ONE LIFE. LOCKED ON HARD.</div>
                    </>
                  ) : (
                    <>
                      <Heart className="w-10 h-10 text-mc-red fill-current mb-2 animate-pulse" />
                      <span className="font-pressstart text-[8px] text-[#55ff55]">MINECRAFT DAYS</span>
                      <h4 className="font-pressstart text-3xl text-mc-green font-bold mt-2">{totalDays}</h4>
                      <div className="font-pressstart text-[7px] text-zinc-650 mt-1 uppercase">Infinite lives. Build & Explore.</div>
                    </>
                  )}
                </div>

              </div>

              {/* Row 2: Hardcore extras or immediate goals */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
                
                {/* Column A: Coordinates & immediate advancements */}
                <div className="md:col-span-8 space-y-6">
                  
                  {/* Pinned Coords Widget */}
                  <div className="bg-zinc-900/60 border-2 border-zinc-750 p-4">
                    <span className="font-pressstart text-[8px] text-[#55ffff] block mb-3">📍 PINNED COMPASS BEACONS</span>
                    {pinnedCoords.length === 0 ? (
                      <p className="text-xs text-zinc-500 italic py-4">No coordinates pinned yet. Keep bases, spawners, or nether highways pinned here for quick spatial checkup inside the Coordinate Vault tab.</p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                        {pinnedCoords.map(co => (
                          <div key={co.id} className="p-3 bg-black/40 border border-zinc-800 flex justify-between items-center group">
                            <div>
                              <span className={`px-1 py-0.5 font-mono text-[9px] ${
                                co.dimension === 'Nether' ? 'text-red-400 bg-red-950/30' : co.dimension === 'The End' ? 'text-purple-400 bg-purple-950/30' : 'text-emerald-400 bg-emerald-950/30'
                              }`}>
                                {co.dimension[0]}
                              </span>
                              <span className="ml-1 text-[#e0e0e0] font-semibold">{co.name}</span>
                              <p className="text-[#ffff55] font-bold text-[10px] mt-1">X: {co.x} | Y: {co.y} | Z: {co.z}</p>
                            </div>
                            <button
                              onClick={() => handleCopyCmd(co)}
                              className="p-1 px-1.5 bg-zinc-850 hover:bg-zinc-700 text-zinc-400 hover:text-white border border-zinc-800 text-[9px] font-mono mr-1"
                              title="Copy tp command telemetry"
                            >
                              {copiedId === co.id ? <Check className="w-3.5 h-3.5 text-mc-green" /> : 'TP'}
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Immediate Advancements Quests Widget */}
                  <div className="bg-zinc-900/60 border-2 border-zinc-750 p-4">
                    <span className="font-pressstart text-[8px] text-mc-gold block mb-3">🏹 ACTIVE ADVANCEMENT TARGETS ({incompleteGoals.length})</span>
                    {incompleteGoals.length === 0 ? (
                      <p className="text-xs text-zinc-500 italic py-4">All goals completed! You've unlocked everything. Set some custom adventure targets in the Advancements Board tab.</p>
                    ) : (
                      <div className="space-y-2 text-xs">
                        {incompleteGoals.slice(0, 3).map(goal => (
                          <div key={goal.id} className="p-2.5 bg-black/20 hover:bg-black/40 border border-zinc-850 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-mc-gold">⚓</span>
                              <span className="text-zinc-300 font-semibold">{goal.text}</span>
                              {goal.priority === 'High' && <span className="text-red-500 font-bold text-[10px] uppercase ml-1.5">[High Stakes]</span>}
                            </div>
                            {!isReadOnly && (
                              <button
                                onClick={() => { sounds.playLevelUp(); handleToggleGoal(goal.id); }}
                                className="text-mc-green hover:underline text-[9px] font-pressstart text-[8px]"
                              >
                                LOCK IN COMPLETED
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>

                {/* Column B: Hardcore Extras or Unfinished big projects */}
                <div className="md:col-span-4 space-y-6 flex flex-col justify-between">
                  
                  {isHardcore ? (
                    /* Hardcore extras panel with Risk meter */
                    <div className="bg-red-950/5 border-2 border-red-900/40 p-5 space-y-4 h-full flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-center border-b border-red-900/40 pb-2 mb-3">
                          <span className="font-pressstart text-[8px] text-[#ff5555]">☠ SURVIVAL RIGOR CONTROL</span>
                        </div>

                        {/* Tension meter */}
                        <div className="space-y-1 bg-black/40 p-3 border border-red-950">
                          <div className="flex justify-between items-center text-xs font-mono">
                            <span className="text-zinc-500">TENSION RISK LEVEL:</span>
                            <span className="text-[#ff5555] font-bold font-pressstart text-[9px] animate-[pulse_1s_infinite]">
                              LVL {hcRisk}
                            </span>
                          </div>
                          
                          <input
                            type="range"
                            min="1"
                            max="10"
                            value={hcRisk}
                            disabled={isReadOnly}
                            onChange={(e) => {
                              if (isReadOnly) return;
                              sounds.playHurt();
                              setHcRisk(Number(e.target.value));
                              onUpdateWorld({
                                ...world,
                                hardcoreExtras: {
                                  ...world.hardcoreExtras!,
                                  riskMeter: Number(e.target.value)
                                }
                              });
                            }}
                            className={`w-full h-2 rounded-none bg-zinc-900 border border-red-900 accent-[#aa0000] ${isReadOnly ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                          />

                          <div className="text-[10px] text-zinc-500 uppercase flex justify-between mt-1 pt-1 border-t border-red-950/20 font-pressstart text-[7px]">
                            <span>Safe (1)</span>
                            <span>Warning (5)</span>
                            <span>Fatal (10)</span>
                          </div>
                        </div>

                        {/* Interactive risk description block */}
                        <div className="mt-3 text-[11px] leading-relaxed text-zinc-400 font-mono">
                          {hcRisk >= 8 ? (
                            <span className="text-red-400 font-bold block bg-red-950/15 p-2 border border-red-950 uppercase animate-pulse">
                              🔥 RED CON: High-altitude scouting. Keep Netherite blast shields in hands, sleep before dark, fly slow.
                            </span>
                          ) : hcRisk >= 5 ? (
                            <span className="text-amber-500 font-bold block bg-amber-950/10 p-2 border border-amber-950 uppercase">
                              ⚠️ AMBER CON: Deepslate caverns active, spiders nearby. Carry instant recovery splash potions.
                            </span>
                          ) : (
                            <span className="text-mc-green font-bold block bg-emerald-950/10 p-2 border border-emerald-950 uppercase text-[10px]">
                              🌲 GREEN CON: Home base camp, farm automation. Zero monster exposures.
                            </span>
                          )}
                        </div>

                        {/* Emergency Shelters text readout */}
                        <div className="mt-4 text-xs space-y-1">
                          <span className="text-zinc-500 block text-[10px] uppercase">CORES ESCAPE ACTION WILL:</span>
                          <p className="text-zinc-200 line-clamp-2 italic">“{world.hardcoreExtras?.worldWill || 'No final testament logged.'}”</p>
                        </div>
                      </div>

                      {/* Hardcore LOST BUTTON */}
                      {!isReadOnly && (
                        <button
                          onClick={handleTriggerDeath}
                          className="mc-button mc-button-red w-full py-2.5 text-[9px] font-pressstart text-[8px] animate-[pulse_2s_infinite]"
                        >
                          ☠ WORLD LOST (I DIED)
                        </button>
                      )}

                    </div>
                  ) : (
                    /* Survival project builder overview */
                    <div className="bg-zinc-900/60 border-2 border-zinc-750 p-5 h-full flex flex-col justify-between">
                      <div>
                        <span className="font-pressstart text-[8px] text-[#ffff55] block mb-3">🧱 ACTIVE CONSTRUCTIONS ({workingProjects.length})</span>
                        {workingProjects.length === 0 ? (
                          <p className="text-xs text-zinc-500 italic py-4">No active builds queue. Clear mountain grids with TNT!</p>
                        ) : (
                          <div className="space-y-3">
                            {workingProjects.slice(0, 2).map(proj => (
                              <div key={proj.id} className="space-y-1">
                                <div className="flex justify-between text-xs font-mono font-semibold">
                                  <span className="truncate max-w-[150px]">{proj.name}</span>
                                  <span className="text-mc-gold">{proj.progress}%</span>
                                </div>
                                <div className="w-full h-2.5 bg-black border border-zinc-800 p-0.5">
                                  <div className="h-full bg-mc-green bg-emerald-600 block" style={{ width: `${proj.progress}%` }}></div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => handleTabSelect('projects')}
                        className="mc-button w-full mt-4 py-2 text-[9px]"
                      >
                        ARRANGE BLUEPRINTS
                      </button>
                    </div>
                  )}

                </div>

              </div>
              
            </div>
          )}

          {activeTab === 'logs' && (
            <SessionLogsPage
              logs={world.logs || []}
              onAddLog={handleAddLog}
              onDeleteLog={handleDeleteLog}
              isReadOnly={isReadOnly}
            />
          )}

          {activeTab === 'coords' && (
            <CoordinateVault
              coordinates={world.coordinates || []}
              onAddCoord={handleAddCoord}
              onDeleteCoord={handleDeleteCoord}
              onTogglePin={handleTogglePinCoord}
              isReadOnly={isReadOnly}
            />
          )}

          {activeTab === 'projects' && (
            <ProjectTracker
              projects={world.projects || []}
              coordinates={world.coordinates || []}
              onAddProject={handleAddProject}
              onDeleteProject={handleDeleteProject}
              onUpdateProjectChecklist={handleUpdateProjectChecklist}
              isReadOnly={isReadOnly}
            />
          )}

          {activeTab === 'goals' && (
            <GoalBoard
              goals={world.goals || []}
              onAddGoal={handleAddGoal}
              onDeleteGoal={handleDeleteGoal}
              onToggleGoal={handleToggleGoal}
              isReadOnly={isReadOnly}
            />
          )}

          {activeTab === 'incidents' && (
            <IncidentLogs
              incidents={world.incidents || []}
              onAddIncident={handleAddIncident}
              onDeleteIncident={handleDeleteIncident}
              isReadOnly={isReadOnly}
            />
          )}

          {activeTab === 'seed' && (
            <SeedExplorer
              world={world}
              onUpdateWorld={onUpdateWorld}
              isReadOnly={isReadOnly}
            />
          )}

          {activeTab === 'oracle' && (
            <AiOracle
              world={world}
              onUpdateWorld={onUpdateWorld}
              isReadOnly={isReadOnly}
            />
          )}

        </main>

      </div>

      {/* Footer statistics ribbon */}
      <footer className="bg-black/85 border-t-4 border-zinc-700 py-3.5 px-4 font-mono text-xs text-zinc-300 uppercase flex flex-col sm:flex-row justify-between items-center gap-2 z-10 relative">
        <div>MineMemory Satellite Terminal Node Syncing... <span className="text-mc-green font-bold">ACTIVE</span></div>
        <div className="text-[10px] text-zinc-400">Coordinates and step log files are saved automatically in standard Local Storage.</div>
      </footer>

    </div>
  );
}
