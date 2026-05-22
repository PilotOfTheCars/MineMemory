import React, { useState, useEffect } from 'react';
import { MinecraftWorld, Coordinate, SessionLog, Project, Goal, Incident } from '../types';
import { sounds } from '../utils/audio';
import { GoogleGenAI } from '@google/genai';
import { 
  Sparkles, ShieldCheck, Terminal, BookOpen, AlertCircle, Key, 
  RefreshCw, Globe, Flame, Award, Lightbulb, Compass, Award as Shield, FileText
} from 'lucide-react';

interface AiOracleProps {
  world: MinecraftWorld;
  onUpdateWorld: (updated: MinecraftWorld) => void;
  isReadOnly?: boolean;
}

export default function AiOracle({ world, onUpdateWorld, isReadOnly = false }: AiOracleProps) {
  const [activeSubTab, setActiveSubTab] = useState<'lore' | 'newspaper' | 'planner' | 'risk'>('lore');
  
  // Custom API key options
  const [useGeminiApi, setUseGeminiApi] = useState<boolean>(() => {
    return localStorage.getItem('minememory_use_real_gemini') === 'true';
  });
  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem('minememory_gemini_key') || '';
  });
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Cached narratives loaded from the active world (or fallback memory index)
  const [loreOutput, setLoreOutput] = useState<string>('');
  const [newspaperOutput, setNewspaperOutput] = useState<{
    header: string;
    issue: number;
    headline: string;
    editorial: string;
    bulletins: string[];
    ad: string;
  } | null>(null);
  const [plannerOutput, setPlannerOutput] = useState<string[]>([]);
  const [riskOutput, setRiskOutput] = useState<{
    level: 'Low' | 'Medium' | 'High' | 'Extreme';
    color: string;
    advisory: string;
  } | null>(null);

  // Save Settings
  const handleSaveApiKeySettings = (newKey: string, useReal: boolean) => {
    sounds.playClick();
    localStorage.setItem('minememory_gemini_key', newKey);
    localStorage.setItem('minememory_use_real_gemini', useReal ? 'true' : 'false');
    setApiKey(newKey);
    setUseGeminiApi(useReal);
    setShowKeyInput(false);
  };

  // Compile prompt context from actual gameplay entries
  const compileWorldContextForAi = () => {
    const logsText = (world.logs || [])
      .map(l => `- Day ${l.minecraftDay} (${l.sessionType}): ${l.title}. Details: ${l.whatHappened}. Loot gained: ${l.lootGained.join(', ')}`)
      .join('\n');
    
    const coordinatesText = (world.coordinates || [])
      .map(c => `- [${c.dimension}] ${c.name} at (${c.x}, y:${c.y}, ${c.z}). Category: ${c.category}. Risk: ${c.dangerLevel}`)
      .join('\n');

    const goalsText = (world.goals || [])
      .map(g => `- ${g.text} (${g.type}). Priority: ${g.priority}. Completed: ${g.isCompleted}`)
      .join('\n');

    const projectsText = (world.projects || [])
      .map(p => `- Project '${p.name}': ${p.description}. Progress: ${p.progress}%. Priority: ${p.priority}`)
      .join('\n');

    const incidentsText = (world.incidents || [])
      .map(i => `- Incident: Blown/Killed by ${i.cause} at (${i.coordinates}). Loot lost: ${i.itemsLost || 'None'}. Recovery state: ${i.recoveryStatus}`)
      .join('\n');

    return `
=== MINECRAFT WORLD SPECIFICATIONS ===
World Name: ${world.name}
Mode: ${world.mode} (Difficulty: ${world.difficulty})
Seed Value: ${world.seed}
Java Edition Core: ${world.version}

=== GAMEPLAY JOURNAL ===
${logsText || 'No logs entered yet.'}

=== LANDMARK COORDS ===
${coordinatesText || 'No custom beacon markers saved yet.'}

=== ADVANCEMENTS & GOALS ===
${goalsText || 'No targets configured.'}

=== ACTIVE BLUEPRINTS ===
${projectsText || 'No actively registered builds.'}

=== CASUALTIES & HAZARDS ===
${incidentsText || 'No lethal hazards logged.'}
`;
  };

  // Local first text generation templates (high fidelity offline backups!)
  const generateOfflineLore = () => {
    const logs = world.logs || [];
    const coordinates = world.coordinates || [];
    const projects = world.projects || [];
    
    if (logs.length === 0) {
      return `### Chronicles of ${world.name}\n\nNo lore blocks established yet. Record your very first day in the gameplay journal to awake the ancient chronicles! The ley lines are quiet, awaiting local logging data.`;
    }

    const latestLog = logs[0];
    const totalMiningSessions = logs.filter(l => l.sessionType === 'Mining').length;
    const totalBuilds = logs.filter(l => l.sessionType === 'Building').length;
    
    const bases = coordinates.filter(c => c.category === 'Base');
    const primaryBase = bases[0]?.name || 'Homestead Spawn Site';

    let loreText = `## The Epic Sagá of ${world.name}\n\n`;
    loreText += `In the cosmic year ${world.startDate || 'unknown'}, a traveler was thrown into a harsh realm defined by the seed matrix \`${world.seed || '0'}\`. `;
    loreText += `Spawned into the world, day one opened with a chronicle entitled *"${latestLog.title}"*, where they struggled against the survival elements:\n\n*&ldquo;${latestLog.whatHappened}&rdquo;*\n\n`;
    
    if (totalMiningSessions > 0) {
      loreText += `Deep below the cobblestone roots, deepslate mine structures were charted. The archives report a staggering sequence of deep subterranean expeditions focusing on resource gathering. `;
    }
    if (totalBuilds > 0) {
      loreText += `Above ground, architectural scaffolding arose from the dirt. The majestic stronghold of ${primaryBase} became a primary focus, anchoring the traveler's dominion. `;
    }

    if (projects.length > 0) {
      const activeProj = projects[0];
      loreText += `Currently, the cosmic archives show active focus on *"${activeProj.name}"*, planned at ${activeProj.priority} priority. `;
      loreText += `Engineering rosters outline plans for building and automation, indicating a shift from a basic survival tent to high-speed automation and block architecture. `;
    } else {
      loreText += `The logs indicate they are currently wandering the wilderness, surviving in nomadic structures. `;
    }

    loreText += `\n\n### The Chronicler's Prediction:\n`;
    if (world.mode === 'hardcore') {
      loreText += `⚠️ WARNING: Under the brutal Hardcore rule set, zero slip-ups are tolerated. The stars predict major dangers deep in the Nether void. Equip fire resistance potions, or this terminal will trigger your final obituary. Stay vigilant, survive the night.`;
    } else {
      loreText += `🌲 OVERWORLD HARMONY: Your survival parameters look stable. The surrounding forest ley lines indicate great prospects. Work toward defeating the legendary Ender Dragon to cement your status in the archives.`;
    }

    return loreText;
  };

  const generateOfflineNewspaper = () => {
    const logs = world.logs || [];
    const coordinates = world.coordinates || [];
    const incidents = world.incidents || [];
    const projects = world.projects || [];

    const issueNum = 1 + logs.length + (incidents.length * 3);
    const mainHeadline = incidents.length > 0
      ? `TERROR IN THE MINES: TRAGEDY AT ${incidents[0].coordinates || 'Y: -58'}!`
      : `SPAWN PORTAL CORRIDORS SECURED IN ${world.name.toUpperCase()}!`;

    const editorial = incidents.length > 0
      ? `A severe warning for miners: Safety helmets and buckets of water must sit in Hotbar slot 1. The local surveyor reports another critical loss to ${incidents[0].cause || 'lava burns'}.`
      : `The Overworld gears up for standard expansion. Spiring castles are mapped, and resources flow smoothly inside our double chests.`;

    const bulletins: string[] = [];
    if (projects.length > 0) {
      bulletins.push(`🏗️ BUILD BULLETIN: ${projects[0].name} reported at ${projects[0].progress}% completion details.`);
    } else {
      bulletins.push(`🏕️ HOUSING: Citizens complain about wood dirt cabins. Built castle templates requested.`);
    }

    if (coordinates.length > 0) {
      const c = coordinates[0];
      bulletins.push(`📍 SENSORS: Pinned teleport node established at ${c.name} (X: ${c.x}, Z: ${c.z}).`);
    }

    if (logs.length > 0) {
      bulletins.push(`📖 RECENT EXPEDITION: Day ${logs[0].minecraftDay} saw traveler completing adventure *"${logs[0].title}"*!`);
    }

    const ad = incidents.length > 0
      ? `🔥 ADS: "Pop totems for cheap!" Local swamp witches offer bad omen cures. Visit coordinates X: -100.`
      : `⚒️ ADS: "Diamond Pickaxes half-off!" Trade at the local plains library block.`;

    return {
      header: `THE COBBLESTONE TELEGRAPH`,
      issue: issueNum,
      headline: mainHeadline,
      editorial,
      bulletins,
      ad
    };
  };

  const generateOfflinePlanner = () => {
    const goals = world.goals || [];
    const projects = world.projects || [];
    const agenda: string[] = [];

    const incomplete = goals.filter(g => !g.isCompleted);
    const activeProjects = projects.filter(p => p.progress < 100);

    if (incomplete.length > 0) {
      agenda.push(`🎯 PRIORITIZE GOAL: LOCK IN "${incomplete[0].text}" immediately. Clear notes suggest: ${incomplete[0].notes || 'no directions drafted yet'}.`);
    } else {
      agenda.push(`🎯 SET NEW GOALS: All advancements cleared! Open the Achieve tab to declare exploration or dragon slaying fights.`);
    }

    if (activeProjects.length > 0) {
      const p = activeProjects[0];
      agenda.push(`🪵 BLUEPRINT TASKS: Progress "${p.name}" past ${p.progress}%. Material checklists demand: ${p.materialsNeeded.slice(0, 3).join(', ') || 'basic cobblestones and spruce boards'}.`);
    }

    // Dynamic procedural filler tasks based on logs
    if ((world.logs || []).length < 3) {
      agenda.push(`📦 SPONTANEOUS EXPEDITION: Go strip mining at coordinate Y: -58. Stock pile deepslate blocks, ore veins, and redstone triggers.`);
    } else {
      agenda.push(`🌾 CHORE LOG: Inspect automated crop farms, unload kelp smelt arrays, and secure village breeder trade blocks.`);
    }

    return agenda;
  };

  const generateOfflineRisk = () => {
    const incidents = world.incidents || [];
    const coordinates = world.coordinates || [];

    const extremeCoords = coordinates.filter(c => c.dangerLevel === 'Extreme' || c.dangerLevel === 'High');
    
    let lvl: 'Low' | 'Medium' | 'High' | 'Extreme' = 'Low';
    let color = 'text-mc-green';
    let adv = 'Your world remains peaceful. Ley line parameters are stable. Build towers at outer edges safely.';

    if (incidents.length > 0 || extremeCoords.length > 0) {
      if (world.mode === 'hardcore') {
        lvl = 'Extreme';
        color = 'text-mc-red animate-pulse';
        adv = `CRITICAL THREAT: You are currently running on single-life seed parameters! Over ${extremeCoords.length} extreme danger nodes map near your coordinates. Recent casualties highlight ${incidents[0]?.cause || 'unforgiven voids'}. Keep shields in offhand slot instantly!`;
      } else if (incidents.length > 2) {
        lvl = 'High';
        color = 'text-mc-red';
        adv = `HIGH DANGER INDEX: Multiple casualties logged inside coordinate hubs. Mob spawn density levels are high. Recommended action: sleep before sundown, lit up all caves, and block underground portals with iron bar doors.`;
      } else {
        lvl = 'Medium';
        color = 'text-mc-yellow';
        adv = `MODERATE RISK: Some structural deaths reported. Re-organize layout chests, carry water buckets, and do not dig blocks straight down underneath feet.`;
      }
    }

    return { level: lvl, color, advisory: adv };
  };

  // Run generation through templates OR actual Gemini API
  const handleGenerateAiOracle = async () => {
    sounds.playLevelUp(); // Play level up sound on AI launch!
    setIsGenerating(true);

    if (useGeminiApi && apiKey.trim().length > 0) {
      try {
        const ai = new GoogleGenAI({ apiKey: apiKey.trim() });
        const worldSpec = compileWorldContextForAi();
        
        let targetPrompt = '';
        if (activeSubTab === 'lore') {
          targetPrompt = `You are the ancient Minecraft chronicler. Write a beautifully stylized, immersive chapter of lore/history (Markdown format, with custom header) representing the active Minecraft survival world. Max 300 words. Keep it blocky, immersive, and styled perfectly for the Minecraft universe. Context:\n${worldSpec}`;
        } else if (activeSubTab === 'newspaper') {
          targetPrompt = `You are writing a funny pixelated Minecraft newspaper called 'The Cobblestone post'. Compile JSON matching this schema: { "header": "THE COBBLESTONE POST", "headline": "Headline", "editorial": "Editorial paragraph", "bulletins": ["Bullet 1", "Bullet 2"], "ad": "Advert shop" }. Keep text short and blocky. Use this context:\n${worldSpec}`;
        } else if (activeSubTab === 'planner') {
          targetPrompt = `Generate a customized list of 3 sequential tactical survival plans (step-by-step hotbar instructions) for the next gameplay session based on current goals, projects, and logs. Return as a brief JSON array of strings e.g. ["Plan A", "Plan B", "Plan C"]. Context:\n${worldSpec}`;
        } else {
          targetPrompt = `Provide a survival threat index advisory (Low, Medium, High, Extreme) and details based on recent incident casualties and coordinates danger tags. Return JSON format: { "level": "High", "advisory": "Paragraph advisory" }. Context:\n${worldSpec}`;
        }

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: targetPrompt,
          config: {
            responseMimeType: activeSubTab !== 'lore' ? 'application/json' : 'text/plain'
          }
        });

        const txt = response.text || '';
        
        // Parse results based on tab
        if (activeSubTab === 'lore') {
          setLoreOutput(txt);
        } else if (activeSubTab === 'newspaper') {
          const parsed = JSON.parse(txt);
          setNewspaperOutput({
            header: parsed.header || 'COBBLESTONE DISPATCH',
            issue: Math.floor(Math.random() * 100) + 1,
            headline: parsed.headline || 'HERO OF SPAWN CORES',
            editorial: parsed.editorial || 'No editorials recorded.',
            bulletins: parsed.bulletins || [],
            ad: parsed.ad || 'Need cheap coal? Dig down!'
          });
        } else if (activeSubTab === 'planner') {
          const parsed = JSON.parse(txt);
          setPlannerOutput(parsed || []);
        } else {
          const parsed = JSON.parse(txt);
          const lvl = parsed.level || 'Low';
          const colors = { Low: 'text-mc-green', Medium: 'text-mc-yellow', High: 'text-mc-red', Extreme: 'text-mc-red animate-pulse' };
          setRiskOutput({
            level: lvl,
            color: colors[lvl as keyof typeof colors] || 'text-zinc-400',
            advisory: parsed.advisory || 'Parameters secure.'
          });
        }

      } catch (err) {
        console.error('Gemini API call crashed, falling back to local formulas:', err);
        // Instant graceful template fallback so the app remains perfect and functional for FREE!
        runFallbackFormulas();
      } finally {
        setIsGenerating(false);
      }
    } else {
      // Offline local computation: instantaneous and extremely friendly
      setTimeout(() => {
        runFallbackFormulas();
        setIsGenerating(false);
      }, 700);
    }
  };

  const runFallbackFormulas = () => {
    if (activeSubTab === 'lore') {
      setLoreOutput(generateOfflineLore());
    } else if (activeSubTab === 'newspaper') {
      setNewspaperOutput(generateOfflineNewspaper());
    } else if (activeSubTab === 'planner') {
      setPlannerOutput(generateOfflinePlanner());
    } else {
      setRiskOutput(generateOfflineRisk());
    }
  };

  // Trigger local initializations automatically on mounts or tab swaps
  useEffect(() => {
    runFallbackFormulas();
  }, [activeSubTab, world]);

  return (
    <div className="space-y-6 select-none animate-fade-in font-mono text-white">
      
      {/* Tab Header Banner */}
      <div className="border-b-2 border-zinc-700 pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <h2 className="font-pressstart text-base sm:text-xl text-mc-gold flex items-center gap-2">
            🔮 THE SATELLITE ORACLE
          </h2>
          <p className="text-xs text-zinc-400 mt-1 uppercase">
            COSMIC ARCHIVES SYNTHESIZER • LORE COMPILER & CHRONOLOGY PLANNERS
          </p>
        </div>

        {/* Gemini Core Key Config Button */}
        <button
          onClick={() => { sounds.playClick(); setShowKeyInput(!showKeyInput); }}
          className="mc-button py-2 px-3 text-[9px] flex items-center gap-1.5 bg-purple-900/35 border-purple-600 border"
        >
          <Key className="w-3.5 h-3.5 text-mc-yellow" />
          {useGeminiApi ? "♊ GEMINI CORES: CONNECTED" : "♊ INTEGRATE GEMINI KEY"}
        </button>
      </div>

      {/* Secret API key portal overlay window */}
      {showKeyInput && (
        <div className="bg-[#1c1611] border-4 border-[#503b2c] p-4 space-y-4 shadow-2xl relative z-10">
          <h4 className="font-pressstart text-[10px] text-mc-gold uppercase"> Gemini Private API Core Key</h4>
          <p className="text-xs text-zinc-300 leading-relaxed uppercase-first">
            Paste your personal Google AI Studio Key below to link real Google LLM models which analyze your logs! The key is saved strictly client-side on your browser local indexes. No servers involved, keeping operations completely private and free!
          </p>
          <div className="space-y-2">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full bg-black border-2 border-zinc-700 p-2 text-xs text-white uppercase focus:outline-none focus:border-mc-green tracking-widest text-center"
              placeholder="AIzaSy..."
            />
            <div className="flex gap-2">
              <button
                onClick={() => handleSaveApiKeySettings(apiKey, true)}
                className="flex-1 py-1.5 bg-emerald-800 hover:bg-emerald-600 border border-black text-xs font-bold uppercase"
              >
                💾 LINK PRIVATE API KEY
              </button>
              <button
                onClick={() => {
                  sounds.playClick();
                  handleSaveApiKeySettings('', false);
                }}
                className="py-1.5 px-4 bg-zinc-800 hover:bg-zinc-650 text-xs border border-transparent uppercase text-zinc-400 hover:text-white"
              >
                MOCK ONLY
              </button>
            </div>
            <p className="text-[10px] text-zinc-500 text-center uppercase">
              Keep empty to utilize standard instant Minecraft templates natively!
            </p>
          </div>
        </div>
      )}

      {/* Mini navigations */}
      <div className="flex border-b border-zinc-800">
        <button 
          onClick={() => { sounds.playClick(); setActiveSubTab('lore'); }}
          className={`py-2.5 px-4 text-xs font-pressstart text-[9px] border-t-2 border-r border-[#3a3024] flex items-center gap-1.5 ${
            activeSubTab === 'lore' ? 'bg-[#29221b] border-mc-gold text-white font-bold' : 'bg-black/25 border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" /> WORLD SAGA
        </button>
        <button 
          onClick={() => { sounds.playClick(); setActiveSubTab('newspaper'); }}
          className={`py-2.5 px-4 text-xs font-pressstart text-[9px] border-t-2 border-r border-[#3a3024] flex items-center gap-1.5 ${
            activeSubTab === 'newspaper' ? 'bg-[#29221b] border-mc-gold text-white font-bold' : 'bg-black/25 border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          <FileText className="w-3.5 h-3.5" /> COBBLEPOST OBSERVER
        </button>
        <button 
          onClick={() => { sounds.playClick(); setActiveSubTab('planner'); }}
          className={`py-2.5 px-4 text-xs font-pressstart text-[9px] border-t-2 border-r border-[#3a3024] flex items-center gap-1.5 ${
            activeSubTab === 'planner' ? 'bg-[#29221b] border-mc-gold text-white font-bold' : 'bg-black/25 border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          <Lightbulb className="w-3.5 h-3.5" /> TACTICAL ENVELOPE
        </button>
        <button 
          onClick={() => { sounds.playClick(); setActiveSubTab('risk'); }}
          className={`py-2.5 px-4 text-xs font-pressstart text-[9px] border-t-2 border-[#3a3024] flex items-center gap-1.5 ${
            activeSubTab === 'risk' ? 'bg-[#29221b] border-mc-gold text-[#ff5555] font-bold' : 'bg-black/25 border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          <AlertCircle className="w-3.5 h-3.5" /> HAZARD ADVISOR
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        
        {/* Sub-tab view content */}
        <div className="md:col-span-3 space-y-4">
          
          <div className="bg-[#29221b] border-4 border-[#3e3229] p-5 shadow-inner min-h-[300px] flex flex-col justify-between">
            
            {/* Displaying state */}
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center p-20 text-center space-y-4 flex-1">
                <RefreshCw className="w-12 h-12 text-mc-gold animate-spin" />
                <h4 className="font-pressstart text-xs text-[#55ffff] uppercase animate-pulse">Consulting the Celestial Anchors...</h4>
                <p className="text-xs text-zinc-400 uppercase font-mono max-w-sm">
                  Compiling gameplay history logs, goal statistics, casualty markers into LLM synthesis vectors...
                </p>
              </div>
            ) : (
              <div className="flex-1">
                
                {/* 1. WORLD SAGA */}
                {activeSubTab === 'lore' && (
                  <div className="space-y-4 text-zinc-300 font-mono text-xs leading-relaxed max-w-none pr-2">
                    <div className="border-b border-zinc-800 pb-3 flex justify-between items-center bg-black/35 px-3 py-2">
                      <span className="font-pressstart text-[8px] text-mc-yellow">📜 HISTORICAL CHRONOLOGY RECHARTED</span>
                      <span className="text-[10px] text-zinc-500 uppercase font-bold text-right">SEED MATRIX CONTEXTUAL</span>
                    </div>

                    <div className="whitespace-pre-line leading-relaxed text-sm p-2 text-zinc-200">
                      {loreOutput}
                    </div>
                  </div>
                )}

                {/* 2. COBBLEPOST OBSERVER (Newspaper layout) */}
                {activeSubTab === 'newspaper' && newspaperOutput && (
                  <div className="bg-[#eedebc] p-5 text-neutral-800 font-mono border-4 border-[#aa9a78] shadow-lg space-y-4 text-xs relative select-text">
                    {/* Retro headline block */}
                    <div className="text-center border-b-4 border-double border-neutral-900 pb-3 space-y-1">
                      <h2 className="font-pressstart text-base sm:text-lg text-neutral-900 tracking-wider">
                        {newspaperOutput.header}
                      </h2>
                      <div className="flex justify-between items-center text-[10px] border-t border-neutral-700 pt-1 text-neutral-600 px-2 uppercase font-bold">
                        <span>ESTD. SPAWN YEAR 1</span>
                        <span className="animate-pulse text-red-700">● SPECIAL EDITION</span>
                        <span>ISSUE #{newspaperOutput.issue}</span>
                      </div>
                    </div>

                    {/* Headline Banner */}
                    <div className="space-y-2 border-b-2 border-dashed border-neutral-600 pb-4">
                      <h3 className="font-pressstart text-xs md:text-sm text-neutral-950 font-black leading-snug tracking-tight text-center">
                        📰 {newspaperOutput.headline}
                      </h3>
                      <p className="indent-6 text-sm leading-relaxed text-neutral-800 text-justify italic">
                        &ldquo; {newspaperOutput.editorial} &rdquo;
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Left half: bullet bulletins */}
                      <div className="space-y-2">
                        <h4 className="font-pressstart text-[8px] text-neutral-950 font-bold border-b border-neutral-800 pb-1 uppercase">CURRENT RELEASES</h4>
                        <ul className="space-y-2 text-[11px] leading-relaxed">
                          {newspaperOutput.bulletins.map((bullet, idx) => (
                            <li key={idx} className="flex gap-1.5">
                              <span className="text-neutral-900 font-bold">⚔️</span>
                              <span>{bullet}</span>
                            </li>
                          ))}
                          {newspaperOutput.bulletins.length === 0 && (
                            <li className="text-neutral-500 italic">No news reported. Core systems are quiet.</li>
                          )}
                        </ul>
                      </div>

                      {/* Right half: Funny classified ads */}
                      <div className="bg-[#ebd9b4] p-3 border border-[#aa9a78] flex flex-col justify-between">
                        <div>
                          <h4 className="font-pressstart text-[8px] text-neutral-900 border-b border-neutral-700 pb-1 uppercase text-center font-bold">CLASSIFIED ADS</h4>
                          <p className="text-[11px] text-neutral-700 leading-snug mt-2 italic text-center">
                            {newspaperOutput.ad}
                          </p>
                        </div>
                        <div className="text-center font-pressstart text-[7px] text-neutral-500 mt-4 leading-none select-none">
                          BUY 64 SMOOTH STONE ROWS, GET 1 FREE
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-neutral-700 pt-2 text-[8px] font-pressstart text-neutral-500 flex justify-between uppercase">
                      <span>Printed in terminal space using dynamic local variables</span>
                      <span>Price: 1 Emerald</span>
                    </div>

                  </div>
                )}

                {/* 3. TACTICAL PLANNER */}
                {activeSubTab === 'planner' && (
                  <div className="space-y-4">
                    <div className="bg-black/35 p-3 flex justify-between items-center border border-zinc-800">
                      <span className="font-pressstart text-[8px] text-mc-aqua">🛡️ EXPEDITION PLANNING DESK AGENDA</span>
                      <span className="text-[10px] text-zinc-500 uppercase font-bold">NEXT SESSION PLANNERS</span>
                    </div>

                    <div className="space-y-3">
                      {plannerOutput.map((item, id) => (
                        <div key={id} className="bg-black/20 border-l-4 border-mc-aqua p-3 flex gap-3 text-xs leading-relaxed text-zinc-300">
                          <div className="bg-mc-aqua/20 text-[#55ffff] w-6 h-6 shrink-0 flex items-center justify-center font-bold text-xs">
                            {id + 1}
                          </div>
                          <div>
                            <p className="font-bold text-white uppercase tracking-wide text-[10px] mb-0.5">SPECIFIC ASSIGNMENT ROW:</p>
                            <p className="font-mono text-zinc-300 capitalize lowercase-first pr-2">
                              {item}
                            </p>
                          </div>
                        </div>
                      ))}
                      {plannerOutput.length === 0 && (
                        <p className="text-xs text-zinc-500 text-center py-6 italic">No planner lists mapped. Draft goals above rows.</p>
                      )}
                    </div>
                  </div>
                )}

                {/* 4. HAZARD RISK ADVISOR */}
                {activeSubTab === 'risk' && riskOutput && (
                  <div className="space-y-4 font-mono text-xs">
                    <div className="bg-black/35 p-3 flex justify-between items-center border border-zinc-800">
                      <span className="font-pressstart text-[8px] text-red-500">💀 HARVEST RISK & TRAUMA SENSORS</span>
                      <span className="text-[10px] text-zinc-500 uppercase font-bold">LETHAL HAZARDS STATUS</span>
                    </div>

                    <div className="bg-red-950/20 border-2 border-red-950 p-5 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-red-900 border border-white text-white p-2 text-xs font-pressstart uppercase text-center font-bold">
                          DANGER METRIC
                        </div>
                        <div>
                          <span className="text-zinc-500 text-[10px] uppercase font-bold block">CURRENT CALCULATED WORLD LEVEL:</span>
                          <span className={`font-pressstart text-xs uppercase font-bold ${riskOutput.color}`}>
                            {riskOutput.level} RISK ASSESSMENT
                          </span>
                        </div>
                      </div>

                      <div className="bg-black/40 p-4 border border-zinc-850 space-y-2">
                        <span className="text-zinc-400 font-bold uppercase text-[10px] tracking-wide block">THE ORACLE WARNING BULLETIN:</span>
                        <p className="text-zinc-300 text-xs leading-relaxed leading-relaxed capitalize lowercase-first">
                          {riskOutput.advisory}
                        </p>
                      </div>

                      {world.mode === 'hardcore' && (
                        <div className="text-[10px] text-red-400 font-pressstart text-[8px] leading-relaxed uppercase border-t border-red-950/40 pt-3">
                          💥 CRITICAL Hardcore Rule Alert: When risk meter thresholds exceed Level 7, emergency backup safehouse chambers are strongly advised. Update backup gear logs inside Settings.
                        </div>
                      )}
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* Bottom Generate Actions Row */}
            <div className="border-t border-zinc-800 pt-3 mt-4 flex justify-between items-center gap-2">
              <span className="text-[10px] text-zinc-500 uppercase tracking-tight hidden sm:block">
                {useGeminiApi ? "🔥 Active Model: gemini-2.5-flash" : "💻 Running local dynamic state parser (Free Offline)"}
              </span>
              <button
                onClick={handleGenerateAiOracle}
                disabled={isGenerating}
                className="mc-button mc-button-green py-2 px-4 text-xs font-bold uppercase tracking-widest flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4 text-mc-yellow" />
                {isGenerating ? "FORGING TEXT..." : "FORCE GENERATE COMPILATION"}
              </button>
            </div>

          </div>

        </div>

        {/* Right Side Description metrics column */}
        <div className="md:col-span-1 border-2 border-[#3a3024] bg-black/35 p-4 text-xs text-zinc-500 space-y-4 font-mono leading-relaxed">
          <h4 className="font-pressstart text-[8px] tracking-wide text-mc-gold uppercase">📟 DECKS SYNTAX</h4>
          <p>
            The Satellite Oracle utilizes state coordinates, blueprints progress, achievements, and death casualty coordinates to automatically compile survival summaries.
          </p>
          <div className="pt-2 border-t border-zinc-850 space-y-1">
            <div className="flex justify-between">
              <span>JOURNAL LOGS:</span>
              <span className="text-white font-bold">{world.logs?.length || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>BLUEPRINTS:</span>
              <span className="text-white font-bold">{world.projects?.length || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>COORDINATES:</span>
              <span className="text-white font-bold">{world.coordinates?.length || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>CASUALTIES:</span>
              <span className="text-white font-bold">{world.incidents?.length || 0}</span>
            </div>
          </div>
          <p className="text-[10px] text-zinc-650 pt-2 border-t border-zinc-850 uppercase">
            No network connections are tracked by default, remaining completely safe, local, and free.
          </p>
        </div>

      </div>

    </div>
  );
}
