import React, { useState } from 'react';
import { Inspiration, MinecraftWorld } from '../types';
import { sounds } from '../utils/audio';
import { Sparkles, Plus, Trash2, Search, Link, Github, Youtube } from 'lucide-react';

interface InspirationVaultProps {
  inspirations: Inspiration[];
  onAddInspiration: (insp: Omit<Inspiration, 'id'>) => void;
  onDeleteInspiration: (id: string) => void;
}

export default function InspirationVault({
  inspirations,
  onAddInspiration,
  onDeleteInspiration
}: InspirationVaultProps) {
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');

  // Form
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [category, setCategory] = useState<Inspiration['category']>('Build');
  const [tagsInput, setTagsInput] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !link.trim()) {
      sounds.playHurt();
      alert("Inspiration item needs both a Title and a Web Link!");
      return;
    }

    sounds.playLevelUp();
    const parseTags = (str: string) => str.split(',').map(s => s.trim()).filter(Boolean);

    onAddInspiration({
      title: title.trim(),
      link: link.trim(),
      category,
      tags: parseTags(tagsInput),
      notes: notes.trim()
    });

    // Reset Form
    setTitle('');
    setLink('');
    setTagsInput('');
    setNotes('');
    setShowForm(false);
  };

  const filtered = inspirations.filter(ins =>
    ins.title.toLowerCase().includes(search.toLowerCase()) ||
    ins.notes.toLowerCase().includes(search.toLowerCase()) ||
    ins.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6 select-none font-mono text-white">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-zinc-700 pb-4">
        <div>
          <h2 className="font-pressstart text-base sm:text-xl text-mc-gold flex items-center gap-3">
            ✨ INSPIRATION ARCHIVE
          </h2>
          <p className="text-xs text-zinc-400 mt-1 uppercase">
            Store YouTube farm tutorials, base decorations, redstone schematics, and quick tips
          </p>
        </div>

        <button
          onClick={() => { sounds.playClick(); setShowForm(!showForm); }}
          className="mc-button mc-button-green flex items-center gap-2 self-start"
        >
          <Plus className="w-4 h-4 text-[#ffffa0]" />
          {showForm ? 'CLOSE VAULT' : 'BOOKMARK IDEA'}
        </button>
      </div>

      {showForm ? (
        /* Form styled as custom panel */
        <div className="bg-zinc-900 border-4 border-zinc-700 p-6 mc-gui-panel max-w-md mx-auto">
          <div className="text-center border-b border-zinc-700 pb-3 mb-4">
            <h3 className="font-pressstart text-xs text-mc-gold uppercase">BOOKMARK SCHEMATIC IDEA</h3>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-zinc-400 mb-1 font-pressstart text-[9px] uppercase">Idea / Tutorial Title:</label>
              <input
                type="text"
                required
                placeholder="e.g. Mumbo Jumbo Compact Item Sorter"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-zinc-950 border-2 border-zinc-650 p-2 font-mono text-xs text-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-zinc-400 mb-1 font-pressstart text-[9px] uppercase">Web link / URL:</label>
                <input
                  type="text"
                  required
                  placeholder="https://youtube.com/..."
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  className="w-full bg-zinc-950 border-2 border-zinc-650 p-2 font-mono text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-pressstart text-[9px] uppercase">Concept Category:</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full bg-zinc-950 border-2 border-zinc-650 p-2 font-mono text-xs text-white h-[38px]"
                >
                  <option value="Build">🎨 Aesthetic Build</option>
                  <option value="Farm">⚙ Piston Farm / Grinder</option>
                  <option value="Redstone">⚡ Complex Redstone logic</option>
                  <option value="Survival Hack">🏹 Pro Survival Tips</option>
                  <option value="Other">⚓ Other concept</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-zinc-400 mb-1 font-pressstart text-[9px] uppercase">Tags (comma separated):</label>
              <input
                type="text"
                placeholder="e.g. storage, iron, compact"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="w-full bg-zinc-950 border-2 border-zinc-650 p-2 font-mono text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-zinc-400 mb-1 font-pressstart text-[9px] uppercase">Memo Notes / Blueprints:</label>
              <textarea
                rows={2}
                placeholder="Obsidian block triggers filter hopper at Y-52..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-zinc-950 border-2 border-zinc-650 p-2.5 font-mono text-xs text-white resize-none"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="mc-button mc-button-green py-2 px-6"
              >
                💾 STORAGE CHRONICLE
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Rendered bookmarked details grid */
        <div className="space-y-4">
          
          {/* Search bar */}
          <div className="bg-black/40 border-2 border-zinc-700 p-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Search ideas, blueprints, categories, or tags..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 bg-zinc-950 border border-zinc-600 text-xs placeholder-zinc-500 text-white focus:outline-none focus:border-yellow-400 font-pressstart text-[9px]"
              />
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="bg-zinc-900/40 border-4 border-dashed border-zinc-700 py-16 text-center text-zinc-500">
              <Sparkles className="w-10 h-10 mx-auto opacity-30 mb-3" />
              <p className="font-pressstart text-[9px] text-zinc-400 mb-2">--- ARCHIVE FEEDS EMPTY ---</p>
              <p className="text-sm">Store links to YouTube tutorials or build pictures to speed up complex block designs.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filtered.map((ins) => {
                return (
                  <div
                    key={ins.id}
                    className="bg-[#241d16] border-2 border-zinc-750 p-4 flex flex-col justify-between hover:border-[#ffffa0] transition-colors"
                  >
                    <div>
                      <div className="flex justify-between items-start border-b border-zinc-800 pb-2 mb-2">
                        <span className="font-pressstart text-[7px] text-[#ffff55] bg-black/40 px-2 py-0.5 border border-zinc-700">
                          {ins.category}
                        </span>

                        <button
                          onClick={() => {
                            sounds.playHurt();
                            if (confirm(`Purge bookmark "${ins.title}"?`)) {
                              onDeleteInspiration(ins.id);
                            }
                          }}
                          className="text-zinc-500 hover:text-red-400 transition ml-2"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <h4 className="font-bold text-sm tracking-wide text-zinc-200">
                        {ins.title}
                      </h4>

                      {ins.notes && (
                        <p className="mt-2 text-xs text-zinc-400 font-mono italic">
                          💡 Notes: “{ins.notes}”
                        </p>
                      )}
                    </div>

                    <div className="mt-4 pt-2.5 border-t border-zinc-805/60 flex flex-wrap gap-2 items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {ins.tags.map((tag, i) => (
                          <span key={i} className="text-[#55ff55] font-mono text-[10px] bg-[#55ff55]/5 px-1 bg-black/30">
                            #{tag}
                          </span>
                        ))}
                      </div>

                      <a
                        href={ins.link.startsWith('http') ? ins.link : `https://${ins.link}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs text-[#ffffa0] font-pressstart text-[8px] hover:underline bg-[#7c7c7c]/10 border border-[#7c7c7c]/30 px-2.5 py-1 hover:bg-[#7c7c7c]/20"
                        onClick={() => sounds.playClick()}
                      >
                        <Youtube className="w-3.5 h-3.5 text-mc-red" /> LAUNCH LINK
                      </a>
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
