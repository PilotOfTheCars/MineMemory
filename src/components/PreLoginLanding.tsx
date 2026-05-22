import React, { useState, useEffect } from 'react';
import { 
  BookOpen, MapPin, Hammer, Award, ShieldAlert, Sparkles, LogIn, Eye, 
  Compass, Heart, Skull, Play, Disc, Music, Shield, Volume2, Gamepad2, Info
} from 'lucide-react';
import { sounds } from '../utils/audio';

interface PreLoginLandingProps {
  onEnterAuth: () => void;
  onEnterDemo: () => void;
}

const MINECRAFT_SPLASHES = [
  "100% CLIENT-SIDE DATA!",
  "WARDEN APPROVED!",
  "DON'T DIG STRAIGHT DOWN!",
  "SAVES COORDINATES SAFELY!",
  "POWERED BY REDSTONE!",
  "DIAMONDS FOUND AT Y -58!",
  "XP LEVEL 999 REACHED!",
  "ASK THE AI ORACLE!",
  "LAVA BUCKET CERTIFIED!",
  "OOF! RETRO SOUNDS ACTIVE!",
  "CHERRY BALCONY BLUEPRINTS!",
  "SWEET BERRIES DETECTED!"
];

export default function PreLoginLanding({ onEnterAuth, onEnterDemo }: PreLoginLandingProps) {
  const [activeSplash, setActiveSplash] = useState(MINECRAFT_SPLASHES[0]);
  const [activeSoundId, setActiveSoundId] = useState<string | null>(null);

  // Rotate splash texts automatically
  useEffect(() => {
    const interval = setInterval(() => {
      const idx = Math.floor(Math.random() * MINECRAFT_SPLASHES.length);
      setActiveSplash(MINECRAFT_SPLASHES[idx]);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const handleAuthBtn = () => {
    sounds.playLevelUp();
    onEnterAuth();
  };

  const handleDemoBtn = () => {
    sounds.playChestOpen();
    onEnterDemo();
  };

  const playSynthesizedSound = (soundType: 'click' | 'xp' | 'level' | 'chest' | 'cave' | 'hurt') => {
    setActiveSoundId(soundType);
    setTimeout(() => setActiveSoundId(null), 500);

    switch(soundType) {
      case 'click':
        sounds.playClick();
        break;
      case 'xp':
        sounds.playXPDing();
        break;
      case 'level':
        sounds.playLevelUp();
        break;
      case 'chest':
        sounds.playChestOpen();
        break;
      case 'cave':
        sounds.playCaveAmbient();
        break;
      case 'hurt':
        sounds.playHurt();
        break;
    }
  };

  return (
    <div className="relative min-h-screen bg-minecraft-sky text-zinc-900 flex flex-col justify-between font-mono select-none overflow-x-hidden" id="prelogin-container">
      
      {/* Dynamic Minecraft style background clouds */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Pixel Cloud 1 */}
        <div className="absolute top-12 left-[10%] w-64 h-16 bg-white/80 border-b-4 border-r-4 border-white/20 shadow-[12px_12px_0_rgba(0,0,0,0.1)]"></div>
        {/* Pixel Cloud 2 */}
        <div className="absolute top-24 right-[15%] w-96 h-20 bg-white/95 border-b-4 border-l-4 border-white/25 shadow-[12px_12px_0_rgba(0,0,0,0.1)]"></div>
        {/* Pixel Cloud 3 */}
        <div className="absolute top-[40%] left-[45%] w-52 h-12 bg-white/70 border-b-4 border-r-4 border-white/10 shadow-[8px_8px_0_rgba(0,0,0,0.1)]"></div>
        
        {/* Rolling Green Hills at the bottom of the page */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-[#4e792c] border-t-8 border-[#3b5d21] opacity-75"></div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-[#3b5d21] border-t-8 border-[#294216]"></div>
      </div>

      {/* Repeating decorative thick grass-block border stripe on top */}
      <div className="h-6 w-full bg-[#5a8934] border-b-4 border-[#3e6023] relative z-20">
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-[#2e1d13] opacity-35"></div>
      </div>

      {/* Navigation Header with warm woodland brown texture */}
      <header className="max-w-7xl w-full mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10 border-b-4 border-[#322315] bg-[#533d26] text-white shadow-lg">
        <div className="flex items-center gap-3">
          {/* Pixel grass / block mimic logo */}
          <div className="w-11 h-11 bg-[#5a8934] border-4 border-zinc-200 flex flex-col justify-between p-0.5 shadow-[4px_4px_0px_rgba(0,0,0,0.85)] text-white shrink-0">
            <div className="h-4 bg-[#3e6023] border-b-2 border-zinc-200"></div>
            <span className="font-pressstart text-[14px] text-center font-bold block pb-1">M</span>
          </div>
          <div>
            <span className="font-pressstart text-[8px] text-[#ffdd55] tracking-widest block drop-shadow-[1px_1px_0_#000]">MINE-COMPASS PROTOCOL ACTIVE</span>
            <div className="flex items-center gap-1.5">
              <h1 className="font-pressstart text-xs sm:text-base text-white tracking-wider drop-shadow-[2px_2px_0_#000]">MINE<span className="text-[#ffff55]">MEMORY</span> COMPASS</h1>
              <span className="text-[8px] bg-[#aeff55] text-black px-1 py-0.5 border-2 border-white font-bold">V2.1</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={handleDemoBtn}
            className="mc-button py-2 px-3 text-[10px] flex items-center gap-1.5 hover:text-[#ffffa0] transition shadow-md"
          >
            <Eye className="w-3.5 h-3.5" /> FREE DEMO
          </button>
          <button 
            onClick={handleAuthBtn}
            className="mc-button mc-button-green py-2 px-4 text-[10px] flex items-center gap-1.5 transition shadow-md"
          >
            <LogIn className="w-3.5 h-3.5 text-white" /> REGISTER / LOGIN
          </button>
        </div>
      </header>

      {/* Main Container Dashboard layout */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-10 flex flex-col items-center justify-center relative z-10 space-y-10">
        
        {/* Title area with iconic yellow bouncing splash text */}
        <div className="text-center space-y-3 max-w-2xl flex flex-col items-center relative bg-black/35 backdrop-blur-xs p-6 border-4 border-[#3a2a19] rounded-none outline outline-4 outline-[#825430] text-white">
          <div className="inline-flex items-center gap-2 bg-[#5a8934] border-2 border-[#aeff55] px-3.5 py-1 text-[9px] text-white uppercase font-pressstart tracking-wider shadow-md">
            <Compass className="w-4 h-4 text-[#ffff55] animate-spin" style={{ animationDuration: '6s' }} /> 
            GPS SAT-GRID ONLINE
          </div>

          <div className="relative pt-4 pb-2">
            <h1 
              className="font-pressstart text-4xl sm:text-5xl lg:text-6xl text-white tracking-widest leading-none select-none relative z-10"
              style={{ textShadow: '4px 4px 0px #000, 8px 8px 0px rgba(0,0,0,0.5)' }}
            >
              MINE<span className="text-mc-gold">MEMORY</span>
            </h1>
            
            {/* Pulsing splash tag */}
            <div 
              className="absolute -bottom-1 -right-6 md:-right-14 transform rotate-[-12deg] bg-[#ffaa00] px-3 py-1 border-4 border-white font-pressstart text-[10px] md:text-sm text-white animate-[bounce_0.6s_infinite] shadow-[4px_4px_0_rgba(0,0,0,0.9)] z-20 whitespace-nowrap select-none"
              style={{ animationDuration: '0.6s' }}
            >
              ★ {activeSplash} ★
            </div>
          </div>

          <p className="text-zinc-100 text-xs sm:text-sm leading-relaxed max-w-lg mx-auto font-mono py-1.5 font-bold drop-shadow-[1px_1px_1px_rgba(0,0,0,0.9)]">
            The ultimate companion dashboard for logs, blueprint calculations, coordinate vaults, hardcore statistics, and automated local data backup directories.
          </p>
        </div>

        {/* Dynamic Interactive Soundboard Widget - Styled as authentic Minecraft crafting grid block */}
        <div className="w-full max-w-3xl mc-gui-panel p-4 shadow-2xl select-none" id="soundboard-panel">
          <div className="flex items-center justify-between border-b-4 border-[#555555] pb-2.5 mb-3">
            <div className="flex items-center gap-2 text-zinc-800">
              <Disc className="w-5 h-5 text-red-600 animate-spin" />
              <h4 className="font-pressstart text-[11px] text-black uppercase tracking-wider font-bold">MINE-COMPASS Jukebox Sounder</h4>
            </div>
            <span className="font-mono text-[10px] text-zinc-650 font-bold bg-[#8b8b8b]/30 px-2 py-0.5 border border-zinc-400">CLICK BLOCKS TO TEST ACOUSTICS</span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
            <button 
              onClick={() => playSynthesizedSound('click')}
              className={`p-3 flex flex-col items-center justify-center border-4 transition active:scale-95 ${
                activeSoundId === 'click' ? 'bg-[#5fac52] border-white text-white' : 'bg-minecraft-planks hover:brightness-110 text-stone-900 border-[#8c683f]'
              }`}
            >
              <span className="text-2xl drop-shadow-[2px_2px_0_rgba(0,0,0,0.3)]">🪵</span>
              <span className="font-pressstart text-[8px] mt-1.5 block font-bold">OAK WOOD</span>
            </button>
            <button 
              onClick={() => playSynthesizedSound('xp')}
              className={`p-3 flex flex-col items-center justify-center border-4 transition active:scale-95 ${
                activeSoundId === 'xp' ? 'bg-[#5fac52] border-white text-white' : 'bg-[#153415] hover:bg-[#1a411a] text-[#55ff55] border-[#55ff55]/50'
              }`}
            >
              <span className="text-2xl drop-shadow-[2px_2px_0_rgba(0,0,0,0.3)]">🟢</span>
              <span className="font-pressstart text-[8px] mt-1.5 block font-bold">XP ORB</span>
            </button>
            <button 
              onClick={() => playSynthesizedSound('level')}
              className={`p-3 flex flex-col items-center justify-center border-4 transition active:scale-95 ${
                activeSoundId === 'level' ? 'bg-[#e7ac1c] border-white text-white' : 'bg-minecraft-gold text-white border-yellow-600'
              }`}
            >
              <span className="text-2xl drop-shadow-[2px_2px_0_rgba(0,0,0,0.3)]">🌟</span>
              <span className="font-pressstart text-[8px] mt-1.5 block font-bold">LEVEL UP</span>
            </button>
            <button 
              onClick={() => playSynthesizedSound('chest')}
              className={`p-3 flex flex-col items-center justify-center border-4 transition active:scale-95 ${
                activeSoundId === 'chest' ? 'bg-[#5fac52] border-white text-white' : 'bg-[#533f2c] text-amber-500 border-amber-800'
              }`}
            >
              <span className="text-2xl drop-shadow-[2px_2px_0_rgba(0,0,0,0.3)]">🧳</span>
              <span className="font-pressstart text-[8px] mt-1.5 block font-bold">CHEST</span>
            </button>
            <button 
              onClick={() => playSynthesizedSound('cave')}
              className={`p-3 flex flex-col items-center justify-center border-4 transition active:scale-95 ${
                activeSoundId === 'cave' ? 'bg-[#a12eff] border-white text-white' : 'bg-[#211d2b] text-purple-400 border-purple-900'
              }`}
            >
              <span className="text-2xl drop-shadow-[2px_2px_0_rgba(0,0,0,0.3)]">💀</span>
              <span className="font-pressstart text-[8px] mt-1.5 block font-bold">AMBIENT</span>
            </button>
            <button 
              onClick={() => playSynthesizedSound('hurt')}
              className={`p-3 flex flex-col items-center justify-center border-4 transition active:scale-95 ${
                activeSoundId === 'hurt' ? 'bg-[#ff5555] border-white text-white' : 'bg-[#3b1212] text-red-500 border-red-800'
              }`}
            >
              <span className="text-2xl drop-shadow-[2px_2px_0_rgba(0,0,0,0.3)]">💥</span>
              <span className="font-pressstart text-[8px] mt-1.5 block font-bold">HURT</span>
            </button>
          </div>
        </div>

        {/* Core Gateway Dual Cards - Dressed in gorgeous block colors (Gold and Emerald/Diamond themes) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
          
          {/* Card left: Showcase Archive gold Theme */}
          <div className="bg-minecraft-gold p-6 flex flex-col justify-between transition-transform duration-200 hover:scale-[1.02] shadow-[8px_8px_0_rgba(0,0,0,0.7)] text-white relative">
            <div className="absolute top-2 right-2 text-yellow-300 opacity-20">
              <Compass className="w-16 h-16" />
            </div>

            <div className="space-y-4 z-10">
              <div className="flex items-center justify-between">
                <span className="font-pressstart text-[9px] text-yellow-200 bg-yellow-950/60 px-2 py-1 border-2 border-yellow-400 font-bold uppercase">
                  ⭐ EXHIBITION MAPS
                </span>
                <Eye className="w-5 h-5 text-yellow-300 animate-pulse" />
              </div>
              
              <h3 className="font-pressstart text-sm sm:text-base text-white tracking-wide uppercase drop-shadow-[2px_2px_0_#000]">
                LOAD DEMO REALM
              </h3>
              <p className="text-xs text-zinc-100 leading-relaxed font-mono drop-shadow-[1px_1px_0_#000]">
                Play with preset logs, Trial Chambers coordinates list, biome seeds, and incident vaults immediately without an account.
              </p>
              
              <div className="text-[10px] bg-yellow-950/70 text-yellow-300 border-2 border-yellow-600 p-2 font-mono leading-tight">
                <strong>🚫 DEMO PLAYING BOUNDARIES:</strong> Your edits inside the showcase world won't be saved permanently to your computer directory.
              </div>
            </div>

            <button
              onClick={handleDemoBtn}
              className="mt-6 mc-button w-full shadow-lg"
            >
              👁️ ENTER PRESET SHOWCASE
            </button>
          </div>

          {/* Card right: Custom Account diamond/slime green Theme */}
          <div className="bg-minecraft-diamond p-6 flex flex-col justify-between transition-transform duration-200 hover:scale-[1.02] shadow-[8px_8px_0_rgba(0,0,0,0.7)] text-white relative">
            <div className="absolute top-2 right-2 text-cyan-300 opacity-20">
              <Sparkles className="w-16 h-16" />
            </div>

            <div className="space-y-4 z-10">
              <div className="flex items-center justify-between">
                <span className="font-pressstart text-[9px] text-cyan-200 bg-cyan-950/60 px-2 py-1 border-2 border-cyan-400 font-bold uppercase">
                  📁 PERSISTENT STORAGE
                </span>
                <Volume2 className="w-5 h-5 text-cyan-300" />
              </div>

              <h3 className="font-pressstart text-sm sm:text-base text-white tracking-wide uppercase drop-shadow-[2px_2px_0_#000]">
                CREATE OWN BASE LOGS
              </h3>
              <p className="text-xs text-zinc-100 leading-relaxed font-mono drop-shadow-[1px_1px_0_#000]">
                Save personal seeds, coordinates, multi-stage building material logs, and daily survival diaries. Securely cached on your local web storage.
              </p>
              
              <div className="text-[10px] bg-emerald-950/70 text-[#aeff55] border-2 border-[#5fac52] p-2 font-mono leading-tight">
                <strong>⚙️ DATA SECURITY ASSURED:</strong> Includes local backup export systems to prevent accidental database wipes or world loss.
              </div>
            </div>

            <button
              onClick={handleAuthBtn}
              className="mt-6 mc-button mc-button-green w-full shadow-lg"
            >
              🚀 CREATE COMPASS VAULT
            </button>
          </div>

        </div>

        {/* Minecraft Style Grid Items features overview - High contrast Inventory Grids */}
        <div className="w-full space-y-6 pt-8 border-t-4 border-[#3a2a19] bg-black/25 p-6 shadow-inner">
          <h4 className="font-pressstart text-[10px] text-zinc-200 uppercase text-center tracking-wider drop-shadow-[1px_1px_0_#000]">--- COMPASS CAPABILITY MANIFESTO ---</h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            
            {/* Feature Slot Item 1 - Gold */}
            <div className="bg-[#ebdcb2] border-4 border-[#7c6238] p-4 relative group hover:brightness-105 transition-all text-stone-900 shadow-md">
              <div className="absolute top-2 right-2 text-[#7c6238] font-pressstart text-[8px] font-bold">SLOT.01</div>
              <div className="flex items-center gap-2 mb-2">
                <div className="mc-slot p-0.5 shadow-md">
                  <div className="w-8 h-8 mc-slot-inner flex items-center justify-center text-sm font-bold bg-[#8b8b8b]">📖</div>
                </div>
                <h5 className="font-pressstart text-[11px] text-[#7c6238] uppercase font-bold">DAILY ADVENTURE JOURNALS</h5>
              </div>
              <p className="text-[11px] text-zinc-800 leading-relaxed font-mono font-bold">
                Write down accomplishments, diamonds mined, boss plans, or simple milestones of your world's life.
              </p>
            </div>

            {/* Feature Slot Item 2 - Diamond blue */}
            <div className="bg-[#ebdcb2] border-4 border-[#7c6238] p-4 relative group hover:brightness-105 transition-all text-stone-900 shadow-md">
              <div className="absolute top-2 right-2 text-[#7c6238] font-pressstart text-[8px] font-bold">SLOT.02</div>
              <div className="flex items-center gap-2 mb-2">
                <div className="mc-slot p-0.5 shadow-md">
                  <div className="w-8 h-8 mc-slot-inner flex items-center justify-center text-sm font-bold bg-[#8b8b8b]">📍</div>
                </div>
                <h5 className="font-pressstart text-[11px] text-sky-700 uppercase font-bold">COORDINATE VAULT</h5>
              </div>
              <p className="text-[11px] text-zinc-800 leading-relaxed font-mono font-bold">
                Store bases, nether portals, fortress spawners, and monument coordinates. Toggle hazard danger flags.
              </p>
            </div>

            {/* Feature Slot Item 3 - Redstone */}
            <div className="bg-[#ebdcb2] border-4 border-[#7c6238] p-4 relative group hover:brightness-105 transition-all text-stone-900 shadow-md">
              <div className="absolute top-2 right-2 text-[#7c6238] font-pressstart text-[8px] font-bold">SLOT.03</div>
              <div className="flex items-center gap-2 mb-2">
                <div className="mc-slot p-0.5 shadow-md">
                  <div className="w-8 h-8 mc-slot-inner flex items-center justify-center text-sm font-bold bg-[#8b8b8b]">🧱</div>
                </div>
                <h5 className="font-pressstart text-[11px] text-red-700 uppercase font-bold">BUILDING DRAFTS</h5>
              </div>
              <p className="text-[11px] text-zinc-800 leading-relaxed font-mono font-bold">
                Breakdown massive construction blueprints (like mob farms or castles) into checklists with material progress trackers.
              </p>
            </div>

            {/* Feature Slot Item 4 */}
            <div className="bg-[#ebdcb2] border-4 border-[#7c6238] p-4 relative group hover:brightness-105 transition-all text-stone-900 shadow-md">
              <div className="absolute top-2 right-2 text-[#7c6238] font-pressstart text-[8px] font-bold">SLOT.04</div>
              <div className="flex items-center gap-2 mb-2">
                <div className="mc-slot p-0.5 shadow-md">
                  <div className="w-8 h-8 mc-slot-inner flex items-center justify-center text-sm font-bold bg-[#8b8b8b]">🏆</div>
                </div>
                <h5 className="font-pressstart text-[11px] text-emerald-700 uppercase font-bold">ADVANCEMENT QUESTS</h5>
              </div>
              <p className="text-[11px] text-zinc-800 leading-relaxed font-mono font-bold">
                Create structured lists of ultimate goals (e.g. "Kill Wither under bed", "Collect every wool color") with sound triggers.
              </p>
            </div>

            {/* Feature Slot Item 5 */}
            <div className="bg-[#ebdcb2] border-4 border-[#7c6238] p-4 relative group hover:brightness-105 transition-all text-stone-900 shadow-md">
              <div className="absolute top-2 right-2 text-[#7c6238] font-pressstart text-[8px] font-bold">SLOT.05</div>
              <div className="flex items-center gap-2 mb-2">
                <div className="mc-slot p-0.5 shadow-md">
                  <div className="w-8 h-8 mc-slot-inner flex items-center justify-center text-sm font-bold bg-[#8b8b8b]">💀</div>
                </div>
                <h5 className="font-pressstart text-[11px] text-red-650 uppercase font-bold">INCIDENT DEATH LOGS</h5>
              </div>
              <p className="text-[11px] text-zinc-800 leading-relaxed font-mono font-bold">
                Catalog near-deaths, lava splashes, lost equipment, and grave markers to prevent future tactical errors.
              </p>
            </div>

            {/* Feature Slot Item 6 */}
            <div className="bg-[#ebdcb2] border-4 border-[#7c6238] p-4 relative group hover:brightness-105 transition-all text-stone-900 shadow-md">
              <div className="absolute top-2 right-2 text-[#7c6238] font-pressstart text-[8px] font-bold">SLOT.06</div>
              <div className="flex items-center gap-2 mb-2">
                <div className="mc-slot p-0.5 shadow-md">
                  <div className="w-8 h-8 mc-slot-inner flex items-center justify-center text-sm font-bold bg-[#8b8b8b]">🌌</div>
                </div>
                <h5 className="font-pressstart text-[11px] text-[#5c2eff] uppercase font-bold">AI ORACLE RADAR</h5>
              </div>
              <p className="text-[11px] text-zinc-800 leading-relaxed font-mono font-bold">
                Ask coordinates or portal mathematics queries from any dimension directly to the server intelligence.
              </p>
            </div>

          </div>
        </div>

      </main>

      {/* Footer statistics system strip */}
      <footer className="bg-[#1c120c] border-t-8 border-[#130b08] py-6 px-6 font-mono text-amber-100/70 uppercase flex flex-col items-center gap-3 text-[10px] relative z-10">
        <div className="w-full flex flex-col md:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-4 h-4 text-[#55ff55] animate-pulse" />
            <span className="font-bold">MineMemory Compass Terminal Base Sync Connected</span>
          </div>
          <div className="font-bold">Offline local state. Zero tracking telemetry files.</div>
          <span className="text-zinc-400 font-pressstart text-[7px] tracking-widest">© 2026 MINEMEMORY COMPASS</span>
        </div>
        <div className="text-center text-zinc-500 font-mono text-[9px] tracking-wide mt-1 border-t border-amber-950/40 pt-3 w-full">
          NOT AN OFFICIAL MINECRAFT PRODUCT, AND NOT APPROVED BY OR ASSOCIATED WITH MOJANG OR MICROSOFT
        </div>
      </footer>

    </div>
  );
}
