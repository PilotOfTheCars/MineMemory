import React, { useEffect } from 'react';
import { MinecraftWorld } from '../types';
import { sounds } from '../utils/audio';
import { Skull, AlertTriangle, RefreshCw, FileText, Calendar, BookOpen, Compass, RotateCcw } from 'lucide-react';

interface HardcoreDeathScreenProps {
  world: MinecraftWorld;
  onBackToMenu: () => void;
  onConvert: () => void; // Trick backup tool to resurrect dead world back to survival!
}

export default function HardcoreDeathScreen({
  world,
  onBackToMenu,
  onConvert
}: HardcoreDeathScreenProps) {
  
  useEffect(() => {
    // Play dramatic hurt followed immediately by deep eerie cave drone
    sounds.playHurt();
    const t = setTimeout(() => {
      sounds.playCaveAmbient();
    }, 500);
    return () => clearTimeout(t);
  }, [world.id]);

  const totalLogs = world.logs?.length || 0;
  const totalCoords = world.coordinates?.length || 0;
  const completedProjects = world.projects?.filter(p => p.progress === 100)?.length || 0;

  return (
    <div className="fixed inset-0 min-h-screen bg-[#aa0000]/30 bg-gradient-to-b from-[#1c1c1c] via-[#000000]/95 to-[#1c0000] text-white flex flex-col items-center justify-center font-mono z-50 p-4 overflow-y-auto select-none">
      
      {/* Mega Red DEATH HEADING */}
      <div className="text-center space-y-3 max-w-xl animate-[pulse_2s_infinite]">
        <Skull className="w-16 h-16 text-red-650 mx-auto fill-current text-mc-darkred" />
        
        <h1 
          className="font-pressstart text-4xl sm:text-5xl md:text-6xl text-red-650 drop-shadow-[4px_4px_0_#2b0000] tracking-widest text-[#aa0000] font-bold"
          style={{ textShadow: '4px 4px 0px #000' }}
        >
          YOU DIED!
        </h1>

        <p className="font-pressstart text-xs sm:text-sm text-zinc-400 uppercase tracking-widest pt-2">
          &mdash; World Lost &mdash;
        </p>
      </div>

      {/* Cinematic Obituary Scroll */}
      <div className="w-full max-w-xl bg-black/80 border-4 border-red-950 p-6 sm:p-8 mt-10 mc-gui-panel-dark shadow-[0_0_20px_rgba(170,0,0,0.3)] space-y-6">
        
        <div className="text-center border-b border-red-900 pb-3 mb-2">
          <h2 className="font-pressstart text-xs text-[#ff5555] uppercase">WORLD OBITUARY RECORD</h2>
          <p className="text-[10px] text-zinc-500 uppercase mt-1">Epitaph score cataloged in offline deck space</p>
        </div>

        <div className="text-center space-y-1">
          <span className="text-zinc-500 uppercase text-xs">Deceased World Seed Locus:</span>
          <p className="font-pressstart text-sm text-zinc-300 font-mono tracking-wider select-all">
            {world.seed}
          </p>
          <p className="text-xs text-zinc-500">Java Edition {world.version}</p>
        </div>

        {/* Core Stats list */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center border-t border-b border-zinc-900 py-4 my-2">
          
          <div className="p-2 bg-zinc-950/40 border border-zinc-900 rounded-none">
            <span className="block text-xl">⏳</span>
            <span className="block text-zinc-500 text-[10px] uppercase mt-1">DAYS</span>
            <span className="font-pressstart text-xs text-[#ff5555] font-bold block mt-1">
              {world.hardcoreExtras?.daysSurvived || 0}
            </span>
          </div>

          <div className="p-2 bg-zinc-950/40 border border-zinc-900 rounded-none">
            <span className="block text-xl">🗒</span>
            <span className="block text-zinc-500 text-[10px] uppercase mt-1">JOURNALS</span>
            <span className="font-pressstart text-xs text-[#ffff55] font-bold block mt-1">
              {totalLogs}
            </span>
          </div>

          <div className="p-2 bg-zinc-950/40 border border-zinc-900 rounded-none">
            <span className="block text-xl">🧱</span>
            <span className="block text-zinc-500 text-[10px] uppercase mt-1">BUILDS</span>
            <span className="font-pressstart text-xs text-[#55ff55] font-bold block mt-1">
              {completedProjects}
            </span>
          </div>

          <div className="p-2 bg-zinc-950/40 border border-zinc-900 rounded-none">
            <span className="block text-xl">📍</span>
            <span className="block text-zinc-500 text-[10px] uppercase mt-1">BEACONS</span>
            <span className="font-pressstart text-xs text-[#55ffff] font-bold block mt-1">
              {totalCoords}
            </span>
          </div>

        </div>

        {/* Hardcore Final Testament readout */}
        {world.hardcoreExtras?.worldWill && (
          <div className="bg-[#1a0000] p-4 border border-red-950 text-xs italic text-red-300/90 leading-relaxed font-serif tracking-normal text-center">
            “ {world.hardcoreExtras.worldWill} ”
          </div>
        )}

        {/* Narrative funeral sign off */}
        <div className="text-zinc-400 text-xs leading-relaxed text-center font-mono max-w-md mx-auto">
          The coordinates are logged, the builds left frozen under dark snow clouds. Minecraft Hardcore is brutal, but your step logs are sealed in the MineMemory Terminal archive forever.
        </div>

      </div>

      {/* Recoveries / Menu boutons */}
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xl mt-8">
        <button
          onClick={() => { sounds.playClick(); onBackToMenu(); }}
          className="mc-button py-3 text-sm flex-1"
        >
          <RotateCcw className="w-4 h-4 mr-2" /> MENU
        </button>

        <button
          onClick={() => {
            sounds.playLevelUp();
            onConvert(); // Converts world to survival resurrecting the archive!
          }}
          className="mc-button mc-button-green py-3 text-sm flex-1 flex items-center justify-center gap-1.5"
          title="Convert this Dead Hardcore World to standard Survival to enable full logging access again"
        >
          <RefreshCw className="w-4 h-4" /> RESURRECT TO SURVIVAL
        </button>
      </div>

      <div className="text-xs text-zinc-600 mt-6 font-mono">
        OS DEATH SEQUENCE TERMINATED CODE — SAVE DATA RETAINED
      </div>
    </div>
  );
}
