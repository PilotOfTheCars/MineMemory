import React, { useState } from 'react';
import { SessionLog } from '../types';
import { sounds } from '../utils/audio';
import { BookOpen, Plus, Calendar, Clock, Award, Trash2, ChevronLeft, ChevronRight, Heart, HeartOff, Sparkles } from 'lucide-react';

interface SessionLogsPageProps {
  logs: SessionLog[];
  onAddLog: (log: Omit<SessionLog, 'id'>) => void;
  onDeleteLog: (id: string) => void;
  isReadOnly?: boolean;
}

export default function SessionLogsPage({ logs, onAddLog, onDeleteLog, isReadOnly = false }: SessionLogsPageProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [activePageIndex, setActivePageIndex] = useState(0);

  // Form states
  const [title, setTitle] = useState('');
  const [realDate, setRealDate] = useState(new Date().toISOString().split('T')[0]);
  const [minecraftDay, setMinecraftDay] = useState(1);
  const [sessionType, setSessionType] = useState<SessionLog['sessionType']>('Adventure');
  const [whatHappened, setWhatHappened] = useState('');
  const [lootGainedInput, setLootGainedInput] = useState('');
  const [itemsLostInput, setItemsLostInput] = useState('');
  const [coordsInput, setCoordsInput] = useState('');
  const [nextGoals, setNextGoals] = useState('');
  const [moodRating, setMoodRating] = useState(5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !whatHappened.trim()) {
      sounds.playHurt();
      alert("Please fill in log title and what happened!");
      return;
    }

    sounds.playLevelUp();
    
    // Parse tags by comma
    const parseTags = (str: string) => str.split(',').map(s => s.trim()).filter(Boolean);

    onAddLog({
      title: title.trim(),
      realDate,
      minecraftDay: Number(minecraftDay) || 1,
      sessionType,
      whatHappened: whatHappened.trim(),
      lootGained: parseTags(lootGainedInput),
      itemsLost: parseTags(itemsLostInput),
      coordinatesVisited: parseTags(coordsInput),
      nextGoals: nextGoals.trim(),
      moodRating
    });

    // Reset Form
    setTitle('');
    setMinecraftDay(minecraftDay + 1); // Auto increment day on submit handy!
    setWhatHappened('');
    setLootGainedInput('');
    setItemsLostInput('');
    setCoordsInput('');
    setNextGoals('');
    setMoodRating(5);
    setShowAddForm(false);
    setActivePageIndex(0); // View latest log
  };

  const handlePageNext = () => {
    if (activePageIndex < logs.length - 1) {
      sounds.playChestClose();
      setActivePageIndex(activePageIndex + 1);
    }
  };

  const handlePagePrev = () => {
    if (activePageIndex > 0) {
      sounds.playChestClose();
      setActivePageIndex(activePageIndex - 1);
    }
  };

  const currentLog = logs[activePageIndex];

  return (
    <div className="space-y-6 select-none font-mono text-white">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-zinc-700 pb-4">
        <div>
          <h2 className="font-pressstart text-base sm:text-xl text-mc-gold flex items-center gap-3">
            🗒 SURVIVAL JOURNAL
          </h2>
          <p className="text-xs text-zinc-400 mt-1 uppercase">
            Documenting historic steps, blocky spoils, and hard lessons in the wild
          </p>
        </div>

        {!isReadOnly && (
          <button
            onClick={() => { sounds.playClick(); setShowAddForm(!showAddForm); }}
            className="mc-button mc-button-green flex items-center gap-2 self-start"
          >
            <Plus className="w-4 h-4 text-[#ffffa0]" /> 
            {showAddForm ? 'VIEW ENTRIES' : 'WRITE NEW ENTRY'}
          </button>
        )}
      </div>

      {showAddForm ? (
        /* Journal Form Panel styled after classic Crafting Layout */
        <div className="bg-zinc-900 border-4 border-zinc-700 p-6 mc-gui-panel max-w-2xl mx-auto">
          <div className="text-center border-b border-zinc-700 pb-3 mb-4">
            <h3 className="font-pressstart text-xs text-mc-gold uppercase">WRITE IN JOURNAL</h3>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-zinc-400 mb-1 font-pressstart text-[9px] uppercase">Session Title:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Slaying the Wither, Found Slimes"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-zinc-950 border-2 border-zinc-600 p-2 font-mono text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-yellow-400"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-pressstart text-[9px] uppercase">Session Type:</label>
                <select
                  value={sessionType}
                  onChange={(e) => setSessionType(e.target.value as any)}
                  className="w-full bg-zinc-950 border-2 border-zinc-600 p-2 font-mono text-xs text-white focus:outline-none focus:border-yellow-400 h-[38px]"
                >
                  <option value="Adventure">⚔ ADVENTURE</option>
                  <option value="Building">🧱 BUILDING</option>
                  <option value="Mining">⛏ MINING</option>
                  <option value="Farming">🌾 FARMING</option>
                  <option value="Boss Fight">🐉 BOSS FIGHT</option>
                  <option value="Redstone">⚙ REDSTONE</option>
                  <option value="Other">⚓ OTHER</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-pressstart text-[9px] uppercase">Minecraft Day Count:</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={minecraftDay}
                  onChange={(e) => setMinecraftDay(Number(e.target.value))}
                  className="w-full bg-zinc-950 border-2 border-zinc-600 p-2 font-mono text-xs text-white focus:outline-none focus:border-yellow-400"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-pressstart text-[9px] uppercase">Real Date:</label>
                <input
                  type="date"
                  required
                  value={realDate}
                  onChange={(e) => setRealDate(e.target.value)}
                  className="w-full bg-zinc-950 border-2 border-zinc-600 p-2 font-mono text-xs text-white focus:outline-none focus:border-yellow-400 h-[38px]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-zinc-400 mb-1 font-pressstart text-[9px] uppercase">Detailed Chronology:</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Today I traveled north across a birch biome..."
                  value={whatHappened}
                  onChange={(e) => setWhatHappened(e.target.value)}
                  className="w-full bg-zinc-950 border-2 border-zinc-600 p-2.5 font-mono text-xs text-white focus:outline-none focus:border-yellow-400 placeholder-zinc-700 h-28 resize-none"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-pressstart text-[9px] uppercase">What Loot Gained (comma separation):</label>
                <input
                  type="text"
                  placeholder="3 diamonds, 12 lapis, ender pearl"
                  value={lootGainedInput}
                  onChange={(e) => setLootGainedInput(e.target.value)}
                  className="w-full bg-zinc-950 border-2 border-zinc-600 p-2 font-mono text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-pressstart text-[9px] uppercase">What Items Lost (comma separation):</label>
                <input
                  type="text"
                  placeholder="iron pants, bow, water bucket"
                  value={itemsLostInput}
                  onChange={(e) => setItemsLostInput(e.target.value)}
                  className="w-full bg-zinc-950 border-2 border-zinc-600 p-2 font-mono text-xs text-white focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-zinc-400 mb-1 font-pressstart text-[9px] uppercase">Coordinates Visited (comma separation):</label>
                <input
                  type="text"
                  placeholder="Nether fortress (X: 100, Z: -20), Desert Temple"
                  value={coordsInput}
                  onChange={(e) => setCoordsInput(e.target.value)}
                  className="w-full bg-zinc-950 border-2 border-zinc-600 p-2 font-mono text-xs text-white focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-zinc-400 mb-1 font-pressstart text-[9px] uppercase">Next Session Immediate Goals:</label>
                <input
                  type="text"
                  placeholder="Collect sand for stained glass windows"
                  value={nextGoals}
                  onChange={(e) => setNextGoals(e.target.value)}
                  className="w-full bg-zinc-950 border-2 border-zinc-600 p-2 font-mono text-xs text-white focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2 flex items-center justify-between bg-black/30 p-3 border border-zinc-700">
                <span className="font-pressstart text-[9px] text-[#ffff55] uppercase">Survival Session Mood:</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => { sounds.playXPDing(); setMoodRating(idx); }}
                      className="p-1 focus:outline-none focus:scale-115 transition"
                    >
                      <Heart
                        className={`w-6 h-6 ${
                          idx <= moodRating ? 'text-mc-red fill-current' : 'text-zinc-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="mc-button mc-button-green py-2 px-6"
              >
                💾 SEAL DIARY PAGE
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Double Page Book Style Reader */
        <div className="w-full max-w-4xl mx-auto">
          {logs.length === 0 ? (
            <div className="bg-zinc-900/50 border-4 border-dashed border-zinc-700 p-12 text-center rounded-none space-y-4">
              <BookOpen className="w-12 h-12 mx-auto text-zinc-500" />
              <h4 className="font-pressstart text-xs text-zinc-400 uppercase">--- The Spine is Empty ---</h4>
              <p className="text-sm text-zinc-500">You haven't added any session logs to this world folder yet. Open the Quill above to chronicle day 1!</p>
              <button
                onClick={() => { sounds.playClick(); setShowAddForm(true); }}
                className="mc-button text-[10px]"
              >
                WRITE FIRST PAGE
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              
              {/* Parchment Book Layout Container */}
              <div className="mc-book-paper grid grid-cols-1 md:grid-cols-2 p-6 md:p-8 min-h-[460px] relative font-vt text-zinc-800 shadow-2xl skew-y-[0.5deg]">
                
                {/* Center binding crease visual decoration pointer */}
                <div className="hidden md:block absolute top-0 bottom-0 left-1/2 w-0.5 bg-[#8b7959]/40 border-l border-[#ffffff]/25 shadow-md"></div>

                {/* Left Page: Narrative block */}
                <div className="pr-0 md:pr-6 flex flex-col justify-between pb-6 md:pb-0 h-full">
                  <div>
                    {/* Header meta info */}
                    <div className="flex justify-between items-center text-xs tracking-wider border-b border-[#a89574] pb-1.5 font-bold">
                      <span className="text-mc-gold text-[#aa3300] uppercase font-bold font-mono">
                        Day {currentLog.minecraftDay}
                      </span>
                      <span className="text-zinc-600 font-mono text-xs">
                        {currentLog.realDate}
                      </span>
                    </div>

                    <h3 className="font-pressstart text-xs leading-5 mt-4 text-[#4a3419] tracking-normal">
                      {currentLog.title}
                    </h3>

                    <div className="mt-2 text-xs uppercase bg-[#8b7959]/10 px-2 py-0.5 font-bold border border-[#8b7959]/20 inline-block text-[#5c4013]">
                      Type: {currentLog.sessionType}
                    </div>

                    <p className="mt-4 text-sm leading-relaxed text-[#3a2c1d] first-letter:text-xl font-medium first-letter:font-pressstart first-letter:mr-1">
                      {currentLog.whatHappened}
                    </p>
                  </div>

                  <div className="text-[11px] font-bold text-[#8b7959]/80 font-mono">
                    Page {activePageIndex * 2 + 1}
                  </div>
                </div>

                {/* Right Page: Details, Loot, Coords, Goals, Delete button */}
                <div className="pl-0 md:pl-6 flex flex-col justify-between pt-6 md:pt-0 border-t md:border-t-0 border-[#a89574] md:border-none">
                  <div className="space-y-4 text-xs">
                    
                    {/* Loot Lists */}
                    <div className="grid grid-cols-2 gap-2 text-[12px]">
                      
                      {/* Gained Box */}
                      <div className="bg-[#dacba9] p-2.5 border border-[#c4b18c]">
                        <span className="font-bold text-[#1f5f0b] block mb-1">☘ LOOTED:</span>
                        {currentLog.lootGained.length === 0 ? (
                          <span className="text-[#8c7a5d] italic">Nonelogged</span>
                        ) : (
                          <div className="flex flex-wrap gap-1">
                            {currentLog.lootGained.map((loot, i) => (
                              <span key={i} className="bg-[#1f5f0b]/10 text-[#1f5f0b] px-1 py-0.5 font-mono text-[10px] break-all">
                                {loot}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Lost Box */}
                      <div className="bg-[#dacba9] p-2.5 border border-[#c4b18c]">
                        <span className="font-bold text-[#961e12] block mb-1">☠ LOST:</span>
                        {currentLog.itemsLost.length === 0 ? (
                          <span className="text-[#8c7a5d] italic">Nonelogged</span>
                        ) : (
                          <div className="flex flex-wrap gap-1">
                            {currentLog.itemsLost.map((lost, i) => (
                              <span key={i} className="bg-[#961e12]/10 text-[#961e12] px-1 py-0.5 font-mono text-[10px] break-all">
                                {lost}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                    </div>

                    {/* Visited Coords */}
                    <div className="bg-[#dacba9] p-2 border border-[#c4b18c] text-[11px]">
                      <span className="font-bold text-[#4c3924] block mb-0.5">📍 VISITED LANDMARKS:</span>
                      {currentLog.coordinatesVisited.length === 0 ? (
                        <span className="text-[#8c7a5d] italic">No spatial references</span>
                      ) : (
                        <span className="font-mono text-[#3a2c1d]">
                          {currentLog.coordinatesVisited.join(' • ')}
                        </span>
                      )}
                    </div>

                    {/* Next goals block */}
                    {currentLog.nextGoals && (
                      <div className="p-2 bg-[#ecdcb9]/80 border border-t-2 border-[#a89574]">
                        <span className="font-bold text-mc-red text-red-800 block mb-0.5">🏹 IMMEDIATE ADVANCEMENT TARGET:</span>
                        <p className="italic text-[#4a3419] font-medium leading-tight">
                          “{currentLog.nextGoals}”
                        </p>
                      </div>
                    )}

                    {/* Hearts Rating and delete */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-[#4c3924]">MOOD:</span>
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Heart
                              key={i}
                              className={`w-4 h-4 ${
                                i < currentLog.moodRating ? 'text-mc-red fill-current' : 'text-[#c4b18c]'
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      {!isReadOnly && (
                        <button
                          onClick={() => {
                            sounds.playHurt();
                            if (confirm("Delete this journal page forever? It will degrade your archive score.")) {
                              onDeleteLog(currentLog.id);
                              setActivePageIndex(0);
                            }
                          }}
                          className="text-red-800 hover:text-red-600 flex items-center gap-1 font-bold text-[10px]"
                          title="Tear page out of Journal"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> TEAR PAGE
                        </button>
                      )}
                    </div>

                  </div>

                  <div className="flex justify-between items-center text-[11px] font-bold text-[#8b7959]/80 mt-4 border-t border-[#a89574]/30 pt-1.5 font-mono">
                    <span className="italic">MineMemory Book V1</span>
                    <span>Page {activePageIndex * 2 + 2}</span>
                  </div>
                </div>

              </div>

              {/* Book Navigation turners */}
              <div className="flex items-center justify-between bg-black/40 p-3 border-2 border-zinc-500/80">
                <button
                  disabled={activePageIndex === 0}
                  onClick={handlePagePrev}
                  className="mc-button text-[9px] flex items-center gap-1.5"
                >
                  <ChevronLeft className="w-4 h-4" /> PREV
                </button>

                <div className="text-xs uppercase text-zinc-300 font-pressstart text-[8px]">
                  Log {activePageIndex + 1} of {logs.length} entries
                </div>

                <button
                  disabled={activePageIndex === logs.length - 1}
                  onClick={handlePageNext}
                  className="mc-button text-[9px] flex items-center gap-1.5"
                >
                  NEXT <ChevronRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}
        </div>
      )}

    </div>
  );
}
