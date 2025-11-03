

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
    [Race.Humano]: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNmYWNjMTUiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMTQuNSAxNy41bC0xMC0xMCIgLz48cGF0aCBkPSJNNSAzbDE2IDE2IiAvPjxwYXRoIGQ9Ik0xOCA2bC01IDUiIC8+PHBhdGggZD0iTTIxIDNsLTYgNiIgLz48L3N2Zz4=",
    [Race.Elfo]: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNmYWNjMTUiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNNiA5bC0zIDNsMyAzIiAvPjxwYXRoIGQ9Ik0xOCAxNWwzLTNsLTMtMyIgLz48cGF0aCBkPSJNMMyIDEybDE4IDAiIC8+PC9zdmc+",
    [Race.Enano]: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNmYWNjMTUiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMyAyMWg0bDIuNDQtOS43NkExIDEgMCAwIDAgOC41MyAxbDYuOTQgMGExIDEgMCAwIDEtLjk1IDEuMjRMMTIgMTVsMiA2aDQiIC8+PC9zdmc+",
    [Race.Mediano]: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNmYWNjMTUiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMjIgMTFIMThsLTEgNEgybDEtNEgtMiIgLz48cGF0aCBkPSJNNCA3aDE2IiAvPjxwYXRoIGQ9Ik0xNiAzaC0zLjM4Yy0uMTEtLjg4LS44MS0xLjUtMS42OS0xLjUtLjg3IDAtMS41OC42My0xLjY5IDEuNUg2Yy0xLjEgMC0yIC45LTIgMnYyIiAvPjxwYXRoIGQ9Ik0xMiAxMS4yNVYxNi41IiAvPjxwYXRoIGQ9Ik0xMiAyMWEyLjUgMi41IDAgMCAwIDAtNSIgLz48cGF0aCBkPSJNMi41IDE2LjVoMTkiIC8+PC9zdmc+",
    [Race.Draconido]: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNmYWNjMTUiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMTkuMTQgMTIuOTRhNS4wMDcgNS4wMDcgMCAwIDAtMi43OS00LjAxaDQuNTJhMiAyIDAgMCAwIDEuOTQtMi4wN0wyMiA1LjVBNCA0IDAgMCAwIDE4IDJoLTVhMiAyIDAgMCAwLTEuNjQuNzRMNi4zNCA3LjhBNS4wMDcgNS4wMDcgMCAwIDAgMi4wNyAxMS45M2wxLjU5IDYuNDlhMiAyIDAgMCAwIDEuOTQgMS41OEg4IiAvPjxwYXRoIGQ9Im0yMiAxMi04LjY4IDguNjgiIC8+PHBhdGggZD0iTTEzLjM0IDE3LjY2IDE4IDEzIiAvPjwvc3ZnPg==",
    [Race.Gnomo]: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNmYWNjMTUiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMTIgMjBhOCA4IDAgMSAwIDAtMTYgOCA4IDAgMCAwIDAgMTZ6IiAvPjxwYXRoIGQ9Ik0xMiAxNGEyIDIgMCAxIDAgMC00IDIgMiAwIDAgMCAwIDR6IiAvPjxwYXRoIGQ9Ik0xMiAydjIiIC8+PHBhdGggZD0iTTEyIDIydj0yIiAvPjxwYXRoIGQ9Im0xNyAyMC42Ni0xLTEuNzMiIC8+PHBhdGggZD0ibTggNC4zNCAxIDEuNzMiIC8+PHBhdGggZD0ibTIwLjY2IDctMS43MyAxIiAvPjxwYXRoIGQ9Im00LjM0IDE3IDEuNzMtMSIgLz48cGF0aCBkPSJNMCAxMmgyIiAvPjxwYXRoIGQ9Ik0yMiAxMmgtMiIgLz48cGF0aCBkPSJtMTcgMy4zNC0xIDEuNzMiIC8+PHBhdGggZD0ibTggMTkuNjYgMS0xLjczIiAvPjxwYXRoIGQ9Im0zLjM0IDcgMS43MyAxIiAvPjxwYXRoIGQ9Im0yMC42NiAxNy0xLjczLTEiIC8+PC9zdmc+",
    [Race.Semielfo]: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNmYWNjMTUiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIgLz48Y2lyY2xlIGN4PSIxMiIgY3k9IjEwIiByPSIzIiAvPjxwYXRoIGQ9Ik03IDE2YTQuODMgNC44MyAwIDAgMCAxMCAwIiAvPjwvc3ZnPg==",
    [Race.Semiorco]: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNmYWNjMTUiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMCAwaDEybDQtNEg1eiIgLz48cGF0aCBkPSJNNCA0bDMgM2wtMyAzVjR6IiAvPjxwYXRoIGQ9Ik0zIDEzaDEybDQtNEg0eiIgLz48cGF0aCBkPSJNNyAxM2wzIDMtMyAzdi02eiIgLz48L3N2Zz4=",
    [Race.Tiflin]: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNmYWNjMTUiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMTQuMjcgMTMuMjcgYTMgMyAwIDAgMC00LjI0IDBsLTEuMjUgMS4yNWMyLjI0IDIuMjQgMS45MyA0LjgtLjU4IDYuODJhMiAyIDAgMCAxLTIuODMgMGwtMS40MS0xLjQxYTIgMiAwIDAgMSAwLTIuODJjMi4wMS0yLjUxIDQuNTgtMi44MiA2LjgyLS41OGwxLjI1LTEuMjV6IiAvPjxwYXRoIGQ9Ik03LjE5IDcuMTlhMyAzIDAgMCAwIDQuMjQgMGwxLjI1LTEuMjVjLTIuMjQtMi4yNC0xLjkzLTQuOC41OC02LjgyYTIgMiAwIDAgMCAyLjgzIDBsMS40MSAxLjQxYTIgMiAwIDAgMCAwIDIuODJjLTIuMDEgMi41MS00LjU4IDIuODItNi44Mi41OGwtMS4yNSAxLjI1eiIgLz48L3N2Zz4=",
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