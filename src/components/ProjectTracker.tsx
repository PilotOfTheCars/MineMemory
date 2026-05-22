import React, { useState } from 'react';
import { Project, ProjectChecklistItem, Coordinate } from '../types';
import { sounds } from '../utils/audio';
import { Hammer, Plus, Layers, CheckSquare, Square, Trash2, Link, Edit, ChevronDown, ChevronUp, Check } from 'lucide-react';

interface ProjectTrackerProps {
  projects: Project[];
  coordinates: Coordinate[];
  onAddProject: (project: Omit<Project, 'id' | 'progress'>) => void;
  onDeleteProject: (id: string) => void;
  onUpdateProjectChecklist: (projectId: string, checklist: ProjectChecklistItem[]) => void;
  isReadOnly?: boolean;
}

export default function ProjectTracker({
  projects,
  coordinates,
  onAddProject,
  onDeleteProject,
  onUpdateProjectChecklist,
  isReadOnly = false
}: ProjectTrackerProps) {
  const [showForm, setShowForm] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Form
  const [name, setName] = useState('');
  const [priority, setPriority] = useState<Project['priority']>('Medium');
  const [description, setDescription] = useState('');
  const [matsInput, setMatsInput] = useState('');
  const [checklistInput, setChecklistInput] = useState('');
  const [selectedCoord, setSelectedCoord] = useState('');
  const [inspInput, setInspInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      sounds.playHurt();
      alert("Please give this mega-build a name!");
      return;
    }

    sounds.playLevelUp();

    const parseTags = (str: string) => str.split(',').map(s => s.trim()).filter(Boolean);
    const parseChecklist = (str: string): ProjectChecklistItem[] => 
      str.split(',').map((s, idx) => ({
        id: `chk-${Date.now()}-${idx}`,
        text: s.trim(),
        done: false
      })).filter(item => item.text.length > 0);

    onAddProject({
      name: name.trim(),
      status: 'Planned',
      priority,
      description: description.trim(),
      materialsNeeded: parseTags(matsInput),
      checklist: parseChecklist(checklistInput),
      linkedCoords: selectedCoord ? [selectedCoord] : [],
      inspirationLinks: parseTags(inspInput)
    });

    // Reset Form
    setName('');
    setDescription('');
    setMatsInput('');
    setChecklistInput('');
    setSelectedCoord('');
    setInspInput('');
    setShowForm(false);
  };

  const toggleChecklistItem = (project: Project, itemId: string) => {
    sounds.playClick();
    const updatedChecklist = project.checklist.map(item => 
      item.id === itemId ? { ...item, done: !item.done } : item
    );
    onUpdateProjectChecklist(project.id, updatedChecklist);
  };

  const getProgressColor = (percent: number) => {
    if (percent === 100) return 'bg-[#55ff55]';
    if (percent > 50) return 'bg-[#ffff55]';
    return 'bg-[#ff5555]';
  };

  return (
    <div className="space-y-6 select-none font-mono text-white">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-zinc-700 pb-4">
        <div>
          <h2 className="font-pressstart text-base sm:text-xl text-mc-gold flex items-center gap-3">
            🧱 BUILD PLANNER
          </h2>
          <p className="text-xs text-zinc-400 mt-1 uppercase">
            Map out colossal castles, diamond vaults, and iron farms with piece-by-piece checklists
          </p>
        </div>

        {!isReadOnly && (
          <button
            onClick={() => { sounds.playClick(); setShowForm(!showForm); }}
            className="mc-button mc-button-green flex items-center gap-2 self-start"
          >
            <Plus className="w-4 h-4 text-[#ffffa0]" />
            {showForm ? 'CLOSE BLUEPRINTS' : 'DRAFT BUILD'}
          </button>
        )}
      </div>

      {showForm ? (
        /* Form styled as grid board */
        <div className="bg-zinc-900 border-4 border-zinc-700 p-6 mc-gui-panel max-w-2xl mx-auto">
          <div className="text-center border-b border-zinc-700 pb-3 mb-4">
            <h3 className="font-pressstart text-xs text-mc-gold uppercase">DRAFT ARCHITECTURAL PROJECT</h3>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div>
                <label className="block text-zinc-400 mb-1 font-pressstart text-[9px] uppercase">Project Title:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Iron Golem Splasher Trap"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-zinc-950 border-2 border-zinc-650 p-2 font-mono text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-pressstart text-[9px] uppercase">Project Priority:</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full bg-zinc-950 border-2 border-zinc-650 p-2 font-mono text-xs text-white h-[38px]"
                >
                  <option value="Low">Low priority</option>
                  <option value="Medium">Medium</option>
                  <option value="High">🔴 Critical Main Task</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-zinc-400 mb-1 font-pressstart text-[9px] uppercase">Layout Goal / Description:</label>
                <textarea
                  rows={2}
                  placeholder="This project will construct a 3-layer platform above deep sea reefs..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-zinc-950 border-2 border-zinc-650 p-2 font-mono text-xs text-white resize-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-zinc-400 mb-1 font-pressstart text-[9px] uppercase">Materials Needed (comma separated):</label>
                <input
                  type="text"
                  placeholder="e.g. 10 pistons, 5 stacks obsidian, 1 lever, observer blocks"
                  value={matsInput}
                  onChange={(e) => setMatsInput(e.target.value)}
                  className="w-full bg-zinc-950 border-2 border-zinc-650 p-2 font-mono text-xs text-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-zinc-400 mb-2 font-pressstart text-[9px] uppercase text-[#ffff55]">Checklist Tasks / Milestones (comma separated):</label>
                <textarea
                  rows={2}
                  placeholder="Clear lava lakes, Erect iron fences, Piston wiring setup, Test spawner rates"
                  value={checklistInput}
                  onChange={(e) => setChecklistInput(e.target.value)}
                  className="w-full bg-zinc-950 border-2 border-zinc-650 p-2 font-mono text-xs text-white resize-none"
                />
                <span className="text-[10px] text-zinc-500 italic">Separate each task check of your blueprint with commas.</span>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-pressstart text-[9px] uppercase">Link Landmark Landmark:</label>
                <select
                  value={selectedCoord}
                  onChange={(e) => setSelectedCoord(e.target.value)}
                  className="w-full bg-zinc-950 border-2 border-zinc-650 p-2 font-mono text-xs text-white h-[38px]"
                >
                  <option value="">No linked landmark</option>
                  {coordinates.map(co => (
                    <option key={co.id} value={co.id}>{co.name} (X:{co.x}, Z:{co.z})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-pressstart text-[9px] uppercase">Inspiration Links (comma separated):</label>
                <input
                  type="text"
                  placeholder="e.g. youtube.com/123, reddit.com/build"
                  value={inspInput}
                  onChange={(e) => setInspInput(e.target.value)}
                  className="w-full bg-zinc-950 border-2 border-zinc-650 p-2 font-mono text-xs text-white"
                />
              </div>

            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="mc-button mc-button-green py-2.5 px-6"
              >
                🧱 LOG BLUEPRINT
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* List with expanded content checkmark lists */
        <div className="space-y-4">
          {projects.length === 0 ? (
            <div className="bg-zinc-900/40 border-4 border-dashed border-zinc-700 py-16 text-center text-zinc-500">
              <Hammer className="w-10 h-10 mx-auto opacity-30 animate-pulse mb-3" />
              <p className="font-pressstart text-[9px] text-zinc-400 mb-2">--- NO PLOTTED STRUCTURES ---</p>
              <p className="text-sm">You haven't planned any major builds. Click "DRAFT BUILD" to plan and track your next megalith.</p>
            </div>
          ) : (
            projects.map((proj) => {
              const isExpanded = expandedId === proj.id;
              
              const totalItems = proj.checklist.length;
              const completedItems = proj.checklist.filter(item => item.done).length;
              const calculatedProgress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

              return (
                <div
                  key={proj.id}
                  className="bg-zinc-900/90 border-2 border-zinc-750 overflow-hidden"
                >
                  {/* Header row click to expand */}
                  <div
                    onClick={() => { sounds.playClick(); setExpandedId(isExpanded ? null : proj.id); }}
                    className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer hover:bg-zinc-850 transition"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-pressstart text-[11px] sm:text-[12px] text-zinc-100 truncate">
                          {proj.name}
                        </h4>
                        <span className={`text-[9px] px-1.5 py-0.5 border ${
                          proj.priority === 'High' 
                            ? 'bg-red-950/40 text-red-400 border-red-900/40' 
                            : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                        }`}>
                          {proj.priority} priority
                        </span>
                        
                        {calculatedProgress === 100 ? (
                          <span className="text-mc-green font-pressstart text-[8px] animate-pulse">★ COMPLETE</span>
                        ) : (
                          <span className="text-zinc-500 text-xs">{proj.status}</span>
                        )}
                      </div>
                      
                      {proj.description && (
                        <p className="mt-1 text-xs text-zinc-400 truncate max-w-xl">
                          {proj.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-4 w-full sm:w-auto self-center justify-between sm:justify-end border-t sm:border-t-0 border-zinc-800 pt-2 sm:pt-0">
                      {/* Progress slider visually represent */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-zinc-400 font-pressstart text-[8px]">
                          PROGRESS:
                        </span>
                        <div className="w-24 h-3 bg-black border border-zinc-700 p-0.5">
                          <div
                            className={`h-full ${getProgressColor(calculatedProgress)} transition-all duration-300`}
                            style={{ width: `${calculatedProgress}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-pressstart text-[9px] text-[#ffff55] w-9 text-right font-bold">
                          {calculatedProgress || proj.progress}%
                        </span>
                      </div>

                      <div className="text-zinc-500 hover:text-white shrink-0">
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </div>
                    </div>
                  </div>

                  {/* Expanded block detailed list */}
                  {isExpanded && (
                    <div className="bg-black/40 border-t border-zinc-800 p-4 space-y-4">
                      
                      {/* Description Expanded */}
                      {proj.description && (
                        <div>
                          <span className="text-xs text-zinc-500 font-pressstart text-[8px] block mb-1">BLUEPRINT BRIEFING:</span>
                          <p className="text-xs text-zinc-300 bg-zinc-950 p-2 border border-zinc-800 leading-relaxed font-mono">
                            {proj.description}
                          </p>
                        </div>
                      )}

                      {/* Checklist Items Split */}
                      <div>
                        <span className="text-xs text-[#ffff55] font-pressstart text-[8px] block mb-2">MILESTONES CHECKLIST:</span>
                        {proj.checklist.length === 0 ? (
                          <p className="text-xs text-zinc-500 italic">No checklist milestoneslogged. Separate tasks with commas when creating.</p>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                             {proj.checklist.map((item) => (
                              <button
                                type="button"
                                key={item.id}
                                disabled={isReadOnly}
                                onClick={() => !isReadOnly && toggleChecklistItem(proj, item.id)}
                                className={`flex items-start gap-2.5 text-left p-1.5 bg-black/20 border border-zinc-800 group ${isReadOnly ? 'cursor-default' : 'hover:bg-black/40'}`}
                              >
                                {item.done ? (
                                  <CheckSquare className="w-4 h-4 text-mc-green fill-current shrink-0 mt-0.5 group-hover:scale-105" />
                                ) : (
                                  <Square className="w-4 h-4 text-zinc-650 shrink-0 mt-0.5 group-hover:scale-105 group-hover:border-zinc-400" />
                                )}
                                <span className={item.done ? 'line-through text-zinc-500 font-mono transition' : 'text-zinc-300 font-mono transition'}>
                                  {item.text}
                                </span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Materials List Box */}
                      <div>
                        <span className="text-xs text-zinc-500 font-pressstart text-[8px] block mb-1.5">MATERIALS SPOILS NEEDED:</span>
                        {proj.materialsNeeded.length === 0 ? (
                          <span className="text-xs text-zinc-500 italic">No specific blocks listed</span>
                        ) : (
                          <div className="flex flex-wrap gap-1.5">
                            {proj.materialsNeeded.map((mat, i) => (
                              <span key={i} className="bg-orange-950/25 border border-orange-900 text-orange-400 px-2 py-0.5 text-[10px] font-pressstart text-[8px] uppercase">
                                🧱 {mat}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Link Coords & Inspiration Web references */}
                      <div className="flex flex-col sm:flex-row justify-between border-t border-zinc-850 pt-3 gap-3">
                        <div className="flex flex-wrap items-center gap-4 text-xs">
                          {proj.linkedCoords.length > 0 && (
                            <div className="flex items-center gap-1.5 text-zinc-400">
                              <Link className="w-3.5 h-3.5 text-mc-gold" />
                              <span className="text-zinc-500">Coordinate Anchor:</span>
                              <span className="text-zinc-300 hover:underline">
                                {coordinates.find(c => c.id === proj.linkedCoords[0])?.name || 'Linked Landmark'}
                              </span>
                            </div>
                          )}

                          {proj.inspirationLinks.length > 0 && (
                            <div className="flex items-center gap-1.5 text-zinc-400">
                              <span className="text-zinc-500">Inspirations:</span>
                              {proj.inspirationLinks.map((link, i) => (
                                <a
                                  key={i}
                                  href={link.startsWith('http') ? link : `https://${link}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[#55ff55] underline hover:text-[#7fdb3a]"
                                >
                                  Ref {i + 1}
                                </a>
                              ))}
                            </div>
                          )}
                        </div>

                        {!isReadOnly && (
                          <button
                            onClick={() => {
                              sounds.playHurt();
                              if (confirm(`Delete the architectural plan "${proj.name}"?`)) {
                                onDeleteProject(proj.id);
                                setExpandedId(null);
                              }
                            }}
                            className="text-red-400 hover:text-red-500 text-[10px] flex items-center justify-end gap-1 font-bold pt-1 uppercase"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Purge Project
                          </button>
                        )}
                      </div>

                    </div>
                  )}

                </div>
              );
            })
          )}
        </div>
      )}

    </div>
  );
}
