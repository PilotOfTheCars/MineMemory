import React, { useState } from 'react';
import { Coordinate, Dimension, CoordCategory } from '../types';
import { sounds } from '../utils/audio';
import { MapPin, Plus, Search, Pin, ShieldAlert, Compass, Copy, Check, Trash2 } from 'lucide-react';

interface CoordinateVaultProps {
  coordinates: Coordinate[];
  onAddCoord: (coord: Omit<Coordinate, 'id'>) => void;
  onDeleteCoord: (id: string) => void;
  onTogglePin: (id: string) => void;
  isReadOnly?: boolean;
}

export default function CoordinateVault({
  coordinates,
  onAddCoord,
  onDeleteCoord,
  onTogglePin,
  isReadOnly = false
}: CoordinateVaultProps) {
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [filterDim, setFilterDim] = useState<Dimension | 'All'>('All');
  const [filterCat, setFilterCat] = useState<CoordCategory | 'All'>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [x, setX] = useState<number | ''>('');
  const [y, setY] = useState<number | ''>('');
  const [z, setZ] = useState<number | ''>('');
  const [dimension, setDimension] = useState<Dimension>('Overworld');
  const [category, setCategory] = useState<CoordCategory>('Base');
  const [notes, setNotes] = useState('');
  const [dangerLevel, setDangerLevel] = useState<Coordinate['dangerLevel']>('Low');
  const [isPinned, setIsPinned] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || x === '' || y === '' || z === '') {
      sounds.playHurt();
      alert("Please provide landmark name and spatial XYZ values!");
      return;
    }

    sounds.playXPDing();
    onAddCoord({
      name: name.trim(),
      x: Number(x),
      y: Number(y),
      z: Number(z),
      dimension,
      category,
      notes: notes.trim(),
      dangerLevel,
      isPinned
    });

    // Reset Form
    setName('');
    setX('');
    setY('');
    setZ('');
    setNotes('');
    setDangerLevel('Low');
    setIsPinned(false);
    setShowForm(false);
  };

  const handleCopy = (coord: Coordinate) => {
    sounds.playClick();
    const textToCopy = `/execute in minecraft:${coord.dimension.toLowerCase().replace(' ', '_')} run tp @s ${coord.x} ${coord.y} ${coord.z}`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopiedId(coord.id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const filtered = coordinates.filter(co => {
    const matchesSearch = co.name.toLowerCase().includes(search.toLowerCase()) || co.notes.toLowerCase().includes(search.toLowerCase());
    const matchesDim = filterDim === 'All' || co.dimension === filterDim;
    const matchesCat = filterCat === 'All' || co.category === filterCat;
    return matchesSearch && matchesDim && matchesCat;
  });

  return (
    <div className="space-y-6 select-none font-mono text-white">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-zinc-700 pb-4">
        <div>
          <h2 className="font-pressstart text-base sm:text-lg text-mc-gold flex items-center gap-3">
            📍 COORDINATE COMPASS
          </h2>
          <p className="text-xs text-zinc-400 mt-1 uppercase">
            Map spawner dungeons, base beacons, and key structural dimensions
          </p>
        </div>

        {!isReadOnly && (
          <button
            onClick={() => { sounds.playClick(); setShowForm(!showForm); }}
            className="mc-button mc-button-green flex items-center gap-2 self-start"
          >
            <Plus className="w-4 h-4 text-[#ffffa0]" />
            {showForm ? 'CLOSE FORM' : 'ADD LANDMARK'}
          </button>
        )}
      </div>

      {showForm ? (
          /* Form styled as classic GUI popup */
          <div className="bg-zinc-900 border-4 border-zinc-700 p-6 mc-gui-panel max-w-xl mx-auto">
            <div className="text-center border-b border-zinc-700 pb-3 mb-4">
              <h3 className="font-pressstart text-xs text-mc-gold uppercase">LOG NEW LOCATION</h3>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                <div className="sm:col-span-3">
                  <label className="block text-zinc-400 mb-1 font-pressstart text-[9px] uppercase">Landmark Label:</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Slime Chunk Spawner Room"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-zinc-950 border-2 border-zinc-650 p-2 font-mono text-xs text-white"
                  />
                </div>

                {/* XYZ Coordinates */}
                <div>
                  <label className="block text-zinc-400 mb-1 font-pressstart text-[9px] uppercase">X Coordination (Width):</label>
                  <input
                    type="number"
                    required
                    placeholder="120"
                    value={x}
                    onChange={(e) => setX(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-zinc-950 border-2 border-zinc-650 p-2 font-mono text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1 font-pressstart text-[9px] uppercase">Y Coordination (Height):</label>
                  <input
                    type="number"
                    required
                    placeholder="-58"
                    value={y}
                    onChange={(e) => setY(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-zinc-950 border-2 border-zinc-650 p-2 font-mono text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1 font-pressstart text-[9px] uppercase">Z Coordination (Depth):</label>
                  <input
                    type="number"
                    required
                    placeholder="-1340"
                    value={z}
                    onChange={(e) => setZ(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-zinc-950 border-2 border-zinc-650 p-2 font-mono text-xs text-white"
                  />
                </div>

                {/* Dimension */}
                <div>
                  <label className="block text-zinc-400 mb-1 font-pressstart text-[9px] uppercase">Dimension Realm:</label>
                  <select
                    value={dimension}
                    onChange={(e) => setDimension(e.target.value as Dimension)}
                    className="w-full bg-zinc-950 border-2 border-zinc-650 p-2 font-mono text-xs text-white h-[38px]"
                  >
                    <option value="Overworld">🌲 Overworld</option>
                    <option value="Nether">🔥 Nether</option>
                    <option value="The End">🌌 The End</option>
                  </select>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-zinc-400 mb-1 font-pressstart text-[9px] uppercase">Type Tag:</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as CoordCategory)}
                    className="w-full bg-zinc-950 border-2 border-zinc-650 p-2 font-mono text-xs text-white h-[38px]"
                  >
                    <option value="Base">🏠 Base</option>
                    <option value="Village">🌾 Village</option>
                    <option value="Portal">🌀 Portal</option>
                    <option value="Mine">⛏ Mine</option>
                    <option value="Structure">🏛 Structure</option>
                    <option value="Farm">⚙ Farm</option>
                    <option value="Danger Zone">☠ Danger Zone</option>
                    <option value="Scenic">🏞 Scenic</option>
                    <option value="Other">⚓ Other</option>
                  </select>
                </div>

                {/* Danger */}
                <div>
                  <label className="block text-zinc-400 mb-1 font-pressstart text-[9px] uppercase">Threat Risk Level:</label>
                  <select
                    value={dangerLevel}
                    onChange={(e) => setDangerLevel(e.target.value as any)}
                    className="w-full bg-zinc-950 border-2 border-zinc-650 p-2 font-mono text-xs text-white h-[38px]"
                  >
                    <option value="Low">Low Risk</option>
                    <option value="Medium">Medium</option>
                    <option value="High">⚠️ High Threat</option>
                    <option value="Extreme">☠ EXTREME DANGER</option>
                  </select>
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-zinc-400 mb-1 font-pressstart text-[9px] uppercase">Beacon Notes / Details:</label>
                  <input
                    type="text"
                    placeholder="Need diamond shovel to extract blocks, creeper active trap door"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-zinc-950 border-2 border-zinc-650 p-2 font-mono text-xs text-white"
                  />
                </div>

                <div className="sm:col-span-3 flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="dash-pin"
                    checked={isPinned}
                    onChange={(e) => setIsPinned(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 focus:ring-0"
                  />
                  <label htmlFor="dash-pin" className="text-zinc-300 font-pressstart text-[9px]">
                    PIN TO MAIN DASHBOARD BEACON PANEL
                  </label>
                </div>

              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="mc-button mc-button-green py-2 px-6"
                >
                  ⚓ LOG COORDINATES
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Coordinates search & render grids */
          <div className="space-y-4">
            
            {/* Filtering bar, search */}
            <div className="bg-black/40 border-2 border-zinc-700 p-4 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="sm:col-span-2 relative">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
                  <input
                    type="text"
                    placeholder="Search landmarks or keys..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-1.5 bg-zinc-950 border border-zinc-600 text-xs placeholder-zinc-500 text-white focus:outline-none focus:border-yellow-400 font-pressstart text-[9px]"
                  />
                </div>

                {/* Dim selector */}
                <div>
                  <select
                    value={filterDim}
                    onChange={(e) => setFilterDim(e.target.value as any)}
                    className="w-full bg-zinc-950 border border-zinc-600 p-1.5 text-xs text-white focus:outline-none"
                  >
                    <option value="All">🌌 ALL REALMS</option>
                    <option value="Overworld">🌲 Overworld</option>
                    <option value="Nether">🔥 Nether</option>
                    <option value="The End">🌌 The End</option>
                  </select>
                </div>

                {/* Cat selector */}
                <div>
                  <select
                    value={filterCat}
                    onChange={(e) => setFilterCat(e.target.value as any)}
                    className="w-full bg-zinc-950 border border-zinc-600 p-1.5 text-xs text-white focus:outline-none"
                  >
                    <option value="All">📦 ALL CATEGORIES</option>
                    <option value="Base">🏠 Base</option>
                    <option value="Village">🌾 Village</option>
                    <option value="Portal">🌀 Portal</option>
                    <option value="Mine">⛏ Mine</option>
                    <option value="Structure">🏛 Structure</option>
                    <option value="Farm">⚙ Farm</option>
                    <option value="Danger Zone">☠ Danger Zone</option>
                    <option value="Scenic">🏞 Scenic</option>
                    <option value="Other">⚓ Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Records grid */}
            {filtered.length === 0 ? (
              <div className="bg-zinc-900/40 border-4 border-dashed border-zinc-700 py-16 text-center text-zinc-500">
                <Compass className="w-10 h-10 mx-auto opacity-30 animate-spin mb-3" style={{ animationDuration: '6s' }} />
                <p className="font-pressstart text-[9px] text-zinc-400 mb-2">--- COLD RADAR FEED ---</p>
                <p className="text-sm">No locations match your filter. Tap "ADD LANDMARK" above to map your realm coords!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filtered.map((co) => {
                  const getDimBadgeStyle = (dim: Dimension) => {
                    switch (dim) {
                      case 'Nether':
                        return 'bg-red-950 text-red-400 border border-red-800';
                      case 'The End':
                        return 'bg-purple-950 text-purple-400 border border-purple-800';
                      default:
                        return 'bg-emerald-950 text-emerald-400 border border-emerald-800';
                    }
                  };

                  const getDangerStyle = (level: string) => {
                    switch (level) {
                      case 'Extreme':
                        return 'text-red-500 border border-red-600 animate-pulse bg-red-950/20 px-1 font-bold';
                      case 'High':
                        return 'text-amber-500 font-bold';
                      case 'Medium':
                        return 'text-yellow-400';
                      default:
                        return 'text-zinc-400';
                    }
                  };

                  return (
                    <div
                      key={co.id}
                      className={`p-4 border-2 flex flex-col justify-between hover:scale-[1.01] transition-transform ${
                        co.dangerLevel === 'Extreme'
                          ? 'bg-zinc-950/90 border-red-600/70 shadow-[0_0_8px_rgba(239,68,68,0.2)]'
                          : co.dimension === 'Nether'
                            ? 'bg-[#1b1111]/90 border-red-950'
                            : co.dimension === 'The End'
                              ? 'bg-[#13111b]/90 border-purple-950'
                              : 'bg-zinc-900/90 border-zinc-750'
                      }`}
                    >
                      <div>
                        {/* Badge head */}
                        <div className="flex justify-between items-start gap-2 border-b border-zinc-800 pb-2 mb-2">
                          <div>
                            <span className={`px-2 py-0.5 font-pressstart text-[7px] ${getDimBadgeStyle(co.dimension)}`}>
                              {co.dimension}
                            </span>
                            <span className="ml-1 px-1.5 py-0.5 text-[10px] bg-zinc-850 border border-zinc-700 text-zinc-300">
                              {co.category}
                            </span>
                          </div>
                          
                          <div className="flex gap-1.5 items-center">
                            {isReadOnly ? (
                              co.isPinned && <Pin className="w-3.5 h-3.5 text-mc-gold fill-current" />
                            ) : (
                              <>
                                <button
                                  onClick={() => { sounds.playClick(); onTogglePin(co.id); }}
                                  className={`p-1 hover:text-white transition ${co.isPinned ? 'text-mc-gold' : 'text-zinc-650'}`}
                                  title={co.isPinned ? "Unpin coordinate from dashboard" : "Pin coordinate to dashboard"}
                                >
                                  <Pin className={`w-3.5 h-3.5 ${co.isPinned ? 'fill-current' : ''}`} />
                                </button>
                                <button
                                  onClick={() => {
                                    sounds.playHurt();
                                    if (confirm(`Delete the coordinate landmark "${co.name}"?`)) {
                                      onDeleteCoord(co.id);
                                    }
                                  }}
                                  className="p-1 text-zinc-550 hover:text-red-400 transition"
                                  title="Purge coordinate entry"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </>
                            )}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-pressstart text-[11px] leading-relaxed text-zinc-100 mt-1">
                            {co.name}
                          </h4>
                        </div>

                        {/* Notes */}
                        {co.notes && (
                          <p className="mt-2 text-xs text-zinc-400 leading-normal italic line-clamp-2">
                            “{co.notes}”
                          </p>
                        )}
                      </div>

                      {/* XYZ row with copy tp tool */}
                      <div className="mt-4 pt-2 border-t border-zinc-800/60 flex items-center justify-between">
                        <div className="font-pressstart text-[10px] text-mc-yellow flex items-center gap-1.5">
                          <span className="text-zinc-500">X:</span>{co.x}
                          <span className="text-zinc-500">Y:</span>{co.y}
                          <span className="text-zinc-500">Z:</span>{co.z}
                        </div>

                        <div className="flex items-center gap-3">
                          <span className={`text-[10px] font-mono ${getDangerStyle(co.dangerLevel)}`}>
                            Danger: {co.dangerLevel}
                          </span>

                          <button
                            onClick={() => handleCopy(co)}
                            className="flex items-center gap-1 bg-zinc-800 hover:bg-zinc-700 px-2 py-0.5 border border-zinc-600 text-[10px]"
                            title="Copy Minecraft teleport command to Clipboard"
                          >
                            {copiedId === co.id ? (
                              <>
                                <Check className="w-3 h-3 text-mc-green" />
                                <span className="text-mc-green font-bold">COPIED!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3 text-zinc-400" />
                                <span>TELEPORT CMD</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}

          </div>
        )
      }

    </div>
  );
}
