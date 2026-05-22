import React, { useState, useRef } from 'react';
import { MinecraftWorld } from '../types';
import { sounds } from '../utils/audio';
import { Skull, Shield, Search, ArrowLeft, Trash2, Edit2, Play, Download, Upload, AlertTriangle, Check, FileJson } from 'lucide-react';

interface WorldSelectPageProps {
  worlds: MinecraftWorld[];
  onSelectWorld: (id: string) => void;
  onDeleteWorld: (id: string) => void;
  onImportWorld: (imported: MinecraftWorld) => void;
  onBack: () => void;
  onCreateNewWorld: () => void;
}

export default function WorldSelectPage({
  worlds,
  onSelectWorld,
  onDeleteWorld,
  onImportWorld,
  onBack,
  onCreateNewWorld
}: WorldSelectPageProps) {
  const [search, setSearch] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredWorlds = worlds.filter(w =>
    w.name.toLowerCase().includes(search.toLowerCase()) ||
    w.seed.toLowerCase().includes(search.toLowerCase()) ||
    w.version.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (id: string, isLost: boolean) => {
    if (isLost) {
      sounds.playHurt();
    } else {
      sounds.playChestOpen();
    }
    onSelectWorld(id);
  };

  const handleDeleteTrigger = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    sounds.playHurt();
    setDeleteConfirmId(id);
  };

  const handleDeleteConfirm = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    sounds.playClick();
    onDeleteWorld(id);
    setDeleteConfirmId(null);
  };

  const handleExport = (e: React.MouseEvent, world: MinecraftWorld) => {
    e.stopPropagation();
    sounds.playLevelUp();
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(world, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `minememory_${world.name.replace(/\s+/g, '_')}_backup.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (err) {
      console.error(err);
    }
  };

  const handleImportClick = () => {
    sounds.playClick();
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result as string);
        if (!parsed.id || !parsed.name || !parsed.mode) {
          throw new Error('Missing key fields (id, name, mode)');
        }
        onImportWorld(parsed as MinecraftWorld);
        setImportSuccess(true);
        setImportError(null);
        sounds.playLevelUp();
        setTimeout(() => setImportSuccess(false), 3000);
      } catch (err: any) {
        sounds.playHurt();
        setImportError(`Invalid JSON format: ${err.message || 'Check file integrity'}`);
        setTimeout(() => setImportError(null), 5000);
      }
    };
    reader.readAsText(file);
    // Reset file input value so same file can be imported again
    e.target.value = '';
  };

  return (
    <div className="relative min-h-screen bg-minecraft-sky flex flex-col justify-between py-8 px-4 font-mono antialiased text-white select-none overflow-hidden">
      
      {/* Minecraft style background clouds & rolling scenery */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-10 left-[8%] w-60 h-14 bg-white/80 border-b-4 border-r-4 border-white/20 shadow-[6px_6px_0_rgba(0,0,0,0.1)]"></div>
        <div className="absolute top-24 right-[12%] w-80 h-16 bg-white/95 border-b-4 border-l-4 border-white/25 shadow-[6px_6px_0_rgba(0,0,0,0.1)]"></div>
        
        {/* Rolling Green Hills at the bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-44 bg-[#4e792c] border-t-8 border-[#3b5d21] opacity-75"></div>
        <div className="absolute bottom-0 left-0 right-0 h-28 bg-[#3b5d21] border-t-8 border-[#294216]"></div>
      </div>
      
      {/* Top Banner Navigation */}
      <div className="w-full max-w-5xl mx-auto flex flex-col gap-6 z-10 px-2 lg:px-0">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <button
            onClick={() => { sounds.playClick(); onBack(); }}
            className="mc-button flex items-center gap-2 "
          >
            <ArrowLeft className="w-4 h-4" /> BACK
          </button>
          
          <h2 className="font-pressstart text-lg sm:text-2xl text-center text-mc-gold drop-shadow-[2px_2px_0_#000000]">
            SELECT WORLD
          </h2>

          <button
            onClick={() => { sounds.playClick(); onCreateNewWorld(); }}
            className="mc-button mc-button-green flex items-center gap-2"
          >
            <PlusIcon /> CREATE WORLD
          </button>
        </div>

        {/* Global Toolbar and Search Input */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-black/40 p-4 border-2 border-zinc-500/80">
          <div className="md:col-span-6 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search world name, seed, or version..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-zinc-950 border-2 border-zinc-600 text-sm font-pressstart text-white placeholder-zinc-500 focus:outline-none focus:border-yellow-400 text-[10px]"
            />
          </div>

          <div className="md:col-span-6 flex gap-2 justify-end">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json"
              className="hidden"
            />
            <button
              onClick={handleImportClick}
              className="mc-button text-[9px] flex items-center gap-2 text-zinc-300 hover:text-white"
              title="Import World from Backup JSON file"
            >
              <Upload className="w-3 h-3 text-mc-green" /> IMPORT JSON
            </button>
            <div className="text-xs self-center">
              {importSuccess && <span className="text-mc-green animate-pulse font-pressstart text-[8px]">★ SUCCESS!</span>}
              {importError && <span className="text-mc-red font-pressstart text-[8px]">⚠ FAIL!</span>}
            </div>
          </div>
        </div>
      </div>

      {/* World Items list scroll view container */}
      <div className="flex-1 w-full max-w-5xl mx-auto my-6 overflow-y-auto max-h-[60vh] bg-black/50 border-4 border-[#8e8e8e] p-4 space-y-4 z-10 relative shadow-2xl backdrop-blur-xs">
        {filteredWorlds.length === 0 ? (
          <div className="py-16 text-center space-y-4">
            <p className="font-pressstart text-sm text-zinc-400">--- NO WORLDS DETECTED ---</p>
            <p className="text-sm text-zinc-500 max-w-sm mx-auto">Create a brand-new survival/hardcore folder, or import a previously exported .json deck file above!</p>
            <button
              onClick={() => { sounds.playClick(); onCreateNewWorld(); }}
              className="mc-button text-[10px]"
            >
              GENERATE AWESOME WORLD
            </button>
          </div>
        ) : (
          filteredWorlds.map((world) => {
            const isHardcore = world.mode === 'hardcore';
            const logCount = world.logs?.length || 0;
            const coordCount = world.coordinates?.length || 0;
            const projectCount = world.projects?.length || 0;

            return (
              <div
                key={world.id}
                onClick={() => handleSelect(world.id, world.isLost)}
                className={`relative group flex flex-col md:flex-row items-start md:items-center justify-between p-4 border-4 transition-all cursor-pointer ${
                  world.isLost
                    ? 'bg-red-950/20 border-red-900/60 hover:bg-red-950/40'
                    : isHardcore
                      ? 'bg-zinc-900/90 border-[#ff5555]/40 hover:border-[#ff5555] hover:bg-zinc-850/90'
                      : 'bg-[#2b251f]/95 border-[#55ff55]/30 hover:border-[#55ff55] hover:bg-[#342c23]/95'
                }`}
              >
                {/* World Left Block Flag & Mode Representation */}
                <div className="flex gap-4 items-start md:items-center w-full md:w-auto">
                  
                  {/* Icon Slot Block */}
                  <div className={`mc-slot p-1 shrink-0 ${world.isLost ? 'opacity-50' : ''}`}>
                    <div className="w-14 h-14 flex flex-col items-center justify-center mc-slot-inner relative">
                      {world.isLost ? (
                        <Skull className="w-8 h-8 text-mc-red" />
                      ) : isHardcore ? (
                        <div className="text-center">
                          <Skull className="w-6 h-6 text-red-500" />
                          <span className="font-pressstart text-[7px] text-zinc-300">HC</span>
                        </div>
                      ) : (
                        <div className="text-center">
                          <span className="font-pressstart text-xl text-[#55ff55]">⚓</span>
                          <span className="block font-pressstart text-[7px] text-zinc-400 mt-0.5">SURV</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Core Title and version detail */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-pressstart text-sm sm:text-base text-white tracking-wide group-hover:text-yellow-400 truncate">
                        {world.name}
                      </h3>
                      {world.isLost && (
                        <span className="font-pressstart text-[8px] px-2 py-0.5 bg-red-800 text-white animate-pulse border border-red-500">
                          DEAD / LOST
                        </span>
                      )}
                      {!world.isLost && isHardcore && (
                        <span className="font-pressstart text-[8px] px-1.5 py-0.5 bg-red-950 text-red-400 border border-red-600">
                          HARDCORE
                        </span>
                      )}
                    </div>

                    <div className="mt-2 text-xs text-zinc-400 space-y-0.5 font-mono">
                      <div>
                        <span className="text-zinc-500">Seed:</span> <span className="text-zinc-300 font-mono text-[11px] bg-black/30 px-1">{world.seed}</span> | <span className="text-zinc-500">Ver:</span> <span className="text-zinc-300">{world.version}</span>
                      </div>
                      <div className="text-[11px] text-zinc-500 italic">
                        Created: {new Date(world.startDate).toLocaleDateString()}
                      </div>
                      {isHardcore && !world.isLost && (
                        <div className="text-mc-red text-[11px] font-bold">
                          ☠ Survived: {world.hardcoreExtras?.daysSurvived || 0} Minecraft Days
                        </div>
                      )}
                      {world.isLost && (
                        <div className="text-red-500 text-[11px] line-through">
                          Survived {world.hardcoreExtras?.daysSurvived || 0} Days before demise
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Status metrics bar with active counts */}
                <div className="mt-4 md:mt-0 flex flex-row sm:flex-col md:flex-row items-center justify-between md:justify-end gap-3 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-zinc-700/60">
                  <div className="flex gap-2 text-xs font-mono">
                    <span className="bg-zinc-950/60 px-2 py-1 border border-zinc-700 rounded-none text-zinc-300" title="Session Logs">
                      🗒 {logCount} Logs
                    </span>
                    <span className="bg-zinc-950/60 px-2 py-1 border border-zinc-700 rounded-none text-zinc-300" title="Saved Coordinates">
                      📍 {coordCount} Coords
                    </span>
                    <span className="bg-zinc-950/60 px-2 py-1 border border-zinc-700 rounded-none text-zinc-300" title="Active Projects">
                      🧱 {projectCount} Builds
                    </span>
                  </div>

                  {/* Actions bar */}
                  <div className="flex gap-2 relative">
                    {deleteConfirmId === world.id ? (
                      <div className="flex items-center gap-1 z-20">
                        <button
                          onClick={(e) => handleDeleteConfirm(e, world.id)}
                          className="mc-button mc-button-red py-1 px-2.5 text-[8px]"
                        >
                          CONFIRM?
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); sounds.playClick(); setDeleteConfirmId(null); }}
                          className="mc-button py-1 px-2 text-[8px]"
                        >
                          X
                        </button>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={(e) => handleExport(e, world)}
                          className="p-2 bg-zinc-800 border border-zinc-650 hover:bg-zinc-700 text-zinc-300 hover:text-white"
                          title="Export World state as JSON backup"
                        >
                          <Download className="w-3.5 h-3.5 text-mc-gold" />
                        </button>
                        <button
                          onClick={(e) => handleDeleteTrigger(e, world.id)}
                          className="p-2 bg-red-950/40 border border-red-900/60 hover:bg-red-900 hover:text-white text-red-400"
                          title="Delete World Permanently"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <div className="mc-button mc-button-green p-1 px-2.5 text-[9px] flex items-center gap-1">
                          <Play className="w-3 h-3 fill-current text-[#ffffa0]" /> ENTER
                        </div>
                      </>
                    )}
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* Footer system status */}
      <div className="w-full max-w-5xl mx-auto flex flex-col items-center text-xs text-zinc-200 font-mono p-3 bg-black/45 border-2 border-[#533d26] px-4 font-bold tracking-wider z-10 gap-2">
        <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-2">
          <div>Worlds folder location: HTML5 Local Deck space</div>
          <div className="text-yellow-400">Select any active node card above to spawn UI panels.</div>
        </div>
        <div className="text-center text-zinc-500 font-mono text-[9px] tracking-wide mt-1.5 border-t border-[#533d26]/45 pt-2 w-full uppercase">
          NOT AN OFFICIAL MINECRAFT PRODUCT, AND NOT APPROVED BY OR ASSOCIATED WITH MOJANG OR MICROSOFT
        </div>
      </div>
    </div>
  );
}

function PlusIcon() {
  return (
    <svg className="w-4 h-4 text-[#ffffa0]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
  );
}
