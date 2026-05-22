import React, { useState } from 'react';
import { Incident, IncidentCause } from '../types';
import { sounds } from '../utils/audio';
import { ShieldAlert, Plus, Trash2, Calendar, Skull, AlertCircle } from 'lucide-react';

interface IncidentLogsProps {
  incidents: Incident[];
  onAddIncident: (incident: Omit<Incident, 'id'>) => void;
  onDeleteIncident: (id: string) => void;
  isReadOnly?: boolean;
}

export default function IncidentLogs({
  incidents,
  onAddIncident,
  onDeleteIncident,
  isReadOnly = false
}: IncidentLogsProps) {
  const [showForm, setShowForm] = useState(false);

  // Form
  const [cause, setCause] = useState<IncidentCause>('Creeper');
  const [coordinates, setCoordinates] = useState('');
  const [itemsLost, setItemsLost] = useState('');
  const [lessonLearned, setLessonLearned] = useState('');
  const [recoveryStatus, setRecoveryStatus] = useState<Incident['recoveryStatus']>('Still Restoring');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playHurt(); // Classic oof sound on submitting a disaster!
    onAddIncident({
      cause,
      coordinates: coordinates.trim() || 'Uncertain Coordinates',
      itemsLost: itemsLost.trim() || 'None',
      lessonLearned: lessonLearned.trim() || 'Keep shield in offhand!',
      recoveryStatus,
      date: new Date().toISOString().split('T')[0]
    });

    setCoordinates('');
    setItemsLost('');
    setLessonLearned('');
    setRecoveryStatus('Still Restoring');
    setShowForm(false);
  };

  const getCauseColor = (c: IncidentCause) => {
    switch (c) {
      case 'Lava': return 'text-orange-500 font-bold';
      case 'Creeper': return 'text-[#55ff55] font-bold';
      case 'Void': return 'text-purple-400 font-bold';
      case 'Pet Lost': return 'text-amber-400 font-bold';
      default: return 'text-red-500 font-bold';
    }
  };

  const getCauseEmoji = (c: IncidentCause) => {
    switch (c) {
      case 'Lava': return '🔥';
      case 'Creeper': return '💣';
      case 'Fall Damage': return '🧗';
      case 'Void': return '🌌';
      case 'Pet Lost': return '🐕';
      case 'Raid': return '📯';
      default: return '💀';
    }
  };

  return (
    <div className="space-y-6 select-none font-mono text-white">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-zinc-700 pb-4">
        <div>
          <h2 className="font-pressstart text-base sm:text-xl text-mc-red flex items-center gap-3">
            ☠ INCIDENT & DEATH ARCHIVE
          </h2>
          <p className="text-xs text-zinc-400 mt-1 uppercase">
            Keep track of creeper blasts, lava slips, lost pets, and lessons learned to spawn-proof your bases
          </p>
        </div>

        {!isReadOnly && (
          <button
            onClick={() => { sounds.playHurt(); setShowForm(!showForm); }}
            className="mc-button mc-button-red flex items-center gap-2 self-start"
          >
            <Plus className="w-4 h-4 text-white" />
            {showForm ? 'CLOSE REPORTS' : 'REPORT ACCIDENT (OOF!)'}
          </button>
        )}
      </div>

      {showForm ? (
        /* Red styled warning popup */
        <div className="bg-red-950/20 border-4 border-red-900/80 p-6 mc-gui-panel-dark max-w-md mx-auto">
          <div className="text-center border-b border-red-900/60 pb-3 mb-4">
            <h3 className="font-pressstart text-xs text-mc-red uppercase">FILE CASUALTY REPORT</h3>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            
            <div>
              <label className="block text-zinc-300 mb-1 font-pressstart text-[9px] uppercase">Casualty Cause:</label>
              <select
                value={cause}
                onChange={(e) => setCause(e.target.value as IncidentCause)}
                className="w-full bg-zinc-950 border-2 border-red-950 p-2 font-mono text-xs text-white focus:outline-none h-[38px]"
              >
                <option value="Creeper">💣 Creeper Explosion</option>
                <option value="Lava">🔥 Lava Swim / Fire Burn</option>
                <option value="Fall Damage">🧗 Fall from Scaffold/Chasm</option>
                <option value="Void">🌌 Falling to the Void</option>
                <option value="Drowning">🫧 Drowning underwater</option>
                <option value="Wither/Ender Dragon">🐉 Major Boss Slain</option>
                <option value="Pet Lost">🐕 Wolf/Cat Tamed casualty</option>
                <option value="Raid">📯 Bad Omen Raid Massacre</option>
                <option value="Other">💀 Other Tragic mishap</option>
              </select>
            </div>

            <div>
              <label className="block text-zinc-300 mb-1 font-pressstart text-[9px] uppercase">Disaster Coordinates:</label>
              <input
                type="text"
                required
                placeholder="e.g. X: -100, Y: 12, Z: 512"
                value={coordinates}
                onChange={(e) => setCoordinates(e.target.value)}
                className="w-full bg-zinc-950 border-2 border-red-950 p-2 font-mono text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-zinc-300 mb-1 font-pressstart text-[9px] uppercase">Gears & Blocks Lost:</label>
              <input
                type="text"
                placeholder="e.g. Diamond shovel, stack of copper wire"
                value={itemsLost}
                onChange={(e) => setItemsLost(e.target.value)}
                className="w-full bg-zinc-950 border-2 border-red-950 p-2 font-mono text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-zinc-300 mb-1 font-pressstart text-[9px] uppercase">Lesson Learned / Preventions:</label>
              <textarea
                required
                rows={2}
                placeholder="Spawn-proof base with lanterns. Carry water bucket in slot 2!"
                value={lessonLearned}
                onChange={(e) => setLessonLearned(e.target.value)}
                className="w-full bg-zinc-950 border-2 border-red-950 p-2 font-mono text-xs text-white resize-none"
              />
            </div>

            <div>
              <label className="block text-zinc-300 mb-1 font-pressstart text-[9px] uppercase">Current Recovery Status:</label>
              <select
                value={recoveryStatus}
                onChange={(e) => setRecoveryStatus(e.target.value as any)}
                className="w-full bg-zinc-950 border-2 border-red-950 p-2 font-mono text-xs text-white h-[38px]"
              >
                <option value="Fully Recovered">Fully Recovered (Rebuilt gears)</option>
                <option value="Still Restoring">Still Restoring (Hunting iron ore)</option>
                <option value="Major Loss">Major Loss (Tragic gear downgrade)</option>
                <option value="Permanent Setback">Permanent Setback (Pet buried)</option>
              </select>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="mc-button mc-button-red py-2 px-6"
              >
                💀 FILE INCIDENT (OOF!)
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Disasters Timeline layout list */
        <div className="space-y-4">
          {incidents.length === 0 ? (
            <div className="bg-zinc-950/40 border-4 border-dashed border-red-950 py-16 text-center text-zinc-650">
              <ShieldAlert className="w-10 h-10 mx-auto opacity-35 mb-3" />
              <p className="font-pressstart text-[9px] text-[#ff5555] mb-2">--- ZERO DEATHS / CASUALTIES ---\n(So Far!)</p>
              <p className="text-sm">Incredible! No major creepers, lava, or falls documented. Keep up the high level vigilance.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {incidents.map((inc) => {
                return (
                  <div
                    key={inc.id}
                    className="bg-[#1e1111]/80 border-2 border-red-900 p-4 relative overflow-hidden group hover:bg-[#2e1a1a]/80 transition-colors"
                  >
                    
                    {/* Corner splash cause background icon */}
                    <div className="absolute -top-3 -right-3 text-7xl font-mono opacity-5 group-hover:opacity-10 pointer-events-none transition-opacity">
                      {getCauseEmoji(inc.cause)}
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-red-950 pb-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl shrink-0">{getCauseEmoji(inc.cause)}</span>
                        <h4 className={`font-pressstart text-[11px] uppercase ${getCauseColor(inc.cause)}`}>
                          {inc.cause} incident
                        </h4>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-zinc-500 font-mono">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{inc.date}</span>
                        <span>|</span>
                        {!isReadOnly && (
                          <button
                            onClick={() => {
                              sounds.playHurt();
                              if (confirm(`Purge this disaster report?`)) {
                                onDeleteIncident(inc.id);
                              }
                            }}
                            className="text-zinc-500 hover:text-red-500 transition"
                            title="Erase log"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Report grids */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
                      
                      {/* Coordinates, lost blocks item */}
                      <div className="space-y-1">
                        <div>
                          <span className="text-zinc-500 uppercase text-[10px]">Locus Coords:</span>
                          <p className="text-yellow-400 font-bold">{inc.coordinates}</p>
                        </div>
                        <div className="pt-1.5">
                          <span className="text-zinc-500 uppercase text-[10px]">Shattered Gear / Lost Blocks:</span>
                          <p className="text-zinc-300 line-clamp-2 italic">“{inc.itemsLost}”</p>
                        </div>
                      </div>

                      {/* Lesson checklist */}
                      <div className="bg-black/30 p-2.5 border border-red-955 self-center">
                        <span className="block text-red-400 font-bold mb-1 text-[11px] uppercase">🏹 ARCHIVAL PREVENTION NOTE:</span>
                        <p className="text-zinc-300 italic text-[11px] leading-relaxed">
                          “{inc.lessonLearned}”
                        </p>
                      </div>

                      {/* Status metrics progress details */}
                      <div className="flex flex-col justify-center items-start sm:items-end">
                        <span className="text-zinc-500 uppercase text-[10px] text-right">Casualty Impact:</span>
                        <div className="mt-1 px-2.5 py-1 bg-zinc-950 border border-red-950 text-[#ff5555] font-pressstart text-[8px] uppercase tracking-wider">
                          {inc.recoveryStatus}
                        </div>
                      </div>

                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

    </div>
  );
}
