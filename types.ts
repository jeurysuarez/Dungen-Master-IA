// Fix: Added full type definitions for the application.

export interface Item {
  name: string;
  quantity: number;
  description: string;
}

export interface Spell {
  name: string;
  cost: number;
  description: string;
}

export interface Skill {
  name: string;
  description: string;
  iconName: string; // To map to an icon component
}

export enum Race {
  Humano = "Humano",
  Elfo = "Elfo",
  Enano = "Enano",
  Orco = "Orco",
}

export enum CharacterClass {
  Guerrero = "Guerrero",
  Mago = "Mago",
  Pícaro = "Pícaro",
  Clérigo = "Clérigo",
}

export interface Character {
  name: string;
  race: Race;
  characterClass: CharacterClass;
  level: number;
  xp: number;
  xpToNextLevel: number;
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  attackBonus: number;
  armorClass: number;
  inventory: Item[];
  spells: Spell[];
  skills: Skill[];
}

// For simplicity, Ally can use the Character type or a subset
export type Ally = Omit<Character, 'xp' | 'xpToNextLevel' | 'inventory'> & {
  isPlayer: boolean;
};

export interface Enemy {
  name: string;
  hp: number;
  maxHp: number;
  description: string;
  attackBonus: number;
}

export interface DMResponse {
  storyText: string;
  characterUpdate?: Partial<Character>;
  partyUpdate?: { name: string, hp: number, maxHp: number }[]; // Simplified update for allies
  newPartyMembers?: Ally[];
  newEnemy?: Enemy;
  removeEnemy?: boolean;
  loot?: Item[];
  event?: 'battle-won' | 'player-dead' | 'level-up';
  ambience?: string; // e.g., 'cave', 'forest', 'battle'
}

export interface Settings {
    ttsEnabled: boolean;
    volume: number;
    textSpeed: number;
}

export interface GameState {
  character: Character;
  party: Ally[];
  enemy: Enemy | null;
  storyLog: string[];
  location: string;
  map?: string; // DM can provide a simple text-based map description
  ambience?: string;
  isLevelingUp?: boolean;
}

// Action types for the game state reducer
export type GameAction =
  | { type: 'SET_GAME_STATE'; payload: GameState }
  | { type: 'APPEND_STORY'; payload: { playerAction?: string; dmResponse: DMResponse } }
  | { type: 'SET_AMBIENCE'; payload: string }
  | { type: 'COMPLETE_LEVEL_UP'; payload: { newSkill: Skill } };