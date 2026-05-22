/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import AuthPage from './components/AuthPage';
import PreLoginLanding from './components/PreLoginLanding';
import LandingPage from './components/LandingPage';
import WorldSelectPage from './components/WorldSelectPage';
import CreateWorldPage from './components/CreateWorldPage';
import WorldDashboard from './components/WorldDashboard';
import HardcoreDeathScreen from './components/HardcoreDeathScreen';
import { MinecraftWorld } from './types';
import { getStoredWorlds, saveStoredWorlds } from './utils/initialData';
import { sounds } from './utils/audio';
import { ShieldAlert } from 'lucide-react';

type ScreenType = 'landing' | 'select' | 'create' | 'dashboard';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('landing');
  const [worlds, setWorlds] = useState<MinecraftWorld[]>([]);
  const [selectedWorldId, setSelectedWorldId] = useState<string | null>(null);
  const [soundMuted, setSoundMuted] = useState(false);
  const [readOnlyWarning, setReadOnlyWarning] = useState<string | null>(null);
  const [preLoginView, setPreLoginView] = useState<'landing' | 'auth'>('landing');

  // Authentication states
  const [currentUser, setCurrentUser] = useState<{ email: string; displayName: string } | null>(() => {
    try {
      const cached = localStorage.getItem('minememory_active_user');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });

  // Track active user changes
  useEffect(() => {
    const loadedWorlds = getStoredWorlds(currentUser?.email);
    setWorlds(loadedWorlds);
    setSoundMuted(sounds.getMuted());
  }, [currentUser]);

  const handleToggleSound = () => {
    const nextMute = !soundMuted;
    setSoundMuted(nextMute);
    sounds.setMute(nextMute);
  };

  const handleLoginSuccess = (email: string, displayName: string) => {
    const user = { email, displayName };
    localStorage.setItem('minememory_active_user', JSON.stringify(user));
    setCurrentUser(user);
    setCurrentScreen('landing');
  };

  const handleLogout = () => {
    sounds.playHurt(); // Play classic Minecraft oof on terminal logout!
    localStorage.removeItem('minememory_active_user');
    setCurrentUser(null);
    setSelectedWorldId(null);
    setWorlds([]);
    setCurrentScreen('landing');
    setPreLoginView('landing');
  };

  const isReadOnly = currentUser?.email.toLowerCase() === 'test';

  const triggerReadOnlyAlert = (actionText: string) => {
    sounds.playHurt();
    setReadOnlyWarning(`Access Denied: Showcase Vault is read-only! Could not ${actionText}. Register a custom account to create your own worlds.`);
    setTimeout(() => {
      setReadOnlyWarning(null);
    }, 5000);
  };

  const handleCreateWorld = (newWorldData: Omit<MinecraftWorld, 'id' | 'logs' | 'coordinates' | 'projects' | 'goals' | 'inspirations' | 'incidents' | 'lastSaved'>) => {
    if (isReadOnly) {
      triggerReadOnlyAlert('create a world');
      return;
    }

    // Scaffold completely empty initial states
    const newWorld: MinecraftWorld = {
      ...newWorldData,
      id: `world-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      logs: [],
      coordinates: [],
      projects: [],
      goals: [],
      inspirations: [],
      incidents: [],
      lastSaved: new Date().toISOString()
    };

    // If hardcore, create the optional hardcore extras blocks!
    if (newWorldData.mode === 'hardcore') {
      newWorld.hardcoreExtras = {
        daysSurvived: 0,
        riskMeter: 5,
        safehouses: 'No emergency pods pinned yet.',
        backupGear: 'No emergency barrels stocked yet.',
        nearDeathReports: [],
        worldWill: 'To any brave traveler who finds this device, my deeds are logged herein.',
        emergencyPlans: 'Equip shield in offhand, drink instant healing potions.'
      };
    }

    const updatedWorlds = [newWorld, ...worlds];
    setWorlds(updatedWorlds);
    saveStoredWorlds(updatedWorlds, currentUser?.email);
    
    // Take the explorer straight into the dashboard! Super handy.
    setSelectedWorldId(newWorld.id);
    setCurrentScreen('dashboard');
  };

  const handleUpdateWorld = (updatedWorld: MinecraftWorld) => {
    if (isReadOnly) {
      triggerReadOnlyAlert('save updates/logs');
      return;
    }

    const updated = worlds.map(w => w.id === updatedWorld.id ? { ...updatedWorld, lastSaved: new Date().toISOString() } : w);
    setWorlds(updated);
    saveStoredWorlds(updated, currentUser?.email);
  };

  const handleDeleteWorld = (id: string) => {
    if (isReadOnly) {
      triggerReadOnlyAlert('delete this world');
      return;
    }

    const updated = worlds.filter(w => w.id !== id);
    setWorlds(updated);
    saveStoredWorlds(updated, currentUser?.email);
    if (selectedWorldId === id) {
      setSelectedWorldId(null);
      setCurrentScreen('select');
    }
  };

  const handleImportWorld = (imported: MinecraftWorld) => {
    if (isReadOnly) {
      triggerReadOnlyAlert('import external world data');
      return;
    }

    // Generate a new unique ID to avoid duplicates
    const uniqueImported: MinecraftWorld = {
      ...imported,
      id: `world-imported-${Date.now()}`,
      lastSaved: new Date().toISOString()
    };
    const updated = [uniqueImported, ...worlds];
    setWorlds(updated);
    saveStoredWorlds(updated, currentUser?.email);
  };

  // If user is not logged in, render the pre-login sequence gates
  if (!currentUser) {
    if (preLoginView === 'auth') {
      return (
        <div className="relative min-h-screen bg-minecraft-darkstone">
          <button
            onClick={() => {
              sounds.playClick();
              setPreLoginView('landing');
            }}
            className="absolute top-4 left-4 z-50 bg-[#7c7c7c] hover:bg-zinc-700 hover:border-[#ffff55] border-2 border-zinc-600 px-3 py-1.5 text-xs text-white uppercase font-pressstart text-[8px] cursor-pointer tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] active:translate-y-0.5"
          >
            ← BACK TO HOME
          </button>
          <AuthPage onLoginSuccess={handleLoginSuccess} />
        </div>
      );
    }
    return (
      <PreLoginLanding
        onEnterAuth={() => setPreLoginView('auth')}
        onEnterDemo={() => {
          handleLoginSuccess('Test', 'Steve Showcase');
        }}
      />
    );
  }

  const activeWorld = worlds.find(w => w.id === selectedWorldId);

  // If active selected world is currently marked as lost (Hardcore Obituary view override)
  if (activeWorld && activeWorld.mode === 'hardcore' && activeWorld.isLost) {
    return (
      <HardcoreDeathScreen
        world={activeWorld}
        onBackToMenu={() => {
          sounds.playClick();
          setSelectedWorldId(null);
          setCurrentScreen('select');
        }}
        onConvert={() => {
          // Resurrection Easter egg: convert from hardcore to survival!
          const resurrected: MinecraftWorld = {
            ...activeWorld,
            mode: 'survival',
            isLost: false,
            // Retain the hardcore profile stats
            difficulty: 'Hard' 
          };
          handleUpdateWorld(resurrected);
          // Stay on active screen but transition from death view!
        }}
      />
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Persistent Read-Only Status Bar at the very top */}
      {isReadOnly && (
        <div className="bg-[#aa0000] text-white border-b-4 border-black font-pressstart text-[8px] sm:text-[9px] py-2 px-4 flex items-center justify-between gap-2 z-50 shadow-md">
          <div className="flex items-center gap-2">
            <span className="animate-pulse">⚠️</span>
            <span>DEMO ARCHIVE MODE: WRITING DISABLED FOR Account "Test" (SHOWCASE V2 SATELLITE CORE)</span>
          </div>
          <div className="text-[7px] text-[#ffff55] opacity-80 hidden sm:block">REGISTER OWN EMAIL ID TO SAVE DATA</div>
        </div>
      )}

      {/* Pop-up flashing alerts for blocked modifications */}
      {readOnlyWarning && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 w-full max-w-md z-50 p-4 animate-bounce select-none">
          <div className="bg-[#262626] border-4 border-red-600 p-3 shadow-[6px_6px_0px_rgba(0,0,0,0.8)] flex items-start gap-3">
            <div className="bg-red-800 p-1 border-2 border-white text-xs text-white shrink-0 font-bold">
              🚫
            </div>
            <div className="space-y-1 font-mono">
              <h4 className="font-pressstart text-[9px] text-red-500 uppercase">ACCESS VIOLATION</h4>
              <p className="text-xs text-zinc-300 leading-relaxed capitalize lowercase-first pr-2">
                {readOnlyWarning}
              </p>
            </div>
          </div>
        </div>
      )}

      {currentScreen === 'landing' && (
        <LandingPage
          onOpenWorlds={() => setCurrentScreen('select')}
          onCreateWorld={() => setCurrentScreen('create')}
          soundMuted={soundMuted}
          onToggleSound={handleToggleSound}
          currentUser={currentUser}
          onLogout={handleLogout}
        />
      )}

      {currentScreen === 'select' && (
        <WorldSelectPage
          worlds={worlds}
          onSelectWorld={(id) => {
            setSelectedWorldId(id);
            setCurrentScreen('dashboard');
          }}
          onDeleteWorld={handleDeleteWorld}
          onImportWorld={handleImportWorld}
          onBack={() => setCurrentScreen('landing')}
          onCreateNewWorld={() => setCurrentScreen('create')}
        />
      )}

      {currentScreen === 'create' && (
        <CreateWorldPage
          onBack={() => {
            // go back to selection screen if we have worlds, else landing
            setCurrentScreen(worlds.length > 0 ? 'select' : 'landing');
          }}
          onSave={handleCreateWorld}
        />
      )}

      {currentScreen === 'dashboard' && activeWorld && (
        <WorldDashboard
          world={activeWorld}
          coordinatesList={activeWorld.coordinates || []}
          onExitWorld={() => {
            setSelectedWorldId(null);
            setCurrentScreen('select');
          }}
          onUpdateWorld={handleUpdateWorld}
          soundMuted={soundMuted}
          onToggleSound={handleToggleSound}
          currentUser={currentUser}
          onLogout={handleLogout}
          isReadOnly={isReadOnly}
        />
      )}
    </div>
  );
}
