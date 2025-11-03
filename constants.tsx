// Fix: Added content for game constants.
import React from 'react';
import { CharacterClass, Race, Skill } from './types';

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

export const RACE_SKILL_POOLS: Record<Race, Skill[]> = {
    [Race.Humano]: [
        { name: "Voluntad Férrea", description: "Gana ventaja en tu próxima tirada de salvación.", cooldown: 5, currentCooldown: 0, iconName: 'Heart' },
        { name: "Habilidad Adicional", description: "Reduce el enfriamiento de una habilidad de clase en 2 turnos.", cooldown: 6, currentCooldown: 0, iconName: 'Book' }
    ],
    [Race.Elfo]: [
        { name: "Trance", description: "Recupera 1d4 de PM. No se puede usar en combate.", cooldown: 0, currentCooldown: 0, iconName: 'Sparkles' },
        { name: "Paso Ligero", description: "Esquiva el siguiente ataque de oportunidad en tu contra.", cooldown: 4, currentCooldown: 0, iconName: 'Footprint' }
    ],
    [Race.Enano]: [
        { name: "Dureza del Enano", description: "Reduce el próximo daño recibido en 1d4.", cooldown: 3, currentCooldown: 0, iconName: 'Anvil' },
        { name: "Grito de Guerra", description: "Tu próximo ataque tiene un +2 al daño.", cooldown: 4, currentCooldown: 0, iconName: 'Battleaxe' }
    ],
    [Race.Mediano]: [
        { name: "Suerte del Mediano", description: "Puedes repetir una tirada de ataque fallida.", cooldown: 5, currentCooldown: 0, iconName: 'Sparkles' },
        { name: "Esconderse", description: "Intenta esconderte. Si tienes éxito, tu próximo ataque será furtivo.", cooldown: 3, currentCooldown: 0, iconName: 'Shadow' }
    ],
    [Race.Draconido]: [
        { name: "Aliento de Dragón", description: "Exhala energía elemental en un cono, causando 1d6 de daño.", cooldown: 4, currentCooldown: 0, iconName: 'Dragon' },
        { name: "Escamas Dracónicas", description: "Aumenta tu Clase de Armadura en +1 por un turno.", cooldown: 5, currentCooldown: 0, iconName: 'Anvil' }
    ],
    [Race.Gnomo]: [
        { name: "Astucia Gnoma", description: "Obtienes ventaja en una tirada de salvación contra magia.", cooldown: 5, currentCooldown: 0, iconName: 'Sparkles' },
        { name: "Manitas", description: "Desactivas una trampa cercana o intentas reparar un objeto.", cooldown: 0, currentCooldown: 0, iconName: 'Gear' }
    ],
    [Race.Semielfo]: [
        { name: "Herencia Feérica", description: "Tienes ventaja en tiradas de salvación contra encantamientos.", cooldown: 0, currentCooldown: 0, iconName: 'Sparkles' },
        { name: "Encanto Diplomático", description: "Gana ventaja en tu próxima prueba de carisma.", cooldown: 4, currentCooldown: 0, iconName: 'Handshake' }
    ],
    [Race.Semiorco]: [
        { name: "Resistencia Implacable", description: "Si tus PS caen a 0, puedes elegir caer a 1 en su lugar.", cooldown: 10, currentCooldown: 0, iconName: 'Heart' },
        { name: "Ataques Salvajes", description: "Cuando obtienes un golpe crítico, puedes tirar un dado de daño adicional.", cooldown: 0, currentCooldown: 0, iconName: 'Battleaxe' }
    ],
    [Race.Tiflin]: [
        { name: "Resistencia Infernal", description: "Obtienes resistencia al daño por fuego por 3 turnos.", cooldown: 6, currentCooldown: 0, iconName: 'Flame' },
        { name: "Legado Infernal", description: "Lanzas un truco menor de mago (ej. Taumaturgia).", cooldown: 2, currentCooldown: 0, iconName: 'Sparkles' }
    ],
};

export const INITIAL_SKILLS: Record<CharacterClass, Skill[]> = {
    [CharacterClass.Guerrero]: [
        { name: "Ataque Poderoso", description: "Un ataque cuerpo a cuerpo que inflige daño adicional.", cooldown: 3, currentCooldown: 0, iconName: 'Sword' },
        { name: "Segundo Aire", description: "Recupera una pequeña cantidad de puntos de vida.", cooldown: 5, currentCooldown: 0, iconName: 'Cross' },
    ],
    [CharacterClass.Mago]: [
        { name: "Rayo de Escarcha", description: "Un rayo helado que daña y ralentiza al enemigo.", cooldown: 0, currentCooldown: 0, iconName: 'Sparkles' },
        { name: "Escudo Arcano", description: "Aumenta temporalmente tu Clase de Armadura.", cooldown: 4, currentCooldown: 0, iconName: 'Sparkles' },
    ],
    [CharacterClass.Picaro]: [
        { name: "Ataque Furtivo", description: "Un ataque preciso que inflige un daño masivo si el enemigo está desprevenido.", cooldown: 3, currentCooldown: 0, iconName: 'Shadow' },
        { name: "Evasión", description: "Esquiva ágilmente el próximo ataque dirigido hacia ti.", cooldown: 5, currentCooldown: 0, iconName: 'Shadow' },
    ],
    [CharacterClass.Clerigo]: [
        { name: "Curar Heridas Leves", description: "Restaura una cantidad moderada de puntos de vida a un objetivo.", cooldown: 2, currentCooldown: 0, iconName: 'Cross' },
        { name: "Llama Sagrada", description: "Invoca una llama celestial para quemar a un enemigo.", cooldown: 0, currentCooldown: 0, iconName: 'Sparkles' },
    ],
};

export const XP_TO_NEXT_LEVEL = [0, 300, 900, 2700, 6500, 14000]; // XP needed to reach level 1, 2, 3, etc.