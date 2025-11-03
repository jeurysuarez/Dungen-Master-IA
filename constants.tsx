
import React from 'react';
import { Race, CharacterClass, Character } from './types';
import { IconSword, IconScroll, IconDagger, IconCross } from './components/Icons';

export const RACE_DESCRIPTIONS: Record<Race, string> = {
  [Race.Humano]: "Adaptables y ambiciosos, los humanos son la raza más común y diversa, capaces de sobresalir en cualquier senda que elijan.",
  [Race.Elfo]: "Criaturas gráciles y longevas, conectadas con la magia de la naturaleza. Poseen una visión aguda y una afinidad por el arco y la hechicería.",
  [Race.Enano]: "Robustos y tenaces, los enanos son maestros artesanos y guerreros de las montañas. Valoran el oro, el honor y la familia por encima de todo.",
  [Race.Mediano]: "Pequeños y de buen corazón, los medianos aman la comodidad del hogar, pero su curiosidad y sigilo los convierten en aventureros inesperados.",
  [Race.Draconido]: "Descendientes de los dragones, los dracónidos son seres nobles y orgullosos con aliento elemental y una imponente presencia.",
  [Race.Gnomo]: "Inventores e ilusionistas diminutos, los gnomos viven la vida con un entusiasmo y una curiosidad sin límites por el mundo que los rodea.",
  [Race.Semielfo]: "Atrapados entre dos mundos, los semielfos combinan la gracia élfica con la ambición humana, siendo excelentes diplomáticos y líderes.",
  [Race.Semiorco]: "Con la fuerza de los orcos y la astucia humana, los semiorcos son guerreros formidables que luchan por encontrar su lugar en el mundo.",
  [Race.Tiflin]: "Marcados por un linaje infernal, los tiflines son carismáticos y astutos, dominando el fuego y las sombras para forjar su propio destino.",
};

export const RACE_IMAGES: Record<Race, string> = {
    [Race.Humano]: "https://i.imgur.com/8f8hYJM.png",
    [Race.Elfo]: "https://i.imgur.com/nJ33o15.png",
    [Race.Enano]: "https://i.imgur.com/s4CFpwA.png",
    [Race.Mediano]: "https://i.imgur.com/2sY2RUD.png",
    [Race.Draconido]: "https://i.imgur.com/f9YTy3H.png",
    [Race.Gnomo]: "https://i.imgur.com/rK2K4iC.png",
    [Race.Semielfo]: "https://i.imgur.com/nJGr823.png",
    [Race.Semiorco]: "https://i.imgur.com/w9y1b7B.png",
    [Race.Tiflin]: "https://i.imgur.com/t9GR51U.png",
};


export const CLASS_DEFAULTS: Record<CharacterClass, Omit<Character, 'name' | 'race' | 'characterClass' | 'level' | 'xp'>> = {
  [CharacterClass.Guerrero]: {
    maxHp: 20, hp: 20, maxMp: 5, mp: 5, attackBonus: 5, armorClass: 16, xpToNextLevel: 100,
    inventory: [{ name: "Poción de Curación", quantity: 1, description: "Restaura 10 PS." }],
    spells: [],
    skills: [{ name: "Ataque Poderoso", description: "Un golpe devastador que inflige daño extra.", cooldown: 3, currentCooldown: 0, icon: <IconSword /> }],
  },
  [CharacterClass.Mago]: {
    maxHp: 12, hp: 12, maxMp: 20, mp: 20, attackBonus: 2, armorClass: 11, xpToNextLevel: 100,
    inventory: [{ name: "Poción de Maná", quantity: 1, description: "Restaura 10 PM." }],
    spells: [{ name: "Bola de Fuego", cost: 5, description: "Lanza una esfera de fuego a un enemigo." }, { name: "Misil Mágico", cost: 2, description: "Un proyectil de energía que nunca falla." }],
    skills: [{ name: "Meditación Arcana", description: "Recupera una pequeña cantidad de PM.", cooldown: 4, currentCooldown: 0, icon: <IconScroll /> }],
  },
  [CharacterClass.Picaro]: {
    maxHp: 15, hp: 15, maxMp: 10, mp: 10, attackBonus: 4, armorClass: 14, xpToNextLevel: 100,
    inventory: [{ name: "Poción de Curación", quantity: 1, description: "Restaura 10 PS." }],
    spells: [],
    skills: [{ name: "Ataque Furtivo", description: "Un ataque preciso que aprovecha la distracción del enemigo.", cooldown: 2, currentCooldown: 0, icon: <IconDagger /> }],
  },
  [CharacterClass.Clerigo]: {
    maxHp: 16, hp: 16, maxMp: 15, mp: 15, attackBonus: 3, armorClass: 15, xpToNextLevel: 100,
    inventory: [{ name: "Poción de Curación", quantity: 1, description: "Restaura 10 PS." }],
    spells: [{ name: "Curar Heridas", cost: 4, description: "Sana las heridas de un aliado o de ti mismo." }, { name: "Llama Sagrada", cost: 3, description: "Invoca fuego divino sobre un enemigo." }],
    skills: [{ name: "Canalizar Divinidad", description: "Expulsa a los no-muertos o fortalece a los aliados.", cooldown: 5, currentCooldown: 0, icon: <IconCross /> }],
  }
};
