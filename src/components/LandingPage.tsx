import React, { useState } from 'react';
import { sounds } from '../utils/audio';
import { Sparkles, Skull, Play, Plus, Volume2, VolumeX, Shield, Heart, Anchor, Flame } from 'lucide-react';

interface LandingPageProps {
  onOpenWorlds: () => void;
  onCreateWorld: () => void;
  soundMuted: boolean;
  onToggleSound: () => void;
  currentUser: { email: string; displayName: string };
  onLogout: () => void;
}

export default function LandingPage({
  onOpenWorlds,
  onCreateWorld,
  soundMuted,
  onToggleSound,
  currentUser,
  onLogout
}: LandingPageProps) {
  const [activeCard, setActiveCard] = useState<'survival' | 'hardcore' | null>(null);
  const [activeSplash, setActiveSplash] = useState('LOCAL SYNC READY!');

  const splashtags = [
    "LOCAL DECK ACCESS ON!",
    "STEVE APPROVED!",
    "DIAMONDS DETECTED!",
    "XP ORB SOUND CHIMES!",
    "BACKUP VAULTS LOADED!",
    "SINGLEPLAYER SERIES PERFECT!",
    "DO NOT DIG STRAIGHT DOWN!"
  ];

  React.useEffect(() => {
    const interval = setInterval(() => {
      const idx = Math.floor(Math.random() * splashtags.length);
      setActiveSplash(splashtags[idx]);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleBtnClick = (action: () => void) => {
    sounds.playClick();
    action();
  };

  const playHoverSound = () => {
    sounds.playClick();
  };

  return (
    <div className="relative min-h-screen bg-minecraft-sky py-12 px-4 flex flex-col items-center justify-between text-zinc-900 overflow-hidden select-none">
      
      {/* Minecraft style background clouds & rolling scenery */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-10 left-[5%] w-80 h-16 bg-white/80 border-b-4 border-r-4 border-white/20 shadow-[8px_8px_0_rgba(0,0,0,0.1)]"></div>
        <div className="absolute top-28 right-[10%] w-64 h-12 bg-white/95 border-b-4 border-l-4 border-white/25 shadow-[8px_8px_0_rgba(0,0,0,0.1)]"></div>
        <div className="absolute bottom-32 left-[30%] w-72 h-14 bg-white/70 border-b-4 border-r-4 border-white/15 shadow-[6px_6px_0_rgba(0,0,0,0.1)]"></div>
        
        {/* Rolling Green Hills at the bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-44 bg-[#4e792c] border-t-8 border-[#3b5d21] opacity-75"></div>
        <div className="absolute bottom-0 left-0 right-0 h-28 bg-[#3b5d21] border-t-8 border-[#294216]"></div>
      </div>

      {/* Floating Header controls */}
      <div className="w-full max-w-5xl flex flex-col sm:flex-row justify-between items-center gap-4 z-10 px-4 bg-[#533d26] border-4 border-[#322315] p-3 text-white shadow-lg">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 text-xs font-mono bg-black/45 px-3 py-1.5 border-2 border-[#5fac52] uppercase tracking-widest text-[#55ff55]">
            <span className="inline-block w-2.5 h-2.5 bg-[#55ff55] animate-ping mr-1"></span>
            COMPASS ONLINE
          </div>
          <div className="flex items-center gap-1.5 text-xs font-mono bg-[#ebdcb2] text-stone-900 px-3 py-1.5 border-2 border-[#7c6238] font-bold uppercase tracking-wide">
            <span className="text-[#3f2d11]">👤 {currentUser.displayName}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sounds.playClick();
              onLogout();
            }}
            className="mc-button mc-button-red py-2 px-3 text-[10px] font-pressstart uppercase"
          >
            LOG OUT
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              onToggleSound();
            }}
            className="mc-button py-2 px-3"
            title={soundMuted ? "Unmute Sounds" : "Mute Sounds"}
            onMouseEnter={playHoverSound}
          >
            {soundMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#ffffa0]" />}
          </button>
        </div>
      </div>

      {/* Hero Header Area with wood sign frame backing */}
      <div className="my-8 text-center z-10 flex flex-col items-center bg-black/35 backdrop-blur-xs p-6 border-4 border-[#3a2a19] rounded-none outline outline-4 outline-[#825430] text-white max-w-2xl">
        {/* Animated Pixel Sword Logo Graphic */}
        <div className="mb-4 relative group">
          <div className="absolute -inset-1.5 bg-yellow-500/20 rounded blur-xl group-hover:bg-yellow-500/40 transition duration-1000"></div>
          <div className="w-16 h-16 bg-[#ebdcb2] border-4 border-[#7c6238] flex items-center justify-center shadow-lg">
            <Sparkles className="w-10 h-10 text-[#fcaa00] animate-bounce" />
          </div>
        </div>

        <div className="relative pt-2 pb-2 flex flex-col items-center">
          <h1 
            className="font-pressstart text-4xl md:text-5xl lg:text-5xl tracking-wider text-center drop-shadow-[0_4px_0_#000] relative text-white"
            style={{ letterSpacing: '0.05em' }}
          >
            MINE<span className="text-mc-gold text-yellow-400">MEMORY</span>
          </h1>
          
          {/* Pulsing splash tag next to title */}
          <div 
            className="absolute -bottom-3 transform rotate-[-12deg] bg-[#ffaa00] px-2.5 py-1 border-4 border-white font-pressstart text-[10px] md:text-xs text-white animate-[bounce_0.6s_infinite] drop-shadow-[3px_3px_0px_#000] z-20 whitespace-nowrap select-none"
            style={{ animationDuration: '0.6s' }}
          >
            ★ {activeSplash} ★
          </div>
        </div>
        
        <p className="font-pressstart text-[10px] md:text-xs mt-6 tracking-widest text-zinc-200 drop-shadow-[0_2px_0_#000] max-w-xl mx-auto uppercase">
          “The Operating System for Minecraft Worlds”
        </p>

        <p className="mt-4 font-mono text-zinc-200 text-sm max-w-md mx-auto font-bold drop-shadow-[1px_1px_1px_rgba(0,0,0,0.95)]">
          Keep your seeds, coordinates, multi-stage mega structures, journals, and tragic hardcore deaths archived forever.
        </p>
      </div>

      {/* Chunky Action Controls */}
      <div className="w-full max-w-md z-10 flex flex-col gap-4 px-4 my-4">
        <button
          onClick={() => handleBtnClick(onOpenWorlds)}
          className="mc-button mc-button-green w-full text-base flex items-center justify-center gap-3 py-4 shadow-[4px_4px_0_rgba(0,0,0,1)] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_rgba(0,0,0,1)] transition-all"
          onMouseEnter={playHoverSound}
          id="btn-open-worlds"
        >
          <Play className="w-5 h-5 fill-current shrink-0" />
          OPEN SAVED WORLDS
        </button>

        <button
          onClick={() => handleBtnClick(onCreateWorld)}
          className="mc-button w-full text-stone-100 text-base flex items-center justify-center gap-3 py-4 bg-[#7c7c7c] hover:brightness-110 border-4 border-[#aeaeae] shadow-[4px_4px_0_rgba(0,0,0,1)] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_rgba(0,0,0,1)] transition-all"
          onMouseEnter={playHoverSound}
          id="btn-create-world"
        >
          <Plus className="w-5 h-5 shrink-0 text-white" />
          CREATE NEW WORLD
        </button>
      </div>

      {/* Immersive Survival vs Hardcore Split Description Showcase */}
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 px-4 z-10 mt-6 relative">
        
        {/* Survival Mode Card */}
        <div
          onClick={() => {
            sounds.playChestOpen();
            setActiveCard('survival');
          }}
          className={`group relative cursor-pointer p-6 rounded-none transition-all duration-300 transform border-4 ${
            activeCard === 'survival' 
              ? 'border-emerald-400 bg-[#1e2f18] scale-[1.02] shadow-[8px_8px_0_rgba(0,0,0,0.7)]' 
              : 'border-[#7c6238] bg-[#ebdcb2] hover:border-emerald-700 text-stone-900 shadow-[4px_4px_0_rgba(0,0,0,0.5)]'
          }`}
          onMouseEnter={playHoverSound}
        >
          <div className="absolute top-2 right-2 text-emerald-600 opacity-60 group-hover:opacity-100 transition-opacity">
            <Heart className="w-8 h-8 fill-current text-red-650" />
          </div>
          
          <div className="flex items-center gap-3 mb-4">
            <span className="p-2 bg-[#5fac52] text-white border-2 border-white font-pressstart text-xs font-bold">
              01
            </span>
            <h3 className={`font-pressstart text-sm ${activeCard === 'survival' ? 'text-mc-green' : 'text-emerald-850'} uppercase font-bold`}>
              Survival Mode
            </h3>
          </div>
          
          <p className={`text-sm leading-relaxed font-mono ${activeCard === 'survival' ? 'text-zinc-200' : 'text-stone-850'} font-bold`}>
            A peaceful, adventurous atmosphere. Focus on deep mining expeditions, expanding villager trading, automating multi-chunk farms, and planning monumental aesthetic castle builds.
          </p>
          
          <div className="mt-4 pt-3 border-t-2 border-black/10 flex gap-2 text-xs font-mono">
            <span className="bg-[#5fac52]/20 px-2.5 py-1 text-emerald-800 font-bold border border-emerald-600">Grass Green</span>
            <span className="bg-[#5fac52]/20 px-2.5 py-1 text-emerald-800 font-bold border border-emerald-600">Oak Wood</span>
            <span className="bg-[#5fac52]/20 px-2.5 py-1 text-emerald-800 font-bold border border-emerald-600">Infinite Lives</span>
          </div>
        </div>

        {/* Hardcore Mode Card */}
        <div
          onClick={() => {
            sounds.playHurt();
            setActiveCard('hardcore');
          }}
          className={`group relative cursor-pointer p-6 rounded-none transition-all duration-300 transform border-4 ${
            activeCard === 'hardcore' 
              ? 'border-red-500 bg-[#3b1212]/95 scale-[1.02] text-white shadow-[8px_8px_0_rgba(0,0,0,0.7)]' 
              : 'border-red-900 bg-[#ebdcb2] hover:border-red-500 text-stone-900 shadow-[4px_4px_0_rgba(0,0,0,0.5)]'
          }`}
          onMouseEnter={playHoverSound}
        >
          <div className="absolute top-2 right-2 text-red-600 opacity-60 group-hover:opacity-100 transition-opacity">
            <Skull className="w-8 h-8 text-red-750 fill-current" />
          </div>
          
          <div className="flex items-center gap-3 mb-4">
            <span className="p-2 bg-red-750 text-white border-2 border-white font-pressstart text-xs font-bold">
              ☠
            </span>
            <h3 className={`font-pressstart text-sm ${activeCard === 'hardcore' ? 'text-mc-red' : 'text-red-750'} uppercase font-bold`}>
              Hardcore Mode
            </h3>
          </div>
          
          <p className={`text-sm leading-relaxed font-mono ${activeCard === 'hardcore' ? 'text-zinc-200' : 'text-stone-850'} font-bold`}>
            High stress, high reward. A dangerous survival landscape. Track backup gear inventory slots, emergency safe houses, near-death logs, and write down your final digital testament before taking on the void. One life only.
          </p>
          
          <div className="mt-4 pt-3 border-t-2 border-black/10 flex gap-2 text-xs font-mono">
            <span className="bg-red-800/10 px-2.5 py-1 text-red-850 font-bold border border-red-800">Blackstone</span>
            <span className="bg-red-800/10 px-2.5 py-1 text-red-850 font-bold border border-red-800">Soul Fire</span>
            <span className="bg-red-800/10 px-2.5 py-1 text-red-850 font-bold border border-red-800">Permadeath</span>
          </div>
        </div>

      </div>

      {/* Footer system details */}
      <div className="mt-8 text-center text-xs text-white bg-black/35 px-4 py-3 border-2 border-[#533d26] font-mono tracking-wider z-10 flex flex-col items-center gap-2 font-bold max-w-2xl mx-auto w-full">
        <div>MINEMEMORY COMPASS COMPANION — LOCAL ENCRYPTED DECK</div>
        <div className="text-[9px] text-zinc-400 border-t border-[#533d26]/40 pt-2 w-full uppercase">
          NOT AN OFFICIAL MINECRAFT PRODUCT, AND NOT APPROVED BY OR ASSOCIATED WITH MOJANG OR MICROSOFT
        </div>
      </div>
    </div>
  );
}
