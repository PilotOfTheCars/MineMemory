import { MinecraftWorld, Coordinate, SessionLog, Project, Goal, Inspiration, Incident } from '../types';

const INITIAL_WORLDS: MinecraftWorld[] = [
  {
    id: 'world-survival-1',
    name: 'Aetheria V1',
    version: '1.21.1',
    seed: '4820184028401',
    difficulty: 'Normal',
    startDate: '2025-10-14',
    mode: 'survival',
    modsNotes: 'OptiFine, Complementary Shaders Rebound, Journeymap.',
    description: 'Our primary long-term survival home. Building a giant gothic mountain cathedral, sprawling automated crop farms, and connecting all bases through a high-speed blue ice nether highway.',
    isLost: false,
    lastSaved: '2026-05-21T18:30:00Z',
    logs: [
      {
        id: 'log-1',
        title: 'Subterranean Beginnings',
        realDate: '2025-10-14',
        minecraftDay: 1,
        sessionType: 'Adventure',
        whatHappened: 'Spawned amidst an atmospheric birch forest flanked by massive stony slopes. Harvested wood, crafted a wood pickaxe, and immediate dug a cozy dirt alcove before sundown. Heard zombies outside all night, but survived without taking hit.',
        lootGained: ['16 Oak logs', '8 coal', '12 cobblestone'],
        itemsLost: [],
        coordinatesVisited: ['Spawn Point (X: 12, Z: -8)' ],
        nextGoals: 'Construct a secure oak house on the hill and find sheep for wool.',
        moodRating: 4
      },
      {
        id: 'log-2',
        title: 'Mining to Level -58',
        realDate: '2025-10-20',
        minecraftDay: 15,
        sessionType: 'Mining',
        whatHappened: 'Constructed an elaborate vertical mine shaft down to deepslate. Broke into an expansive cavern network at Y: -58 filled with massive lava pools. Located our very first diamonds! Encountered a severe Cave Spider spawner but successfully neutralized it with torches.',
        lootGained: ['5 Diamonds', '64 Redstone dust', '12 Iron ore', '32 Lapis Lazuli'],
        itemsLost: ['2 Iron Pickaxes (broke)'],
        coordinatesVisited: ['Deepslate Ravine Y: -58'],
        nextGoals: 'Craft diamond pickaxe, build Enchanting Table and draft the Portal room.',
        moodRating: 5
      },
      {
        id: 'log-3',
        title: 'Breaching the Nether Void',
        realDate: '2025-11-05',
        minecraftDay: 48,
        sessionType: 'Redstone',
        whatHappened: 'Gathered obsidian, lighted the Nether portal in our cobblestone cellar dungeon. Traveled through and spawned inside a Soul Sand Valley—extremely tough terrain. Fought off three Ghasts using arrow deflects. Spotted a Nether Fortress in the distant crimson fog!',
        lootGained: ['12 Ghast tears', '64 Soul Sand', '18 Nether Quartz'],
        itemsLost: ['Gold boots (degraded to zero)'],
        coordinatesVisited: ['Nether Portal Hub (X: -34, Z: 110)'],
        nextGoals: 'Explore the Fortress and construct a safe Blaze Spawner trap.',
        moodRating: 3
      }
    ],
    coordinates: [
      {
        id: 'coord-1-1',
        name: 'Hilltop Cathedral Base',
        x: 120,
        y: 72,
        z: -340,
        dimension: 'Overworld',
        category: 'Base',
        notes: 'Main homestead with sleeping quarters, custom armor display, auto furnace array and temporary storage barrels.',
        dangerLevel: 'Low',
        isPinned: true
      },
      {
        id: 'coord-1-2',
        name: 'Fortress Blaze Spawner',
        x: -45,
        y: 60,
        z: 180,
        dimension: 'Nether',
        category: 'Farm',
        notes: 'Isolated spawner inside fortress. Surrounded by stone bricks with an active funnel trap to grid rod ingredients safely.',
        dangerLevel: 'High',
        isPinned: true
      },
      {
        id: 'coord-1-3',
        name: 'Forest Village Trading Hub',
        x: 450,
        y: 64,
        z: -800,
        dimension: 'Overworld',
        category: 'Village',
        notes: 'Secured with cobblestone walls. Contains Mending librarian (10 emeralds!), Unbreaking III priest and level-max toolsmiths.',
        dangerLevel: 'Low',
        isPinned: false
      },
      {
        id: 'coord-1-4',
        name: 'Eerily Deep Ravine Mine',
        x: 82,
        y: -44,
        z: -220,
        dimension: 'Overworld',
        category: 'Mine',
        notes: 'Major deepslate exploration zone. High quartz exposure and hidden water veins.',
        dangerLevel: 'Medium',
        isPinned: false
      }
    ],
    projects: [
      {
        id: 'proj-1-1',
        name: 'The Gothic Cathedral',
        status: 'In Progress',
        priority: 'High',
        description: 'A monument of towering proportions, featuring flying stone buttresses, dyed stained glass windows depicting the spawn cycle, and an iron golem tower inside the steeple.',
        materialsNeeded: ['32 stacks of Stone Bricks', '10 stacks of Deepslate Tiles', '5 stacks of Red/Blue Colored Glass', '16 Spruce Logs'],
        checklist: [
          { id: 'item1', text: 'Clear top of Birch Hill with iron shovels', done: true },
          { id: 'item2', text: 'Draft cobblestone pillars layout outline', done: true },
          { id: 'item3', text: 'Erect central stone support arches', done: true },
          { id: 'item4', text: 'Furnace stained-glass firing and installation', done: false },
          { id: 'item5', text: 'Enclose the high dome ceiling tiles', done: false }
        ],
        linkedCoords: ['coord-1-1'],
        inspirationLinks: ['Youtube: Grian Cathedral Tutorial', 'Reddit: Gothic Buttress Sketches'],
        progress: 60
      },
      {
        id: 'proj-1-2',
        name: 'Automated Sugar Cane Farm',
        status: 'Completed',
        priority: 'Medium',
        description: 'Using mud blocks, observers, pistons, and a water collection minecart track system to harvest sugar canes automatically for paper and rocket manufacturing.',
        materialsNeeded: ['16 Pistons', '16 Observers', '32 Redstone dust', '1 Powered rail', '1 Hopper minecart'],
        checklist: [
          { id: 'p2-1', text: 'Dig underground water streams', done: true },
          { id: 'p2-2', text: 'Plant sugar cane on mud rows', done: true },
          { id: 'p2-3', text: 'Circuit redstone observers behind pistons', done: true }
        ],
        linkedCoords: [],
        inspirationLinks: ['Mumbo Jumbo: Compact Piston Farms'],
        progress: 100
      }
    ],
    goals: [
      {
        id: 'goal-1-1',
        text: 'Locate Stronghold portal frame',
        type: 'Exploration',
        priority: 'High',
        isCompleted: false,
        notes: 'Requires crafting 12 Eyes of Ender. Target is likely located a few thousand blocks southwest of spawn.'
      },
      {
        id: 'goal-1-2',
        text: 'Obtain Elytra wings from End Ship',
        type: 'Advancement',
        priority: 'High',
        isCompleted: false,
        notes: 'Will require entering End Gateways post Ender Dragon defeat.'
      },
      {
        id: 'goal-1-3',
        text: 'Build full level-30 enchanting library',
        type: 'Farming',
        priority: 'Medium',
        isCompleted: true,
        notes: 'Placed 15 bookshelf items surrounding center stand.'
      }
    ],
    inspirations: [
      {
        id: 'insp-1-1',
        title: 'Nether Highway Blue Ice Fast Travel',
        link: 'https://youtube.com/watch?placeholder1',
        category: 'Survival Hack',
        tags: ['Nether', 'Ice Road', 'Fast Travel'],
        notes: 'Placing blue ice blocks on every second tile lets boats slide at breakneck speed. 1 Nether block = 8 Overworld blocks!'
      },
      {
        id: 'insp-1-2',
        title: 'Cozy Wood Cabin Exterior Ideas',
        link: 'https://reddit.com/r/Minecraft/placeholder2',
        category: 'Build',
        tags: ['Cozy', 'Wood', 'Spruce', 'Aesthetic'],
        notes: 'Adding upside-down stair blocks under windows and trapdoor shutters on sides creates incredible depth.'
      }
    ],
    incidents: [
      {
        id: 'inc-1-1',
        cause: 'Lava',
        coordinates: 'X: 18, Y: -54, Z: -229',
        itemsLost: 'Diamond Chestplate, Enchanted Pickaxe (Efficiency IV), 42 iron rails.',
        lessonLearned: 'Never mine straight down. Always carry an active water bucket in Hotbar slot 2, and use Fire Resistance potions when nearby deep lava caverns!',
        recoveryStatus: 'Fully Recovered',
        date: '2025-11-20'
      },
      {
        id: 'inc-1-2',
        cause: 'Creeper',
        coordinates: 'X: 102, Y: 71, Z: -332',
        itemsLost: 'Wooden chest blown up (scattered 20 double chests of dirt and cobblestone all over the grassy fields).',
        lessonLearned: 'Spawn-proof base yards with lanterns. Double chests outside are highly vulnerable to wandering green boys.',
        recoveryStatus: 'Fully Recovered',
        date: '2026-02-15'
      }
    ]
  },
  {
    id: 'world-hardcore-2',
    name: 'Phantoms Wake',
    version: '1.20.4',
    seed: '-84920492049104',
    difficulty: 'Hard',
    startDate: '2026-01-02',
    mode: 'hardcore',
    modsNotes: 'Bare Bones Texture Pack, Sodium, Iris Shaders.',
    description: 'Ultra-stakes Hardcore challenge. My longest-surviving single life playthrough. Goal: 500 days, defeating all three bosses (Dragon, Wither, Elder Guardian) and establishing a monumental obsidian vault.',
    isLost: false,
    lastSaved: '2026-05-22T04:10:00Z',
    logs: [
      {
        id: 'l-hc-1',
        title: 'Spawn & First Shield (Day 1-10)',
        realDate: '2026-01-02',
        minecraftDay: 10,
        sessionType: 'Adventure',
        whatHappened: 'Encountered span in a harsh snow tundra. Food ran dry within minutes. Plundered nearby igloo basement to get furnace coal and stew. Crafted an iron shield immediately upon mining three iron ingots. This shield is my life.',
        lootGained: ['Iron Shield', '6 golden apples (from igloo)', 'Coals'],
        itemsLost: [],
        coordinatesVisited: ['Igloo basement (X: -140, Z: 512)'],
        nextGoals: 'Construct an underground thermal greenhouse for wheat.',
        moodRating: 5
      },
      {
        id: 'l-hc-2',
        title: 'Ancient City Sneaking',
        realDate: '2026-03-15',
        minecraftDay: 112,
        sessionType: 'Boss Fight',
        whatHappened: 'Carefully descended into a gargantuan Deep Dark cavern beneath glaciers. Crawling on sheep wool carpets, silencing every block broken. Evaded a Sculk Shrieker triggers twice. Found a notch apple inside chest! Escaped right before warden emerged.',
        lootGained: ['1 Enchanted Golden Apple', 'Swift Sneak III Book', '8 Sculk Catalyst blocks'],
        itemsLost: ['64 Wool Blocks (placed and abandoned)'],
        coordinatesVisited: ['Deep Dark City Portal (X: 1100, Y: -52, Z: -1880)'],
        nextGoals: 'Uncover the stronghold and prep standard feather falling potions.',
        moodRating: 4
      }
    ],
    coordinates: [
      {
        id: 'coord-2-1',
        name: 'The Tundra Chasm Bunker',
        x: -281,
        y: 63,
        z: 490,
        dimension: 'Overworld',
        category: 'Base',
        notes: 'Sealed underground operations. Double iron-doors with a pressure plate safety lockout, automated snow blast chamber, and fully stocked potion stand.',
        dangerLevel: 'Low',
        isPinned: true
      },
      {
        id: 'coord-2-2',
        name: 'Ancient City Portal Ruins',
        x: 1100,
        y: -52,
        z: -1880,
        dimension: 'Overworld',
        category: 'Structure',
        notes: 'Warning! High Sculk infestation. Do NOT jump, do NOT trigger sensors. Extremely close to Warden spawning zones.',
        dangerLevel: 'Extreme',
        isPinned: true
      },
      {
        id: 'coord-2-3',
        name: 'Safehouse Alpha Emergency Pod',
        x: 200,
        y: 78,
        z: -400,
        dimension: 'Overworld',
        category: 'Base',
        notes: 'Emergency dirt capsule. Fully equipped with water bucket, iron armor pack, notch apple, and bed. Pinned specifically for quick escape.',
        dangerLevel: 'Low',
        isPinned: false
      }
    ],
    projects: [
      {
        id: 'proj-2-1',
        name: 'Stronghold Garrison Outpost',
        status: 'In Progress',
        priority: 'High',
        description: 'Constructing heavily armored obsidian and iron cage walls surrounding the Ender portal in the Stronghold, allowing instant escape or lockdown if Endermen aggro.',
        materialsNeeded: ['4 stacks of Obsidian', '2 stacks of Iron Bars', '6 Water Buckets', 'Chest of Golden Apples'],
        checklist: [
          { id: 'hcitem1', text: 'Clear Silverfish Spawner block immediately', done: true },
          { id: 'hcitem2', text: 'Enclose the entire ender frame room in glass walls', done: true },
          { id: 'hcitem3', text: 'Strap secondary trapdoors on emergency run-out corridors', done: false }
        ],
        linkedCoords: ['coord-2-2'],
        inspirationLinks: ['Hardcore Phil: End Room Lockdown builds'],
        progress: 75
      }
    ],
    goals: [
      {
        id: 'goal-2-1',
        text: 'Drink Potion of Fire Resistance in Nether always',
        type: 'Combat',
        priority: 'High',
        isCompleted: false,
        notes: 'A critical rule. Zero lava risks taken. Pocket full of fire pots.'
      },
      {
        id: 'goal-2-2',
        text: 'Kill 3 raid captains and establish Village Totem farm',
        type: 'Farming',
        priority: 'High',
        isCompleted: true,
        notes: 'Successfully captured raid captains, completed Bad Omen, gathered our first 5 Totems of Undying!'
      }
    ],
    inspirations: [
      {
        id: 'insp-2-1',
        title: 'Totem of Undying Automatic Farm Designs',
        link: 'https://youtube.com/watch?placeholder3',
        category: 'Farm',
        tags: ['Totem', 'Raid', 'Emeralds', 'Hardcore'],
        notes: 'Raid farm provides infinite Totems. In Hardcore, a totem must always sit in the offhand. This is the absolute meta.'
      }
    ],
    incidents: [
      {
        id: 'inc-2-1',
        cause: 'Fall Damage',
        coordinates: 'X: -245, Y: 94, Z: 120',
        itemsLost: 'None, but popped our first Totem!',
        lessonLearned: 'Slipped off a gravel scaffolding. Fell 40 blocks. The Totem of Undying saved my life. Instantly became immune, regenerated, and built a safety barrier. NEVER build scaffolds without a water pool underneath.',
        recoveryStatus: 'Fully Recovered',
        date: '2026-03-02'
      }
    ],
    hardcoreExtras: {
      daysSurvived: 143,
      riskMeter: 8,
      safehouses: 'Tundra Base Capsule (X: -281, Z: 490), Canopy dirt vault (X: 200, Z: -400)',
      backupGear: 'Full Enchanted Diamond Armor set, Totem of Undying, and Efficiency IV diamond pick inside Tundra safe room vault under floor.',
      nearDeathReports: [
        'Day 42: Trapped by three baby zombies inside a woodland mansion closet. Shields broke. Popped Totem inside narrow 1-block pit.',
        'Day 122: Warden sniped sonic boom from deep slate crack. Knockdown to half generic heart before pearl landed.'
      ],
      worldWill: 'If this screen faded to red, know that I fought proudly. My farms, the obsidian spires, and my journals are bequeathed to any traveler who discovers this terminal.',
      emergencyPlans: 'Equip elytra, trigger Fire resistance potion immediately, ender pearl diagonally upwards, pull cobble shield walls, deploy golden carrot.'
    }
  }
];

export function getStoredWorlds(email?: string): MinecraftWorld[] {
  const key = email ? `minememory_user_${email.trim().toLowerCase()}_worlds` : 'minememory_worlds';
  try {
    const data = localStorage.getItem(key);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Error retrieving worlds from LocalStorage:', e);
  }
  // Fallback to templates & save them initially
  try {
    localStorage.setItem(key, JSON.stringify(INITIAL_WORLDS));
  } catch (e) {
    // Ignored
  }
  return INITIAL_WORLDS;
}

export function saveStoredWorlds(worlds: MinecraftWorld[], email?: string) {
  const key = email ? `minememory_user_${email.trim().toLowerCase()}_worlds` : 'minememory_worlds';
  try {
    localStorage.setItem(key, JSON.stringify(worlds));
  } catch (e) {
    console.error('Error saving worlds to LocalStorage:', e);
  }
}
