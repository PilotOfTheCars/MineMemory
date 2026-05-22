import React, { useState } from 'react';
import { sounds } from '../utils/audio';
import { ArrowLeft, Shield, Skull, Heart, Flame, Sparkles, HelpCircle } from 'lucide-react';
import { GameMode, MinecraftWorld } from '../types';

interface CreateWorldPageProps {
  onBack: () => void;
  onSave: (world: Omit<MinecraftWorld, 'id' | 'logs' | 'coordinates' | 'projects' | 'goals' | 'inspirations' | 'incidents' | 'lastSaved'>) => void;
}

export default function CreateWorldPage({ onBack, onSave }: CreateWorldPageProps) {
  const [name, setName] = useState('');
  const [version, setVersion] = useState('1.21.1');
  const [seed, setSeed] = useState('');
  const [difficulty, setDifficulty] = useState<'Peaceful' | 'Easy' | 'Normal' | 'Hard'>('Normal');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [mode, setMode] = useState<GameMode>('survival');
  const [modsNotes, setModsNotes] = useState('');
  const [description, setDescription] = useState('');

  const generateRandomSeed = () => {
    sounds.playXPDing();
    // Generate typical Minecraft style seed (positive or negative large integer)
    const neg = Math.random() > 0.5 ? '-' : '';
    const val = Math.floor(Math.random() * 999999999999999).toString();
    setSeed(neg + val);
  };

  const handleModeChange = (selected: GameMode) => {
    if (selected === 'hardcore') {
      sounds.playHurt();
      setDifficulty('Hard'); // Hardcore is locked on Hard
    } else {
      sounds.playChestOpen();
    }
    setMode(selected);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      sounds.playHurt();
      alert("Please enter a name for your world! Minecraft worlds need a title.");
      return;
    }
    sounds.playLevelUp();
    
    onSave({
      name: name.trim(),
      version: version.trim() || '1.21.1',
      seed: seed.trim() || '0',
      difficulty: mode === 'hardcore' ? 'Hard' : difficulty,
      startDate,
      mode,
      modsNotes: modsNotes.trim(),
      description: description.trim() || 'No description provided.',
      isLost: false
    });
  };

  const isHard = mode === 'hardcore';

  return (
    <div className={`min-h-screen transition-all duration-500 py-10 px-4 font-mono select-none flex flex-col justify-between relative overflow-hidden ${
      isHard 
        ? 'bg-[#1a0a0a] bg-minecraft-darkstone text-white' 
        : 'bg-minecraft-sky text-zinc-900'
    }`}>
      
      {/* Visual background layers */}
      {!isHard ? (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-10 left-[5%] w-80 h-16 bg-white/80 border-b-4 border-r-4 border-white/20 shadow-[8px_8px_0_rgba(0,0,0,0.1)]"></div>
          <div className="absolute top-24 right-[8%] w-60 h-12 bg-white/95 border-b-4 border-l-4 border-white/25 shadow-[8px_8px_0_rgba(0,0,0,0.1)]"></div>
          
          {/* Rolling Green Hills at the bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-44 bg-[#4e792c] border-t-8 border-[#3b5d21] opacity-75"></div>
          <div className="absolute bottom-0 left-0 right-0 h-28 bg-[#3b5d21] border-t-8 border-[#294216] opacity-90"></div>
        </div>
      ) : (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-40">
          <div className="absolute bottom-0 left-0 right-0 h-44 bg-red-950 border-t-8 border-red-900"></div>
          <div className="absolute bottom-0 left-0 right-0 h-28 bg-red-950/70 border-t-8 border-black"></div>
        </div>
      )}

      {/* Top Controls */}
      <div className="w-full max-w-3xl mx-auto flex items-center justify-between mb-8 z-10 relative">
        <button
          type="button"
          onClick={() => { sounds.playClick(); onBack(); }}
          className="mc-button flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> CANCEL
        </button>
        
        <div className="font-pressstart text-[10px] text-white uppercase tracking-widest bg-black/45 px-3 py-1.5 border-2 border-[#823030] shadow-md font-bold">
          WORLD SPAWNING BENCH
        </div>
      </div>

      {/* Main Spawning Scroll Panel */}
      <div className={`w-full max-w-3xl mx-auto p-6 border-4 shadow-2xl transition-all duration-500 z-10 relative ${
        isHard 
          ? 'mc-gui-panel-dark border-red-650 bg-[#2a1212]/95 text-white' 
          : 'mc-gui-panel border-[#8a8a8a] text-stone-900 shadow-xl'
      }`}>
        
        <div className="text-center mb-6 border-b-2 border-black/10 pb-4">
          <h1 className="font-pressstart text-xl sm:text-2xl text-mc-gold drop-shadow-[2px_2px_0_#000000] font-bold">
            CREATE NEW WORLD
          </h1>
          <p className={`text-xs mt-2 uppercase font-bold ${isHard ? 'text-red-300' : 'text-stone-700'}`}>
            Initialize your survival folder profile variables
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 text-sm">
          
          {/* Game Mode Selector (Visual Theme Mutator) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Survival Tab Option */}
            <div
              onClick={() => handleModeChange('survival')}
              className={`p-4 cursor-pointer border-4 flex flex-col justify-between h-36 transition-all ${
                mode === 'survival'
                  ? 'border-[#5fac52] bg-[#ebdcb2] text-stone-900 shadow-md font-bold'
                  : isHard
                    ? 'border-zinc-800 bg-black/30 opacity-40 hover:opacity-75 text-zinc-400'
                    : 'border-zinc-400 bg-stone-300/40 opacity-60 hover:opacity-100 text-stone-700'
              }`}
            >
              <div className="flex justify-between items-start">
                <span className="font-pressstart text-[10px] text-emerald-850 uppercase font-bold">Survival Mode</span>
                <Heart className="w-5 h-5 text-red-600 fill-current" />
              </div>
              <p className="text-[11px] leading-tight font-mono">
                Standard exploration. Fully integrated logs, build planners, coordinates, with infinite spawns.
              </p>
              <div className="text-[10px] uppercase font-bold text-emerald-700">Cozy & Experimental</div>
            </div>

            {/* Hardcore Tab Option */}
            <div
              onClick={() => handleModeChange('hardcore')}
              className={`p-4 cursor-pointer border-4 flex flex-col justify-between h-36 transition-all ${
                mode === 'hardcore'
                  ? 'border-red-600 bg-red-950/65 text-white shadow-md font-bold'
                  : 'border-zinc-400 bg-stone-300/40 opacity-60 hover:opacity-100 text-stone-700'
              }`}
            >
              <div className="flex justify-between items-start">
                <span className="font-pressstart text-[10px] text-red-500 uppercase font-bold">☠ Hardcore Life</span>
                <Skull className="w-5 h-5 text-red-500 fill-current" />
              </div>
              <p className="text-[11px] leading-tight font-mono text-zinc-300">
                High-tension log counters. Unlocks near-death diaries, world-will final sheets and a lock screen if marked as lost.
              </p>
              <div className="text-[10px] uppercase font-bold text-red-400">ONE LIFE. LOCKED ON HARD.</div>
            </div>

          </div>

          {/* Core Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Name */}
            <div className="space-y-1">
              <label className={`block text-[10px] font-pressstart uppercase ${isHard ? 'text-zinc-300' : 'text-stone-850'} font-bold`}>World Name:</label>
              <input
                type="text"
                placeholder="My Epic Survival 1.21"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full p-2.5 outline-none font-pressstart text-[10px] uppercase ${
                  isHard
                    ? 'bg-black/60 border-2 border-red-950 text-white placeholder-red-900/60 focus:border-red-400'
                    : 'bg-[#4a4a4a] border-2 border-[#1e1e1e] text-white placeholder-stone-400 focus:border-yellow-400 font-bold'
                }`}
              />
            </div>

            {/* Version */}
            <div className="space-y-1">
              <label className={`block text-[10px] font-pressstart uppercase ${isHard ? 'text-zinc-300' : 'text-stone-850'} font-bold`}>Minecraft Version:</label>
              <input
                type="text"
                placeholder="e.g. 1.21.1 or Beta 1.7.3"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                className={`w-full p-2.5 outline-none font-pressstart text-[10px] ${
                  isHard
                    ? 'bg-black/60 border-2 border-red-950 text-white placeholder-red-900/60 focus:border-red-400'
                    : 'bg-[#4a4a4a] border-2 border-[#1e1e1e] text-white placeholder-stone-400 focus:border-yellow-400 font-bold'
                }`}
              />
            </div>

            {/* Seed with randomizer */}
            <div className="sm:col-span-2 space-y-1">
              <label className={`block text-[10px] font-pressstart uppercase ${isHard ? 'text-zinc-300' : 'text-stone-850'} font-bold`}>World Seed:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. -84920492049104 or leave random"
                  value={seed}
                  onChange={(e) => setSeed(e.target.value)}
                  className={`flex-1 p-2.5 outline-none font-pressstart text-[10px] ${
                    isHard
                      ? 'bg-black/60 border-2 border-red-950 text-white placeholder-red-900/60 focus:border-red-400'
                      : 'bg-[#4a4a4a] border-2 border-[#1e1e1e] text-white placeholder-stone-400 focus:border-yellow-400 font-bold'
                  }`}
                />
                <button
                  type="button"
                  onClick={generateRandomSeed}
                  className="mc-button shrink-0 py-2 px-3.5 flex items-center gap-1.5"
                  title="Generate typical random seed"
                >
                  <Sparkles className="w-4 h-4 text-mc-gold animate-pulse" /> RANDOM
                </button>
              </div>
            </div>

            {/* Difficulty */}
            <div className="space-y-1">
              <label className={`block text-[10px] font-pressstart uppercase ${isHard ? 'text-zinc-300' : 'text-stone-850'} font-bold`}>Difficulty Setting:</label>
              {isHard ? (
                <div className="w-full bg-red-950/60 border-2 border-red-900/80 p-2.5 text-red-400 font-pressstart text-[10px] h-[38px] flex items-center justify-center font-bold">
                  ☠ HARD (LOCKED ON HARDCORE)
                </div>
              ) : (
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as any)}
                  className="w-full bg-[#4a4a4a] border-2 border-[#1e1e1e] p-2 text-[10px] font-pressstart text-white focus:outline-none focus:border-yellow-400 h-[38px] font-bold"
                >
                  <option value="Peaceful">PEACEFUL</option>
                  <option value="Easy">EASY</option>
                  <option value="Normal">NORMAL</option>
                  <option value="Hard">HARD</option>
                </select>
              )}
            </div>

            {/* Start Date */}
            <div className="space-y-1">
              <label className={`block text-[10px] font-pressstart uppercase ${isHard ? 'text-zinc-300' : 'text-stone-850'} font-bold`}>Real Start Date:</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={`w-full p-2.5 outline-none font-pressstart text-[10px] h-[38px] ${
                  isHard
                    ? 'bg-black/60 border-2 border-red-950 text-white focus:border-red-400'
                    : 'bg-[#4a4a4a] border-2 border-[#1e1e1e] text-white focus:border-yellow-400 font-bold'
                }`}
              />
            </div>

            {/* Mods & Shaders notes */}
            <div className="sm:col-span-2 space-y-1">
              <label className={`block text-[10px] font-pressstart uppercase ${isHard ? 'text-zinc-300' : 'text-stone-850'} font-bold`}>Installed Mods & Shaders Notes:</label>
              <input
                type="text"
                placeholder="e.g. OptiFine, Complementary Unbound Shaders, Create Mod..."
                value={modsNotes}
                onChange={(e) => setModsNotes(e.target.value)}
                className={`w-full p-2.5 outline-none font-mono text-xs ${
                  isHard
                    ? 'bg-black/60 border-2 border-red-950 text-white placeholder-red-900/60 focus:border-red-400'
                    : 'bg-[#4a4a4a] border-2 border-[#1e1e1e] text-white placeholder-stone-400 focus:border-yellow-400 font-bold'
                }`}
              />
            </div>

            {/* Description */}
            <div className="sm:col-span-2 space-y-1">
              <label className={`block text-[10px] font-pressstart uppercase ${isHard ? 'text-zinc-300' : 'text-stone-850'} font-bold`}>World Chronicle / Description:</label>
              <textarea
                placeholder="Write down the core philosophy or long-term plan for this world folder deck..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className={`w-full p-2.5 outline-none font-mono text-xs resize-none ${
                  isHard
                    ? 'bg-black/60 border-2 border-red-950 text-white placeholder-red-900/60 focus:border-red-400'
                    : 'bg-[#4a4a4a] border-2 border-[#1e1e1e] text-white placeholder-stone-400 focus:border-yellow-400 font-bold'
                }`}
              />
            </div>

          </div>

          {/* Create Button bottom container */}
          <div className="pt-4 border-t-2 border-black/10 flex justify-end">
            <button
              type="submit"
              className="mc-button mc-button-green text-base flex items-center gap-2 py-3 px-6 shadow-md"
            >
              🚀 SPAWN WORLD
            </button>
          </div>

        </form>

      </div>

      {/* Footer info lock */}
      <div className="text-center text-xs font-mono font-bold z-10 pt-6 text-white bg-black/35 max-w-sm mx-auto p-2 border-2 border-[#533d26]">
        MINEMEMORY OS SPAWNING GRID — SAVED LOCALLY
      </div>
    </div>
  );
}
