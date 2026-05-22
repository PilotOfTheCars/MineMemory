import React from 'react';
import { MinecraftWorld } from '../types';
import { Globe, ExternalLink, RefreshCw, Info } from 'lucide-react';
import { sounds } from '../utils/audio';

interface SeedExplorerProps {
  world: MinecraftWorld;
  onUpdateWorld: (updated: MinecraftWorld) => void;
  isReadOnly?: boolean;
}

export default function SeedExplorer({ world, onUpdateWorld, isReadOnly = false }: SeedExplorerProps) {
  const iframeRef = React.useRef<HTMLIFrameElement>(null);
  const targetUrl = "https://mcseedmap.net/";

  const handleReload = () => {
    sounds.playClick();
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
    }
  };

  return (
    <div className="space-y-4 font-mono select-none" id="seed-explorer-container">
      {/* Visual Header / Browser Bar mimic */}
      <div className="bg-[#1b1c20] border-4 border-zinc-800 rounded-none shadow-xl flex flex-col" id="seed-explorer-header">
        
        {/* Top pseudo browser frame header */}
        <div className="bg-[#141518] px-4 py-2 flex items-center justify-between border-b border-zinc-800 text-xs">
          <div className="flex items-center gap-2 font-pressstart text-[9px] text-mc-gold uppercase tracking-wider">
            <Globe className="w-4 h-4 text-mc-gold animate-spin" style={{ animationDuration: '6s' }} />
            <span>MCSEEDMAP.NET EMBEDDED SYSTEM</span>
          </div>
          <div className="flex items-center gap-2 font-mono text-zinc-500 text-[10px]">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>LIVE CONNECTIVITY</span>
          </div>
        </div>

        {/* Browser address bar */}
        <div className="p-3 bg-black/40 flex flex-col md:flex-row items-center gap-3">
          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">ADDRESS:</span>
          <div className="flex-1 w-full bg-[#15171a] border border-zinc-700 font-mono text-zinc-300 text-xs px-3 py-1.5 overflow-x-auto whitespace-nowrap select-all">
            {targetUrl}
          </div>
          <div className="flex gap-2 w-full md:w-auto justify-end">
            <button
              onClick={handleReload}
              className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-600 text-[10px] font-bold uppercase flex items-center justify-center gap-1.5 transition"
              title="Reload Frame"
              id="reload-frame-button"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              RELOAD
            </button>
            <a
              href={targetUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => sounds.playLevelUp()}
              className="px-3 py-1.5 bg-[#4a722b] hover:bg-[#5e9237] border-2 border-[#aeff55] text-white text-[10px] font-bold uppercase flex items-center justify-center gap-1.5 transition whitespace-nowrap"
              id="open-external-button"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              OPEN SITE
            </a>
          </div>
        </div>
      </div>

      {/* Helpful Hint banner */}
      <div className="bg-zinc-950/40 border border-zinc-800 p-3 flex gap-2.5 items-start text-xs text-zinc-400">
        <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          The <span className="text-white font-semibold">mcseedmap.net</span> interface is loaded live below. If the map fails to display or loads blankly inside the container, use the <span className="text-sky-300 font-semibold">"OPEN SITE"</span> trigger above to open it in a standalone browser window.
        </p>
      </div>

      {/* Embedded Site Frame */}
      <div className="bg-[#121316] border-4 border-zinc-800 relative shadow-2xl overflow-hidden" id="iframe-wrapper">
        <iframe
          ref={iframeRef}
          src={targetUrl}
          className="w-full h-[650px] bg-zinc-900 border-0"
          title="MC Seed Map Embed Frame"
          allow="fullscreen"
          referrerPolicy="no-referrer"
          id="mcseedmap-iframe"
        />
      </div>

      {/* Attribution notice */}
      <div className="text-center font-mono text-[10px] text-zinc-500 uppercase tracking-wide py-1">
        Embedded seed map functionality powered by mcseedmap.net. All rights belong to their respective owners.
      </div>
    </div>
  );
}
