import type { ReactNode } from 'react';

export enum GameState {
  TITLE,
  CHARACTER_CREATION,
  PLAYING,
}

export enum Race {
  Humano = "Humano",
  Elfo = "Elfo",
  Enano = "Enano",
  Mediano = "Mediano",
  Draconido = "Dracónido",
  Gnomo = "Gnomo",
  Semielfo = "Semielfo",
  Semiorco = "Semiorco",
  Tiflin = "Tiflin",
}

export enum CharacterClass {
  Guerrero = "Guerrero",
  Mago = "Mago",
  Picaro = "Pícaro",
  Clerigo = "Clérigo",
}

export interface Item {
  name: string;
  quantity: number;
  description?: string;
}

export interface Spell {
  name:string;
  cost: number;
  description: string;
}

export interface Skill {
  name: string;
  description: string;
  cooldown: number;
  currentCooldown: number;
  iconName: string;
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

export interface Ally extends Omit<Character, 'xp' | 'xpToNextLevel' | 'level' | 'inventory' | 'spells' | 'skills'> {
    // Allies have simpler stats
}

export interface Enemy {
  name: string;
  hp: number;
  maxHp: number;
  attackBonus: number;
  armorClass: number;
  description?: string;
}

export interface DMResponse {
  storyText: string;
  encounter?: Enemy;
  playerUpdate?: { hp?: number; mp?: number };
  enemyUpdate?: { hp?: number };
  partyUpdate?: { name: string; hp: number }[];
  loot?: Item[];
  newAlly?: Ally;
  combatOver?: boolean;
  xpAward?: number;
}

export interface SavedGame {
  character: Character;
  storyLog: string[];
  isInCombat: boolean;
  enemy: Enemy | null;
  party: Ally[];
  settings: Settings;
}

export interface Settings {
    ttsEnabled: boolean;
    volume: number;
    textSpeed: number; // 0 for instant, 50 for normal, 100 for slow
}