import React, { useState } from 'react';
import { Goal, GoalType } from '../types';
import { sounds } from '../utils/audio';
import { Award, Plus, Trash2, CheckCircle, Crosshair, Search, ShieldCheck } from 'lucide-react';

interface GoalBoardProps {
  goals: Goal[];
  onAddGoal: (goal: Omit<Goal, 'id'>) => void;
  onDeleteGoal: (id: string) => void;
  onToggleGoal: (id: string) => void;
  isReadOnly?: boolean;
}

export default function GoalBoard({
  goals,
  onAddGoal,
  onDeleteGoal,
  onToggleGoal,
  isReadOnly = false
}: GoalBoardProps) {
  const [showForm, setShowForm] = useState(false);
  const [filterType, setFilterType] = useState<GoalType | 'All'>('All');

  // Form
  const [text, setText] = useState('');
  const [type, setType] = useState<GoalType>('Long-Term');
  const [priority, setPriority] = useState<Goal['priority']>('Medium');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) {
      sounds.playHurt();
      alert("Advancement text cannot be empty!");
      return;
    }

    sounds.playXPDing();
    onAddGoal({
      text: text.trim(),
      type,
      priority,
      notes: notes.trim(),
      isCompleted: false
    });

    setText('');
    setNotes('');
    setShowForm(false);
  };

  const handleToggle = (goal: Goal) => {
    if (!goal.isCompleted) {
      sounds.playLevelUp(); // Level up chime on completion! Satisfying!
    } else {
      sounds.playClick();
    }
    onToggleGoal(goal.id);
  };

  const filteredGoals = goals.filter(g => filterType === 'All' || g.type === filterType);

  return (
    <div className="space-y-6 select-none font-mono text-white">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-zinc-700 pb-4">
        <div>
          <h2 className="font-pressstart text-base sm:text-xl text-mc-gold flex items-center gap-3">
            🏆 ADVANCEMENTS BOARD
          </h2>
          <p className="text-xs text-zinc-400 mt-1 uppercase">
            Unlock combat, exploration, and building achievements. Completing goals rewards digital chime logs!
          </p>
        </div>

        {!isReadOnly && (
          <button
            onClick={() => { sounds.playClick(); setShowForm(!showForm); }}
            className="mc-button mc-button-green flex items-center gap-2 self-start"
          >
            <Plus className="w-4 h-4 text-[#ffffa0]" />
            {showForm ? 'CLOSE TARGETS' : 'DECLARE ADVANCEMENT'}
          </button>
        )}
      </div>

      {showForm ? (
        /* Form styled as advancement pop */
        <div className="bg-zinc-900 border-4 border-zinc-700 p-6 mc-gui-panel max-w-sm mx-auto">
          <div className="text-center border-b border-zinc-700 pb-3 mb-4">
            <h3 className="font-pressstart text-xs text-mc-gold uppercase">NEW ADVANCEMENT GOAL</h3>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-zinc-400 mb-1 font-pressstart text-[9px] uppercase">Advancement Quest:</label>
              <input
                type="text"
                required
                placeholder="e.g. Build an auto pumpkin harvester"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full bg-zinc-950 border-2 border-zinc-650 p-2 font-mono text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-zinc-400 mb-1 font-pressstart text-[9px] uppercase">Advancement Group:</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as GoalType)}
                className="w-full bg-zinc-950 border-2 border-zinc-650 p-2 font-mono text-xs text-white h-[38px]"
              >
                <option value="Long-Term">🏆 Long-Term Quest</option>
                <option value="Daily">⏰ Daily Target</option>
                <option value="Exploration">🧭 Spatial Discovery</option>
                <option value="Combat">⚔ Combat / Slayer</option>
                <option value="Farming">🌾 Farming Resource</option>
                <option value="Advancement">✨ Epic achievement</option>
              </select>
            </div>

            <div>
              <label className="block text-zinc-400 mb-1 font-pressstart text-[9px] uppercase">Goal Priority:</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full bg-zinc-950 border-2 border-zinc-650 p-2 font-mono text-xs text-white h-[38px]"
              >
                <option value="Low font-bold">Standard</option>
                <option value="Medium font-bold">Medium Priority</option>
                <option value="High font-bold">🔴 High Stakes</option>
              </select>
            </div>

            <div>
              <label className="block text-zinc-400 mb-1 font-pressstart text-[9px] uppercase">Detailed Strategy:</label>
              <input
                type="text"
                placeholder="Needs redstone repeaters & observation rows"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-zinc-950 border-2 border-zinc-650 p-2 font-mono text-xs text-white"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="mc-button mc-button-green py-2 px-6"
              >
                🏆 LOG TARGET
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Progress dashboard list split */
        <div className="space-y-4">
          
          {/* Group filtering header */}
          <div className="flex gap-2 p-1 bg-black/50 border-2 border-zinc-700 overflow-x-auto justify-start sm:justify-center">
            {['All', 'Daily', 'Long-Term', 'Exploration', 'Combat', 'Farming', 'Advancement'].map((gType) => (
              <button
                key={gType}
                onClick={() => { sounds.playClick(); setFilterType(gType as any); }}
                className={`py-1.5 px-3 border-2 font-mono text-xs whitespace-nowrap ${
                  filterType === gType
                    ? 'bg-[#7c7c7c] border-[#ffffa0] text-[#ffffa0] font-bold'
                    : 'border-transparent text-zinc-400 hover:text-white hover:border-zinc-700'
                }`}
              >
                {gType === 'All' ? '🌌 ALL GOALS' : gType.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Goals catalog layout map */}
          {filteredGoals.length === 0 ? (
            <div className="bg-zinc-900/40 border-4 border-dashed border-zinc-700 py-16 text-center text-zinc-500">
              <Award className="w-10 h-10 mx-auto opacity-30 mb-3" />
              <p className="font-pressstart text-[9px] text-zinc-400 mb-2">--- COLD STATS FEED ---</p>
              <p className="text-sm">No recorded milestoneslogged under this group section. Unpack some targets above!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredGoals.map((go) => {
                return (
                  <div
                    key={go.id}
                    onClick={() => !isReadOnly && handleToggle(go)}
                    className={`p-4 border-4 flex items-start gap-4 transition-transform duration-100 ${
                      isReadOnly
                        ? 'cursor-default'
                        : 'cursor-pointer hover:scale-[1.01]'
                    } ${
                      go.isCompleted
                        ? 'bg-zinc-950/90 border-[#55ff55]/70 shadow-[0_0_10px_rgba(85,255,85,0.1)]'
                        : 'bg-[#211a12]/95 border-amber-900/40 hover:border-zinc-500'
                    }`}
                  >
                    {/* Retro icon indicator */}
                    <div className={`mc-slot shrink-0 p-1`}>
                      <div className={`w-10 h-10 flex items-center justify-center mc-slot-inner ${go.isCompleted ? 'bg-emerald-950' : ''}`}>
                        {go.isCompleted ? (
                          <ShieldCheck className="w-6 h-6 text-mc-green" />
                        ) : (
                          <div className="w-3.5 h-3.5 border-2 border-dashed border-zinc-650 rounded-full animate-spin" style={{ animationDuration: '8s' }}></div>
                        )}
                      </div>
                    </div>

                    {/* Meta values info text */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 border-b border-zinc-800/60 pb-1 mr-1">
                        <span className="font-pressstart text-[8px] text-mc-gold uppercase">
                          {go.type}
                        </span>
                        
                        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                          {!isReadOnly && (
                            <button
                              onClick={() => {
                                sounds.playHurt();
                                if (confirm(`Delete the achievement quest "${go.text}"?`)) {
                                  onDeleteGoal(go.id);
                                }
                              }}
                              className="text-zinc-650 hover:text-red-400 transition"
                              title="Purge advancement"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      <h4 className={`text-sm tracking-wide font-semibold ${
                        go.isCompleted ? 'text-mc-green line-through opacity-80' : 'text-zinc-100'
                      }`}>
                        {go.text}
                      </h4>

                      {go.notes && (
                        <p className="text-[11px] text-zinc-400 mt-1 italic leading-tight">
                          Strategy: {go.notes}
                        </p>
                      )}

                      <div className="mt-2.5 flex items-center gap-2">
                        {go.isCompleted ? (
                          <span className="text-mc-green font-pressstart text-[7px] uppercase tracking-wide bg-emerald-950/20 px-1.5 py-0.5 border border-emerald-900/40">
                            UNLOCKED
                          </span>
                        ) : (
                          <span className="text-zinc-500 font-pressstart text-[7px] uppercase tracking-wide bg-zinc-950 px-1.5 py-0.5 border border-zinc-850">
                            IN PROGRESS
                          </span>
                        )}
                        <span className="text-zinc-650 text-xs">|</span>
                        <span className="text-zinc-400 text-[11px] uppercase tracking-wider">
                          Priority: {go.priority}
                        </span>
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
