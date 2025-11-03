// Fix: Added content for game constants.
import React from 'react';
import { CharacterClass, Race, Skill } from './types';
import { IconSword, IconSparkles, IconShadow, IconCross } from './components/Icons';

export const RACE_DESCRIPTIONS: Record<Race, string> = {
    [Race.Humano]: "Versátiles y ambiciosos, los humanos son la raza más común.",
    [Race.Elfo]: "Elegantes y longevos, los elfos tienen una afinidad natural con la magia y la naturaleza.",
    [Race.Enano]: "Robustos y resistentes, los enanos son maestros artesanos y guerreros formidables.",
    [Race.Mediano]: "Pequeños y ágiles, los medianos son conocidos por su sigilo y su amor por la comodidad.",
    [Race.Draconido]: "Descendientes de dragones, los dracónidos son una raza noble y orgullosa con aliento elemental.",
    [Race.Gnomo]: "Curiosos e inventivos, los gnomos son expertos en ilusiones y artilugios.",
    [Race.Semielfo]: "Mezcla de humano y elfo, los semielfos combinan lo mejor de ambos mundos.",
    [Race.Semiorco]: "Fruto de la unión entre humanos y orcos, los semiorcos son fuertes y tenaces.",
    [Race.Tiflin]: "Con ascendencia infernal, los tiflines son astutos y carismáticos, a menudo vistos con desconfianza.",
};

export const CLASS_DESCRIPTIONS: Record<CharacterClass, string> = {
    [CharacterClass.Guerrero]: "Maestro del combate marcial, hábil con una variedad de armas y armaduras.",
    [CharacterClass.Mago]: "Estudioso de lo arcano que moldea la realidad a su voluntad a través de poderosos hechizos.",
    [CharacterClass.Picaro]: "Experto en el sigilo, el engaño y el asesinato, que ataca desde las sombras.",
    [CharacterClass.Clerigo]: "Un sirviente de los dioses que blande poder divino para sanar a los aliados y castigar a los enemigos.",
};

export const INITIAL_SKILLS: Record<CharacterClass, Skill[]> = {
    [CharacterClass.Guerrero]: [
        { name: "Ataque Poderoso", description: "Un ataque cuerpo a cuerpo que inflige daño adicional.", cooldown: 3, currentCooldown: 0, icon: <IconSword /> },
        { name: "Segundo Aire", description: "Recupera una pequeña cantidad de puntos de vida.", cooldown: 5, currentCooldown: 0, icon: <IconCross /> },
    ],
    [CharacterClass.Mago]: [
        { name: "Rayo de Escarcha", description: "Un rayo helado que daña y ralentiza al enemigo.", cooldown: 0, currentCooldown: 0, icon: <IconSparkles /> },
        { name: "Escudo Arcano", description: "Aumenta temporalmente tu Clase de Armadura.", cooldown: 4, currentCooldown: 0, icon: <IconSparkles /> },
    ],
    [CharacterClass.Picaro]: [
        { name: "Ataque Furtivo", description: "Un ataque preciso que inflige un daño masivo si el enemigo está desprevenido.", cooldown: 3, currentCooldown: 0, icon: <IconShadow /> },
        { name: "Evasión", description: "Esquiva ágilmente el próximo ataque dirigido hacia ti.", cooldown: 5, currentCooldown: 0, icon: <IconShadow /> },
    ],
    [CharacterClass.Clerigo]: [
        { name: "Curar Heridas Leves", description: "Restaura una cantidad moderada de puntos de vida a un objetivo.", cooldown: 2, currentCooldown: 0, icon: <IconCross /> },
        { name: "Llama Sagrada", description: "Invoca una llama celestial para quemar a un enemigo.", cooldown: 0, currentCooldown: 0, icon: <IconSparkles /> },
    ],
};

export const XP_TO_NEXT_LEVEL = [0, 300, 900, 2700, 6500, 14000]; // XP needed to reach level 1, 2, 3, etc.
